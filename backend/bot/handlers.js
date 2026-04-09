import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { PendingMedia } from '../models/PendingMedia.js'

const BOT_TOKEN = process.env.BOT_TOKEN
const bot = new Telegraf(BOT_TOKEN)

export async function botHandlers() {
  // Handle photo messages
  bot.on(message('photo'), async (ctx) => {
    try {
      const photo = ctx.message.photo[ctx.message.photo.length - 1]
      const file = await ctx.telegram.getFile(photo.file_id)

      const pendingMedia = new PendingMedia({
        userId: ctx.from.id,
        file_id: photo.file_id,
        file_type: 'photo',
        file_name: null,
        mime_type: 'image/jpeg',
        file_size: photo.file_size,
        thumb_file_id: photo.file_id,
      })

      await pendingMedia.save()

      await ctx.reply(
        '✅ Photo received! It is ready to use in the web app. It will be available for 10 minutes.'
      )
    } catch (error) {
      console.error('Error handling photo:', error)
      await ctx.reply('Failed to process photo')
    }
  })

  // Handle video messages
  bot.on(message('video'), async (ctx) => {
    try {
      const video = ctx.message.video
      const file = await ctx.telegram.getFile(video.file_id)

      const pendingMedia = new PendingMedia({
        userId: ctx.from.id,
        file_id: video.file_id,
        file_type: 'video',
        file_name: video.file_name || null,
        mime_type: video.mime_type,
        file_size: video.file_size,
        thumb_file_id: video.thumb?.file_id || null,
      })

      await pendingMedia.save()

      await ctx.reply(
        '✅ Video received! It is ready to use in the web app. It will be available for 10 minutes.'
      )
    } catch (error) {
      console.error('Error handling video:', error)
      await ctx.reply('Failed to process video')
    }
  })

  // Handle audio messages
  bot.on(message('audio'), async (ctx) => {
    try {
      const audio = ctx.message.audio

      const pendingMedia = new PendingMedia({
        userId: ctx.from.id,
        file_id: audio.file_id,
        file_type: 'audio',
        file_name: audio.title || null,
        mime_type: audio.mime_type,
        file_size: audio.file_size,
      })

      await pendingMedia.save()

      await ctx.reply(
        '✅ Audio received! It is ready to use in the web app. It will be available for 10 minutes.'
      )
    } catch (error) {
      console.error('Error handling audio:', error)
      await ctx.reply('Failed to process audio')
    }
  })

  // Handle document messages
  bot.on(message('document'), async (ctx) => {
    try {
      const document = ctx.message.document

      const pendingMedia = new PendingMedia({
        userId: ctx.from.id,
        file_id: document.file_id,
        file_type: 'document',
        file_name: document.file_name || null,
        mime_type: document.mime_type,
        file_size: document.file_size,
        thumb_file_id: document.thumb?.file_id || null,
      })

      await pendingMedia.save()

      await ctx.reply(
        '✅ Document received! It is ready to use in the web app. It will be available for 10 minutes.'
      )
    } catch (error) {
      console.error('Error handling document:', error)
      await ctx.reply('Failed to process document')
    }
  })

  // Handle voice messages
  bot.on(message('voice'), async (ctx) => {
    try {
      const voice = ctx.message.voice

      const pendingMedia = new PendingMedia({
        userId: ctx.from.id,
        file_id: voice.file_id,
        file_type: 'voice',
        mime_type: voice.mime_type,
        file_size: voice.file_size,
      })

      await pendingMedia.save()

      await ctx.reply(
        '✅ Voice message received! It is ready to use in the web app. It will be available for 10 minutes.'
      )
    } catch (error) {
      console.error('Error handling voice:', error)
      await ctx.reply('Failed to process voice message')
    }
  })

  // Start command
  bot.command('start', async (ctx) => {
    await ctx.reply(
      'Welcome to Telegram Post Maker Bot! Forward any media to this chat and it will be available in the web app.'
    )
  })

  // Launch bot
  bot.launch()

  console.log('Telegram bot handlers registered')
}
