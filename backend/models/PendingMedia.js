import mongoose from 'mongoose'

const pendingMediaSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    file_id: {
      type: String,
      required: true,
    },
    file_type: {
      type: String,
      enum: ['photo', 'video', 'audio', 'document', 'voice', 'sticker', 'animation'],
      required: true,
    },
    file_name: String,
    mime_type: String,
    file_size: Number,
    thumb_file_id: String,
    receivedAt: {
      type: Date,
      default: Date.now,
      expires: 600, // Auto-delete after 10 minutes
    },
  },
  { timestamps: true }
)

export const PendingMedia = mongoose.model('PendingMedia', pendingMediaSchema)
