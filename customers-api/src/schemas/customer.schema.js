const { z } = require('zod');

// Esquema para crear un cliente
const createCustomerSchema = z.object({
  name: z.string({ required_error: "El nombre es obligatorio" }).min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string({ required_error: "El email es obligatorio" }).email("Formato de email inválido"),
  phone: z.string().optional() // El teléfono es opcional según tu SQL, pero buena práctica definirlo
});

module.exports = { createCustomerSchema };