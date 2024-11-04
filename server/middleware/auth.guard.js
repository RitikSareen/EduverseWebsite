const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
   const token = req.header('Authorization')?.split(' ')[1];


   if (!token) {
       return res.status(401).json({ error: 'Access denied, no token provided' });
   }

   try {
       const secretKey = 'mysecretkey'
       const decoded = jwt.verify(token, secretKey);
       req.user = decoded;
       next();
   } catch (error) {
       return res.status(403).json({ error: 'Invalid token' });
   }
};

module.exports = verifyToken;
