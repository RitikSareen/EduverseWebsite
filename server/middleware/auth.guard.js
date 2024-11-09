const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('Authorization header received:', authHeader); // Log full Authorization header

  const token = authHeader?.split(' ')[1];
  console.log('Extracted token:', token); // Log extracted token

  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }

  try {
    const secretKey = process.env.JWT_SECRET || 'mysecretkey';
    console.log('Using secret key:', secretKey); // Log the secret key used for verification
    const decoded = jwt.verify(token, secretKey); // Verify the token
    console.log('Decoded token payload:', decoded); // Log the decoded payload
    req.user = decoded; // Attach decoded token data to request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Token verification failed:', error); // Log full error details
    return res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = verifyToken;
