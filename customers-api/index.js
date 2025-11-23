const express = require('express');
const dotenv = require('dotenv');
const customerRoutes = require('./src/routes/customer.routes');
const healthRoutes = require('./src/routes/health.routes');
const { validateServiceToken } = require('./src/middlewares/auth.middleware');
const { getCustomerById } = require('./src/controllers/customers');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


app.use('/health', healthRoutes);

app.use('/customers', customerRoutes);

app.use('/internal/customers/:id', validateServiceToken, getCustomerById );

app.listen(port, () => {
  console.log(`Customers API escuchando en puerto ${port}`);
});