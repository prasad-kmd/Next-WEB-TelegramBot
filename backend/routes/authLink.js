const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const bot = require('../bot');

// MongoDB Schema for Telegram Link Requests
const tgLinkRequestSchema = new mongoose.Schema({
  email: { type: String, required: true },
  telegramId: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  confirmed: { type: Boolean, default: false },
  answeredAt: { type: Date }
});

const TgLinkRequest = mongoose.models.TgLinkRequest || mongoose.model('TgLinkRequest', tgLinkRequestSchema);

// Resolve identifier and send confirmation
router.post('/tg-link-request', async (req, res) => {
  const { telegramIdentifier, email } = req.body;

  if (!telegramIdentifier || !email) {
    return res.status(400).json({ error: 'Missing telegramIdentifier or email' });
  }

  try {
    let telegramId;
    if (telegramIdentifier.startsWith('@')) {
      const chat = await bot.telegram.getChat(telegramIdentifier);
      telegramId = chat.id.toString();
    } else if (/^\d+$/.test(telegramIdentifier)) {
      telegramId = telegramIdentifier;
    } else {
      return res.status(400).json({ error: 'Invalid identifier format' });
    }

    // Check AUTH_USERS
    if (process.env.AUTH_USERS) {
      const allowedUsers = process.env.AUTH_USERS.split(',');
      if (!allowedUsers.includes(telegramId)) {
        return res.status(403).json({ error: 'This Telegram account is not authorized.' });
      }
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await TgLinkRequest.findOneAndUpdate(
      { email },
      { telegramId, code, expiresAt, confirmed: false },
      { upsert: true, new: true }
    );

    // Send Telegram Message
    await bot.telegram.sendMessage(telegramId,
      `🔐 *Login Confirmation*\n\nSomeone is trying to link this Telegram account to the Post Maker Bot using email: \`${email}\`\n\nConfirmation code: *${code}*\n\nTap a button or reply with the code to confirm.`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '✅ Confirm Login', callback_data: `tg_confirm:${code}` },
              { text: '❌ Deny', callback_data: `tg_deny:${code}` }
            ]
          ]
        }
      }
    );

    res.json({ status: 'sent', telegramId });
  } catch (err) {
    console.error('TgLinkRequest Error:', err);
    res.status(500).json({ error: 'Failed to send confirmation. Is your bot started?' });
  }
});

// Verify 6-digit code
router.post('/tg-verify', async (req, res) => {
  const { code, email } = req.body;
  try {
    const request = await TgLinkRequest.findOne({ code, email });
    if (!request) return res.status(404).json({ error: 'Invalid code' });

    if (request.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Code expired' });
    }

    request.confirmed = true;
    request.answeredAt = new Date();
    await request.save();

    res.json({ success: true, telegramId: request.telegramId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check status (for polling)
router.get('/tg-link-status', async (req, res) => {
  const { email } = req.query;
  try {
    const request = await TgLinkRequest.findOne({ email });
    if (!request) return res.json({ confirmed: false });
    res.json({ confirmed: request.confirmed, telegramId: request.telegramId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { router, TgLinkRequest };
