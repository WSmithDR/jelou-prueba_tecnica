const { z } = require('zod');

// Esquema para crear cliente
const createCustomerSchema = z.object({
  name: z.string({ required_error: "El nombre es obligatorio" }).min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string({ required_error: "El email es obligatorio" }).email("Formato de email inválido"),
  phone: z.string().optional()
});

// Esquema para actualizar datos del cliente
const updateCustomerSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional()
});

module.exports = { createCustomerSchema, updateCustomerSchema };