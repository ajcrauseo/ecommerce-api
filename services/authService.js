const bcrypt = require('bcrypt');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const config = require('../config/');
const UserService = require('./usersService');

const userService = new UserService();

class AuthService {
  constructor() {}

  async signIn(email, password) {
    const user = await userService.findByEmail(email);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch || !user) {
      throw boom.unauthorized('password or email incorrect');
    }

    const userSignedIn = userService.findById(user.id);

    return userSignedIn;
  }

  async signUp(data) {
    // data = {username, email, password}

    const newUser = await userService.create(data);

    const response = this.signToken(newUser);

    return response;
  }

  signToken(user) {
    const payload = {
      sub: user.id,
      role: user.role,
    };

    const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1d' });

    return { user, token };
  }

  async sendEmail(infoMail) {
    // mailExample = {
    // from: 'sender@example.com',
    // to: 'receiver@emaple.com',
    // subject: 'subject',
    // text: 'hello world'
    // html: <p>Hello world</p>
    // }

    const transporter = nodemailer.createTransport({
      host: config.NODEMAILER_HOST,
      port: 465,
      secure: true,
      auth: {
        user: config.NODEMAILER_USER,
        pass: config.NODEMAILER_PASS,
      },
    });

    await transporter.sendMail(infoMail);
    return { message: 'mail sent' };
  }

  async sendRecovery(email) {
    const user = await userService.findByEmail(email);

    if (!user) {
      throw boom.unauthorized();
    }

    const payload = { sub: user.id };

    const token = jwt.sign(payload, config.JWT_SECRET_RECOVERY, {
      expiresIn: '15min',
    });

    await userService.updateOne(user.id, { recoveryToken: token });
    const link = `http://myfrontend.com/recovery?token=${token}`;

    const mailToRecoverPassword = {
      from: 'antonycabeza00@gmail.com',
      to: `${user.email}`,
      subject: 'Recuperación de contraseña',
      text: `Ingresa a este link para cambiar la contraseña => ${link}`,
    };

    const response = await this.sendEmail(mailToRecoverPassword);

    return response;
  }

  async changePassword(recoveryToken, newPassword) {
    try {
      const payload = jwt.verify(recoveryToken, config.JWT_SECRET_RECOVERY);
      const user = await userService.findToChangePassword(payload.sub);

      console.log(recoveryToken);
      console.log(user.recoveryToken);

      if (user.recoveryToken !== recoveryToken) {
        throw boom.unauthorized('invalid token');
      }

      const hash = await bcrypt.hash(newPassword, 10);

      await userService.updateOne(user.id, {
        recoveryToken: null,
        password: hash,
      });

      return { message: 'password changed' };
    } catch (error) {
      // Manejo de errores
      if (error instanceof jwt.TokenExpiredError) {
        // Token expirado
        throw boom.unauthorized('token expirado');
      } else if (error instanceof jwt.NotBeforeError) {
        // Token no válido aún (fecha de inicio permitida)
        throw boom.unauthorized('token no valido aun');
      } else if (error instanceof jwt.JsonWebTokenError) {
        // Otro error relacionado con el token JWT
        throw boom.unauthorized('error con la verificacion del token');
      } else {
        // Otro tipo de error
        throw boom.unauthorized(error.message);
      }
    }
  }
}

module.exports = AuthService;
