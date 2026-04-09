import express from 'express'
import { Telegraf } from 'telegraf'

const router = express.Router()
const BOT_TOKEN = process.env.BOT_TOKEN

// Validate bot token and get bot info
router.get('/', async (req, res) => {
  try {
    const bot = new Telegraf(BOT_TOKEN)
    const botInfo = await bot.telegram.getMe()

    res.json({
      id: botInfo.id,
      username: botInfo.username,
      firstName: botInfo.first_name,
    })
  } catch (error) {
    res.status(400).json({
      error: 'Invalid BOT_TOKEN',
    })
  }
})

export default router
