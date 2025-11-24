const pool = require('../config/db');

const getHealthCheck = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    res.json({ 
      status: 'UP', 
      service: 'Orders API', 
      db_check: rows[0].solution === 2 ? 'OK' : 'ERROR' 
    });
  } catch (error) {
    res.status(500).json({ status: 'DOWN', error: error.message });
  }
};

module.exports = getHealthCheck;