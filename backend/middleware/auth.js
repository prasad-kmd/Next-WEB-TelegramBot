const jwt = require('jsonwebtoken');
const UserLink = require('../models/UserLink');

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  const emailHeader = req.headers['x-user-email'];

  // Case 1: Custom JWT (Telegram login)
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (process.env.AUTH_USERS) {
        const allowedUsers = process.env.AUTH_USERS.split(',');
        if (!allowedUsers.includes(decoded.id.toString())) {
          return res.status(403).json({ error: 'User not authorized in AUTH_USERS' });
        }
      }
      return next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }

  // Case 2: NextAuth (Credentials login)
  if (emailHeader) {
    req.user = { email: emailHeader, id: emailHeader }; // Use email as ID

    if (process.env.AUTH_USERS) {
      const link = await UserLink.findOne({ email: emailHeader });
      if (!link) {
        return res.status(403).json({ error: 'Please link your Telegram account to enable posting' });
      }

      const allowedUsers = process.env.AUTH_USERS.split(',');
      if (!allowedUsers.includes(link.telegramId)) {
        return res.status(403).json({ error: 'This Telegram account is not authorized.' });
      }

      req.user.telegramId = link.telegramId;
    }
    return next();
  }

  return res.status(401).json({ error: 'Unauthorized' });
};

module.exports = authMiddleware;
