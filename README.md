# Telegram Post Maker Bot

A full-stack application to compose, preview, and schedule Telegram posts.

## Setup

### Prerequisites
- Node.js 18+
- MongoDB (Local or Atlas)
- Telegram Bot Token (from @BotFather)

### Backend
1. `cd backend`
2. `npm install`
3. Create `.env` from `.env.example` and fill in your details.
4. `npm start`

### Frontend
1. `cd frontend`
2. `npm install`
3. Create `.env.local` from `.env.local.example` and fill in your details.
4. `npm run dev`

## Features
- Visual Post Composer with TipTap (HTML formatting)
- Media Forwarding: Forward any file to the bot to attach it.
- Inline Keyboard Builder
- Post Scheduling (via node-cron)
- Multi-channel support
- Real Telegram-style preview
