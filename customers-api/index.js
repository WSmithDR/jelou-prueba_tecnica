const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware para leer JSON
app.use(express.json());

// Pool de conexión a MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/health', async (req, res) => {
  try {
    // Prueba simple a la DB
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    res.json({ 
      status: 'UP', 
      service: 'Customers API', 
      db_check: rows[0].solution === 2 ? 'OK' : 'ERROR' 
    });
  } catch (error) {
    res.status(500).json({ status: 'DOWN', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Customers API escuchando en puerto ${port}`);
});