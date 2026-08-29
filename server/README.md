# CineVerse API

Node.js + Express + MongoDB backend for CineVerse.

## Setup

1. Copy `.env.example` to `.env`.
2. Set `MONGODB_URI`, `JWT_SECRET`, and `TMDB_ACCESS_TOKEN`.
3. Run `npm install` inside `server`.
4. Run `npm run dev` (Node 18+) or `npm start`.

Default API: `http://localhost:5000/api`

## Core endpoints

- `GET /api/health`
- `GET /api/tmdb/*` — controlled TMDB proxy
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout` — protected
- `GET /api/auth/me` — protected

Passwords are hashed with bcrypt. JWTs are signed server-side and the user model never returns `passwordHash` in API responses.
