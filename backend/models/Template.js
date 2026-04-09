import mongoose from 'mongoose'

const templateSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    message: {
      type: String,
      required: true,
      maxlength: 4096,
    },
    replyMarkup: {
      inline_keyboard: [[Object]],
    },
    media: {
      file_id: String,
      file_type: String,
      thumbnail_file_id: String,
    },
    settings: {
      parseMode: String,
      pinMessage: Boolean,
      silentSend: Boolean,
      protectContent: Boolean,
      disableLinkPreview: Boolean,
    },
  },
  { timestamps: true }
)

export const Template = mongoose.model('Template', templateSchema)
