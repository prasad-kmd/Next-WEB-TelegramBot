const cron = require('node-cron');
const ScheduledPost = require('./models/ScheduledPost');
const { sendPost } = require('./routes/posts');

const initScheduler = () => {
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    const duePosts = await ScheduledPost.find({
      status: 'pending',
      scheduledAt: { $lte: now }
    });

    for (const post of duePosts) {
      try {
        for (const target of post.targets) {
          await sendPost(target, post);
        }
        post.status = 'sent';
      } catch (err) {
        console.error(`Failed to send scheduled post ${post._id}:`, err);
        post.status = 'failed';
      }
      await post.save();
    }
  });
};

module.exports = initScheduler;
