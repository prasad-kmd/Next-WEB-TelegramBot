import mongoose from 'mongoose'

const channelSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    channelId: {
      type: String,
      required: true,
    },
    channelTitle: String,
    channelUsername: String,
    type: {
      type: String,
      enum: ['channel', 'group', 'supergroup'],
    },
  },
  { timestamps: true }
)

channelSchema.index({ userId: 1, channelId: 1 }, { unique: true })

export const Channel = mongoose.model('Channel', channelSchema)
