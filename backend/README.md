# 🖥️ Post Maker Backend

Node.js + Express server handling the Telegram Bot, Post Scheduling, and API.

## 🛠 Setup

1. `npm install`
2. Configure `.env` (see root README for details).
3. `npm start`

## 📡 API Endpoints

- `POST /auth/telegram`: Verify Telegram login hash and issue JWT.
- `GET /api/media/pending`: Poll the latest file forwarded to the bot.
- `POST /api/posts/send`: Send a post immediately.
- `POST /api/posts/schedule`: Schedule a post for later.
- `GET /api/channels`: Manage connected Telegram channels.

## 🤖 Bot Logic
The bot is located in `bot/index.js`. It listens for messages containing media and stores their `file_id` in MongoDB with a 10-minute TTL. This allows the web UI to "pick up" the media without uploading large files to your server.
