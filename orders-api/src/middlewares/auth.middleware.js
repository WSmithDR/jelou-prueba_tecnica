const dotenv = require('dotenv');
dotenv.config();

const validateServiceToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Acceso denegado: Falta token' });
  }

  if (token !== process.env.SERVICE_TOKEN) {
    return res.status(403).json({ success: false, error: 'Acceso prohibido: Token inválido' });
  }

  next();
};

module.exports = validateServiceToken ;