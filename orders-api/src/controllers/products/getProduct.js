
const pool = require('../../config/db');

const getProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { search } = req.query;

    // Caso 1: Buscar por ID
    if (id) {
      const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
      return rows.length ? res.json({ success: true, data: rows[0] }) 
                         : res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }

    // Caso 2: Búsqueda (Search) o Listar todos
    let query = 'SELECT * FROM products';
    const params = [];

    if (search) {
      query += ' WHERE name LIKE ? OR sku LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' LIMIT 50'; // Limite de seguridad

    const [rows] = await pool.query(query, params);
    res.json({ success: true, data: rows });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
module.exports = getProducts;