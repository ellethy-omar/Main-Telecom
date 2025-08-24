const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 4129;

const { letMeIn, findReqUser } = require('../shared/letMeIn');
app.use(letMeIn, findReqUser);

app.use(express.json());

const profileRoutes = require('./routes/profileRoute');
app.use(profileRoutes);

app.listen(PORT, () => {
  console.log(`Profile Service running at http://localhost:${PORT}`);
});