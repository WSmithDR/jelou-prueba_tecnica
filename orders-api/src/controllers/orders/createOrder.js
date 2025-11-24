const pool = require('../../config/db');
const { createOrderSchema } = require('../../schemas');
const customerService = require('../../services');

const createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { customer_id, items } = createOrderSchema.parse(req.body);

    const customer = await customerService.getCustomerById(customer_id);
    if (!customer) {
      return res.status(404).json({ success: false, error: `El cliente ID ${customer_id} no existe` });
    }

    await connection.beginTransaction();

    let totalCents = 0;
    const orderItemsData = [];

    for (const item of items) {
      const [products] = await connection.query(
        'SELECT price_cents, stock FROM products WHERE id = ? FOR UPDATE', 
        [item.product_id]
      );

      if (products.length === 0) {
        throw new Error(`Producto ID ${item.product_id} no encontrado`);
      }

      const product = products[0];

      if (product.stock < item.qty) {
        throw new Error(`Stock insuficiente para el producto ID ${item.product_id}`);
      }

    
      const subtotal = product.price_cents * item.qty;
      totalCents += subtotal;
      
      orderItemsData.push({
        product_id: item.product_id,
        qty: item.qty,
        unit_price: product.price_cents,
        subtotal: subtotal
      });

      await connection.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.qty, item.product_id]
      );
    }

    const [orderResult] = await connection.query(
      'INSERT INTO orders (customer_id, status, total_cents) VALUES (?, "CREATED", ?)',
      [customer_id, totalCents]
    );
    const orderId = orderResult.insertId;

    for (const data of orderItemsData) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, qty, unit_price_cents, subtotal_cents) VALUES (?, ?, ?, ?, ?)',
        [orderId, data.product_id, data.qty, data.unit_price, data.subtotal]
      );
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      data: {
        order_id: orderId,
        status: 'CREATED',
        total_cents: totalCents,
        items: orderItemsData
      }
    });

  } catch (error) {
    await connection.rollback();

    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    
    if (error.message.includes('Stock') || error.message.includes('Producto')) {
      return res.status(409).json({ success: false, error: error.message });
    }

    console.error(error);
    res.status(500).json({ success: false, error: 'Error procesando la orden' });
  } finally {
    connection.release();
  }
};

module.exports = createOrder;