# 🚀 Telegram Post Maker Bot

A powerful full-stack application to compose, preview, and schedule Telegram posts visually. Supports rich text formatting, inline buttons, and media forwarding.

---

## 🛠 Tech Stack

- **Frontend:** Next.js 16 (App Router), Tailwind CSS v4, shadcn/ui, TipTap Editor.
- **Backend:** Node.js, Express, Telegraf (Bot API).
- **Database:** MongoDB (with Mongoose).
- **Scheduler:** node-cron.
- **Auth:** Official Telegram Login Widget + JWT.

---

## 🏗 Project Structure

```text
.
├── backend/            # Express server & Telegram Bot
│   ├── bot/           # Telegraf bot handlers
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API endpoints
│   └── scheduler.js   # node-cron post scheduler
├── frontend/           # Next.js 16 web application
│   ├── app/           # App router pages
│   ├── components/    # UI components & Post Maker logic
│   └── lib/           # API utilities
└── README.md           # This guide
```

---

## 🚦 Getting Started

### 1. Telegram Bot Setup
1. Message [@BotFather](https://t.me/botfather) on Telegram.
2. Create a new bot using `/newbot` and save the **API Token**.
3. Set the bot's domain for the Login Widget using `/setdomain` (use `localhost` for local testing).
4. (Optional) Set the bot's profile picture and description.

### 2. Database Setup
1. Install [MongoDB](https://www.mongodb.com/try/download/community) locally OR create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Get your connection string (e.g., `mongodb://localhost:27017/tgpostmaker`).

### 3. Backend Configuration
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file:
   ```env
   BOT_TOKEN=your_telegram_bot_token
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=a_random_long_string_for_security
   AUTH_USERS=your_telegram_id,another_id (Optional: whitelist of IDs)
   FRONTEND_URL=http://localhost:3000
   PORT=3001
   ```
4. Start the server: `npm start`

### 4. Frontend Configuration
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_BOT_USERNAME=your_bot_username (without @)
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```
4. Start the development server: `npm run dev`

---

## 📖 Usage Guide

### How to send your first post:

1. **Login:** Open `http://localhost:3000` and sign in using the Telegram Login Widget.
2. **Add Channels:**
   - Go to the **Settings** tab.
   - Enter your channel's `@username` or numeric ID.
   - **Important:** Your bot must be an administrator in the channel.
3. **Attach Media:**
   - Open Telegram and forward any photo/video/file to your bot's private chat.
   - The bot will reply: "✅ Media received!"
   - In the web app composer, click **"Poll Media"**. The forwarded file will appear.
   - Click **"Attach"**.
4. **Compose & Format:**
   - Use the toolbar to add Bold, Italic, Links, etc.
   - Add **Inline Buttons** using the Button Builder at the bottom.
5. **Send or Schedule:**
   - Select your target channels from the badges at the top.
   - Click **"Send Now"** for immediate delivery.
   - Or pick a date/time and click **"Schedule"**.

---

## 🚀 Deployment

### Backend (e.g., Railway, Heroku, or VPS)
1. Set the environment variables in your provider's dashboard.
2. Ensure the `PORT` is correctly mapped.
3. If using Railway, `node-cron` will run reliably as the process stays active.

### Frontend (e.g., Vercel)
1. Connect your GitHub repo to Vercel.
2. Set the `NEXT_PUBLIC_` environment variables.
3. **Important:** Update your Bot's domain via `@BotFather` to your production URL.

---

## 🔒 Security
- **httpOnly Cookies:** JWT tokens are stored securely to prevent XSS.
- **HMAC Verification:** Every login is verified using Telegram's official security hash algorithm on the backend.
- **Whitelist:** Use `AUTH_USERS` in the backend `.env` to restrict access to yourself or specific teammates.
