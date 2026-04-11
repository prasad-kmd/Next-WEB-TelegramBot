const express = require('express');
const router = express.Router();
const Channel = require('../models/Channel');
const auth = require('../middleware/auth');
const bot = require('../bot');

router.get('/', auth, async (req, res) => {
  try {
    const channels = await Channel.find({ userId: req.user.id.toString() });
    res.json(channels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  const { channelId } = req.body;
  try {
    // Ensure channelId starts with @ or is a numeric ID
    const formattedId = (channelId.startsWith('@') || channelId.startsWith('-'))
      ? channelId
      : `@${channelId}`;

    const chat = await bot.telegram.getChat(formattedId);
    const channel = new Channel({
      userId: req.user.id.toString(),
      channelId: chat.id.toString(),
      channelTitle: chat.title || chat.username || chat.first_name
    });
    await channel.save();
    res.json(channel);
  } catch (err) {
    console.error('Error adding channel:', err);
    res.status(500).json({ error: 'Could not add channel. Make sure the bot is an admin and the ID/Username is correct.' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Channel.findOneAndDelete({ _id: req.params.id, userId: req.user.id.toString() });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
