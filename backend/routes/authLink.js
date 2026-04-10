const express = require('express');
const router = express.Router();
const TgLinkRequest = require('../models/TgLinkRequest');
const UserLink = require('../models/UserLink');
const bot = require('../bot');
const jwt = require('jsonwebtoken');

// Middleware to get user email from either custom JWT or NextAuth (mocked for backend)
// In a real scenario, we'd need to verify the NextAuth session, but here we'll assume the email is passed or decoded from a token.
const getEmailFromReq = (req) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded.email || decoded.id?.toString(); // custom token might have email or id
    } catch (e) {}
  }
  // For NextAuth, we might expect the frontend to pass the email in headers or we verify the session cookie if shared.
  // Since we are adding this flow specifically for credentials users, let's assume they provide their email in the request for now,
  // but in a production app, we'd use a shared secret or session verification.
  return req.body.email || req.headers['x-user-email'];
};

router.post('/tg-link-request', async (req, res) => {
  const { telegramIdentifier } = req.body;
  const email = getEmailFromReq(req);

  if (!email) return res.status(401).json({ error: 'Unauthorized' });

  try {
    let telegramId = telegramIdentifier;
    let username = null;

    if (telegramIdentifier.startsWith('@')) {
      try {
        const chat = await bot.telegram.getChat(telegramIdentifier);
        telegramId = chat.id.toString();
        username = chat.username;
      } catch (err) {
        return res.status(404).json({ error: 'Telegram user not found' });
      }
    }

    // Check AUTH_USERS
    if (process.env.AUTH_USERS) {
      const allowedUsers = process.env.AUTH_USERS.split(',');
      if (!allowedUsers.includes(telegramId)) {
        return res.status(403).json({ error: 'This Telegram account is not authorized.' });
      }
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await TgLinkRequest.findOneAndUpdate(
      { email },
      { telegramId, code, expiresAt, confirmed: false },
      { upsert: true, new: true }
    );

    const message = `🔐 *Login Confirmation*\n\nSomeone is trying to link this Telegram account to the Post Maker Bot using email: ${email}\n\nConfirmation code: \`${code}\`\n\nTap a button or reply with the code to confirm.`;

    await bot.telegram.sendMessage(telegramId, message, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Confirm Login', callback_data: `tg_confirm:${code}` },
            { text: '❌ Deny', callback_data: `tg_deny:${code}` }
          ]
        ]
      }
    });

    res.json({ status: 'sent', telegramId, username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send confirmation' });
  }
});

router.post('/tg-verify', async (req, res) => {
  const { code } = req.body;
  const email = getEmailFromReq(req);

  if (!email) return res.status(401).json({ error: 'Unauthorized' });

  const request = await TgLinkRequest.findOne({ email, code, expiresAt: { $gt: new Date() } });

  if (!request) {
    return res.status(400).json({ error: 'Invalid or expired code' });
  }

  request.confirmed = true;
  request.answeredAt = new Date();
  await request.save();

  await UserLink.findOneAndUpdate(
    { email },
    { telegramId: request.telegramId, linkedAt: new Date() },
    { upsert: true }
  );

  res.json({ success: true, telegramId: request.telegramId });
});

router.get('/tg-link-status', async (req, res) => {
  const email = getEmailFromReq(req);
  if (!email) return res.status(401).json({ error: 'Unauthorized' });

  const request = await TgLinkRequest.findOne({ email }).sort({ _id: -1 });

  if (request && request.confirmed) {
    await UserLink.findOneAndUpdate(
      { email },
      { telegramId: request.telegramId, linkedAt: new Date() },
      { upsert: true }
    );
    return res.json({ confirmed: true, telegramId: request.telegramId });
  }

  res.json({ confirmed: false });
});

router.get('/tg-link-info', async (req, res) => {
  const email = getEmailFromReq(req);
  if (!email) return res.status(401).json({ error: 'Unauthorized' });

  const link = await UserLink.findOne({ email });
  if (link) {
    try {
      const chat = await bot.telegram.getChat(link.telegramId);
      return res.json({ telegramId: link.telegramId, username: chat.username });
    } catch (e) {
      return res.json({ telegramId: link.telegramId });
    }
  }

  res.json({ linked: false });
});

module.exports = router;
