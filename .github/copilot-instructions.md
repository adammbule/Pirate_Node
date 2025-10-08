# Pirate_Node Copilot Instructions

## Project Overview
- **Pirate_Node** is a Node.js backend for movie/series details, user authentication, and wallet management, aiming to make content affordable and accessible while curbing piracy.
- Built with **Express**, **Mongoose** (MongoDB), and integrates Bitcoin wallet logic using **bitcoinjs-lib** and related crypto libraries.
- Designed for deployment on **Vercel** (see `vercel.json`).

## Architecture & Data Flow
- **API Entrypoint:** `api/index.js` mounts all major route modules under `/api/*` paths.
- **Routes:**
  - `routes/` contains REST endpoints for users, movies, series, wallets, collections, CoinKeys, and rentals.
  - Each route delegates to a controller in `controllers/`.
- **Controllers:**
  - Business logic for each domain (e.g., `walletController.js` for wallet creation, encryption, and holdings).
  - Uses Mongoose models from `models/` for DB operations.
- **Models:**
  - Mongoose schemas for `User`, `Wallet`, `CoinKey`, etc. (`models/`).
  - Wallets store encrypted private keys and reference CoinKeys.
- **Middleware:**
  - JWT authentication via `middleware/authMiddleware.js` (`verifyJWT`).
  - Rate limiting in `api/index.js` using `rate-limiter-flexible`.

## Developer Workflows
- **Start (Dev):** `npm run dev` (uses `nodemon` for hot reload)
- **Start (Prod):** `npm run prod`
- **Vercel Deploy:** Entrypoint is `api/index.js`, all routes proxied via Vercel config.
- **Environment:** Secrets (DB, JWT, Google client) in `subkey.env` (see `dotenv` usage).
- **MongoDB:** Connection logic in `controllers/userController.js` (uses `process.env.db_pass`).

## Project-Specific Patterns
- **Wallet Encryption:**
  - Private keys are encrypted with AES-256-CBC before storing in DB.
  - IV and key are generated per wallet (replace with env-secured key in production).
- **JWT Auth:**
  - All sensitive routes require `verifyJWT` middleware.
  - JWT secret loaded from env.
- **Google Login:**
  - Uses `google-auth-library` for OAuth2 login.
  - New users created on first Google login.
- **REST Conventions:**
  - Most endpoints use `/api/[resource]/[action]` (e.g., `/api/wallet/createwallet`).
  - Some legacy/test endpoints may differ.
- **Error Handling:**
  - Controllers log errors and return JSON error messages.

## Integration Points
- **External:**
  - Google OAuth2 (Google client ID in env)
  - Bitcoin wallet logic (bitcoinjs-lib, tiny-secp256k1, ecpair)
  - Vercel serverless deployment
- **Internal:**
  - Models reference each other (e.g., Wallets reference CoinKeys)
  - Controllers expect Mongoose models and JWT-authenticated requests

## Examples
- **Create Wallet:** `POST /api/wallet/createwallet` (JWT required)
- **Login:** `POST /api/users/login` (manual), `POST /api/users/login/google` (OAuth)
- **Get Holdings:** `GET /api/wallet/holdings/:walletId` (JWT required)

## Key Files
- `api/index.js` (main server)
- `controllers/` (business logic)
- `models/` (Mongoose schemas)
- `routes/` (REST endpoints)
- `middleware/authMiddleware.js` (JWT)
- `subkey.env` (secrets)
- `vercel.json` (deployment)

---

_If any section is unclear or missing, please specify which part needs more detail or examples._
