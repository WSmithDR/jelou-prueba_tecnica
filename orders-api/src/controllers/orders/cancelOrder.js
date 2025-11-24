const pool = require('../../config/db');

const cancelOrder = async (req, res) => {
  const { id } = req.params;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const [orders] = await connection.query('SELECT * FROM orders WHERE id = ? FOR UPDATE', [id]);
    
    if (!orders.length) {
      await connection.rollback();
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    const order = orders[0];
    
    // Reglas de negocio
    if (order.status === 'CANCELED') {
      await connection.rollback();
      return res.status(400).json({ error: 'Ya está cancelada' });
    }
    if (order.status === 'CONFIRMED') {
      // Regla de 10 minutos usando updated_at o created_at
      const lastUpdate = new Date(order.updated_at || order.created_at);
      const diffMinutes = (new Date() - lastUpdate) / 1000 / 60;
      if (diffMinutes > 10) {
        await connection.rollback();
        return res.status(409).json({ error: 'No se puede cancelar orden confirmada hace más de 10 min' });
      }
    }

    // Restaurar Stock
    const [items] = await connection.query('SELECT product_id, qty FROM order_items WHERE order_id = ?', [id]);
    for (const item of items) {
      await connection.query('UPDATE products SET stock = stock + ? WHERE id = ?', [item.qty, item.product_id]);
    }

    await connection.query('UPDATE orders SET status = "CANCELED" WHERE id = ?', [id]);
    await connection.commit();

    res.json({ success: true, message: 'Orden cancelada y stock restaurado' });

  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};
module.exports = cancelOrder;