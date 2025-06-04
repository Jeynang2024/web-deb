// middleware/authenticateToken.js

import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'helloworld'; // Use environment variable in production

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = user; // Attach decoded user information to request
    next();
  });
}

export default authenticateToken;
