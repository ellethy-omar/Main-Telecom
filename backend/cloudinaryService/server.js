const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 4130;

const { letMeIn, findReqUser } = require('../shared/letMeIn');
app.use(letMeIn, findReqUser);

const cloudinaryRoutes = require('./routes/cloudinaryRoutes');

app.use(cloudinaryRoutes);

app.listen(PORT, () => {
  console.log(`Cloudinary Service running at http://localhost:${PORT}`);
});