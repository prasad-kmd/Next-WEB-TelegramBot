const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  channelId: { type: String, required: true },
  channelTitle: { type: String },
  addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Channel', channelSchema);
