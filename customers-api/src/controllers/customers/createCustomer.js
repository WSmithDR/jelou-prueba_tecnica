const {pool} = require('../../config');
const { createCustomerSchema } = require('../../schemas/customer.schema');

const createCustomer = async (req, res) => {
  try {
    const validatedData = createCustomerSchema.parse(req.body);
    
    const [result] = await pool.query(
      'INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)',
      [validatedData.name, validatedData.email, validatedData.phone || null]
    );

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        ...validatedData
      }
    });

  } catch (error) {
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

module.exports = createCustomer;