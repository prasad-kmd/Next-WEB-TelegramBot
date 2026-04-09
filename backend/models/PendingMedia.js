const mongoose = require('mongoose');

const pendingMediaSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  file_id: { type: String, required: true },
  file_type: { type: String, required: true },
  file_name: String,
  mime_type: String,
  file_size: Number,
  thumb_file_id: String,
  receivedAt: { type: Date, default: Date.now, expires: 600 } // 10 minutes TTL
});

module.exports = mongoose.model('PendingMedia', pendingMediaSchema);
