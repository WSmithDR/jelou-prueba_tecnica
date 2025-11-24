const {pool} = require('../config');

const checkIdempotency = async (req, res, next) => {
  const idempotencyKey = req.headers['x-idempotency-key'];

  if (!idempotencyKey) {
    return next();
  }

  try {
    const [rows] = await pool.query(
      'SELECT response_body, response_status FROM idempotency_keys WHERE idempotency_key = ?',
      [idempotencyKey]
    );

    if (rows.length > 0) {
      console.log(`Idempotencia detectada: Key ${idempotencyKey}`);
      const cached = rows[0];
      // Devolvemos lo que guardamos la primera vez, ¡sin procesar nada nuevo!
      return res.status(cached.response_status).json(cached.response_body);
    }

    // Si no existe, guardamos la key en el request para que el controlador la use luego
    req.idempotencyKey = idempotencyKey;
    next();

  } catch (error) {
    console.error('Error en middleware de idempotencia:', error);
    next(); // Si falla la DB de claves, mejor dejar pasar la petición que bloquearla
  }
};

module.exports = checkIdempotency;