const express = require('express');
const dotenv = require('dotenv');
const { healthRoutes } = require('./src/routes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/health', healthRoutes);

app.listen(port, () => {
  console.log(`Orders API escuchando en puerto ${port}`);
});