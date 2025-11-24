const pool = require('../../config/db');

const confirmOrder = async (req, res) => {
  const { id } = req.params;
  const idempotencyKey = req.idempotencyKey; // Viene del middleware

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Verificar si la orden existe
    const [orders] = await connection.query('SELECT * FROM orders WHERE id = ? FOR UPDATE', [id]);
    
    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, error: 'Orden no encontrada' });
    }

    const order = orders[0];

    // 2. Regla de negocio: Solo confirmar si está CREATED
    if (order.status !== 'CREATED') {
      await connection.rollback();
      return res.status(400).json({ 
        success: false, 
        error: `No se puede confirmar una orden en estado ${order.status}` 
      });
    }

    // 3. Actualizar estado
    await connection.query('UPDATE orders SET status = "CONFIRMED" WHERE id = ?', [id]);

    // 4. Preparar respuesta
    const responseBody = {
      success: true,
      data: {
        id: order.id,
        status: 'CONFIRMED',
        message: 'Orden confirmada exitosamente'
      }
    };
    const responseStatus = 200;

    // 5. GUARDAR IDEMPOTENCIA (Si se envió la key)
    if (idempotencyKey) {
      await connection.query(
        `INSERT INTO idempotency_keys (idempotency_key, target_type, target_id, status, response_body, response_status)
         VALUES (?, 'ORDER', ?, 'COMPLETED', ?, ?)`,
        [idempotencyKey, id, JSON.stringify(responseBody), responseStatus]
      );
    }

    await connection.commit();

    // 6. Responder
    res.status(responseStatus).json(responseBody);

  } catch (error) {
    await connection.rollback();
    
    // Si es error de llave duplicada (por condición de carrera), fallamos seguro
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, error: 'Conflicto de idempotencia procesando en paralelo' });
    }

    console.error(error);
    res.status(500).json({ success: false, error: 'Error confirmando la orden' });
  } finally {
    connection.release();
  }
};

module.exports = confirmOrder;