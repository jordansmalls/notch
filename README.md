<img src="https://i.ibb.co/wFqd3nv9/notch.gif" alt="notch - the easiest click counter service for developers.">

A click counter service where authenticated users create counters, share public increment/read endpoints, and view personal + global usage statistics.

* **Website & docs:** <https://trynotch.cc> · <https://trynotch.cc/docs>
* **App:** <https://app.trynotch.cc>
* **API:** `https://api.trynotch.cc`

```js
// increment a counter from any site, no auth needed
fetch("https://api.trynotch.cc/api/counters/public/notch_pub_your_key", { method: "POST" })
```

## 🚀 Quick Start

### Prerequisites

* **Node.js** >= 18 (Express 5 and Vite 7 both require a modern LTS Node)
* **pnpm** >= 8 (lockfiles are `pnpm-lock.yaml`)
* **MongoDB** instance — local or MongoDB Atlas
* Optional: `nodemon` is installed as a dev dependency for the server

### Installation

```bash
# Clone the repository
git clone https://github.com/jordansmalls/notch.git
cd notch

# Install server dependencies
cd server
pnpm install

# Install client dependencies
cd ../client
pnpm install
```

### Configuration

Create a `.env` file inside `server/` with the following variables (see [Configuration & Environment Variables](#️-configuration--environment-variables) for the full table):

```bash
PORT=4000
MONGO_URI=mongodb://localhost:27017/notch
JWT_SECRET=replace-with-a-long-random-string
NODE_ENV=development
```

For production builds of the client, create `client/.env.production` with:

```bash
VITE_API_BASE_URL=https://api.trynotch.cc
```

### Running the Application

Open two terminals:

```bash
# Terminal 1 — server (port 4000, auto-restarts with nodemon)
cd server
pnpm dev

# Terminal 2 — client (port 5173, proxies /api to the server)
cd client
pnpm dev
```

Then open <http://localhost:5173>. In production, build the client and serve the `dist/` output behind your platform of choice:

```bash
cd client
pnpm build
```

---

## 📂 Project Structure

```text
notch/
├── client/                          # React + Vite frontend
│   ├── public/                      # Static assets served as-is
│   ├── src/
│   │   ├── assets/                  # Bundled images, SVGs, etc.
│   │   ├── components/              # Reusable UI building blocks
│   │   │   ├── buttons/             # Action buttons (copy, delete, reset, etc.)
│   │   │   ├── dashboard-ui/        # Dashboard widgets
│   │   │   ├── dialogs/             # Modal dialogs (edit/delete confirmations)
│   │   │   ├── forms/               # Form components (login, signup, settings, etc.)
│   │   │   ├── sidebar/             # Application sidebar navigation
│   │   │   ├── theme/               # Theme provider, toaster, mode toggle
│   │   │   ├── ui/                  # shadcn/ui primitives (button, card, dialog, …)
│   │   │   └── private-route.tsx    # Auth-gated route wrapper
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── lib/                     # Generic utility helpers
│   │   ├── pages/                   # Route-level components
│   │   │   ├── auth/                # Login, signup
│   │   │   ├── counters/            # Create counter
│   │   │   ├── def/                 # 404
│   │   │   ├── dashboard.tsx        # Authenticated dashboard
│   │   │   └── settings.tsx         # Account settings
│   │   ├── slices/                  # Redux Toolkit slices & RTK Query APIs
│   │   ├── utils/                   # API base URL + small helpers
│   │   ├── App.tsx                  # Root component (theme + toaster + outlet)
│   │   ├── main.tsx                 # Entry point + router configuration
│   │   └── store.ts                 # Redux store setup
│   ├── components.json              # shadcn/ui generator config
│   ├── eslint.config.js             # Flat ESLint config
│   ├── index.html                   # Vite HTML entry
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── tsconfig*.json               # TypeScript configs (app + node)
│   └── vite.config.ts               # Vite config (proxies /api to server)
├── server/                          # Express + Mongoose API
│   ├── src/
│   │   ├── config/                  # Environment config + MongoDB connection
│   │   ├── controllers/             # Route handlers (user, counter, global)
│   │   ├── middlewares/             # Auth middleware (JWT verification)
│   │   ├── models/                  # Mongoose schemas (User, Counter, GlobalStats)
│   │   ├── routes/                  # Express routers mounted at /api/*
│   │   └── utils/                   # JWT, public key generation, rate limiting, global stats helpers
│   ├── index.js                     # Server entry point
│   ├── package.json
│   └── pnpm-lock.yaml
└── README.md
```

### Key Files & Components

* `server/index.js` — Express app entry point. Wires middleware (`morgan`, `cors`, `cookie-parser`, `compression`), mounts the three route groups, and starts the HTTP listener.
* `server/src/config/config.js` — Centralized environment configuration (port, secrets, CORS origins) loaded via `dotenv`.
* `server/src/config/db.js` — Establishes the MongoDB connection using `MONGO_URI`, exits the process on failure.
* `server/src/middlewares/auth.middleware.js` — `protect` middleware that reads the `jwt` HTTP-only cookie, verifies it, and attaches the authenticated user to `req.user`.
* `server/src/models/user.model.js` — Mongoose `User` schema with `bcrypt` password hashing, email validation, and an `active` flag for soft-deactivation.
* `server/src/models/counter.model.js` — Mongoose `Counter` schema with a `notch_pub_`-prefixed public key, plus `resetCount`, `incrementCount`, and `incrementByPublicKey` helpers.
* `server/src/models/global.model.js` — Singleton `GlobalStats` document tracking lifetime clicks, users, and counters.
* `server/src/utils/rate.limiting.js` — Five rate-limit presets (`strict`, `light`, `emailCheck`, `increment`, `counterRead`) tailored to each endpoint's risk profile.
* `server/src/utils/generate.jwt.js` — Issues JWTs and sets them as HTTP-only, `SameSite=Lax` cookies.
* `server/src/utils/generate.public.key.js` — Generates collision-checked `notch_pub_…` keys for new counters.
* `server/src/utils/global.utils.js` — Fire-and-forget counters that increment `GlobalStats` (clicks/users/counters).
* `client/src/main.tsx` — React entry point. Builds the React Router 7 router tree (public, auth, and private routes) and wraps it in the Redux `Provider`. `/` redirects to `/dashboard`.
* `client/src/store.ts` — Redux Toolkit store, combines `auth` slice with the RTK Query `apiSlice` (with cookie credentials enabled).
* `client/src/utils/api-config.ts` — Resolves the API base URL: `VITE_API_BASE_URL` in production, `/api` (Vite proxy) in development.
* `client/src/components/private-route.tsx` — Redirects unauthenticated users to `/login` before protected pages render.
* `client/vite.config.ts` — Vite configuration including the `/api` dev proxy to `http://localhost:4000` and Tailwind CSS v4 plugin.
* `client/.env.production` — Holds the production `VITE_API_BASE_URL` (the Vite proxy is bypassed in production builds).

---

## 🛠️ Architecture & Core Concepts

* **Tech Stack:**
  * **Client:** React 19, TypeScript 5.9, Vite 7, React Router 7, Redux Toolkit + RTK Query, Tailwind CSS 4, shadcn/ui (Radix primitives + `lucide-react`), `next-themes` (dark/light mode), `sonner` (toasts).
  * **Server:** Node.js, Express 5, Mongoose 9 (MongoDB), `jsonwebtoken`, `bcryptjs`, `cookie-parser`, `cors`, `compression`, `morgan`, `express-rate-limit`, `dotenv`, Prettier.
* **Data Flow / Pattern:** Classic client–server with token-based auth.
  1. The browser hits the client (React SPA). Unauthenticated users on `/`, `/dashboard`, `/settings`, or `/create-counter` are redirected via `PrivateRoute` to `/login`; auth pages (`/login`, `/signup`) are public.
  2. All API calls go through RTK Query using `fetchBaseQuery` with `credentials: 'include'`, so the HTTP-only `jwt` cookie travels automatically.
  3. The server's `protect` middleware validates the cookie and attaches the user to `req.user`. Public counter endpoints (`/api/counters/public/:public_key`) are intentionally unauthenticated so any consumer can increment or read a counter.
  4. Mutating events (new account, new counter, public increment) call fire-and-forget helpers in `global.utils.js` to keep the singleton `GlobalStats` document in sync.

---

## ⚙️ Configuration & Environment Variables

Create a `server/.env` file with the values below. The client only requires `VITE_API_BASE_URL` for production builds.

### Server (`server/.env`)

| Variable      | Description                                                       | Default Value               | Required? |
| ------------- | ----------------------------------------------------------------- | --------------------------- | --------- |
| `PORT`        | Port the Express server listens on                                | `4000`                      | No        |
| `MONGO_URI`   | MongoDB connection string (local or Atlas)                        | _none_                      | Yes       |
| `JWT_SECRET`  | Secret used to sign and verify session JWTs                       | _none_                      | Yes       |
| `NODE_ENV`    | `development` or `production`; toggles secure cookies & logging    | _none_                      | Yes       |

### Client (`client/.env.production`)

| Variable             | Description                                                          | Default Value | Required? |
| -------------------- | -------------------------------------------------------------------- | ------------- | --------- |
| `VITE_API_BASE_URL`  | Base URL of the deployed API (no trailing slash). Empty in dev = proxy. | _empty_       | No (prod) |

> ⚠️ CORS in `server/src/config/config.js` is split by route. Public endpoints (`/api/counters/public/*`, `/api/global/*`) accept any origin. Everything else uses the login cookie and only accepts origins in `allowedOrigins` (`https://app.trynotch.cc` and `http://localhost:5173`). Add your own frontend's origin there if you self-host.

---

## 📡 API Reference

All routes are mounted under `/api` on `https://api.trynotch.cc`. Protected routes require a valid `jwt` HTTP-only cookie.

### Auth & Users (`/api/users`)

| Method | Route                        | Access  | Description                                      |
| ------ | ---------------------------- | ------- | ------------------------------------------------ |
| POST   | `/`                          | Public  | Create a new user account (sets JWT cookie)      |
| GET    | `/check-email/:email`        | Public  | Check whether an email is already registered     |
| POST   | `/login`                     | Public  | Authenticate and set JWT cookie                  |
| POST   | `/logout`                    | Public  | Clear the JWT cookie                             |
| POST   | `/deactivate`                | Private | Soft-deactivate the authenticated user           |
| GET    | `/me`                        | Private | Fetch the authenticated user's profile           |
| PUT    | `/`                          | Private | Change the authenticated user's password         |
| DELETE | `/`                          | Private | Permanently delete the authenticated user's account |

### Counters (`/api/counters`)

| Method | Route                                | Access  | Description                                          |
| ------ | ------------------------------------ | ------- | ---------------------------------------------------- |
| POST   | `/`                                  | Private | Create a new counter (returns a `notch_pub_…` key)    |
| GET    | `/`                                  | Private | List all counters owned by the authenticated user    |
| PATCH  | `/`                                  | Private | Update a counter's name/description                  |
| DELETE | `/`                                  | Private | Delete **all** counters owned by the authenticated user |
| DELETE | `/:id`                               | Private | Delete a single counter                              |
| POST   | `/:id/reset`                         | Private | Reset a counter's count to `0`                       |
| GET    | `/public/:public_key`                | Public  | Read the current count for a counter                 |
| POST   | `/public/:public_key`                | Public  | Increment a counter by `1`                           |

### Global Statistics (`/api/global`)

| Method | Route        | Access | Description                              |
| ------ | ------------ | ------ | ---------------------------------------- |
| GET    | `/`          | Public | Full snapshot of `GlobalStats`           |
| GET    | `/clicks`    | Public | Lifetime total clicks across all counters |
| GET    | `/users`     | Public | Lifetime total registered users          |
| GET    | `/counters`  | Public | Lifetime total counters created          |

---

## 🧪 Testing & Quality

The client uses Vitest to test optimistic counter updates, rollback, concurrent requests, and recovery after failed refreshes.

```bash
# Check the client
cd client
pnpm test
pnpm lint
pnpm build

# Format the server with Prettier
cd server
pnpm format
```

Counter edits, resets, and individual deletes appear immediately when the client has loaded the counter and is online. Pending changes remain separate from server data so older reads cannot overwrite them. Failed writes roll back only their own change, then refresh the list. Confirmed changes remain visible if that refresh fails, with a retry button on the dashboard. Requests time out after 15 seconds and writes are never retried automatically. Creation, bulk deletion, and account actions wait for server confirmation.

---

## 🛡️ Security & Rate Limiting

The server applies layered `express-rate-limit` middlewares (defined in `server/src/utils/rate.limiting.js`) to every route group:

| Limiter             | Window  | Max Requests | Applied To                                                |
| ------------------- | ------- | ------------ | --------------------------------------------------------- |
| `strictLimiter`     | 5 min   | 10           | Signup, login, password change, counter create/delete-all  |
| `lightLimiter`      | 15 min  | 100          | Logout, deactivate, fetch profile, counter list/update    |
| `emailCheckLimiter` | 10 min  | 60           | `GET /api/users/check-email/:email`                       |
| `incrementLimiter`  | 10 sec  | 30           | Public counter increment                                  |
| `counterReadLimiter`| 1 min   | 60           | Public counter read                                       |

JWTs are stored in HTTP-only cookies with `SameSite=Lax` and a 30-day expiry; cookies are flagged `secure` outside of development. The app and API share the `trynotch.cc` site, so the cookie is never sent on requests started by other sites.

---
