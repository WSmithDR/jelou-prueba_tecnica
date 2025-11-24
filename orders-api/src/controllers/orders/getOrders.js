const pool = require('../../config/db');

const getOrders = async (req, res) => {
  try {
    const { status, from, to, search, limit = 10, cursor } = req.query;
    const limitNum = parseInt(limit) || 10;

    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (from) {
      query += ' AND created_at >= ?';
      params.push(new Date(from));
    }

    if (to) {
      query += ' AND created_at <= ?';
      params.push(new Date(to));
    }

    // 2. Paginación por Cursor (Optimizada)
    // Asumimos que queremos ver las órdenes más recientes primero (DESC)
    // Por tanto, el cursor busca IDs MENORES que el último visto.
    if (cursor) {
      query += ' AND id < ?'; 
      params.push(cursor);
    }

    // 3. Ordenamiento y Límite
    query += ' ORDER BY id DESC LIMIT ?';
    params.push(limitNum);

    const [rows] = await pool.query(query, params);

    // Calcular siguiente cursor (el ID de la última fila)
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
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = getOrders;