require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 4132;

// Ensure API gateway is the start, but here no JWT is required
const { letMeIn } = require('../shared/letMeIn');
app.use(letMeIn);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const callsRoutes = require('./routes/callsRoutes');
app.use(callsRoutes);

app.listen(PORT, () => {
    console.log(`Calls service running on port ${PORT}`);
    console.log(`3CX Webhook endpoint: http://localhost:${PORT}/webhook/3cx`);
});

