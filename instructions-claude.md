Build a full-stack Telegram Post Maker Bot with a Next.js frontend and
an Express backend. Users compose rich Telegram posts visually and send
or schedule them via a Telegram bot. Run entirely on free-tier services.

---

## STACK

- Frontend: Next.js 16 (App Router/ no `src` dir.) + Tailwind CSS + shadcn/ui — deploy on Vercel
- Backend: Node.js + Express — deploy on Railway (free tier)
- Bot library: telegraf
- Scheduler: node-cron
- Database: MongoDB Atlas (free 512MB tier) with Mongoose
  - → Fallback option: Supabase (free 500MB PostgreSQL tier) with Prisma
- File handling: NEVER upload files to the backend or store them anywhere.
  -All media is referenced by Telegram file_id only (see Media section).
- Auth: Telegram Login Widget (official) + AUTH_USERS env whitelist

---

## AUTHENTICATION

### Telegram Login Widget
- Use the official Telegram Login Widget on the sign-in page
- On callback, verify the hash using HMAC-SHA256 with BOT_TOKEN as the
  secret key (as per Telegram docs) — do this on the backend, never frontend
- After verification, issue a signed JWT (jsonwebtoken) stored in an
  httpOnly cookie

### Authorization (Two-Layer)
1. Telegram login verifies the user is a real Telegram account
2. AUTH_USERS env var contains a comma-separated list of allowed Telegram
   user IDs: AUTH_USERS=123456789,987654321
   - If AUTH_USERS is set, only those IDs can access the app after login
   - If AUTH_USERS is empty/unset, any Telegram user can log in (open mode)

### Session
- JWT stored in httpOnly cookie (15-day expiry)
- Backend middleware checks JWT + validates user ID against AUTH_USERS on
  every protected route
- Frontend Next.js middleware redirects unauthenticated users to /login

---

## DATABASE SCHEMA (MongoDB)

Collections:
- scheduled_posts: { id, userId, targets, message, parseMode, replyMarkup,
    media: { file_id, file_type }, linkPreviewOptions, pinMessage,
    silentSend, scheduledAt, status, createdAt }
- templates: { id, userId, name, message, replyMarkup,
    media: { file_id, file_type, thumbnail_file_id }, settings, createdAt }
- channels: { id, userId, channelId, channelTitle, addedAt }

Note: Only file_id strings are stored, never binary data or file paths.

---

## MEDIA HANDLING — file_id APPROACH (Core Design)

### Why file_id?
Telegram's Bot API limits direct uploads to 50MB. However, files already
on Telegram's servers are referenced by a file_id string — a permanent,
reusable identifier. Using file_id, a bot can re-send any file of any
size (photos, videos, documents up to 2GB) without any re-upload.

### How users attach media (Two methods):

METHOD 1 — Forward to Bot (Primary method):
1. User opens their Telegram app and forwards any message containing
   a file (photo, video, audio, document, voice, sticker, etc.) to
   the bot's private chat (@YourPostBot)
2. The bot's telegraf handler receives the forwarded message, extracts
   the file_id (and file_type, file_name, mime_type, file_size,
   thumbnail file_id if available) and stores it temporarily in MongoDB
   with a short TTL (e.g. 10 minutes): pending_media collection
3. In the web UI, user clicks "Attach from Telegram" — a polling call
   to GET /api/media/pending fetches the most recently forwarded file
   for that user from pending_media, displays its metadata (type, size,
   name) and a thumbnail if available
4. User confirms — the file_id is attached to the current post draft
5. On send/schedule, the backend uses this file_id directly in the
   Telegram API call (e.g. sendVideo with video: file_id)

METHOD 2 — Paste file_id manually (Power user):
- An expandable "Advanced" section in the media panel
- Input field: "Paste Telegram file_id"
- Dropdown: select file type (photo / video / audio / document / voice)
- Optional: paste thumbnail file_id for video/document preview in UI
- Useful when the user already knows the file_id from a previous post

### Bot handlers (telegraf) for file_id extraction:
Handle all incoming message types in the bot:
- message.photo      → use highest resolution: photos[photos.length-1].file_id
- message.video      → video.file_id
- message.audio      → audio.file_id
- message.document   → document.file_id
- message.voice      → voice.file_id
- message.video_note → video_note.file_id
- message.sticker    → sticker.file_id
- message.animation  → animation.file_id (GIF)

For each, extract and save to pending_media:
{
  userId: <telegram user id of sender>,
  file_id: <string>,
  file_type: <"photo"|"video"|"audio"|"document"|"voice"|...>,
  file_name: <string|null>,
  mime_type: <string|null>,
  file_size: <number|null>,
  thumb_file_id: <string|null>,
  receivedAt: <Date>,   ← TTL index: auto-delete after 10 minutes
}

After saving, bot replies to the user:
"✅ Media received! [Photo/Video/Document/...] is ready to use in the
web app. It will be available for 10 minutes."

### Sending with file_id:
When sending a post, the backend calls the appropriate Telegram method:
- sendPhoto(chat_id, file_id, { caption, parse_mode, reply_markup })
- sendVideo(chat_id, file_id, { caption, parse_mode, reply_markup })
- sendAudio(chat_id, file_id, { caption, ... })
- sendDocument(chat_id, file_id, { caption, ... })
- sendVoice(chat_id, file_id, { ... })
- sendSticker(chat_id, file_id, { reply_markup })
- sendAnimation(chat_id, file_id, { caption, ... })
- sendMediaGroup(chat_id, [ {type, media: file_id, caption}... ])
  → For media groups, user can forward multiple files; each becomes
    a pending_media entry; UI lets user select and order up to 10

### UI — Media Panel:
- "📎 Attach from Telegram" button → polls /api/media/pending, shows
  spinner while waiting, displays result when file arrives
- Shows attached file metadata: icon for type, file name, size badge
- Shows thumbnail preview if thumb_file_id is available (fetch via
  GET /api/media/thumbnail?file_id=... which calls getFile() and
  returns the Telegram CDN URL — no proxying, just the URL)
- "Remove" button to detach media from current draft
- "Add another" for media groups (up to 10)
- Clear instructions in the UI: "Forward any file to @YourBotUsername
  in Telegram, then click Attach"

---

## CORE FEATURES

### 1. Telegram Text Formatting (HTML parse_mode)

Rich text toolbar with:
- Bold → <b>text</b>
- Italic → <i>text</i>
- Underline → <u>text</u>
- Strikethrough → <s>text</s>
- Inline Code → <code>text</code>
- Code Block → <pre>text</pre>
- Spoiler → <tg-spoiler>text</tg-spoiler>
- Custom Emoji → <tg-emoji emoji-id="...">🎉</tg-emoji>
- Mention by ID → <a href="tg://user?id=123456">Name</a>

Implement with TipTap editor. Serialize to HTML for Telegram API.

### 2. Inline Keyboard Buttons

Button builder UI with:
- URL Button: label + URL
- Callback Button: label + callback data
- Multiple rows and columns (grid layout)
- Add / remove / reorder via drag-and-drop (@dnd-kit/core)
Sent as reply_markup: { inline_keyboard: [[...]] }

### 3. Quote (Reply with Quote)

- Input: paste a Telegram message link (t.me/channel/123) or enter
  message_id + chat_id manually
- Parse the link on the backend to extract chat_id and message_id
- Set reply_parameters: { message_id, chat_id } in the API call
- UI: collapsible "Quote" section showing parsed message reference

### 4. Create Link (Text Hyperlink)

- User selects text in TipTap editor, clicks "🔗 Create Link", enters URL
- Renders as <a href="URL">selected text</a> in HTML mode
- Telegram renders this as a clickable inline hyperlink
- UI: popover triggered from formatting toolbar

### 5. Date / Time Picker for Scheduling

- shadcn/ui Calendar + TimePicker component
- Timezone selector (Intl.supportedValuesOf('timeZone'))
- Store in UTC in DB, display in user's local timezone in UI
- Show countdown on scheduled post cards ("sends in 2h 15m")

### 6. Link Preview Control

Toggle panel:
- Enable / Disable link preview (disable_web_page_preview)
- Prefer large media (link_preview_options.prefer_large_media)
- Prefer small media (link_preview_options.prefer_small_media)
- Show preview above text (link_preview_options.show_above_text)
- Custom preview URL (link_preview_options.url)

### 7. AI Integration (Only if API key is present in env)

At startup, check for OPENAI_API_KEY or ANTHROPIC_API_KEY.
If neither is set, AI panel is hidden entirely — no errors shown.
If set, enable in the composer sidebar:
- "✨ Improve Writing" — refine the post text
- "🪄 Generate Post" — user provides a brief, AI writes the post
- "🌐 Translate" — translate to a target language
- "🔘 Suggest Buttons" — AI suggests inline button labels and URLs

All AI calls go through the backend. Never expose API keys to frontend.
Prefer Anthropic (claude-haiku-3) if both keys present; else OpenAI (gpt-4o-mini).

### 8. Scheduling

- node-cron on Railway backend checks every minute for pending posts
- Sends due posts, updates status to "sent" in MongoDB
- Railway free tier does not sleep — cron is reliable
- UI: "Scheduled" tab with pending posts, cancel button per post

### 9. Channel / Chat Management

- Add channels by @username or numeric ID
- Backend calls getChat() to validate and fetch title
- Multi-select when composing — send to multiple channels at once
- Stored per user in MongoDB channels collection

### 10. Post Templates

- Save full composer state (text, buttons, media file_id, settings)
- Load to pre-fill the composer
- Stored per user in MongoDB templates collection

### 11. Message Options

- 📌 Pin Message → pinChatMessage() after send
- 🔕 Silent Send → disable_notification: true
- 🔒 Protect Content → protect_content: true (blocks forwarding/saving)

---

## UI LAYOUT & DESIGN

Pages:
- /login        — Telegram Login Widget, centered card
- /             — Main composer, split panel (protected)
- /scheduled    — Scheduled posts queue (protected)
- /templates    — Saved templates (protected)
- /settings     — Bot username, channels, AI status (protected)

Dashboard layout:
- Left 60%: Composer (toolbar, TipTap editor, media panel, button
  builder, quote, link preview, schedule picker, send options)
- Right 40%: Live Telegram-style preview (dark bubble, renders HTML
  formatting, shows inline buttons, shows media type badge)

Use shadcn/ui: Card, Button, Dialog, Popover, Tooltip, Select,
Switch, Badge, Tabs, Progress, Calendar, ScrollArea, Separator.

---

## BACKEND API ROUTES (Express)

Auth:
POST /auth/telegram         → Verify Telegram hash, return JWT cookie
POST /auth/logout           → Clear cookie
GET  /auth/me               → Return current user info

Bot:
GET  /api/bot-info          → Validate BOT_TOKEN, return bot username

Media:
GET  /api/media/pending     → Get latest pending_media for current user
GET  /api/media/thumbnail   → Return Telegram CDN URL for a file_id
                              (calls getFile(), returns file_path URL only)
DELETE /api/media/pending   → Clear user's pending_media entry

Posts:
POST /api/send              → Send post immediately using file_id
POST /api/schedule          → Schedule a post
GET  /api/scheduled         → List scheduled posts
DELETE /api/scheduled/:id   → Cancel scheduled post

Channels:
GET  /api/channels          → List saved channels
POST /api/channels          → Validate + add channel
DELETE /api/channels/:id    → Remove channel

Templates:
GET  /api/templates         → List templates
POST /api/templates         → Save template
DELETE /api/templates/:id   → Delete template

AI (registered only if AI key present):
POST /api/ai/improve        → Improve post text
POST /api/ai/generate       → Generate post from brief
POST /api/ai/translate      → Translate post
POST /api/ai/suggest-buttons → Suggest inline buttons

---

## ENVIRONMENT VARIABLES

Backend (.env):
BOT_TOKEN=           # Telegram bot token from @BotFather
MONGODB_URI=         # MongoDB Atlas connection string
JWT_SECRET=          # Random 64-char secret
AUTH_USERS=          # Comma-separated Telegram user IDs (optional)
OPENAI_API_KEY=      # Optional
ANTHROPIC_API_KEY=   # Optional
FRONTEND_URL=        # Vercel frontend URL (for CORS)
PORT=3001

Frontend (.env.local):
NEXT_PUBLIC_BOT_USERNAME=   # Your bot's @username (for Login Widget)
NEXT_PUBLIC_API_URL=        # Railway backend URL

---

## VALIDATION & ERROR HANDLING

- Text post: max 4096 chars — live counter in UI, red when exceeded
- Caption (media): max 1024 chars — separate live counter
- Media group: 2–10 items, only photo/video types
- If pending_media has expired (>10 min): show "Media expired — please
  forward the file again" with a re-attach prompt
- Telegram API errors surfaced as toast notifications with clear messages:
  "Bot is not an admin in this channel"
  "file_id is invalid or from a different bot"
  "Message text is empty"
- file_id cross-bot note: file_ids are bot-specific. A file_id obtained
  by your bot is only valid for your bot. Warn the user if they try to
  paste a file_id from a different bot context.

---

## FREE TIER DEPLOYMENT SUMMARY

| Service       | What it runs              | Free limits                    |
|---------------|---------------------------|--------------------------------|
| Vercel        | Next.js frontend          | Unlimited hobby deployments    |
| Railway       | Express backend + cron    | $5 free credit/month, no sleep |
| MongoDB Atlas | Database (M0 cluster)     | 512MB shared                   |
| Telegram API  | Bot + all file delivery   | Free, no size limit via file_id|

Railway does NOT sleep on the free tier — cron scheduler is reliable.
Monitor Railway credit usage to avoid unexpected cutoff mid-month.

---

## DELIVERABLES

1. /frontend  — Next.js 14 app (App Router, Tailwind, shadcn/ui, TipTap)
2. /backend   — Express app (Mongoose, telegraf, node-cron, JWT)
3. /README.md — Full setup guide:
   - @BotFather bot creation and making bot admin in channels
   - MongoDB Atlas M0 cluster creation
   - AUTH_USERS configuration guide
   - Vercel + Railway deployment steps with env var setup
   - How to forward files to the bot and use the Attach button
4. package.json for both frontend and backend
5. .env.example files for both
