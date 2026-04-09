const express = require('express');
const router = express.Router();
const PendingMedia = require('../models/PendingMedia');
const auth = require('../middleware/auth');
const bot = require('../bot');

router.get('/pending', auth, async (req, res) => {
  try {
    const media = await PendingMedia.findOne({ userId: req.user.id.toString() }).sort({ receivedAt: -1 });
    if (!media) return res.status(404).json({ error: 'No pending media found' });
    res.json(media);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/thumbnail', auth, async (req, res) => {
  const { file_id } = req.query;
  if (!file_id) return res.status(400).json({ error: 'file_id is required' });

  try {
    const file = await bot.telegram.getFile(file_id);
    const url = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/pending', auth, async (req, res) => {
  try {
    await PendingMedia.deleteMany({ userId: req.user.id.toString() });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
