const dotenv = require('dotenv');
dotenv.config();

const getRequired = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`FATAL: La variable de entorno ${key} es obligatoria.`);
  }
  return value;
};

const config = {
  nodeEnv:getRequired('NODE_ENV'),
  port: getRequired('PORT'),
  jwtSecret: getRequired('JWT_SECRET'),
  db: {
    host: getRequired('DB_HOST'),
    user: getRequired('DB_USER'),
    password: getRequired('DB_PASSWORD'),
    database: getRequired('DB_NAME'),
  }
};

module.exports = config;