const {pool} = require('../../config');

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (!orders.length) return res.status(404).json({ error: 'Orden no encontrada' });

    const [items] = await pool.query(
      `SELECT oi.*, p.name, p.sku 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`, 
      [id]
    );

    const order = orders[0];
    order.items = items;

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = getOrderById;