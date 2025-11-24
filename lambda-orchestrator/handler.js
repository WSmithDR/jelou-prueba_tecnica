const { buildResponse } = require('./src/utils');
const orderService = require('./src/services');

module.exports.createAndConfirmOrder = async (event) => {
  console.log('Lambda Invocado');

  try {
    const body = JSON.parse(event.body || '{}');
    const { customer_id, items, idempotency_key, correlation_id } = body;

    if (!customer_id || !items || !idempotency_key) {
      return buildResponse(400, { success: false, message: 'Faltan campos requeridos (customer_id, items, idempotency_key)' });
    }

    // 1. Validar Cliente
    const customer = await orderService.validateCustomer(customer_id);

    // 2. Crear Orden
    const order = await orderService.createOrder(customer_id, items);

    // 3. Confirmar Orden
    const confirmedOrder = await orderService.confirmOrder(order.order_id, idempotency_key);

    // 4. Armar respuesta final
    const responseData = {
      success: true,
      correlationId: correlation_id,
      data: {
        customer,
        order: {
          ...order,
          status: confirmedOrder ? confirmedOrder.status : 'CREATED_BUT_NOT_CONFIRMED',
          message: confirmedOrder ? 'Proceso completo' : 'Atención: La orden se creó pero falló la confirmación'
        }
      }
    };

    return buildResponse(201, responseData);

  } catch (error) {
    // Manejo de errores limpio
    const status = error.status || 500;
    return buildResponse(status, { 
      success: false, 
      message: error.message || 'Internal Server Error',
      details: error.details
    });
  }
};