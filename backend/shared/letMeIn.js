const validateEnv = () => {
  const GateWaySecret = process.env.API_SECRET;
  if (!GateWaySecret) {
    console.error('API_SECRET environment variable is not set. Ask the admin to let you in.');
    process.exit(1);
  }
  
  const authHeaderTitle = process.env.AUTH_HEADER_TITLE;
  if (!authHeaderTitle) {
    console.error('AUTH_HEADER_TITLE environment variable is not set.');
    process.exit(1);
  }

  return {
    GateWaySecret,
    authHeaderTitle
  };
}

const letMeIn = (req, res, next) => {
  const {
    GateWaySecret,
    authHeaderTitle
  } = validateEnv();
  
  const authHeader = req.headers[authHeaderTitle.toLowerCase()];
  if (authHeader !== GateWaySecret) {
    return res.status(403).send('Forbidden');
  }
  next();
}


// This middleware exists only as req.user doesn't after we proxy, so it is better to have it like that
// But no problemo as our API-gateway will always send the user data in the header
// So we can use it in the services
const findReqUser = (req, res, next) => {
  if (req.headers['x-user-data']) {
    req.user = JSON.parse(req.headers['x-user-data']);
    if(!req.user) {
      return res.status(400).send('Invalid user data');
    }  
  }
  next();
};

const handleInvalidRoute = (serviceName) => {
  return (req, res) => {
    const message = `Invalid ${serviceName} Route!`;
    console.log(message);
    console.log('URL:', req.originalUrl, 'Path:', req.url);

    res.status(404).json({ error: message });
  };
}


module.exports = { 
  validateEnv, 
  letMeIn, 
  findReqUser,
  handleInvalidRoute
};