const pool = require('../../config/db');

const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);

    if (orders.length === 0) {
      return res.status(404).json({ success: false, error: 'Orden no encontrada' });
    }

    const order = orders[0];

    const [items] = await pool.query(
      `SELECT oi.*, p.name as product_name, p.sku 
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [id]
    );

    order.items = items;

    res.json({ success: true, data: order });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error al obtener la orden' });
  }
};

module.exports = getOrderById;