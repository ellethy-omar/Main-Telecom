const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 4127;
const { letMeIn } = require('../shared/letMeIn');
app.use(letMeIn);

app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use(authRoutes);

app.listen(PORT, () => {
  console.log(`Auth Service running at http://localhost:${PORT}`);
});