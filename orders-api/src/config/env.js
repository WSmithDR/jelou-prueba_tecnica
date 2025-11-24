const dotenv = require('dotenv');
dotenv.config();

const getRequired = (key) => {
  if (!process.env[key]) throw new Error(`FATAL: Falta variable ${key}`);
  return process.env[key];
};

const config = {
  port: getRequired('PORT'),
  jwtSecret: getRequired('JWT_SECRET'),
  customersApiUrl: getRequired('CUSTOMERS_API_URL'),
  db: {
    host: getRequired('DB_HOST'),
    user: getRequired('DB_USER'),
    password: getRequired('DB_PASSWORD'),
    database: getRequired('DB_NAME'),
  }
};

module.exports = config;