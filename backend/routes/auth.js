const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/telegram', (req, res) => {
  const { hash, ...data } = req.body;

  // Verify Telegram hash
  const secretKey = crypto.createHash('sha256').update(process.env.BOT_TOKEN).digest();
  const dataCheckString = Object.keys(data)
    .sort()
    .map(key => `${key}=${data[key]}`)
    .join('\n');

  const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  if (hmac !== hash) {
    return res.status(401).json({ error: 'Data is not from Telegram' });
  }

  // Check if data is outdated (more than 24h)
  if (Date.now() / 1000 - data.auth_date > 86400) {
    return res.status(401).json({ error: 'Data is outdated' });
  }

  // Authorize user
  if (process.env.AUTH_USERS) {
    const allowedUsers = process.env.AUTH_USERS.split(',');
    if (!allowedUsers.includes(data.id.toString())) {
      return res.status(403).json({ error: 'User not authorized' });
    }
  }

  const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '15d' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 24 * 60 * 60 * 1000
  });

  res.json({ success: true, user: data });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

router.get('/me', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json(decoded);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
