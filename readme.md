# Slack Connect – Schedule and Send Messages

A full-stack web app that connects to multiple Slack workspaces via OAuth and allows users to send or schedule Slack messages. Built with **React + Vite + TailwindCSS** on the frontend and **Node.js + TypeScript + Express** on the backend. MongoDB is used to store Slack credentials and scheduled messages.

🔗 **Live App:**  
➡️ [https://slack-connect-two.vercel.app](https://slack-connect-two.vercel.app)

---

## 🗂️ Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Slack App Configuration](#2-slack-app-configuration)
  - [3. Backend Setup](#3-backend-setup)
  - [4. Frontend Setup](#4-frontend-setup)
- [Architecture Overview](#architecture-overview)
- [Deployment](#deployment)
- [Challenges & Learnings](#challenges--learnings)

---

## ✨ Features

- 🔐 Slack OAuth 2.0 login
- 🧑 Multi-user & multi-team support
- 📬 Send Slack messages immediately
- ⏰ Schedule Slack messages with a future time
- 📃 View and cancel scheduled messages
- 🔁 Backend scheduler using `node-cron`
- 🔄 Team tokens stored securely in MongoDB
- 💬 Clean and responsive UI with TailwindCSS v4

---

## 🛠 Tech Stack

| Frontend             | Backend               | DevOps / Tools         |
|----------------------|------------------------|-------------------------|
| React + TypeScript   | Node.js + Express      | Vercel (Frontend)       |
| Tailwind CSS v4      | TypeScript             | Render (Backend)        |
| Vite                 | MongoDB Atlas          | Slack OAuth             |

---

## 🚀 Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/shashankbaheti8/slack-connect.git
cd slack-connect
````

### 2. Slack App Configuration

Go to [https://api.slack.com/apps](https://api.slack.com/apps) and create a new app.

#### OAuth & Permissions:

Add this redirect URI:

```
https://your-backend-url.com/api/auth/slack/callback
```

Add these Bot Token Scopes:

```
channels:read
chat:write
chat:write.public
channels:join
users:read
```

Install the app to your workspace.

---

### 3. Backend Setup

```bash
cd backend
# Then fill in your Slack and Mongo credentials in `.env`

npm install
npm run dev
```

#### .env Format:

```env
SLACK_CLIENT_ID=your-client-id
SLACK_CLIENT_SECRET=your-client-secret
SLACK_REDIRECT_URI=http://localhost:3000/api/auth/slack/callback
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://...
```

---

### 4. Frontend Setup

```bash
cd ../frontend
# Then set the backend base URL in .env

npm install
npm run dev
```

#### .env Format:

```env
VITE_BASE_URL=http://localhost:3000
```

Now open [http://localhost:5173](http://localhost:5173) to test it!

---

## 🧠 Architecture Overview

### 🔐 OAuth Flow

* User clicks “Connect to Slack”
* Slack redirects back to backend with a code
* Backend exchanges code for token
* Access token, team ID, and user ID are stored in MongoDB
* Backend redirects to frontend with `team_id`

### 🗝 Token Storage

Each team has a document in the `UserToken` collection:

```ts
{
  team_id,
  team_name,
  user_id,
  bot_token,
  scope
}
```

### ⏳ Scheduled Message Handling

* Messages are saved in `ScheduledMessage` model with `send_time`, `channel_id`, and `message`
* `node-cron` runs every minute and sends messages whose time has arrived

---

## 🌐 Deployment

### ✅ Frontend (Vercel)

* Hosted at: [https://slack-connect-two.vercel.app](https://slack-connect-two.vercel.app)
* Set `VITE_BASE_URL=https://your-backend.onrender.com` in Vercel environment variables

### ✅ Backend (Render)

* Hosted at: `https://your-backend.onrender.com`
* Set environment variables for Slack, MongoDB, and frontend URL

---

## 🚧 Challenges & Learnings

### 🧩 1. Slack OAuth and Multi-User Token Management

Handling separate tokens for each Slack team and storing them securely in MongoDB was a key part of making the app multi-user ready.

### 🔒 2. Token Expiry & Refresh

Though Slack doesn’t currently support refresh tokens, the backend is structured to handle `invalid_auth` errors and prompt re-authorization if needed.

### 🕓 3. Scheduling System

Used `node-cron` to run a background scheduler that checks for pending messages and uses Slack’s `chat.postMessage` to send them at the right time.

### 🎨 4. Tailwind v4 Adoption

Used TailwindCSS v4 for modern UI utility classes and responsive layouts. Learned how to configure Tailwind with Vite and React efficiently.

---

> 🌟 If you found this project useful, consider giving it a ⭐ on GitHub!

```
