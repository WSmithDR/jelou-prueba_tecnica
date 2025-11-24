const { z } = require('zod');

const createOrderSchema = z.object({
  customer_id: z.number({ required_error: "El customer_id es obligatorio" }).int().positive(),
  items: z.array(
    z.object({
      product_id: z.number().int().positive(),
      qty: z.number().min(1, "La cantidad debe ser al menos 1")
    })
  ).min(1, "El pedido debe tener al menos un producto")
});

module.exports = createOrderSchema;