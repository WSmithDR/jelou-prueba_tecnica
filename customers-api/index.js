const express = require('express');
const customerRoutes = require('./src/routes/customer.routes');
const healthRoutes = require('./src/routes/health.routes');
const { validateServiceToken } = require('./src/middlewares');
const { getCustomerById } = require('./src/controllers/customers');
const { config } = require('./src/config');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./openapi.yaml');

const app = express();
const port = config.port;

app.use(express.json());


app.use('/health', healthRoutes);

app.use('/customers', customerRoutes);

app.use('/internal/customers/:id', validateServiceToken, getCustomerById );

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

if(config.nodeEnv !== 'test'){
  app.listen(port, () => {
    console.log(`Customers API escuchando en puerto ${port}`);
  });
}


module.exports = app;
