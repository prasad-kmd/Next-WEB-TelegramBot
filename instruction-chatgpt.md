Create a **full-stack Telegram Post Composer system** with a web interface and Telegram bot integration.

The system must allow creating rich Telegram posts using a web UI, previewing them, and sending them to Telegram channels or groups.

The project must be production-ready, modular, and deployable using only free-tier services.

---

# Tech Stack Requirements

Frontend:

Next.js 16 (App Router)
TypeScript
Tailwind CSS
shadcn/ui components
Deployed on Vercel

Backend:

Node.js
Express.js or Fastify
Telegraf (Telegram Bot Framework)
Deployed on Railway

Database:

Use either:

MongoDB Atlas (free tier)
OR
Supabase (free tier)

Design database abstraction layer so switching between MongoDB and Supabase is easy.

Do not store files in database.

---

# System Architecture

The system consists of:

1. Telegram Bot
2. Web Dashboard
3. Database
4. Scheduler
5. Optional AI module

Users interact with:

Telegram bot (for login + file forwarding)

AND

Web dashboard (for composing posts)

---

# Authentication Requirements

Authentication must support:

Telegram Login Widget on web frontend.

Use Telegram Login authentication flow.

Store:

telegram_user_id
username
first_name
last_name

Backend must validate Telegram login signature.

Add environment variable:

AUTH_USERS=12345678,98765432

Only those Telegram user IDs can use the system.

If user ID not in AUTH_USERS:

Reject access.

---

# File Handling Requirements

Telegram API has 50MB upload limits.

To avoid storing files:

Users must send files to the bot first.

Bot captures:

file_id
file_type
file_name

Store only:

file_id
file_type
file_name

Never store actual files.

When sending posts:

Reuse stored file_ids.

Allow:

Forward media from bot to channel
Attach media using file_ids
Create media groups using file_ids

---

# Core Features

The system must support building advanced Telegram posts.

---

# Post Builder Features

Users must be able to:

Create new post
Edit post
Preview post
Delete post
Send post
Schedule post

Post content includes:

Text
Media (via file_id)
Buttons
Links
Quotes
Date
Formatting

---

# Telegram Formatting Support

Support full Telegram Markdown V2.

Allow:

Bold
Italic
Underline
Strikethrough
Spoiler
Monospace
Inline code
Code blocks
Block quotes

Auto-escape invalid Markdown characters.

Provide formatting toolbar in UI.

---

# Buttons Support

Support Telegram inline keyboards.

Allow:

Multiple buttons
Multiple rows
Button types:

URL Button
Callback Button
Switch Inline Button

Store:

button_text
button_url
row_number
column_position

Preview buttons before sending.

---

# Inline Link Preview Control

Allow toggling:

Enable link preview
Disable link preview

Allow setting:

Preview position (above or below text if supported)

Preview links such as:

YouTube
Web pages
Telegram posts

---

# Quote Block Support

Add support for Telegram quote-style text blocks.

Allow:

Multiple quotes
Quoted text formatting

---

# Create Link Feature

Provide UI to create inline links.

Allow:

Clickable inline text links

Example:

[text](https://example.com)

Auto-validate URL.

---

# Date Feature

Allow inserting dynamic or static date.

Support:

Manual date
Auto-insert current date
Custom date format

Example formats:

YYYY-MM-DD
DD MMM YYYY
Relative date text

---

# Media Support

Support:

Photo
Video
Animation
Document
Audio

All media must use file_ids.

Allow:

Single media
Media groups
Media captions

Do not upload files via web UI.

Files must be received from Telegram bot.

---

# Media Inbox System

When user sends media to bot:

Store:

file_id
file_type
file_name
upload_date

User can:

Select previously sent files
Attach to posts

---

# Post Preview System

Preview posts inside Telegram.

Use:

sendMessage
sendPhoto
sendMediaGroup

Preview must show:

Formatting
Buttons
Media
Link preview behavior

Preview should send to user's private chat.

---

# Channel and Group Support

Allow posting to:

Telegram Channels
Telegram Groups

User must add bot as admin.

Allow saving:

Multiple destination channels.

Allow selecting target before sending.

---

# Scheduling System

Allow scheduling posts.

User selects:

Date
Time
Timezone

Use:

node-cron
or
BullMQ (Redis optional)

Store scheduled posts.

System must:

Send automatically at correct time.

Retry failed sends.

---

# Templates System

Allow saving templates.

Template includes:

Text
Buttons
Formatting
Links
Preview settings

User can:

Create template
Load template
Edit template
Delete template

---

# Multi-User Support

System must support multiple authorized users.

Each user has:

Own drafts
Own templates
Own media list
Own scheduled posts

Use:

telegram_user_id as main key.

---

# Optional AI Integration

Only implement AI if API key provided.

Use:

OpenAI API
OR
Compatible LLM API

Environment variable:

AI_API_KEY

AI Features:

Generate post text
Improve grammar
Create hashtags
Summarize content
Rewrite content

If AI key not present:

Disable AI features.

---

# UI Requirements

Use shadcn components.

Include:

Post Editor
Media Selector
Button Builder
Preview Panel
Templates Panel
Schedule Picker
Settings Panel

UI layout:

Left sidebar:

Posts
Templates
Media
Scheduled
Settings

Main area:

Post editor

Preview panel on right side.

---

# Editor Requirements

Rich text editor must support:

Markdown V2
Toolbar formatting
Inline link builder
Quote insertion
Date insertion

Live preview recommended.

---

# API Requirements

Backend must expose REST APIs:

POST /auth/telegram
GET /posts
POST /posts
PUT /posts/:id
DELETE /posts/:id

POST /preview
POST /send
POST /schedule

GET /media
POST /templates

Use JWT session tokens.

---

# Environment Variables

Define:

BOT_TOKEN=
WEBHOOK_URL=
DATABASE_URL=
AUTH_USERS=
JWT_SECRET=
AI_API_KEY= optional

---

# Telegram Bot Features

Bot must:

Receive media
Save file_ids
Authenticate users
Send previews
Send posts
Handle inline keyboards

Use webhook mode.

---

# Database Schema Design

Collections / Tables:

users
posts
templates
media
scheduled_posts
channels

Do not store binary data.

Store only metadata.

---

# Security Requirements

Validate all input.

Escape Markdown characters.

Restrict access to authorized users.

Protect API routes with authentication.

Use HTTPS.

---

# Deployment Requirements

Frontend:

Deploy on Vercel.

Backend:

Deploy on Railway.

Database:

MongoDB Atlas or Supabase.

Provide:

Deployment instructions
Environment setup
Webhook configuration

---

# Logging Requirements

Add logging for:

User login
Post sending
Errors
Scheduled tasks

Store logs in console and file.

---

# Performance Requirements

Use:

Async operations
Caching where useful

Avoid unnecessary polling.

Use Telegram webhooks.

---

# Future Expansion Ready

Code must be modular.

Allow adding:

RSS auto-posting
Analytics
Bulk posting
Multi-channel automation
Webhook triggers

---

# Expected Output from Code Generator

Generate:

Frontend project
Backend project
Telegram bot integration
Database schema
API routes
Deployment guides
.env example files
README documentation

Everything must be fully functional and ready to deploy.

---

# Optional Enhancements (If Possible)

Add:

Emoji picker
Character counter
Poll creation
Quiz creation
Message editing
Pin message support
Forward message support

---

# Final System Goal

Create a **Telegram Post Composer Dashboard** that behaves like a lightweight publishing tool.

Users should be able to:

Send media to Telegram bot
Compose posts on web UI
Add formatting
Add buttons
Add links
Add quotes
Add dates
Preview posts
Schedule posts
Send posts

All without storing files or using paid services.
