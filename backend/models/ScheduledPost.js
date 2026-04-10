const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  targets: [{ type: String }],
  message: { type: String },
  parseMode: { type: String, default: 'HTML' },
  replyMarkup: { type: Object },
  media: {
    file_id: String,
    file_type: String
  },
  linkPreview: { type: Boolean, default: true },
  linkPreviewOptions: { type: Object },
  pinMessage: { type: Boolean, default: false },
  silentSend: { type: Boolean, default: false },
  scheduledAt: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ScheduledPost', postSchema);
