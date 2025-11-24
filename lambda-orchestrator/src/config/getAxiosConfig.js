const jwt = require('jsonwebtoken');
const config = require("./env")

const getAxiosConfig = () => {
  // Validación estricta: Si no hay secreto, detenemos la ejecución
  if (!config.jwtSecret) {
    throw new Error('FATAL: La variable de entorno JWT_SECRET no está definida.');
  }

  // Generamos el token usando la variable segura
  const token = jwt.sign(
    { service: 'lambda-orchestrator', role: 'admin' }, 
    config.jwtSecret, 
    { expiresIn: '5m' }
  );

  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

module.exports = getAxiosConfig;