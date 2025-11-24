const { z } = require('zod');

const createProductSchema = z.object({
  sku: z.string().min(3, "SKU muy corto"),
  name: z.string().min(2),
  price_cents: z.number().int("El precio debe ser en centavos").positive("El precio debe ser positivo"),
  stock: z.number().int().min(0, "El stock no puede ser negativo")
});

const updateProductSchema = z.object({
  price_cents: z.number().int().positive().optional(),
  stock: z.number().int().min(0).optional(),
  name: z.string().min(2).optional()
});

module.exports = { createProductSchema, updateProductSchema };