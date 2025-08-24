const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 4126;

const { letMeIn, findReqUser } = require('../shared/letMeIn');
app.use(letMeIn, findReqUser);

app.use(express.json());

const contactsRoutes = require('./routes/contactsRoutes');
app.use(contactsRoutes);

app.listen(PORT, () => {
  console.log(`Contacts Service running at http://localhost:${PORT}`);
});