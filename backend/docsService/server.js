const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();

const { letMeIn } = require('../shared/letMeIn');
app.use(letMeIn);

const swaggerUi = require('swagger-ui-express');
const finalSwaggerDoc = require('./docs/loadYmlFiles');

app.use('/', swaggerUi.serve, swaggerUi.setup(finalSwaggerDoc));

const { handleInvalidRoute } = require('../shared/letMeIn');
app.use(handleInvalidRoute('Auth Service'));

const PORT = process.env.PORT || 4125;

app.listen(PORT, () => {
  console.log(`Docs service running at port ${PORT}`);
});