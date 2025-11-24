const pool = require('../../config/db');

const cancelOrder = async (req, res) => {
  const { id } = req.params;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [orders] = await connection.query('SELECT * FROM orders WHERE id = ? FOR UPDATE', [id]);

    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, error: 'Orden no encontrada' });
    }

    const order = orders[0];

    if (order.status === 'CANCELED') {
      await connection.rollback();
      return res.status(400).json({ success: false, error: 'La orden ya está cancelada' });
    }

    if (order.status === 'CONFIRMED') {
      // Regla de los 10 minutos
      const now = new Date();
      const orderTime = new Date(order.created_at);
      const diffMinutes = (now - orderTime) / 1000 / 60;

      if (diffMinutes > 10) {
        await connection.rollback();
        return res.status(409).json({ 
          success: false, 
          error: 'No se puede cancelar una orden confirmada con más de 10 minutos de antigüedad' 
        });
      }
    }

    
    const [items] = await connection.query('SELECT product_id, qty FROM order_items WHERE order_id = ?', [id]);

    
    for (const item of items) {
      await connection.query(
        'UPDATE products SET stock = stock + ? WHERE id = ?',
        [item.qty, item.product_id]
      );
    }

    await connection.query('UPDATE orders SET status = "CANCELED" WHERE id = ?', [id]);

    await connection.commit();

    res.json({
      success: true,
      message: 'Orden cancelada y stock restaurado correctamente',
      data: { id: order.id, previous_status: order.status, new_status: 'CANCELED' }
    });

  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ success: false, error: 'Error al cancelar la orden' });
  } finally {
    connection.release();
  }
};

module.exports = cancelOrder;