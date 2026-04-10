const mongoose = require('mongoose');

const UserLinkSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  telegramId: { type: String, required: true },
  linkedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserLink', UserLinkSchema);
