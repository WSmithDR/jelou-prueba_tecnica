const { z } = require('zod');

const createProductSchema = z.object({
  sku: z.string().min(3),
  name: z.string().min(2),
  price_cents: z.number().int().positive(),
  stock: z.number().int().min(0)
});

const updateProductSchema = z.object({
  price_cents: z.number().int().positive().optional(),
  stock: z.number().int().min(0).optional()
});

module.exports = { createProductSchema, updateProductSchema };