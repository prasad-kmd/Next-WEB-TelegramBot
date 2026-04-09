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
   ```
3. Start the frontend: `npm run dev`.
4. Open `http://localhost:3000` in your browser.

---

## 🌎 Online Deployment Guide (Comprehensive)

To deploy this project to the internet for free, we recommend **Vercel** for the frontend and **Railway** for the backend/database.

### 1. Setup MongoDB Atlas (Cloud Database)
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a **Free Shared Cluster** (M0).
3. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) or specific IP addresses if you prefer.
4. Under **Database Access**, create a user with a username and password.
5. Click **Connect** -> **Drivers** -> Copy the `Connection String`. It looks like: `mongodb+srv://user:password@cluster.mongodb.net/tgpostmaker?retryWrites=true&w=majority`.

### 2. Deploy Backend (Railway)
1. Push your code to a **GitHub Repository**.
2. Sign in to [Railway.app](https://railway.app/).
3. Click **New Project** -> **Deploy from GitHub repo** -> Select your repository.
4. When prompted for the root directory, choose the `backend/` folder (or configure it in Settings).
5. Go to the **Variables** tab and add:
   - `BOT_TOKEN`: (Your bot token)
   - `MONGODB_URI`: (Your MongoDB Atlas connection string)
   - `JWT_SECRET`: (A random 64-character string)
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
   - `NEXT_PUBLIC_API_URL`: (The Railway Public URL from the previous step)
5. Click **Deploy**. Copy the resulting domain (e.g., `https://my-tg-bot.vercel.app`).

### 4. Final Configuration (Crucial)
1. **Update Backend CORS:** Go back to your Railway project variables and update `FRONTEND_URL` to your real Vercel domain.
2. **Authorize Bot Domain:**
   - In Telegram, message [@BotFather](https://t.me/botfather).
   - Send `/setdomain`, select your bot, and enter your **Vercel domain** (e.g., `my-tg-bot.vercel.app`).
   - **Note:** Without this step, the Telegram Login button will show "Auth domain invalid".

---

## 📖 Usage Workflow

1. **Login:** Use the Telegram button on the login page.
2. **Setup Channels:**
   - Navigate to **Settings**.
   - Add your bot as an **Administrator** in your Telegram channel.
   - Enter the channel username (e.g., `@mychannel`) in the app and click **Add**.
3. **Forward Media:**
   - Go to Telegram and forward any photo, video, or document to your bot.
   - In the web composer, click the **Poll Media** icon.
   - Click **Attach** to add it to your post.
4. **Schedule:**
   - Compose your message with the rich text editor.
   - Add inline buttons (URL or Callback).
   - Choose a target channel and a date/time, then click **Schedule**.

---

## 🛡 Security Best Practices
- **AUTH_USERS**: Set this backend variable to a comma-separated list of Telegram User IDs (e.g., `123456,789012`) to restrict the app only to yourself.
- **JWT_SECRET**: Use a high-entropy string and never commit it to git.
- **Database Access**: Ensure your MongoDB Atlas user has the minimum necessary permissions.
