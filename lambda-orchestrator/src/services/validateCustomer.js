const axios = require('axios');
const getAxiosConfig = require('./getAxiosConfig');

const validateCustomer = async (customerId) => {
  try {
    const url = `${process.env.CUSTOMERS_API_URL}/internal/customers/${customerId}`;
    console.log(`Validando cliente en: ${url}`);
    const res = await axios.get(url, getAxiosConfig());
    return res.data.data;
  } catch (error) {
    console.error('Error validando cliente:', error.message);
    throw { status: 404, message: 'Cliente no encontrado o error en servicio Customers' };
  }
};

module.exports = validateCustomer;