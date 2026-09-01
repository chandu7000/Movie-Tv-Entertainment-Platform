# CineVerse — Movie & TV Entertainment Platform

CineVerse is a public movie and TV discovery application built from the CineVerse codebase and redesigned around a privacy-friendly streaming experience. It does not require login or registration. TMDB is used for entertainment metadata, while playback sources are stored separately in a new CineVerse MongoDB database.

> **Content policy:** CineVerse is designed for media you own, public-domain works, Creative Commons media, or streams you are otherwise authorized to distribute. The project does not include piracy-site scraping, OTT DRM bypassing, or unauthorized copyrighted streams.

## Current Transformation Status — Phases 1–18

1. **Rebrand:** CineVerse application identity changed to CineVerse across the active client/server application.
2. **Public access:** Login, registration, protected routes and guest locks removed.
3. **Old user system removal:** JWT/user/profile authentication backend removed.
4. **Old personal features removal:** Database watchlists, favorites, ratings, reviews and personalized recommendation code removed.
5. **Fresh database:** default database is `cineverse_db`; `StreamSource` is the new streaming-data model.
6. **Discovery preserved:** Home, Movies, TV Shows, Discover, Search, Details, cast, trailers, similar and recommendation metadata remain public.
7. **Streaming architecture:** stream records support movie/TV/demo media, season/episode mapping, MP4/HLS source type, quality, language and subtitles.
8. **Watch routes:** `/watch/movie/:id`, `/watch/tv/:id/:season/:episode`, and `/watch/demo`.
9. **Video player:** dedicated CineVerse HTML5 player with seeking, volume, fullscreen, playback speed, MP4 playback, source/quality switching, subtitles and HLS playback through hls.js when native HLS is unavailable.
10. **TV episodes:** season links, configured episode list and previous/next episode navigation.
11. **Subtitles/languages:** WebVTT track metadata and language/quality source metadata supported.
12. **Local personalization:** recently viewed and continue-watching progress are stored only in browser `localStorage`.
13. **Streaming backend:** public availability, source, TV episode and demo endpoints added.
14. **Performance:** existing lazy routes, image lazy loading, TMDB caching/retry/coalescing and request timeout behavior preserved.
15. **UI transformation:** CineVerse branding, public navigation, player demo and Watch Now states added.
16. **Security/privacy:** no account tracking, no JWT, CORS allowlist, Helmet, API rate limiting, input sanitization and environment validation retained.
17. **Testing:** app/public-shell, playback-progress, health, security and stream-route tests included.
18. **Cleanup:** authentication/user-specific files and unused auth packages removed from active project configuration.

Phases 19–20 (production preparation and deployment) are intentionally left for final local verification, environment setup, GitHub push and deployment.

## Stack

**Frontend:** React 19, Redux Toolkit, React Router, Tailwind CSS, Axios, React Testing Library.

**Backend:** Node.js, Express 5, MongoDB/Mongoose, Axios, Helmet, CORS, express-rate-limit, Morgan, Jest/Supertest.

**External metadata:** TMDB API.

## Project Structure

```text
Movie & TV Entertainment Platform/
├── client/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── app/
│       ├── components/
│       ├── features/
│       │   ├── details/
│       │   ├── discovery/
│       │   ├── history/
│       │   ├── home/
│       │   ├── search/
│       │   └── watch/
│       └── routes/
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/StreamSource.js
│   │   ├── routes/
│   │   ├── scripts/seedDemoStreams.js
│   │   └── services/
│   └── tests/
└── README.md
```

## Environment

### Server

Copy `server/.env.example` to `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/cineverse_db
TMDB_ACCESS_TOKEN=your_tmdb_read_access_token
# Optional but recommended for titles whose correct trailer is missing from TMDB:
YOUTUBE_API_KEY=your_youtube_data_api_v3_key
CLIENT_URL=http://localhost:3000
```

For MongoDB Atlas, create/use a **new CineVerse database** and put its URI in `MONGODB_URI`. Do not reuse the old CineVerse database if you want a clean separation.

### Trailer resolution

CineVerse does not simply play the first TMDB video anymore. The backend now ranks **official Trailer** entries first, checks regional TMDB video results (including Telugu, Hindi, Tamil, Malayalam and Kannada), rejects clips/promos/featurettes for the main trailer button, and only falls back to a teaser when necessary.

If TMDB has no usable trailer at all, setting `YOUTUBE_API_KEY` enables an automatic YouTube Data API search for the movie/series title + year + original language + “official trailer”. This key is optional: without it, CineVerse still uses the improved multi-language TMDB resolver, but a title that is completely missing a trailer in TMDB will correctly show **Trailer Unavailable** instead of playing an unrelated clip.

### Client

Copy `client/.env.example` to `client/.env`:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_USE_BACKEND_TMDB=true
```

## Install and Run

Backend:

```bash
cd server
npm install
npm run seed:demo
npm test
npm run dev
```

Frontend in another terminal:

```bash
cd client
npm install
npm test -- --watchAll=false
npm start
```

The demo seeder adds **Big Buck Bunny** as an openly licensed player demonstration, with MP4 and HLS playback plus a local WebVTT caption track. It does not map a fake stream to arbitrary TMDB movies.

## Stream Data Model

A stream record contains:

```text
mediaType     movie | tv | demo
tmdbId        TMDB identifier (0 for standalone demo)
season        TV season or 0
 episode       TV episode or 0
sourceType    mp4 | hls
url           authorized media URL
quality       e.g. 720p / 1080p / Auto
language      source language
subtitles     WebVTT track metadata
isActive      availability flag
isDemo        demo flag
licenseNote   source/licensing note
```

For a movie, configure `season=0` and `episode=0`. For TV, configure each episode separately.

## Public Streaming API

```text
GET /api/health
GET /api/tmdb/*
GET /api/streams/demo
GET /api/streams/:mediaType/:tmdbId/availability
GET /api/streams/:mediaType/:tmdbId
GET /api/streams/tv/:tmdbId/episodes?season=1
```

Movie example:

```text
GET /api/streams/movie/123/availability
GET /api/streams/movie/123
```

TV example:

```text
GET /api/streams/tv/456/episodes?season=1
GET /api/streams/tv/456?season=1&episode=2
```

## Privacy Design

CineVerse has no account requirement in this version. Recently viewed titles and playback positions are stored locally in the user's browser. They are not written to the server database.

## HLS Note

MP4 playback uses the standard HTML5 video element. HLS playback uses native browser HLS when available and automatically loads hls.js for browsers such as Chrome that need Media Source Extensions. The legal demo seeder configures both an MP4 source and a public HLS test source so source switching can be tested without paid infrastructure.

## Remaining Phases

**Phase 19:** run final production builds, browser/responsive testing, accessibility/performance checks and final README polish.

**Phase 20:** create the new repository, configure MongoDB Atlas and environment variables, deploy backend/frontend, seed only authorized content, and verify the live application.

### Home discovery updates
CineVerse's public home feed mixes worldwide and Indian discovery content and includes New Releases, Popular in India, Bollywood, Telugu, Tamil, Malayalam, Kannada, Dubbed & International Picks, Hollywood, worldwide trending, and TV sections. Recently Viewed is browser-local and automatically keeps only the latest 10 unique titles.

## Local Me hub

On small screens, the fourth bottom-navigation slot is now **Me**. It is a local-only profile area with no account, name, email, or personal details. It includes Continue Watching, Favorites, the latest 10 viewed titles, autoplay-next-episode preference, and local privacy/storage controls. Favorites and preferences are stored only in the current browser.
