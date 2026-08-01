# Find Jobs 🔎 — Full-Stack Job Portal & Professional Network

[![CI](https://github.com/mrashikali18-smart/find-jobs/actions/workflows/ci.yml/badge.svg)](https://github.com/mrashikali18-smart/find-jobs/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

By [@mrashikali18-smart](https://github.com/mrashikali18-smart)

A MERN-stack platform combining a job portal (search, apply, manage
applicants) with a LinkedIn-style professional network: a feed, connections,
direct messaging, notifications, and cross-entity search — built as a
portfolio project.

**A note on scope:** messaging and notifications here are REST + polling
(the client re-fetches every few seconds), not WebSocket push. That keeps
the stack simple to run with just Node + MongoDB. If you want true
real-time delivery, the natural next step is adding Socket.io on top of
the existing `Conversation`/`Message`/`Notification` models — the data
layer is already shaped for it.

## Feature summary

- **Job portal:** search/filter/sort/paginate jobs, apply with resume + cover note, recruiter job CRUD, applicant pipeline (applied → reviewed → shortlisted → hired/rejected).
- **Social feed:** create posts (text + optional image upload, can attach a job), like, comment, delete your own posts. Feed shows your posts + your connections' posts.
- **Networking:** send/accept/reject connection requests, view your network, remove a connection, "Connect" button with live status on any profile.
- **Messaging:** 1:1 conversations, conversation list sorted by recent activity, read receipts (`readBy`).
- **Notifications:** connection requests/acceptances, post likes/comments, new messages, application status changes — bell icon with unread count, polled every 30s.
- **Search:** one search bar across people, jobs, and companies.
- **Public profiles:** experience, education, skills, bio, posts, and a connect/message action for anyone viewing someone else's profile.

## Tech stack

| Layer     | Choice                                   |
|-----------|-------------------------------------------|
| Frontend  | React 18 (Vite) + Tailwind CSS            |
| Backend   | Node.js + Express.js                      |
| Database  | MongoDB + Mongoose                        |
| Auth      | JWT (httpOnly cookie + bearer fallback)   |
| Uploads   | Multer (local disk storage for resumes)   |

## Folder structure

```
find-jobs/
├── backend/
│   ├── config/
│   │   └── db.js                 # Mongo connection
│   ├── controllers/              # Route handler logic
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── companyController.js
│   │   ├── jobController.js
│   │   ├── applicationController.js
│   │   ├── postController.js
│   │   ├── connectionController.js
│   │   ├── notificationController.js
│   │   ├── messageController.js
│   │   └── searchController.js
│   ├── middleware/
│   │   ├── auth.js               # JWT verification + role guard
│   │   ├── errorHandler.js       # Central error formatting
│   │   ├── validate.js           # express-validator wrapper
│   │   └── upload.js             # Multer resume/avatar uploads
│   ├── models/                   # Mongoose schemas
│   │   ├── User.js
│   │   ├── Company.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   ├── Post.js
│   │   ├── Connection.js
│   │   ├── Notification.js
│   │   ├── Conversation.js
│   │   └── Message.js
│   ├── routes/                   # Express routers
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── postRoutes.js
│   │   ├── connectionRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── messageRoutes.js
│   │   └── searchRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── notify.js              # Shared notification creation helper
│   │   └── seed.js               # Demo data seeder
│   ├── uploads/                  # Uploaded resumes (gitignored)
│   ├── server.js                 # App entry point
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── client.js          # Axios instance
    │   │   └── services.js        # Grouped API calls
    │   ├── components/            # Navbar, Footer, JobCard, LoopRing,
    │   │   │                        PostCard, PostComposer, ConnectButton,
    │   │   │                        NotificationBell, etc.
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/                 # Home, Jobs, JobDetails, Dashboard,
    │   │   │                        Feed, PublicProfile, Connections,
    │   │   │                        Messages, SearchResults, etc.
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

## Prerequisites

- Node.js 18+
- MongoDB running locally, or a MongoDB Atlas connection string

## Push this repo to your GitHub

This zip isn't connected to git yet. From the extracted `find-jobs/` folder:

```bash
git init
git add .
git commit -m "Initial commit: Find Jobs full-stack job portal"
git branch -M main
git remote add origin https://github.com/mrashikali18-smart/find-jobs.git
git push -u origin main
```

(Create the empty `find-jobs` repo on your GitHub account first — no README/license/gitignore initialized there, since this folder already has them — then run the commands above.)

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env    # then edit .env with your own MONGO_URI and JWT_SECRET
npm install
npm run seed             # optional: creates demo recruiter/jobseeker + sample jobs
npm run dev               # starts the API on http://localhost:5000
```

Demo accounts created by the seed script:

- Recruiter: `recruiter@demo.com` / `password123`
- Job seeker: `jobseeker@demo.com` / `password123`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev               # starts the app on http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` requests to `http://localhost:5000`,
so both servers need to be running at the same time in development.

### 3. Tests

```bash
cd backend && npm test      # Jest + Supertest, runs against an in-memory MongoDB
cd frontend && npm run lint # ESLint
```

CI (`.github/workflows/ci.yml`) runs both on every push/PR to `main`.

### 4. Production build & deployment

Two ways to deploy:

**Option A — single server (simplest):**
```bash
cd frontend && npm run build   # outputs to frontend/dist
cd ../backend && npm start
```
`backend/app.js` automatically serves `frontend/dist` if it exists, so one
Node process hosts both the API and the SPA. Set `CLIENT_URL` in the backend
`.env` to whatever origin you're serving from.

**Option B — split deploy (recommended): backend on Render, frontend on Vercel**
1. Deploy `backend/` to a host that supports Node + MongoDB. The included
   `render.yaml` provides a Render blueprint, but Railway or Fly.io also work.
2. In the frontend, set `VITE_API_URL=https://your-backend-url/api`
   (see `frontend/.env.example`) before building/deploying.
3. Deploy `frontend/` to Vercel. `frontend/vercel.json` is already configured
   for the Vite SPA. Set the Vercel project root to `frontend/` when importing
   this monorepo.
4. Set `CLIENT_URL` in the backend's env to your Vercel frontend URL so CORS
   and cookies work.

### Automated Vercel deployment via GitHub Actions

This repo includes a GitHub workflow that can deploy the frontend to Vercel
whenever `main` is updated. To use it, add these repository secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

The workflow is defined in `.github/workflows/vercel-deploy.yml` and deploys
from the `frontend/` directory.

## API reference

Base URL: `/api`

### Auth (`/auth`)

| Method | Route        | Access  | Description                     |
|--------|--------------|---------|----------------------------------|
| POST   | `/register`  | Public  | Create a jobseeker or recruiter account |
| POST   | `/login`     | Public  | Log in, sets JWT cookie          |
| POST   | `/logout`    | Private | Clears the JWT cookie            |
| GET    | `/me`        | Private | Get the logged-in user           |

### Users (`/users`)

| Method | Route             | Access  | Description                    |
|--------|-------------------|---------|----------------------------------|
| PUT    | `/profile`        | Private | Update profile fields            |
| POST   | `/upload-resume`  | Private | Upload a resume (multipart form, field name `resume`) |
| GET    | `/dashboard`      | Private | Role-aware dashboard stats + recent activity |

### Companies (`/companies`)

| Method | Route       | Access             | Description                |
|--------|-------------|--------------------|------------------------------|
| GET    | `/mine`     | Private (recruiter)| Get the recruiter's own company |
| POST   | `/`         | Private (recruiter)| Create a company profile   |
| PUT    | `/:id`      | Private (owner)    | Update a company profile   |
| GET    | `/:slug`    | Public             | Get a company by slug      |

### Jobs (`/jobs`)

| Method | Route               | Access             | Description                          |
|--------|---------------------|--------------------|----------------------------------------|
| GET    | `/`                 | Public             | List/search jobs — see query params below |
| GET    | `/meta/categories`  | Public             | Distinct list of open job categories |
| GET    | `/recruiter/mine`   | Private (recruiter)| Jobs posted by the logged-in recruiter |
| GET    | `/:id`              | Public             | Get a single job (increments view count) |
| POST   | `/`                 | Private (recruiter)| Create a job posting                 |
| PUT    | `/:id`              | Private (owner)    | Update a job posting                 |
| DELETE | `/:id`              | Private (owner)    | Delete a job posting and its applications |

`GET /jobs` query params: `keyword`, `location`, `category`, `jobType`,
`experienceLevel`, `skills` (comma separated), `salaryMin`, `sort`
(e.g. `-createdAt`, `-salaryMax`), `page`, `limit`.

### Applications (`/applications`)

| Method | Route             | Access              | Description                        |
|--------|-------------------|---------------------|--------------------------------------|
| POST   | `/:jobId`         | Private (jobseeker) | Apply to a job                       |
| GET    | `/mine`           | Private (jobseeker) | List the logged-in user's applications |
| DELETE | `/:id`            | Private (owner)     | Withdraw an application               |
| GET    | `/job/:jobId`     | Private (recruiter) | List applicants for a job (owner only) |
| PUT    | `/:id/status`     | Private (recruiter) | Update an applicant's status          |

All private routes expect the JWT either as an httpOnly `token` cookie
(set automatically on login/register) or as `Authorization: Bearer <token>`.

### Posts / Feed (`/posts`)

| Method | Route              | Access  | Description                              |
|--------|--------------------|---------|--------------------------------------------|
| GET    | `/feed`            | Private | Posts from you + your accepted connections |
| GET    | `/user/:userId`    | Public  | All posts by a specific user (profile page) |
| POST   | `/upload-image`    | Private | Upload an image file for a post (multipart form, field name `image`), returns `imageUrl` |
| POST   | `/`                | Private | Create a post (`content`, optional `imageUrl`, `job`) |
| DELETE | `/:id`             | Private (author) | Delete your own post              |
| PUT    | `/:id/like`        | Private | Toggle a like on a post                    |
| POST   | `/:id/comments`    | Private | Add a comment (`text`)                     |

### Connections (`/connections`)

| Method | Route              | Access  | Description                              |
|--------|--------------------|---------|--------------------------------------------|
| GET    | `/mine`            | Private | Your accepted connections                  |
| GET    | `/pending`         | Private | Incoming pending requests                  |
| GET    | `/status/:userId`  | Private | Connection status with a specific user (`none`/`pending`/`accepted`/`rejected`) |
| POST   | `/:userId`         | Private | Send a connection request                  |
| PUT    | `/:id/respond`     | Private (recipient) | Accept or reject (`status`)       |
| DELETE | `/:userId`         | Private | Remove an existing connection              |

### Notifications (`/notifications`)

| Method | Route          | Access  | Description                        |
|--------|----------------|---------|--------------------------------------|
| GET    | `/`            | Private | List notifications + unread count    |
| PUT    | `/:id/read`    | Private | Mark one notification as read        |
| PUT    | `/read-all`    | Private | Mark all notifications as read       |

### Messages (`/messages`)

| Method | Route                                       | Access               | Description                     |
|--------|----------------------------------------------|----------------------|------------------------------------|
| GET    | `/conversations`                             | Private              | Your conversations, most recent first |
| POST   | `/conversations/:userId`                     | Private              | Start (or reopen) a conversation with a user |
| GET    | `/conversations/:conversationId/messages`    | Private (participant)| Get messages in a conversation (marks as read) |
| POST   | `/conversations/:conversationId/messages`    | Private (participant)| Send a message (`text`)         |

Messaging and notifications use polling on the frontend (every 5–30s),
not WebSockets — see the note at the top of this file.

### Search (`/search`)

| Method | Route | Access  | Description                                         |
|--------|-------|---------|-------------------------------------------------------|
| GET    | `/?q=keyword&type=all\|people\|jobs\|companies` | Private | Search across people, jobs, and companies |

### Users — public profile (`/users/:id`)

| Method | Route  | Access  | Description                                    |
|--------|--------|---------|---------------------------------------------------|
| GET    | `/:id` | Private | Another user's public profile (no email/phone)   |

## Notes on production readiness

- Passwords are hashed with bcrypt; the password field is never returned by default (`select: false`).
- Central error handler normalizes Mongoose validation, cast, and duplicate-key errors into consistent JSON.
- Rate limiting is applied to `/auth/login` and `/auth/register` to slow brute-force attempts.
- `helmet` and scoped `cors` are enabled; update `CLIENT_URL` for your deployed frontend origin.
- File uploads are restricted by type (`pdf`, `doc`, `docx`, `png`, `jpg`) and size (5MB).
- For a real deployment, swap local disk storage in `middleware/upload.js` for a cloud store (S3, Cloudinary, etc.), since local files won't survive a redeploy on most hosts.
- Backend has Jest + Supertest smoke tests (`backend/tests/`) covering auth and job creation/authorization, run against an in-memory MongoDB — no real database needed to test.
- CI (`.github/workflows/ci.yml`) runs backend tests and frontend lint + build on every push/PR.

## License

This project is licensed under the [MIT License](./LICENSE) — free to use, modify, and distribute for personal or portfolio purposes.

## Ports

| Service  | Default port | Configured via                  |
|----------|---------------|----------------------------------|
| Backend (Node/Express API) | `5000` | `PORT` in `backend/.env` (defaults to 5000 if unset) |
| Frontend (Vite dev server) | `5173` | Vite default; set `CLIENT_URL=http://localhost:5173` in `backend/.env` to match |

Run the backend with `npm run dev` inside `/backend` and the frontend with `npm run dev` inside `/frontend` — both must be running for the app to work locally.
