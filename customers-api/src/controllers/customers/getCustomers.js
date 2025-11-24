const pool = require('../../config/db');

const getCustomers = async (req, res) => {
  try {
    const { search, limit = 10, cursor } = req.query;
    const limitNum = parseInt(limit) || 10;
    
    let query = 'SELECT * FROM customers WHERE deleted_at IS NULL';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (cursor) {
      // CORRECCIÓN 2: Usamos AND porque ya existe el WHERE del deleted_at
      query += ' AND id > ?';
      params.push(cursor);
    }

    // 3. Ordenamiento y Límite
    query += ' ORDER BY id ASC LIMIT ?';
    params.push(limitNum);

    const [rows] = await pool.query(query, params);
    
    // Calcular siguiente cursor
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
    console.error(error);
    res.status(500).json({ success: false, error: 'Error al buscar clientes' });
  }
};

module.exports = getCustomers;