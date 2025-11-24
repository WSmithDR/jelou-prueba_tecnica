const pool = require('../../config/db');
const { createProductSchema } = require('../../schemas');

const createProduct = async (req, res) => {
  try {
    const data = createProductSchema.parse(req.body);
    const [result] = await pool.query(
      'INSERT INTO products (sku, name, price_cents, stock) VALUES (?, ?, ?, ?)',
      [data.sku, data.name, data.price_cents, data.stock]
    );
    res.status(201).json({ success: true, data: { id: result.insertId, ...data } });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, error: 'El SKU ya existe' });
    res.status(500).json({ success: false, error: error.message });
  }
};
module.exports = createProduct;