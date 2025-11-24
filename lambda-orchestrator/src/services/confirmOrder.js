const axios = require('axios');
const getAxiosConfig = require('./getAxiosConfig');

const confirmOrder = async (orderId, idempotencyKey) => {
  try {
    const url = `${process.env.ORDERS_API_URL}/orders/${orderId}/confirm`;
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