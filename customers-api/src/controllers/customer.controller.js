const pool = require('../config/db');
const { createCustomerSchema } = require('../schemas/customer.schema');

// 1. Crear Cliente (POST /customers)
const createCustomer = async (req, res) => {
  try {
    // A) Validar datos con Zod
    const validatedData = createCustomerSchema.parse(req.body);

    // B) Insertar en MySQL
    const [result] = await pool.query(
      'INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)',
      [validatedData.name, validatedData.email, validatedData.phone || null]
    );

    // C) Responder con el ID creado
    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        ...validatedData
      }
    });

  } catch (error) {
    // Manejo de errores específicos
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, error: 'El email ya está registrado' });
    }
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    
    console.error(error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// 2. Obtener Cliente por ID (GET /customers/:id)
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM customers WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Cliente no encontrado' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { createCustomer, getCustomerById };