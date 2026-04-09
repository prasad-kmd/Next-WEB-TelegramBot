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

## 🚦 Getting Started (Local)

### 1. Telegram Bot Setup
1. Message [@BotFather](https://t.me/botfather) on Telegram.
2. Create a new bot using `/newbot` and save the **API Token**.
3. Set the bot's domain for the Login Widget using `/setdomain`. For local testing, use `localhost`.

### 2. Backend Configuration
1. Navigate to `backend/` and run `npm install`.
2. Create a `.env` file in the `backend/` directory:
   ```env
   BOT_TOKEN=your_telegram_bot_token_here
   MONGODB_URI=mongodb://localhost:27017/tgpostmaker
   JWT_SECRET=your_random_jwt_secret_here
   FRONTEND_URL=http://localhost:3000
   PORT=3001
   ```
3. Start the backend: `npm start`.

### 3. Frontend Configuration
1. Navigate to `frontend/` and run `npm install`.
2. Create a `.env.local` file in the `frontend/` directory:
   ```env
   NEXT_PUBLIC_BOT_USERNAME=your_bot_username_here
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```
3. Start the frontend: `npm run dev`.
4. Open `http://localhost:3000` in your browser.

---

## 🌎 Online Deployment Guide (Step-by-Step)

### 1. Setup MongoDB Atlas (Cloud Database)
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a **Free Shared Cluster** (M0).
3. Under **Network Access**, add `0.0.0.0/0`.
4. Create a database user and copy the `Connection String`.

### 2. Deploy Backend (Railway)
1. Push your code to GitHub and import the repo into [Railway.app](https://railway.app/).
2. In Railway, add the following variables:
   - `BOT_TOKEN`, `MONGODB_URI`, `JWT_SECRET`, `PORT=3001`.
   - `FRONTEND_URL`: (Your Vercel URL, e.g., `https://my-app.vercel.app`)
3. Generate a Public Domain in Railway and copy it.

### 3. Deploy Frontend (Vercel)
1. Import your GitHub repo into [Vercel](https://vercel.com/).
2. Root Directory: `frontend`.
3. Add Environment Variables:
   - `NEXT_PUBLIC_BOT_USERNAME`: `your_bot_name`
   - `NEXT_PUBLIC_API_URL`: (Your Railway URL)
4. Deploy and copy your Vercel URL.

### 4. Authorize Domain (IMPORTANT)
1. Open Telegram and message [@BotFather](https://t.me/botfather).
2. Send `/setdomain`, select your bot.
3. **Crucial:** Enter your **Vercel domain** WITHOUT `https://` (e.g., `my-app.vercel.app`).
4. If testing locally, you must send `/setdomain` again and enter `localhost`.

---

## 🔍 Troubleshooting: Telegram Login Issues

If you enter your phone number in the Login Widget and do **not** receive a confirmation message in Telegram, check the following:

### 1. Correct Bot Domain
Telegram will only send the confirmation message if the request comes from the domain registered via `/setdomain` in @BotFather.
- **Issue:** You are trying to login on `localhost`, but your bot is set to `my-app.vercel.app` (or vice versa).
- **Fix:** Update the domain in @BotFather to match where you are currently viewing the app.

### 2. Check "Telegram" Service Chat
The login confirmation does **not** come from your bot. It comes from the official **Telegram** service account (the same one that sends you login codes for new devices).
- Look for a chat named **Telegram** with a blue checkmark.
- The message will say: "We received a request to log in to [Your Bot Name] with your Telegram account..."
- You must click **"Confirm"** in that chat.

### 3. Browser Privacy Settings
- If you are using Brave or have strict ad-blockers, the Telegram widget script might be blocked.
- Try disabling your ad-blocker or using Incognito mode.

### 4. Bot API Token
Ensure the `BOT_TOKEN` in your backend `.env` is **identical** to the one used to create the widget (linked to `NEXT_PUBLIC_BOT_USERNAME`). If they don't match, the widget will fail to initialize correctly.

---

## 📖 Usage Workflow

1. **Login:** Use the Telegram button. Confirm the request in your official Telegram service chat.
2. **Setup Channels:** Add your bot as an **Admin** in your channel, then add the channel @username in the **Settings** tab.
3. **Forward Media:** Forward any file to your bot in Telegram. Click **Poll Media** in the web app to attach it.
4. **Post:** Compose, preview, and click **Send Now** or **Schedule**.
