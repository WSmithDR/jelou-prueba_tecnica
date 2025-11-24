const {pool} = require('../../config');
const { updateCustomerSchema } = require('../../schemas/customer.schema');

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    // Validamos solo los campos que vengan
    const data = updateCustomerSchema.parse(req.body);

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ success: false, error: 'No se enviaron datos para actualizar' });
    }

    // Construcción dinámica del query SQL
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), id];

    const [result] = await pool.query(`UPDATE customers SET ${fields} WHERE id = ?`, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Cliente no encontrado' });
    }

    res.json({ 
      success: true, 
      message: 'Cliente actualizado correctamente', 
      updatedFields: data 
    });

  } catch (error) {
    // Error de email duplicado
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, error: 'El email ya está en uso por otro cliente' });
    }
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = updateCustomer;