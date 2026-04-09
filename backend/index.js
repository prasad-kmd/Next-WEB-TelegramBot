require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bot = require('./bot');
const initScheduler = require('./scheduler');

const authRoutes = require('./routes/auth');
const authLinkRoutes = require('./routes/authLink').router;
const mediaRoutes = require('./routes/media');
const postsRoutes = require('./routes/posts').router;
const channelsRoutes = require('./routes/channels');
const templatesRoutes = require('./routes/templates');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/auth', authRoutes);
app.use('/api/auth', authLinkRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/channels', channelsRoutes);
app.use('/api/templates', templatesRoutes);

// AI Routes placeholder
app.post('/api/ai/improve', (req, res) => res.status(501).json({ error: 'AI not implemented' }));

// Start Bot
bot.launch()
  .then(() => console.log('Telegram Bot Started'))
  .catch(err => console.error('Bot Launch Error:', err));

// Start Scheduler
initScheduler();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful stop
process.once('SIGINT', () => {
  bot.stop('SIGINT');
  mongoose.connection.close();
  process.exit();
});
process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
  mongoose.connection.close();
  process.exit();
});
