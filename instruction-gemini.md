**Project Overview**
Build a full-stack Telegram Post Management System. The system consists of a **Next.js Frontend Dashboard** (Vercel) and a **Node.js/TypeScript Backend** (Railway). The goal is to draft, format, and publish posts to Telegram channels, including support for large files via `file_id` forwarding.

**Technical Stack**
* **Frontend:** Next.js (App Router), Tailwind CSS, Shadcn UI, Lucide Icons.
* **Backend:** Node.js, TypeScript, grammY (Telegram Bot Framework).
* **Database:** MongoDB (via MongoDB Atlas Free Tier) for storing post metadata.
* **Authentication:** Telegram Login Widget (Official) + `AUTH_USERS` env check.
* **Deployment:** Frontend on Vercel, Backend on Railway.

**Core Features to Implement**

**1. Secure Authentication & Access Control**
* Implement a login page using the **Telegram Login Widget**.
* On successful login, the backend must verify the hash and check the user's Telegram ID against an `AUTH_USERS` environment variable (comma-separated string).
* Only authorized users can access the dashboard or trigger bot commands.

**2. Post Composer UI (Next.js + Shadcn)**
* Create a rich text editor or structured input fields that support:
    * **Text Formatting:** Bold, Italic, Monospace.
    * **Special Blocks:** **Quote** (`<blockquote>`) and **Date** insertion.
    * **Hyperlinks:** A dedicated "Create Link" tool for nested URLs.
* **Interactive Buttons:** A dynamic UI to add/remove multiple rows of Inline Keyboard buttons (Label + URL).
* **Link Preview:** Toggle for `link_preview_options` (Show/Hide, Above/Below text).
* **Live Preview:** A side panel showing a "Telegram-style" mock of the post.

**3. Large File Handling (The 2GB Strategy)**
* **Zero-Storage Policy:** Do not store files on the server or in the DB.
* **Forwarding Logic:** The bot must have a listener. When an admin forwards a file (up to 2GB) to the bot, the bot extracts the `file_id` and `file_name`.
* **Linking:** The `file_id` is sent to the Frontend to be attached to the current post draft.
* **Dispatch:** When publishing, the bot uses `sendDocument` or `sendVideo` using the stored `file_id`.

**4. Backend Logic (Railway + grammY)**
* Connect to **MongoDB** to save post drafts (content, button arrays, `file_id`, and status).
* Implement an API endpoint that the Next.js frontend calls to "Publish" a post.
* Support **HTML Parse Mode** for all outgoing messages to ensure Quote and Link tags render correctly.

**5. Environment Variables Configuration**
* `BOT_TOKEN`: Your Telegram Bot Token.
* `MONGO_URI`: Connection string for MongoDB Atlas.
* `AUTH_USERS`: Comma-separated IDs (e.g., `123456,789012`).
* `NEXT_PUBLIC_BOT_USERNAME`: Your bot's username for the login widget.
* `BACKEND_URL`: The Railway deployment URL.

**Instructions for the AI Coding App**
1.  Initialize a Next.js project with Tailwind and Shadcn UI for the dashboard.
2.  Initialize a separate Express or Fastify server for the Telegram Bot and API.
3.  Ensure the "Quote" and "Link" features use standard Telegram HTML tags.
4.  Focus on a clean, sophisticated engineering-style UI.

---

### **A Few Pro-Tips for Your Implementation:**

* **MongoDB:** Use the **Atlas Free Tier (M0)**. It gives you 512MB, which is enough for millions of text-based post drafts since you aren't storing the actual files.
* **The Quote Tag:** In Telegram HTML, the tag is `<blockquote>Your text</blockquote>`. It creates that nice vertical line on the left—perfect for engineering formulas or citations.
* **Date Feature:** Since you asked for a "Date" feature, have the AI include a button that automatically grabs the current date in **Sri Lanka time (UTC+5:30)** and appends it to the bottom of your post.
