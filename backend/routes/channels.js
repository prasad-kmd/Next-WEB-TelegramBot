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
    const chat = await bot.telegram.getChat(channelId);
    const channel = new Channel({
      userId: req.user.id.toString(),
      channelId: chat.id.toString(),
      channelTitle: chat.title || chat.username || chat.first_name
    });
    await channel.save();
    res.json(channel);
  } catch (err) {
    res.status(500).json({ error: 'Could not find channel or bot is not a member.' });
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
