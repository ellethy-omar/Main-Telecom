const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET

if(!jwtSecret) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

const requireAuth = (req, res, next) => {  
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    console.log('Detected a request with no token');
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    
    req.headers['x-user-data'] = JSON.stringify(decoded);
    
    console.log('API Gateway req.user:', req.user);
    next();
  } catch (err) {
    console.log('Detected a request with Invalid or expired token');
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

const handleServiceUnaviable = (err, req, res) => {
  console.log('Proxy error:', err.message);
  res.status(503).json({
    error: 'Service Unavailable',
    message: 'The requested service is currently unavailable.',
  });
}

module.exports = { 
  requireAuth,
  handleServiceUnaviable
};