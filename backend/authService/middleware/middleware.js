const jwt = require('jsonwebtoken');

const privateKey = process.env.JWT_SECRET;

if (!privateKey) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

const generateToken = (id) => {
    return jwt.sign({ id }, privateKey, { expiresIn: '3d' })
}

const verifyTokenMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    console.log('Detected a request with no token');
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, privateKey);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('Detected a request with Invalid or expired token:', err.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = {
    generateToken,
    verifyTokenMiddleware
}
