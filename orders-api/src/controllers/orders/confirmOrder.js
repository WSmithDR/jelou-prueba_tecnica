const pool = require('../../config/db');

const confirmOrder = async (req, res) => {
  const { id } = req.params;
  const idempotencyKey = req.idempotencyKey; // Viene del middleware
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [orders] = await connection.query('SELECT * FROM orders WHERE id = ? FOR UPDATE', [id]);
    if (!orders.length) {
      await connection.rollback();
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    const order = orders[0];
    if (order.status !== 'CREATED') {
      await connection.rollback();
      return res.status(400).json({ error: `No se puede confirmar orden en estado ${order.status}` });
    }

    await connection.query('UPDATE orders SET status = "CONFIRMED" WHERE id = ?', [id]);

    const responseBody = { success: true, data: { id: order.id, status: 'CONFIRMED' } };
    
    // Guardar idempotencia si existe key
    if (idempotencyKey) {
      await connection.query(
        `INSERT INTO idempotency_keys (idempotency_key, target_type, target_id, status, response_body, response_status)
         VALUES (?, 'ORDER', ?, 'COMPLETED', ?, ?)`,
        [idempotencyKey, id, JSON.stringify(responseBody), 200]
      );
    }

    await connection.commit();
    res.json(responseBody);

  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Conflicto de idempotencia' });
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};
module.exports = confirmOrder;