const { Telegraf } = require('telegraf');
const PendingMedia = require('../models/PendingMedia');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.on('message', async (ctx, next) => {
  const message = ctx.message;
  let fileData = null;

  if (message.photo) {
    const photo = message.photo[message.photo.length - 1];
    fileData = { file_id: photo.file_id, file_type: 'photo' };
  } else if (message.video) {
    fileData = { file_id: message.video.file_id, file_type: 'video', file_name: message.video.file_name, thumb_file_id: message.video.thumb?.file_id };
  } else if (message.audio) {
    fileData = { file_id: message.audio.file_id, file_type: 'audio', file_name: message.audio.file_name };
  } else if (message.document) {
    fileData = { file_id: message.document.file_id, file_type: 'document', file_name: message.document.file_name, thumb_file_id: message.document.thumb?.file_id };
  } else if (message.voice) {
    fileData = { file_id: message.voice.file_id, file_type: 'voice' };
  } else if (message.video_note) {
    fileData = { file_id: message.video_note.file_id, file_type: 'video_note' };
  } else if (message.sticker) {
    fileData = { file_id: message.sticker.file_id, file_type: 'sticker' };
  } else if (message.animation) {
    fileData = { file_id: message.animation.file_id, file_type: 'animation' };
  }

  if (fileData) {
    await PendingMedia.findOneAndUpdate(
      { userId: ctx.from.id.toString() },
      {
        ...fileData,
        userId: ctx.from.id.toString(),
        receivedAt: new Date()
      },
      { upsert: true, new: true }
    );
    return ctx.reply(`✅ Media received! ${fileData.file_type} is ready to use in the web app. It will be available for 10 minutes.`);
  }

  return next();
});

module.exports = bot;
