# CineVerse — Movie & TV Entertainment Platform

CineVerse is a modern Movie & TV entertainment platform designed for discovering, exploring, and personalizing entertainment content.

The application combines a cinematic React interface with a secure Node.js and Express backend, MongoDB persistence, TMDB integration, authentication, personalized recommendations, watchlists, favorites, ratings, reviews, trailers, and responsive user experiences.

## Live Demo

Production URLs will be added after the live deployments have been verified.

* Frontend: `Coming soon`
* Backend: `Coming soon`

---

## Features

### Entertainment Discovery

* Cinematic Home experience with an infinite hero slider
* Smooth hero transitions with slide indicators
* Trending, Popular, Now Playing, Top Rated and Upcoming movies
* Popular, Airing Today, On The Air and Top Rated TV shows
* Movie and TV discovery with filtering and sorting
* Infinite scrolling
* Multi-search across Movies, TV Shows and People
* Debounced search
* Recent and trending searches

### Movie & TV Details

* Movie and TV information
* Ratings and release information
* Genres and runtime
* Cast and creators
* Production information
* Trailers, teasers and videos
* Similar titles
* Related recommendations
* Automatic scroll-to-top when navigating to a new title

### Authentication

* User registration
* Secure login and logout
* JWT authentication
* Password hashing with bcrypt
* Session restoration
* Browser-tab isolated authenticated sessions
* Protected application routes
* Login and registration redirect to Home

### Guest Access Experience

CineVerse provides a controlled preview experience for visitors who are not authenticated.

Guests can:

* View the Home page
* Experience the cinematic hero slider
* Preview available entertainment content
* See Movies, TV Shows, Discover and Search navigation options

Content below the Home hero is presented as a restricted preview.

When a guest attempts to access protected content or actions, CineVerse displays a reusable authentication prompt with:

* Login
* Create Account

Protected guest actions include:

* Movie and TV details
* Trailers
* Movies
* TV Shows
* Discover
* Search
* Watchlist
* Favorites
* Ratings
* Reviews
* Recommendations
* Profile

After authentication, the complete application experience is unlocked.

---

## Personalization

Authenticated users receive personalized entertainment functionality including:

* Personal Watchlist
* Favorites
* Ratings
* Reviews
* Profile statistics
* Recent activity
* Recently Viewed
* Personalized recommendations

Recommendation signals are generated from saved titles, favorites and user ratings.

New users receive popular-content recommendations until enough preference information becomes available.

---

## Recently Viewed

Authenticated users can maintain a recent viewing history while exploring movie and TV details.

Features include:

* Recently viewed movie and TV titles
* Recent-first ordering
* Limited recent history
* User/session-aware history
* Card action menu
* Remove individual items
* Immediate UI updates after removal

---

## Watchlist & Favorites

Users can maintain separate persistent collections for:

* Watchlist
* Favorites

Features include:

* Add content
* Remove content
* Check saved state
* Movie and TV support
* Filtering
* Sorting
* Direct navigation to title details

All user library information is persisted in MongoDB.

---

## Ratings & Reviews

CineVerse supports user-generated title feedback.

Users can:

* Rate movies and TV shows
* Update ratings
* Remove ratings
* Write reviews
* Edit their own reviews
* Delete their own reviews

Review ownership is enforced by the backend.

---

## Performance & Reliability

CineVerse includes several optimizations for a smoother user experience:

* Server-side TMDB response caching
* In-flight duplicate request coalescing
* Automatic retry for temporary TMDB request failures
* Cached response fallback
* Client request timeouts
* AbortController request cancellation
* React route-level lazy loading
* Lazy-loaded poster imagery
* Loading skeletons
* Empty states
* Error states
* Manual retry fallback

Temporary TMDB failures are automatically retried before an error is shown to the user.

---

## Security

The backend includes production-oriented security controls:

* Helmet security headers
* Express signature disabled
* Explicit CORS allowlist
* Global API rate limiting
* Stricter authentication rate limiting
* JWT verification and expiration
* Token-version logout revocation
* bcrypt password hashing
* Password length validation
* Request body size limits
* MongoDB operator and dotted-key filtering
* Prototype-pollution protection
* Production-safe error responses
* Standardized 404 responses
* Duplicate database conflicts mapped to HTTP `409`
* Invalid MongoDB IDs mapped to HTTP `400`
* Authentication responses configured with `no-store` / `no-cache`
* Environment validation
* TMDB credentials kept exclusively on the backend

Real `.env` files and credentials are excluded from version control.

---

## Testing

The project contains automated frontend and backend tests covering areas such as:

* Application smoke testing
* Async UI states
* Media payload normalization
* Discovery controls
* Authentication security
* Backend validation
* Security headers
* Request-size protection
* Safe 404 handling
* JWT signature verification
* User feature validation
* Recommendation weighting

---

## Technology Stack

### Frontend

* React.js
* JavaScript
* Redux Toolkit
* React Router
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt

### External API

* TMDB API

### Development & Testing

* Git
* GitHub
* Jest
* React Testing Library
* Supertest

### Production

* Vercel
* Render
* MongoDB Atlas

---

## Project Structure

```text
Movie & TV Entertainment Platform/
│
├── client/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── .env.example
│
├── server/
│   ├── src/
│   ├── tests/
│   ├── package.json
│   ├── package-lock.json
│   └── .env.example
│
├── .gitignore
├── README.md
└── image.png
```

---

## Getting Started

### Prerequisites

Install:

* Node.js
* npm
* MongoDB or MongoDB Atlas
* Git

A TMDB API Read Access Token is also required.

---

## Frontend Setup

Navigate to the client:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file based on `.env.example`:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_USE_BACKEND_TMDB=true
```

Start the frontend:

```bash
npm run dev
```

The application runs at:

```text
http://localhost:3000
```

---

## Backend Setup

Navigate to the server:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file based on `.env.example`.

Example configuration:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
TMDB_ACCESS_TOKEN=your_tmdb_read_access_token
```

Start the backend:

```bash
npm run dev
```

The API runs at:

```text
http://localhost:5000
```

> Never commit real database credentials, JWT secrets, TMDB tokens or `.env` files.

---

## Main API Areas

The backend provides APIs for:

```text
/api/auth
/api/tmdb
/api/watchlist
/api/favorites
/api/ratings
/api/reviews
/api/profile
/api/recommendations
```

TMDB requests are proxied through the CineVerse backend so the TMDB access token is never exposed to the browser.

### Health Check

```text
GET /api/health
```

The health endpoint can be used to verify that the deployed backend is available.

---

## Testing Commands

### Frontend Tests

```bash
cd client
npm test -- --watchAll=false
```

### Frontend Production Build

```bash
cd client
npm run build
```

### Backend Tests

```bash
cd server
npm test
```

---

## Application Flow

```text
Guest
  ↓
CineVerse Home
  ↓
Hero Experience + Content Preview
  ↓
Protected Action
  ↓
Login / Create Account
  ↓
Authentication
  ↓
Complete CineVerse Experience
  ↓
Movies / TV Shows / Discover / Search
  ↓
Movie & TV Details / Trailers
  ↓
Watchlist / Favorites
  ↓
Ratings / Reviews
  ↓
Recently Viewed
  ↓
Personalized Recommendations
  ↓
Profile / Settings
```

---

## Responsive Experience

CineVerse is designed for:

* Desktop
* Laptop
* Tablet
* Mobile

Navigation and content layouts adapt to different screen sizes.

### Desktop Navigation

```text
CineVerse
Home | Movies | TV Shows | Discover | Search
Hi, User | Watchlist | Favorites | Settings
```

### Mobile Navigation

```text
Top:
CineVerse Logo | Search | Profile

Bottom:
Home | Movies | TV | Settings
```

---

## Production Architecture

```text
User Browser
    ↓
Vercel
React CineVerse Frontend
    ↓
HTTPS API
    ↓
Render
Node.js / Express Backend
    │
    ├── MongoDB Atlas
    │
    └── TMDB API
```

The frontend uses `client/vercel.json` to support React Router deep links and direct route refreshes in the Vercel production environment.

### Production Environment Variables

Backend environment variables are configured securely on Render:

```text
NODE_ENV=production
MONGODB_URI=<secret>
JWT_SECRET=<secret>
JWT_EXPIRES_IN=7d
TMDB_ACCESS_TOKEN=<secret>
CLIENT_URL=https://<your-vercel-domain>
```

Frontend environment variables are configured on Vercel:

```text
REACT_APP_API_BASE_URL=https://<your-render-domain>/api
REACT_APP_USE_BACKEND_TMDB=true
```

The frontend does not require a TMDB token when backend TMDB proxy mode is enabled.

Real production values must never be committed to the repository.

---

## Deployment

CineVerse is designed to use:

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB Atlas
* **Entertainment Data:** TMDB API

The production URLs will be added to this README after both deployments and the complete frontend-to-backend integration have been verified.

---

## Screenshots

Production screenshots will be added after the live CineVerse deployment has been fully verified across desktop, tablet and mobile layouts.

Screenshots should not expose authentication tokens, credentials, environment variables or private browser information.

---

## Future Improvements

Potential future enhancements include:

* Enhanced recommendation intelligence
* Additional profile customization
* Social entertainment features
* Expanded accessibility testing
* Additional end-to-end testing

---

## Disclaimer

CineVerse is a portfolio and educational project.

Movie, TV, cast, poster, backdrop and related entertainment metadata are provided through TMDB.

CineVerse does not host or distribute copyrighted movies or television episodes.

---

## Author

**Chandra Sekhar Nadiminti**

MERN Full Stack Developer

---

## License

This project is intended for portfolio and educational use.
