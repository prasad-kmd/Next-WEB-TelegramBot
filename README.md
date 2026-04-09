# Telegram Post Maker Bot

A full-stack web application for composing, scheduling, and sending rich Telegram posts. Built with Next.js 16, Express, MongoDB, and Telegraf.

## Features

- **Rich Text Formatting**: Bold, italic, underline, strikethrough, code, spoilers
- **Media Handling**: Forward files to the bot via Telegram, attach media via file_id
- **Inline Buttons**: Create clickable buttons with URLs or callback data
- **Scheduling**: Schedule posts to send at specific dates/times
- **Channel Management**: Add and manage multiple Telegram channels
- **Post Templates**: Save and reuse post templates
- **AI Integration**: Optional AI features (improve text, generate posts, translate, suggest buttons)
- **Message Options**: Pin messages, silent send, protect content
- **Live Preview**: See how your post looks in Telegram in real-time

## Architecture

```
telegram-bot/
├── frontend/           # Next.js 16 web application
│   ├── app/           # App Router pages
│   ├── components/    # React components
│   ├── lib/          # Utilities and helpers
│   └── public/       # Static assets
├── backend/           # Express.js backend
│   ├── routes/       # API endpoints
│   ├── models/       # MongoDB schemas
│   ├── middleware/   # Authentication & validation
│   ├── bot/         # Telegraf bot handlers
│   └── scheduler/   # Post scheduler with cron
└── README.md         # This file
```

## Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier available)
- Telegram Bot created via @BotFather
- (Optional) OpenAI or Anthropic API key for AI features

## Setup Guide

### 1. Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` and follow the prompts
3. Save your bot token (it looks like `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
4. Send `/setcommands` to BotFather and set up commands
5. **Important**: Add your bot as an admin to any channels where it will post

### 2. MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster (512MB shared)
3. Create a database user and get your connection string
4. Connection string format: `mongodb+srv://username:password@cluster.mongodb.net/telegram-bot?retryWrites=true&w=majority`

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_BOT_USERNAME=YourBotUsername
```

### 4. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
BOT_TOKEN=your_bot_token_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/telegram-bot
JWT_SECRET=generate-a-random-secret-at-least-32-chars-long
FRONTEND_URL=http://localhost:3000
PORT=3001
```

**Optional AI features** (add one or both):
```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

### 5. Authorization Setup (Optional)

To restrict access to specific Telegram users, add their IDs to `.env`:
```
AUTH_USERS=123456789,987654321,555555555
```

If left empty, any Telegram user can access the app.

## Running Locally

### Terminal 1: Start Backend
```bash
cd backend
npm run dev
```

Backend runs on `http://localhost:3001`

### Terminal 2: Start Frontend
```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:3000`

## Deployment

### Vercel (Frontend)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Set environment variables in Vercel settings:
   - `NEXT_PUBLIC_API_URL=https://your-railway-app.up.railway.app`
   - `NEXT_PUBLIC_BOT_USERNAME=YourBotUsername`
5. Deploy

### Railway (Backend)

1. Go to [Railway](https://railway.app)
2. Create a new project
3. Connect your GitHub repository
4. Add MongoDB Atlas connection in Railway Variables
5. Set environment variables:
   - `BOT_TOKEN`
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL=https://your-vercel-app.vercel.app`
   - `OPENAI_API_KEY` (optional)
   - `ANTHROPIC_API_KEY` (optional)
   - `AUTH_USERS` (optional)
6. Railway will automatically deploy on push

## API Routes

### Authentication
- `POST /auth/telegram` - Verify Telegram login
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout

### Media
- `GET /api/media/pending` - Get latest forwarded file
- `GET /api/media/thumbnail` - Get thumbnail URL for file_id
- `DELETE /api/media/pending` - Clear pending media

### Posts
- `POST /api/send` - Send post immediately
- `POST /api/schedule` - Schedule a post
- `GET /api/scheduled` - List scheduled posts
- `DELETE /api/scheduled/:id` - Cancel scheduled post

### Channels
- `GET /api/channels` - List user's channels
- `POST /api/channels` - Add a channel
- `DELETE /api/channels/:id` - Remove a channel

### Templates
- `GET /api/templates` - List templates
- `POST /api/templates` - Create template
- `DELETE /api/templates/:id` - Delete template

### AI (Optional)
- `POST /api/ai/improve` - Improve post text
- `POST /api/ai/generate` - Generate post from brief
- `POST /api/ai/translate` - Translate to language
- `POST /api/ai/suggest-buttons` - Suggest buttons for post

## How to Use

### 1. Login
- Visit `http://localhost:3000/login`
- Click "Sign in with Telegram" button
- Verify your Telegram account

### 2. Attach Media
- Forward any file to your bot in Telegram
- Go to the composer and click "Attach from Telegram"
- Wait for the file to appear and select it

### 3. Compose Post
- Write your message in the text area
- Use formatting toolbar for bold, italic, etc.
- Add inline buttons if desired
- Select media (optional)

### 4. Send or Schedule
- Click "Send Now" to send immediately
- Click "Schedule" to send at a later time
- Set message options (pin, silent, protect)

## File_ID System

This bot uses Telegram's `file_id` system to avoid re-uploading files. When you forward a file to the bot:

1. The bot extracts the `file_id` (a unique identifier for that file on Telegram's servers)
2. The `file_id` is stored in MongoDB
3. When sending, the bot references this `file_id` instead of re-uploading

This allows sending files of any size (up to 2GB) without the 50MB upload limit.

## Telegram HTML Formatting

The bot supports HTML parse_mode. Format text with:
- `<b>bold</b>`
- `<i>italic</i>`
- `<u>underline</u>`
- `<s>strikethrough</s>`
- `<code>inline code</code>`
- `<pre>code block</pre>`
- `<tg-spoiler>spoiler</tg-spoiler>`
- `<a href="https://example.com">link</a>`
- `<a href="tg://user?id=123456">mention</a>`

## Troubleshooting

### "Bot is not an admin in this channel"
- Add the bot as an admin to the channel in Telegram
- Make sure it has the permission to post messages

### "file_id is invalid"
- The file_id is specific to your bot
- Don't use file_ids from other bots
- Re-forward the file to your bot

### Messages not sending
- Check bot permissions in the channel
- Verify the channel ID format
- Check backend logs for API errors

### Scheduler not working
- Railway free tier doesn't sleep, cron should work
- Check that `node-cron` is running
- Verify scheduled times are in the future

## Environment Variables Reference

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL      # Backend URL (default: http://localhost:3001)
NEXT_PUBLIC_BOT_USERNAME # Your bot's @username for Login Widget
```

### Backend (.env)
```
BOT_TOKEN               # From @BotFather
MONGODB_URI             # MongoDB Atlas connection string
JWT_SECRET              # Random secret for JWT signing (min 32 chars)
AUTH_USERS              # Comma-separated allowed Telegram IDs (optional)
OPENAI_API_KEY          # OpenAI API key (optional)
ANTHROPIC_API_KEY       # Anthropic API key (optional)
FRONTEND_URL            # Frontend URL for CORS (default: http://localhost:3000)
PORT                    # Backend port (default: 3001)
NODE_ENV                # development or production
```

## Free Tier Limits

| Service | Limit |
|---------|-------|
| MongoDB Atlas | 512MB shared (M0) |
| Railway | $5/month credit |
| Vercel | Unlimited hobby deployments |
| Telegram Bot API | No size limit via file_id |

## Technology Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, Telegraf, node-cron
- **Database**: MongoDB with Mongoose
- **Authentication**: Telegram Login Widget + JWT
- **Deployment**: Vercel (frontend), Railway (backend)

## License

MIT

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check the console logs for error messages

## Contributing

Contributions are welcome! Feel free to open issues and pull requests.
