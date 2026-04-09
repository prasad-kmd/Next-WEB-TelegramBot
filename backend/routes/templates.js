const express = require('express');
const router = express.Router();
const Template = require('../models/Template');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const templates = await Template.find({ userId: req.user.id.toString() });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const template = new Template({
      ...req.body,
      userId: req.user.id.toString()
    });
    await template.save();
    res.json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Template.findOneAndDelete({ _id: req.params.id, userId: req.user.id.toString() });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
