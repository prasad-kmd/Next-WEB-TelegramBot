# 🚀 Telegram Post Maker Bot (Premium Edition)

A professional-grade, full-stack application designed for content creators, community managers, and businesses to compose, preview, and schedule Telegram posts with a high-end visual experience.

---

## ✨ Features (Remastered)

- **💎 Premium UI/UX:** Completely redesigned frontend with a modern, dark-themed aesthetic, featuring animated components like `ClickSpark`, `FloatingNavbar`, and Framer Motion transitions.
- **🎨 Custom Typography:** Utilizing 8+ high-quality local fonts (Space Mono, Google Sans, Mozilla Headline, JetBrains Mono, etc.) for a distinct and professional feel.
- **📱 Responsive & Mobile Ready:** Optimized for seamless usage across all devices, from desktop workstations to mobile phones.
- **🌓 Dark/Light Mode:** Full support for system-wide and manual theme toggling.
- **📝 Rich Post Composition:** TipTap-powered editor with HTML formatting support and real-time live preview.
- **🗓 Smart Scheduling:** Advance post scheduling with precision time control and node-cron automation.
- **🔗 Secure Authentication:** Unified Telegram Login Widget and Credentials-based fallback for enterprise security.
- **⚖️ Compliance Ready:** Built-in `Privacy Policy`, `Terms & Conditions`, and `Disclaimer` pages.

---

## 🛠 Tech Stack

- **Frontend:** Next.js 16 (App Router), Tailwind CSS v4, shadcn/ui, TipTap, Framer Motion.
- **Backend:** Node.js, Express, Telegraf (Bot API).
- **Database:** MongoDB (with Mongoose).
- **Scheduler:** node-cron.
- **Auth:** NextAuth.js + Telegram Login Widget.

---

## 🚦 Getting Started (Local)

### 1. Telegram Bot Setup
1. Message [@BotFather](https://t.me/botfather) on Telegram.
2. Create a new bot using `/newbot` and save the **API Token**.
3. Set the bot's domain for the Login Widget using `/setdomain`. For local testing, use `localhost`.

### 2. Database Setup
1. Install [MongoDB Community Server](https://www.mongodb.com/try/download/community) or use a Cloud Atlas instance.

### 3. Backend Configuration
1. Navigate to `backend/` and run `npm install`.
2. Create a `.env` file:
   ```env
   BOT_TOKEN=your_telegram_bot_token_here
   MONGODB_URI=mongodb://localhost:27017/tgpostmaker
   JWT_SECRET=your_random_jwt_secret_here
   FRONTEND_URL=http://localhost:3000
   PORT=3001
   ```
3. Start the backend: `npm start`.

### 4. Frontend Configuration
1. Navigate to `frontend/` and run `npm install`.
2. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_BOT_USERNAME=your_bot_username_here
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_here
   ```
3. Start the frontend: `npm run dev`.

---

## 🌎 Online Deployment

For production, we recommend **Vercel** for the frontend and **Railway** or **Render** for the backend/database. Ensure `AUTH_USERS` is set in the backend environment to restrict access to authorized personnel.

---

## ⚖️ Legal
This application includes dedicated pages for:
- [Privacy Policy](http://localhost:3000/privacy)
- [Terms & Conditions](http://localhost:3000/terms)
- [Disclaimer](http://localhost:3000/disclaimer)

---

## 🛡 Security
- **Secure Sessions:** NextAuth managed sessions with custom JWT providers.
- **API Protection:** Backend endpoints protected by identity verification.
- **Local Fonts Only:** No external font dependencies for maximum privacy and performance.

---
Designed and Developed with ❤️ by **PRASADM**
