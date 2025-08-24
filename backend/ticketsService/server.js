const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 4131;

const { letMeIn, findReqUser } = require('../shared/letMeIn');
app.use(letMeIn, findReqUser);

app.use(express.json());

const ticketRoutes = require('./routes/ticketsRoutes');
app.use(ticketRoutes);

app.listen(PORT, () => {
  console.log(`Tickets Service running at http://localhost:${PORT}`);
});