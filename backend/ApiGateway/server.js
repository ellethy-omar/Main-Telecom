const express = require('express');
require('dotenv').config({
  path: process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env.local'
}); // ! For docker's sake don't touch this line

const app = express();
const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 4123;

const servicesURLS = {
  docsServiceURL: process.env.DOCS_SERVICE_URL,
  contactsServiceURL: process.env.CONTACTS_SERVICE_URL,
  authServiceURL: process.env.AUTH_SERVICE_URL,
  cloudinaryServiceURL: process.env.CLOUDINARY_SERVICE_URL,
  profileServiceURL: process.env.PROFILE_SERVICE_URL,
  ticketsServiceURL: process.env.TICKETS_SERVICE_URL,
  callsServiceURL: process.env.CALLS_SERVICE_URL
}

for (const [key, value] of Object.entries(servicesURLS)) {
  if (!value) {
    console.error(`Missing environment variable: ${key}. Please check your .env file or environment setup.`);
    process.exit(1);
  }
}

const { validateEnv } = require('../shared/letMeIn');
const { GateWaySecret, authHeaderTitle } = validateEnv();

const routerCreator = require('./routes/integrationRoutes')
const integrationRouter = routerCreator({ servicesURLS, GateWaySecret, authHeaderTitle });

app.use('/api', integrationRouter);

app.use((req, res) => {
  res.status(404).send('invalid route!');
})

app.listen(PORT, () => {
  console.log(`API Gateway running at http://localhost:${PORT}`);
});