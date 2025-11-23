const express = require('express');
const dotenv = require('dotenv');
const customerRoutes = require('./src/routes/customer.routes');
const healthRoutes = require('./src/routes/health.routes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


app.use('/health', healthRoutes);

app.use('/customers', customerRoutes);

app.listen(port, () => {
  console.log(`Customers API escuchando en puerto ${port}`);
});