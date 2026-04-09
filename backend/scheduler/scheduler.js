import cron from 'node-cron'
import { Telegraf } from 'telegraf'
import { ScheduledPost } from '../models/ScheduledPost.js'

const BOT_TOKEN = process.env.BOT_TOKEN
const bot = new Telegraf(BOT_TOKEN)

export function startScheduler() {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date()

      // Find pending posts that should be sent
      const postsToSend = await ScheduledPost.find({
        status: 'pending',
        scheduledAt: { $lte: now },
      })

      for (const post of postsToSend) {
        try {
          for (const channelId of post.targets) {
            const sendOptions = {
              parse_mode: post.parseMode || 'HTML',
              disable_notification: post.silentSend,
              protect_content: post.protectContent,
              disable_web_page_preview: post.linkPreviewOptions?.disable_web_page_preview,
            }

            // Add buttons if present
            if (post.replyMarkup) {
              sendOptions.reply_markup = post.replyMarkup
            }

            let messageId

            if (post.media && post.media.file_id) {
              // Send with media
              switch (post.media.file_type) {
                case 'photo':
                  const photoMsg = await bot.telegram.sendPhoto(
                    channelId,
                    post.media.file_id,
                    {
                      ...sendOptions,
                      caption: post.message,
                    }
                  )
                  messageId = photoMsg.message_id
                  break

                case 'video':
                  const videoMsg = await bot.telegram.sendVideo(
                    channelId,
                    post.media.file_id,
                    {
                      ...sendOptions,
                      caption: post.message,
                    }
                  )
                  messageId = videoMsg.message_id
                  break

                case 'document':
                  const docMsg = await bot.telegram.sendDocument(
                    channelId,
                    post.media.file_id,
                    {
                      ...sendOptions,
                      caption: post.message,
                    }
                  )
                  messageId = docMsg.message_id
                  break

                case 'audio':
                  const audioMsg = await bot.telegram.sendAudio(
                    channelId,
                    post.media.file_id,
                    {
                      ...sendOptions,
                      caption: post.message,
                    }
                  )
                  messageId = audioMsg.message_id
                  break

                case 'voice':
                  const voiceMsg = await bot.telegram.sendVoice(
                    channelId,
                    post.media.file_id,
                    {
                      ...sendOptions,
                      caption: post.message,
                    }
                  )
                  messageId = voiceMsg.message_id
                  break

                case 'animation':
                  const animMsg = await bot.telegram.sendAnimation(
                    channelId,
                    post.media.file_id,
                    {
                      ...sendOptions,
                      caption: post.message,
                    }
                  )
                  messageId = animMsg.message_id
                  break

                default:
                  const textMsg = await bot.telegram.sendMessage(channelId, post.message, sendOptions)
                  messageId = textMsg.message_id
              }
            } else {
              // Send text only
              const textMsg = await bot.telegram.sendMessage(channelId, post.message, sendOptions)
              messageId = textMsg.message_id
            }

            // Pin message if requested
            if (post.pinMessage && messageId) {
              await bot.telegram.pinChatMessage(channelId, messageId, {
                disable_notification: true,
              })
            }
          }

          // Mark post as sent
          post.status = 'sent'
          post.sentAt = new Date()
          await post.save()

          console.log(`Post ${post._id} sent successfully`)
        } catch (error) {
          console.error(`Error sending post ${post._id}:`, error)
          post.status = 'failed'
          post.error = error.message
          await post.save()
        }
      }
    } catch (error) {
      console.error('Scheduler error:', error)
    }
  })

  console.log('Scheduler started')
}
