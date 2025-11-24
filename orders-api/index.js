const express = require('express');
const dotenv = require('dotenv');
const { healthRoutes, orderRoutes, productRoutes } = require('./src/routes');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./openapi.yaml');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/health', healthRoutes);
app.use('/orders', orderRoutes);
app.use('/products', productRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Orders API escuchando en puerto ${port}`);
});