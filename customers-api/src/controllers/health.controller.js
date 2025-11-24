const {pool} = require('../config/db');

const getHealthCheck = async (req, res) => {
  try {
    // Prueba de conexión a la base de datos
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    const isDatabaseOK = rows[0].solution === 2;
    
    const status = isDatabaseOK ? 'success' : 'error';
    const statusCode = isDatabaseOK ? 200 : 503;
    
    res.status(statusCode).json({ 
      success: isDatabaseOK,
      status: status,
      service: 'Customers API',
      database: isDatabaseOK ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      status: 'error',
      service: 'Customers API',
      database: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = { getHealthCheck };