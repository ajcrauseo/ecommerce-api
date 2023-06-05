const express = require('express');
const cors = require('cors');

const routerApi = require('./routes');
const config = require('./config');

const {
  logErrors,
  errorHandler,
  boomErrorHandler,
  ormErrorHandler,
} = require('./middlewares/errorHandler');

const app = express();
const PORT = config.PORT;

app.use(express.json());

const whitelist = ['http://localhost:8080', 'anotherorigin.example'];
const corsOptions = {
  origin: (origin, callback) => {
    // Permito un origen que sea null o undefined para conectarme con insomnia/postman
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Origin no permitido'));
    }
  }, // Solo permitir solicitudes desde este dominio
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Solo permitir los métodos HTTP GET y POST
  allowedHeaders: ['Content-Type', 'Authorization'], // Permitir solo estas cabeceras
};

app.use(cors(corsOptions));

// ROUTER
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(ormErrorHandler);
app.use(errorHandler);

app.listen(PORT, () => console.log(`App running at port: ${PORT}`));
