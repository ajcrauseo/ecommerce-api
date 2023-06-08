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

    delete user.dataValues.password;

    return user;
  }

  async signUp(data) {
    // data = {username, email, password}

    const newUser = await userService.create(data);

    const response = this.signToken(newUser)

    return response;
  }

  signToken(user) {
    const payload = {
      sub: user.id,
      role: user.role,
    };

    const token = jwt.sign(payload, config.JWT_SECRET);

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

  async changePassword(token, newPassword) {
    try {
      const payload = jwt.verify(token, config.JWT_SECRET_RECOVERY);
      const user = await userService.findById(payload.sub);

      if (user.recoveryToken !== token) {
        throw boom.unauthorized();
      }

      const hash = bcrypt.hash(newPassword, 10);

      await userService.updateOne(user.id, {
        recoveryToken: null,
        password: hash,
      });

      return { message: 'password changed' };
    } catch (error) {
      throw boom.unauthorized();
    }
  }
}

module.exports = AuthService;
