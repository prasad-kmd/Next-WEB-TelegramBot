const mongoose = require('mongoose');

const TgLinkRequestSchema = new mongoose.Schema({
  email: { type: String, required: true },
  telegramId: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  confirmed: { type: Boolean, default: false },
  answeredAt: { type: Date }
});

module.exports = mongoose.model('TgLinkRequest', TgLinkRequestSchema);
