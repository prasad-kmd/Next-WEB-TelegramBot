# 🌐 Post Maker Frontend

Next.js 16 (App Router) application for the Post Maker dashboard.

## 🛠 Setup

1. `npm install`
2. Configure `.env.local`:
   ```env
   NEXT_PUBLIC_BOT_USERNAME=your_bot_name
   NEXT_PUBLIC_API_URL=http://localhost:3001

   # NextAuth configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=a-random-64-character-string

   # Admin Users (Credentials Provider)
   # Passwords can be plaintext or bcrypt hashes starting with $2b
   NEXTAUTH_USER1_EMAIL=admin@example.com
   NEXTAUTH_USER1_PASSWORD=strongpassword1
   NEXTAUTH_USER1_NAME=Admin

   # Optional additional users
   # NEXTAUTH_USER2_EMAIL=
   # NEXTAUTH_USER2_PASSWORD=
   # NEXTAUTH_USER2_NAME=
   ```
3. `npm run dev`

## 🎨 UI & UX Features
- **Modern UI:** Built with Radix UI and shadcn/ui components.
- **Onboarding:** Step-by-step checklist for new users.
- **Command Palette:** Quick navigation and actions with `Ctrl+K`.
- **Rich Text:** TipTap-based editor with HTML formatting support.
- **Character Count:** Real-time character counter with Telegram limit warnings.
- **Rich Preview:** Instant visualization of how posts will look in Telegram.

## 🔒 Authentication
Dual authentication system:
1. **Telegram Login:** Uses the official Telegram Login Widget (currently showing notice banner).
2. **NextAuth Credentials:** Email/Password login for administrators.
   - Credentials users can link their Telegram account via a confirmation code flow for identity verification.
   - Access to posting is restricted if `AUTH_USERS` is configured on the backend and the account is not linked/authorized.

## 🚀 Deployment
Recommended to deploy on **Vercel**.
- Set `NEXTAUTH_URL` to your production domain.
- Ensure `NEXTAUTH_SECRET` is a secure random string.
