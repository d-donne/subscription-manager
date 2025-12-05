# Subscription Manager API

Backend API for creating users, managing subscriptions, and scheduling renewal reminders. Built with Express 5, TypeScript, MongoDB (Mongoose), JWT auth, Arcjet bot protection, Upstash Workflow for scheduled reminder steps, and Nodemailer for email delivery.

## Features

- User signup/signin with JWT + httpOnly cookies
- Subscription CRUD skeleton with auto-calculated renewal dates
- Reminder workflow via Upstash Workflow + QStash trigger
- Arcjet middleware for basic bot/abuse protection
- Nodemailer email sender with templated reminder emails
- Request logging and centralized error handling

## Tech Stack

- Runtime: Node.js 20+, Express 5, TypeScript
- Data: MongoDB via Mongoose
- Auth: JWT (cookies), bcrypt for hashing
- Scheduling: Upstash Workflow/QStash
- Email: Nodemailer
- Security: Arcjet middleware

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- MongoDB running locally or a connection string

### Install

```
pnpm install
```

### Environment

Create a file `.env.local` (or `.env.development` / `.env.production`) using the values your environment needs:

```
NODE_ENV=local
PORT=3000
SERVER_URL=http://localhost:3000
DB_URI=mongodb://localhost:27017/subscriptions

JWT_SECRET=super-secret-change-me
JWT_EXPIRES_IN=7d

ARCJET_ENV=local
ARCJET_KEY=your-arcjet-key

QSTASH_URL=https://qstash.upstash.io
QSTASH_TOKEN=your-qstash-token
QSTASH_CURRENT_SIGNING_KEY=your-current-signing-key
QSTASH_NEXT_SIGNING_KEY=your-next-signing-key

EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-email-password
```

### Run the API

```
pnpm dev
```

The server starts at `http://localhost:3000` and connects to MongoDB using `DB_URI`.

### Upstash Workflow Dev (optional)

For local workflow development you can run the QStash CLI:

```
pnpm upstash
```

Workflow endpoint is mounted at `/api/workflows/subscription/reminder`.

## API Overview

Base path: `/api`

- `POST /auth/signup` – create user
- `POST /auth/signin` – login, sets JWT cookie
- `POST /auth/signout` – clear cookie
- `POST /subscriptions` – create subscription (auth required), triggers reminder workflow
- `GET /subscriptions/:userId` – list subscriptions for a user (auth required)
- `POST /workflows/subscription/reminder` – Upstash workflow handler

> Note: Additional subscription routes are scaffolded but not fully implemented yet.

## Project Structure

- `src/index.ts` – Express bootstrap
- `src/routes` – Route registration
- `src/controllers` – Request handlers
- `src/database` – Mongo connection and Mongoose models
- `src/middlewares` – Auth, Arcjet, logger, errors
- `src/utils` – Email templates and mailer
- `src/config` – Env parsing and third-party clients

## Scripts

- `pnpm dev` – run in watch mode (tsx)
- `pnpm build` – type-check with `tsc --noEmit`
- `pnpm upstash` – run Upstash/QStash dev CLI

## Notes

- Renewal dates auto-calculate if not provided (see `subscription.model.ts`).
- Reminder scheduling relies on valid `SERVER_URL` so Upstash workflows can call back into your API.
- Nodemailer uses `EMAIL_USER`/`EMAIL_PASSWORD`; configure for your SMTP provider.
