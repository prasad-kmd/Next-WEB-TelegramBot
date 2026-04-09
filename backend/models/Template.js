const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  message: { type: String },
  replyMarkup: { type: Object },
  media: {
    file_id: String,
    file_type: String,
    thumbnail_file_id: String
  },
  settings: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Template', templateSchema);
