import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    telegramId: {
      type: Number,
      required: true,
      unique: true,
    },
    firstName: String,
    lastName: String,
    username: String,
    photoUrl: String,
    isAuthorized: {
      type: Boolean,
      default: false,
    },
    lastLogin: Date,
  },
  { timestamps: true }
)

export const User = mongoose.model('User', userSchema)
