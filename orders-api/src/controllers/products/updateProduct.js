const pool = require('../../config/db');
const { updateProductSchema } = require('../../schemas/product.schema');

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const data = updateProductSchema.parse(req.body);

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ success: false, error: 'Debe enviar price_cents o stock para actualizar' });
    }

    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), id];

    const [result] = await pool.query(`UPDATE products SET ${fields} WHERE id = ?`, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }

    const [updatedRows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);

    res.json({ 
      success: true, 
      message: 'Producto actualizado correctamente',
      data: updatedRows[0] 
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = updateProduct;