import express from 'express'
import { Telegraf } from 'telegraf'
import { Channel } from '../models/Channel.js'
import { verifyAuthToken } from '../middleware/auth.js'

const router = express.Router()
const BOT_TOKEN = process.env.BOT_TOKEN
const bot = new Telegraf(BOT_TOKEN)

// Get user's channels
router.get('/', verifyAuthToken, async (req, res) => {
  try {
    const channels = await Channel.find({ userId: req.userId })
    res.json(channels)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Add channel
router.post('/', verifyAuthToken, async (req, res) => {
  try {
    let { channelId, channelUsername } = req.body

    // Normalize channel ID
    if (channelUsername && !channelId) {
      channelId = `@${channelUsername}`
    }

    if (!channelId) {
      return res.status(400).json({ error: 'Channel ID or username required' })
    }

    // Validate channel exists and bot is admin
    try {
      const chat = await bot.telegram.getChat(channelId)
      
      // Check if bot is admin
      const admins = await bot.telegram.getChatAdministrators(channelId)
      const botInfo = await bot.telegram.getMe()
      const isBotAdmin = admins.some((admin) => admin.user.id === botInfo.id)

      if (!isBotAdmin) {
        return res.status(400).json({
          error: 'Bot must be an admin in the channel',
        })
      }

      // Check if already added
      const existing = await Channel.findOne({
        userId: req.userId,
        channelId: chat.id.toString(),
      })

      if (existing) {
        return res.status(400).json({ error: 'Channel already added' })
      }

      const channel = new Channel({
        userId: req.userId,
        channelId: chat.id.toString(),
        channelTitle: chat.title,
        channelUsername: chat.username,
        type: chat.type,
      })

      await channel.save()

      res.json({
        success: true,
        channel,
      })
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(400).json({ error: 'Channel not found' })
      }
      throw error
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete channel
router.delete('/:id', verifyAuthToken, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)

    if (!channel || channel.userId !== req.userId) {
      return res.status(404).json({ error: 'Channel not found' })
    }

    await Channel.deleteOne({ _id: req.params.id })

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
