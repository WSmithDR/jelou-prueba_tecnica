const axios = require('axios');
const {getAxiosConfig, config} = require('../config');


const createOrder = async (customerId, items) => {
  try {
    const url = `${config.ordersApiUrl}/orders`;
    console.log(`mz Creando orden en: ${url}`);
    const res = await axios.post(
      url,
      { customer_id: customerId, items },
      getAxiosConfig()
    );
    return res.data.data;
  } catch (error) {
    console.error('Error creando orden:', error.message);
    throw { status: 400, message: 'No se pudo crear la orden', details: error.response?.data };
  }
};

module.exports = createOrder;