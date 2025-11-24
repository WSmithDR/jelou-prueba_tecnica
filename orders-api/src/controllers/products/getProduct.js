const pool = require('../../config/db');

const getProducts = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. Caso Detalle (GET /products/:id)
    if (id) {
      const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
      return rows.length ? res.json({ success: true, data: rows[0] }) 
                         : res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }

    // 2. Caso Lista/Búsqueda con Cursor (GET /products?search=...&cursor=...)
    const { search, limit = 10, cursor } = req.query;
    const limitNum = parseInt(limit) || 10;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR sku LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (cursor) {
      query += ' AND id > ?';
      params.push(cursor);
    }

    query += ' ORDER BY id ASC LIMIT ?';
    params.push(limitNum);

    const [rows] = await pool.query(query, params);

    const nextCursor = rows.length === limitNum ? rows[rows.length - 1].id : null;

    res.json({ 
      success: true, 
      data: rows,
      pagination: {
        next_cursor: nextCursor,
        limit: limitNum
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = getProducts;