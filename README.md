# 🚀 Telegram Post Maker Bot

A powerful full-stack application to compose, preview, and schedule Telegram posts visually. Supports rich text formatting, inline buttons, and media forwarding.

---

## 🛠 Tech Stack

- **Frontend:** Next.js 15 (App Router), Tailwind CSS v3, shadcn/ui, TipTap Editor.
- **Backend:** Node.js, Express, Telegraf (Bot API).
- **Database:** MongoDB (with Mongoose).
- **Scheduler:** node-cron.
- **Auth:** Official Telegram Login Widget + NextAuth.js (Email/Password fallback).

---

## 🏗 Project Structure

```text
.
├── backend/            # Express server & Telegram Bot
│   ├── bot/           # Telegraf bot handlers
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API endpoints
│   └── scheduler.js   # node-cron post scheduler
├── frontend/           # Next.js web application
│   ├── app/           # App router pages
│   ├── components/    # UI components & Post Maker logic
│   └── lib/           # API utilities
└── README.md           # This guide
```

---

## 🚦 Getting Started (Local)

### 1. Telegram Bot Setup
1. Message [@BotFather](https://t.me/botfather) on Telegram.
2. Create a new bot using `/newbot` and save the **API Token**.
3. Set the bot's domain for the Login Widget using `/setdomain`. For local testing, use `localhost`.

### 2. Database Setup
1. Install [MongoDB Community Server](https://www.mongodb.com/try/download/community) locally.
2. Ensure it is running on `mongodb://localhost:27017`.

### 3. Backend Configuration
1. Navigate to `backend/` and run `npm install`.
2. Create a `.env` file in the `backend/` directory:
   ```env
   BOT_TOKEN=your_telegram_bot_token_here
   MONGODB_URI=mongodb://localhost:27017/tgpostmaker
   JWT_SECRET=your_random_jwt_secret_here
   AUTH_USERS=12345678,98765432 (Optional: your Telegram ID)
   FRONTEND_URL=http://localhost:3000
   PORT=3001
   ```
3. Start the backend: `npm start`.

### 4. Frontend Configuration
1. Navigate to `frontend/` and run `npm install`.
2. Create a `.env.local` file in the `frontend/` directory:
   ```env
   NEXT_PUBLIC_BOT_USERNAME=your_bot_username_here
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXTAUTH_SECRET=your_nextauth_secret_64_char
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_USER1_EMAIL=admin@example.com
   NEXTAUTH_USER1_PASSWORD=password123
   NEXTAUTH_USER1_NAME=Admin
   ```
3. Start the frontend: `npm run dev`.
4. Open `http://localhost:3000` in your browser.

---

## 🌎 Online Deployment Guide (Comprehensive)

To deploy this project online for free, we recommend **Vercel** for the frontend and **Railway** for the backend/database.

### 1. Setup MongoDB Atlas (Cloud Database)
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a **Free Shared Cluster** (M0).
3. Under **Network Access**, add `0.0.0.0/0`.
4. Create a database user and copy the `Connection String`.

### 2. Deploy Backend (Railway)
1. Push your code to a **GitHub Repository**.
2. Sign in to [Railway.app](https://railway.app/).
3. Click **New Project** -> **Deploy from GitHub repo** -> Select your repository.
4. When prompted for the root directory, choose the `backend/` folder.
5. Go to the **Variables** tab and add:
   - `BOT_TOKEN`: (Your bot token)
   - `MONGODB_URI`: (Your MongoDB Atlas connection string)
   - `JWT_SECRET`: (A random string)
   - `FRONTEND_URL`: `https://your-frontend-domain.vercel.app` (Update this later)
   - `PORT`: `3001`
6. Go to **Settings** -> **Public Networking** -> Click **Generate Domain**. Copy this URL.

### 3. Deploy Frontend (Vercel)
1. Sign in to [Vercel](https://vercel.com/).
2. Click **Add New** -> **Project** -> Import your GitHub repo.
3. In the **Build and Output Settings**:
   - **Root Directory**: Select `frontend`.
   - **Framework Preset**: Next.js.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_BOT_USERNAME`: (Your bot's username without @)
   - `NEXT_PUBLIC_API_URL`: (The Railway Public URL)
   - `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXTAUTH_USER1_EMAIL`, `NEXTAUTH_USER1_PASSWORD`.
5. Click **Deploy**. Copy the resulting domain.

### 4. Final Configuration (Crucial)
1. **Update Backend CORS:** Update `FRONTEND_URL` in Railway to your real Vercel domain.
2. **Authorize Bot Domain:**
   - In Telegram, message [@BotFather](https://t.me/botfather).
   - Send `/setdomain`, select your bot, and enter your **Vercel domain** (e.g., `my-app.vercel.app`).

---

## 🔍 Troubleshooting: Telegram Login Issues

If you enter your phone number in the Login Widget and do **not** receive a confirmation message in Telegram:
1. **Correct Bot Domain:** Telegram only sends codes to the domain registered via `/setdomain`. Ensure `localhost` or your Vercel URL is set correctly.
2. **Check "Telegram" Chat:** Confirmation messages come from the official **Telegram** account, not your bot.
3. **Use Email Fallback:** Use the email login if the Telegram widget is unavailable.

---

## 📖 Usage Workflow

1. **Onboarding:** Follow the checklist on the dashboard.
2. **Setup Channels:** Add your bot as an **Administrator** in your Telegram channel, then link it in **Settings**.
3. **Forward Media:** Forward any file to your bot in Telegram to "pick it up" in the composer.
4. **Composer:** Use the TipTap editor for rich formatting, add inline buttons, and schedule your post.
5. **Command Palette:** Press `Ctrl+K` to navigate the app quickly.

---

## 🛡 Security & Accessibility
- **NextAuth.js:** Provides a secure fallback when Telegram Login is down.
- **Accessibility:** All icon-only buttons have `aria-label`, and color contrast meets WCAG AA standards.
- **Data Safety:** Uses `httpOnly` cookies and HMAC-SHA256 verification.
