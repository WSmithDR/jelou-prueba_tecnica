const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const validateServiceToken = (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    console.error('FATAL: JWT_SECRET no está definido en el servidor.');
    return res.status(500).json({ success: false, error: 'Error interno de configuración de seguridad' });
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Acceso denegado: Falta token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, error: 'Token inválido o expirado' });
  }
};

module.exports = validateServiceToken;