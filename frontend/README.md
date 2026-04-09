# 🌐 Post Maker Frontend

Next.js 16 (App Router) application for the Post Maker dashboard.

## 🛠 Setup

1. `npm install`
2. Configure `.env.local`:
   ```env
   NEXT_PUBLIC_BOT_USERNAME=your_bot_name
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```
3. `npm run dev`

## 🎨 Components

- **Composer:** Main dashboard for writing posts.
- **PostEditor:** TipTap-based rich text editor.
- **PostPreview:** Real-time Telegram style message preview.
- **ButtonBuilder:** Interface for creating inline keyboard buttons.

## 🔒 Authentication
Uses the official Telegram Login Widget. The verification hash is sent to the backend, which returns a secure `httpOnly` JWT cookie.
