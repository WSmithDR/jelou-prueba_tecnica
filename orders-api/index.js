const express = require('express');
const { healthRoutes, orderRoutes, productRoutes } = require('./src/routes');
const swaggerUi = require('swagger-ui-express');
const { config } = require('./src/config');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./openapi.yaml');

const app = express();
const port = config.port;

app.use(express.json());

app.use('/health', healthRoutes);
app.use('/orders', orderRoutes);
app.use('/products', productRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


if(config.nodeEnv !== 'test'){
  app.listen(port, () => {
    console.log(`Orders API escuchando en puerto ${port}`);
  });
}

module.exports = app;