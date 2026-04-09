import express from 'express'
import { Telegraf } from 'telegraf'
import { PendingMedia } from '../models/PendingMedia.js'
import { verifyAuthToken } from '../middleware/auth.js'

const router = express.Router()
const BOT_TOKEN = process.env.BOT_TOKEN
const bot = new Telegraf(BOT_TOKEN)

// Get latest pending media for user
router.get('/pending', verifyAuthToken, async (req, res) => {
  try {
    const media = await PendingMedia.findOne({ userId: req.userId }).sort({
      receivedAt: -1,
    })

    if (!media) {
      return res.status(404).json({ error: 'No pending media' })
    }

    res.json({
      file_id: media.file_id,
      file_type: media.file_type,
      file_name: media.file_name,
      file_size: media.file_size,
      thumb_file_id: media.thumb_file_id,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get thumbnail URL for a file_id
router.get('/thumbnail', verifyAuthToken, async (req, res) => {
  try {
    const { file_id } = req.query

    if (!file_id) {
      return res.status(400).json({ error: 'file_id required' })
    }

    const file = await bot.telegram.getFile(file_id)
    const url = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`

    res.json({ url })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete pending media for user
router.delete('/pending', verifyAuthToken, async (req, res) => {
  try {
    await PendingMedia.deleteOne({ userId: req.userId })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
