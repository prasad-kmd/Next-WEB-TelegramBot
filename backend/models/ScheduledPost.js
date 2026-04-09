import mongoose from 'mongoose'

const scheduledPostSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    targets: [
      {
        type: String, // channel ID or username
      },
    ],
    message: {
      type: String,
      required: true,
      maxlength: 4096,
    },
    parseMode: {
      type: String,
      enum: ['HTML', 'Markdown'],
      default: 'HTML',
    },
    replyMarkup: {
      inline_keyboard: [[Object]],
    },
    media: {
      file_id: String,
      file_type: String,
    },
    linkPreviewOptions: {
      disable_web_page_preview: Boolean,
      prefer_large_media: Boolean,
      prefer_small_media: Boolean,
      show_above_text: Boolean,
      url: String,
    },
    pinMessage: {
      type: Boolean,
      default: false,
    },
    silentSend: {
      type: Boolean,
      default: false,
    },
    protectContent: {
      type: Boolean,
      default: false,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'cancelled'],
      default: 'pending',
    },
    sentAt: Date,
    error: String,
  },
  { timestamps: true }
)

// Index for scheduler to find pending posts
scheduledPostSchema.index({ scheduledAt: 1, status: 1 })

export const ScheduledPost = mongoose.model('ScheduledPost', scheduledPostSchema)
