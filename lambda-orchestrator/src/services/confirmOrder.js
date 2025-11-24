const axios = require('axios');
const {getAxiosConfig, config} = require('../config');

const confirmOrder = async (orderId, idempotencyKey) => {
  try {
    const url = `${config.ordersApiUrl}/orders/${orderId}/confirm`;
    console.log(`Cc Confirmando orden ${orderId} en: ${url}`);
    
    const res = await axios.post(
      url,
      {}, 
      {
        headers: {
          ...getAxiosConfig().headers,
          'X-Idempotency-Key': idempotencyKey
        }
      }
    );
    return res.data.data;
  } catch (error) {
    console.error('Error confirmando orden:', error.message);
    return null;
  }
};

module.exports = confirmOrder;