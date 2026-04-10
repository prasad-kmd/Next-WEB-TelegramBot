const express = require('express');
const router = express.Router();
const ScheduledPost = require('../models/ScheduledPost');
const auth = require('../middleware/auth');
const bot = require('../bot');

const sendPost = async (chatId, post) => {
  const { message, media, replyMarkup, parseMode, pinMessage, silentSend, protectContent, linkPreview } = post;
  const extra = {
    parse_mode: parseMode || 'HTML',
    reply_markup: replyMarkup,
    disable_notification: silentSend,
    protect_content: protectContent,
    link_preview_options: linkPreview !== undefined ? { is_disabled: !linkPreview } : undefined
  };

  let sentMessage;
  if (!media || !media.file_id) {
    sentMessage = await bot.telegram.sendMessage(chatId, message, extra);
  } else {
    switch (media.file_type) {
      case 'photo':
        sentMessage = await bot.telegram.sendPhoto(chatId, media.file_id, { ...extra, caption: message });
        break;
      case 'video':
        sentMessage = await bot.telegram.sendVideo(chatId, media.file_id, { ...extra, caption: message });
        break;
      case 'audio':
        sentMessage = await bot.telegram.sendAudio(chatId, media.file_id, { ...extra, caption: message });
        break;
      case 'document':
        sentMessage = await bot.telegram.sendDocument(chatId, media.file_id, { ...extra, caption: message });
        break;
      case 'voice':
        sentMessage = await bot.telegram.sendVoice(chatId, media.file_id, { ...extra, caption: message });
        break;
      case 'animation':
        sentMessage = await bot.telegram.sendAnimation(chatId, media.file_id, { ...extra, caption: message });
        break;
      case 'sticker':
        sentMessage = await bot.telegram.sendSticker(chatId, media.file_id, { reply_markup: replyMarkup });
        break;
      default:
        throw new Error('Unsupported media type');
    }
  }

  if (pinMessage) {
    await bot.telegram.pinChatMessage(chatId, sentMessage.message_id);
  }
  return sentMessage;
};

router.post('/send', auth, async (req, res) => {
  const { targets, ...postData } = req.body;
  try {
    const results = [];
    for (const target of targets) {
      const result = await sendPost(target, postData);
      results.push(result);
    }
    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/schedule', auth, async (req, res) => {
  try {
    const post = new ScheduledPost({
      ...req.body,
      userId: req.user.id.toString(),
      status: 'pending'
    });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/scheduled', auth, async (req, res) => {
  try {
    const posts = await ScheduledPost.find({ userId: req.user.id.toString() }).sort({ scheduledAt: 1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/scheduled/:id', auth, async (req, res) => {
  try {
    await ScheduledPost.findOneAndDelete({ _id: req.params.id, userId: req.user.id.toString() });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { router, sendPost };
