const pool = require('../../config/db');
const { updateProductSchema } = require('../../schemas');

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = updateProductSchema.parse(req.body);

    if (Object.keys(data).length === 0) return res.status(400).json({ error: 'Nada que actualizar' });

    // Construcción dinámica del query
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), id];

    const [result] = await pool.query(`UPDATE products SET ${fields} WHERE id = ?`, values);

    if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Producto no encontrado' });

    res.json({ success: true, message: 'Producto actualizado', updated_fields: data });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
module.exports = updateProduct;