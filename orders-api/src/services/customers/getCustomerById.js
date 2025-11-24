const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const getCustomerById = async (customerId) => {
  try {
    const url = `${process.env.CUSTOMERS_API_URL}/internal/customers/${customerId}`;
    
    console.log(`Llamando a Customers API: ${url}`);
    const response = await axios.get(url, {
      headers: { 
        'Authorization': `Bearer ${process.env.SERVICE_TOKEN}` 
      }
    });

    return response.data.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    console.error('Error en customer.service:', error.message);
    throw new Error('Falló la comunicación con Customers API');
  }
};

module.exports = getCustomerById;