const jwt = require('jsonwebtoken');

const getAxiosConfig = () => {
  // Validación estricta: Si no hay secreto, detenemos la ejecución
  if (!process.env.JWT_SECRET) {
    throw new Error('FATAL: La variable de entorno JWT_SECRET no está definida.');
  }

  // Generamos el token usando la variable segura
  const token = jwt.sign(
    { service: 'lambda-orchestrator', role: 'admin' }, 
    process.env.JWT_SECRET, 
    { expiresIn: '5m' }
  );

  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

module.exports = getAxiosConfig;