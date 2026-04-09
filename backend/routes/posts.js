import express from 'express'
import { Telegraf } from 'telegraf'
import { ScheduledPost } from '../models/ScheduledPost.js'
import { Channel } from '../models/Channel.js'
import { verifyAuthToken } from '../middleware/auth.js'

const router = express.Router()
const BOT_TOKEN = process.env.BOT_TOKEN
const bot = new Telegraf(BOT_TOKEN)

// Send post immediately
router.post('/send', verifyAuthToken, async (req, res) => {
  try {
    const { text, media, buttons, targets, pinMessage, silentSend, protectContent, disableLinkPreview } = req.body

    // Get user's channels if no targets specified
    let channelsToSend = targets
    if (!channelsToSend || channelsToSend.length === 0) {
      const channels = await Channel.find({ userId: req.userId })
      channelsToSend = channels.map((c) => c.channelId)
    }

    if (channelsToSend.length === 0) {
      return res.status(400).json({ error: 'No channels selected' })
    }

    const results = []

    for (const channelId of channelsToSend) {
      try {
        let messageId
        const sendOptions = {
          parse_mode: 'HTML',
          disable_web_page_preview: disableLinkPreview,
          disable_notification: silentSend,
          protect_content: protectContent,
        }

        // Add inline buttons if present
        if (buttons && buttons.length > 0) {
          sendOptions.reply_markup = {
            inline_keyboard: [
              buttons.map((btn) => ({
                text: btn.text,
                url: btn.url || undefined,
                callback_data: btn.url ? undefined : btn.text,
              })),
            ],
          }
        }

        if (media && media.file_id) {
          // Send with media
          const mediaOptions = {
            ...sendOptions,
            caption: text,
          }

          switch (media.file_type) {
            case 'photo':
              await bot.telegram.sendPhoto(channelId, media.file_id, mediaOptions)
              break
            case 'video':
              await bot.telegram.sendVideo(channelId, media.file_id, mediaOptions)
              break
            case 'audio':
              await bot.telegram.sendAudio(channelId, media.file_id, mediaOptions)
              break
            case 'document':
              await bot.telegram.sendDocument(channelId, media.file_id, mediaOptions)
              break
            case 'voice':
              await bot.telegram.sendVoice(channelId, media.file_id, mediaOptions)
              break
            case 'sticker':
              await bot.telegram.sendSticker(channelId, media.file_id)
              break
            case 'animation':
              await bot.telegram.sendAnimation(channelId, media.file_id, mediaOptions)
              break
          }
        } else {
          // Send text only
          const message = await bot.telegram.sendMessage(channelId, text, sendOptions)
          messageId = message.message_id
        }

        // Pin message if requested
        if (pinMessage && messageId) {
          await bot.telegram.pinChatMessage(channelId, messageId, { disable_notification: true })
        }

        results.push({ channelId, success: true })
      } catch (error) {
        results.push({ channelId, success: false, error: error.message })
      }
    }

    res.json({ success: true, results })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Schedule a post
router.post('/schedule', verifyAuthToken, async (req, res) => {
  try {
    const { text, media, buttons, targets, scheduledAt, pinMessage, silentSend, protectContent, disableLinkPreview } =
      req.body

    // Validate scheduled time
    const scheduleDate = new Date(scheduledAt)
    if (scheduleDate <= new Date()) {
      return res.status(400).json({ error: 'Scheduled time must be in the future' })
    }

    // Get user's channels if no targets specified
    let channelsToSend = targets
    if (!channelsToSend || channelsToSend.length === 0) {
      const channels = await Channel.find({ userId: req.userId })
      channelsToSend = channels.map((c) => c.channelId)
    }

    if (channelsToSend.length === 0) {
      return res.status(400).json({ error: 'No channels selected' })
    }

    // Build reply markup
    let replyMarkup = null
    if (buttons && buttons.length > 0) {
      replyMarkup = {
        inline_keyboard: [
          buttons.map((btn) => ({
            text: btn.text,
            url: btn.url || undefined,
            callback_data: btn.url ? undefined : btn.text,
          })),
        ],
      }
    }

    const scheduledPost = new ScheduledPost({
      userId: req.userId,
      targets: channelsToSend,
      message: text,
      parseMode: 'HTML',
      replyMarkup,
      media: media && media.file_id ? media : undefined,
      pinMessage,
      silentSend,
      protectContent,
      scheduledAt: scheduleDate,
    })

    await scheduledPost.save()

    res.json({
      success: true,
      postId: scheduledPost._id,
      scheduledAt: scheduledPost.scheduledAt,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get scheduled posts
router.get('/scheduled', verifyAuthToken, async (req, res) => {
  try {
    const posts = await ScheduledPost.find({
      userId: req.userId,
      status: 'pending',
    }).sort({ scheduledAt: 1 })

    res.json(posts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Cancel scheduled post
router.delete('/scheduled/:id', verifyAuthToken, async (req, res) => {
  try {
    const post = await ScheduledPost.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    if (post.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    post.status = 'cancelled'
    await post.save()

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
