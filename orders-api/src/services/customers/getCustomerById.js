const axios = require('axios');
const jwt = require('jsonwebtoken');
const {config} = require('../../config');

const getCustomerById = async (customerId) => {
  if (!config.JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET no configurado en Orders API.');
  }

  try {
    const url = `${config.CUSTOMERS_API_URL}/internal/customers/${customerId}`;
    
    const token = jwt.sign(
      { service: 'orders-api', role: 'internal' },
      config.JWT_SECRET,
      { expiresIn: '1m' }
    );

    console.log(`Llamando a Customers API: ${url}`);
    
    const response = await axios.get(url, {
      headers: { 
        'Authorization': `Bearer ${token}` 
      }
    });

    return response.data.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    // Propagamos el error para que el controlador lo maneje
    throw error; 
  }
};

module.exports = getCustomerById;