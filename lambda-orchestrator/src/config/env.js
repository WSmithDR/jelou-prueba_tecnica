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
    customersApiUrl: getRequired('CUSTOMERS_API_URL'),
    ordersApiUrl: getRequired('ORDERS_API_URL'),
    offlineHttpPort: getRequired('OFFLINE_HTTP_PORT'),
    offlineLambdaPort: getRequired('OFFLINE_LAMBDA_PORT'),
    jwtSecret: getRequired('JWT_SECRET'),
};

module.exports = config;