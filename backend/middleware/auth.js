const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Optional: Check against AUTH_USERS
    if (process.env.AUTH_USERS) {
      const allowedUsers = process.env.AUTH_USERS.split(',');
      if (!allowedUsers.includes(decoded.id.toString())) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
