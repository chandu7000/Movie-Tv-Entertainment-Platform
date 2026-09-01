# CineVerse --- Movie & TV Entertainment Platform

CineVerse is a full-stack movie and TV entertainment platform for
discovering movies, TV series, trailers, and authorized streaming
content through a modern responsive interface.

The application is publicly accessible without login or registration.
Entertainment metadata is powered by TMDB, while CineVerse uses its own
Node.js/Express backend for API access, trailer resolution,
streaming-source management, security, and MongoDB integration.

## Features

-   Public movie and TV discovery with no authentication required
-   Responsive UI for mobile, tablet, laptop, and desktop
-   Telugu, Indian regional, Hindi, and international discovery sections
-   Movies, TV Shows, Discover, Search, and Details pages
-   Live title search for movies, series, shows, and anime
-   Detailed metadata including ratings, genres, release information,
    cast, overview, recommendations, and similar titles
-   Official trailer playback using native YouTube embedded controls
-   Multi-language and regional trailer resolution
-   Authorized MP4 and HLS streaming support
-   TV season and episode playback
-   Subtitle/WebVTT support
-   Playback quality/source selection
-   Playback speed, volume, seeking, fullscreen, and resume support
-   Previous/next episode navigation
-   Continue Watching
-   Favorites
-   Recently Viewed history
-   Local settings and privacy controls
-   Browser-local personalization using `localStorage`
-   TMDB request caching, retry handling, coalescing, and timeouts
-   Backend security with Helmet, CORS, rate limiting, input
    sanitization, and environment validation
-   Automated frontend and backend tests

## Technology Stack

### Frontend

-   React
-   Redux Toolkit
-   React Router
-   Tailwind CSS
-   Axios
-   React Testing Library
-   HTML5 Video
-   hls.js

### Backend

-   Node.js
-   Express
-   MongoDB
-   Mongoose
-   Axios
-   Helmet
-   CORS
-   express-rate-limit
-   Morgan
-   Jest
-   Supertest

### External Services

-   TMDB API --- movie and TV metadata
-   YouTube --- official trailer playback
-   YouTube Data API --- optional trailer-search fallback
-   MongoDB Atlas --- production database
-   Render --- backend deployment
-   Netlify --- frontend deployment

## Application Architecture

``` text
User
 │
 ▼
React Frontend
 │
 ├── Discovery / Search / Details
 ├── Trailer Player
 ├── Streaming Player
 └── Local Personalization
 │
 ▼
Node.js + Express API
 │
 ├── TMDB Proxy
 ├── Trailer Resolver
 ├── Stream API
 ├── Security Middleware
 └── MongoDB / Mongoose
 │
 ├──────────────► TMDB API
 ├──────────────► YouTube
 └──────────────► MongoDB
```

## Project Structure

``` text
Movie & TV Entertainment Platform/
├── client/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── app/
│       ├── components/
│       ├── constants/
│       ├── features/
│       │   ├── details/
│       │   ├── discovery/
│       │   ├── history/
│       │   ├── home/
│       │   ├── me/
│       │   ├── search/
│       │   └── watch/
│       ├── routes/
│       └── styles/
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── scripts/
│   │   └── services/
│   └── tests/
└── README.md
```

## Local Development

### Prerequisites

Install:

-   Node.js and npm
-   MongoDB locally or a MongoDB Atlas database
-   TMDB Read Access Token

### Backend Setup

Create `server/.env` using `server/.env.example`:

``` env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/cineverse_db
TMDB_ACCESS_TOKEN=your_tmdb_read_access_token
YOUTUBE_API_KEY=your_optional_youtube_data_api_key
CLIENT_URL=http://localhost:3000
```

Install dependencies and start the backend:

``` bash
cd server
npm install
npm run dev
```

The API runs locally on port `5000` by default.

### Frontend Setup

Create `client/.env`:

``` env
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_USE_BACKEND_TMDB=true
```

Install dependencies and start the frontend:

``` bash
cd client
npm install
npm start
```

## Production Configuration

### Backend

Configure the production environment with values similar to:

``` env
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
TMDB_ACCESS_TOKEN=your_tmdb_read_access_token
YOUTUBE_API_KEY=your_optional_youtube_data_api_key
CLIENT_URL=https://cineverse-movie-tv.netlify.app
```

### Frontend

For the production React build:

``` env
REACT_APP_API_BASE_URL=https://movie-tv-entertainment-platform.onrender.com/api
REACT_APP_USE_BACKEND_TMDB=true
```

Create the production build with:

``` bash
cd client
npm run build
```

## API Overview

### Health

``` http
GET /api/health
```

### TMDB

``` http
GET /api/tmdb/*
```

### Trailer Resolution

``` http
GET /api/tmdb/trailer/:mediaType/:id
```

The trailer resolver prioritizes official trailers, checks
regional/language variants, rejects unrelated clips and promotional
videos for the primary trailer action, and can optionally use the
YouTube Data API as a fallback.

### Streaming

``` http
GET /api/streams/demo
GET /api/streams/:mediaType/:tmdbId/availability
GET /api/streams/:mediaType/:tmdbId
GET /api/streams/tv/:tmdbId/episodes?season=1
```

Stream records support:

-   Movie and TV content
-   Season and episode mapping
-   MP4 and HLS sources
-   Quality variants
-   Language metadata
-   WebVTT subtitles
-   Availability state
-   Licensing/source notes

## Playback

CineVerse separates trailer playback from full-content playback.

**Trailers** use YouTube's native embedded player, preserving standard
play/pause, seeking, volume, captions, settings, quality, and fullscreen
controls.

**Movies and episodes** use the CineVerse HTML5/HLS player for
configured authorized sources. The player supports resume progress,
subtitles, quality/source switching, playback speed, volume, fullscreen,
and episode navigation.

## Local Personalization

CineVerse does not require a user account.

The following data stays in the current browser:

-   Favorites
-   Recently Viewed
-   Continue Watching
-   Playback progress
-   Autoplay-next preference
-   Local settings

Users can clear watch activity, favorites, settings, or all locally
stored CineVerse data from the Me section.

## Testing

Run backend tests:

``` bash
cd server
npm test
```

Run frontend tests:

``` bash
cd client
npm test -- --watchAll=false
```

Create a production frontend build:

``` bash
cd client
npm run build
```

## Security & Privacy

The backend includes:

-   CORS origin restrictions
-   Helmet security headers
-   API rate limiting
-   Input sanitization
-   Environment-variable validation
-   Controlled API proxying

CineVerse does not require accounts and does not send favorites, watch
history, or playback progress to the backend.

## Content & Streaming Policy

CineVerse is designed for:

-   User-owned media
-   Public-domain content
-   Creative Commons content
-   Licensed or otherwise authorized streaming sources

The project does not provide piracy-site scraping, DRM bypassing, or
unauthorized copyrighted streams.

## Deployment

**Frontend:** Netlify\
`https://cineverse-movie-tv.netlify.app`

**Backend:** Render\
`https://movie-tv-entertainment-platform.onrender.com`

The production frontend communicates with the backend through:

``` text
https://movie-tv-entertainment-platform.onrender.com/api
```

## Author

**Chandra Sekhar Nadiminti**

-   GitHub: `https://github.com/chandu7000`
-   Repository:
    `https://github.com/chandu7000/movie-tv-entertainment-platform`

------------------------------------------------------------------------

CineVerse is built as a portfolio-ready full-stack entertainment
platform demonstrating responsive React development, REST API
architecture, third-party API integration, MongoDB data modeling, secure
backend design, streaming-player integration, testing, and cloud
deployment.