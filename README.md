# CineVerse — Movie & TV Entertainment Platform

CineVerse is a modern Movie & TV entertainment platform designed for discovering, exploring, and personalizing entertainment content.

The application combines a cinematic React interface with a secure Node.js and Express backend, MongoDB persistence, TMDB integration, authentication, personalized recommendations, watchlists, favorites, ratings, reviews, trailers, and responsive user experiences.

## Live Demo

- **Frontend:** https://cineverse-movie-tv.netlify.app
- **Backend API:** https://movie-tv-entertainment-platform.onrender.com
- **API Health Check:** https://movie-tv-entertainment-platform.onrender.com/api/health

> The backend is hosted on Render's free service tier. After a period of inactivity, the first request may take additional time while the service starts.

---

## Features

### Entertainment Discovery

- Cinematic Home experience with an infinite hero slider
- Smooth hero transitions with slide indicators
- Trending, Popular, Now Playing, Top Rated and Upcoming movies
- Popular, Airing Today, On The Air and Top Rated TV shows
- Movie and TV discovery with filtering and sorting
- Infinite scrolling
- Multi-search across Movies, TV Shows and People
- Debounced search
- Recent and trending searches

### Movie & TV Details

- Movie and TV information
- Ratings and release information
- Genres and runtime
- Cast and creators
- Production information
- Trailers, teasers and videos
- Similar titles
- Related recommendations
- Automatic scroll-to-top when navigating to a new title

### Authentication

- User registration
- Secure login and logout
- JWT authentication
- Password hashing with bcrypt
- Session restoration
- Browser-tab isolated authenticated sessions
- Protected application routes
- Login and registration redirect to Home

### Guest Access Experience

CineVerse provides a controlled preview experience for visitors who are not authenticated.

Guests can:

- View the Home page
- Experience the cinematic hero slider
- Preview available entertainment content
- See Movies, TV Shows, Discover and Search navigation options

Content below the Home hero is presented as a restricted preview.

When a guest attempts to access protected content or actions, CineVerse displays a reusable authentication prompt with:

- Login
- Create Account

Protected guest actions include:

- Movie and TV details
- Trailers
- Movies
- TV Shows
- Discover
- Search
- Watchlist
- Favorites
- Ratings
- Reviews
- Recommendations
- Profile

After authentication, the complete application experience is unlocked.

---

## Personalization

Authenticated users receive personalized entertainment functionality including:

- Personal Watchlist
- Favorites
- Ratings
- Reviews
- Profile statistics
- Recent activity
- Recently Viewed
- Personalized recommendations

Recommendation signals are generated from saved titles, favorites and user ratings.

New users receive popular-content recommendations until enough preference information becomes available.

---

## Recently Viewed

Authenticated users can maintain a recent viewing history while exploring movie and TV details.

Features include:

- Recently viewed movie and TV titles
- Recent-first ordering
- Limited recent history
- User/session-aware history
- Card action menu
- Remove individual items
- Immediate UI updates after removal

---

## Watchlist & Favorites

Users can maintain separate persistent collections for:

- Watchlist
- Favorites

Features include:

- Add content
- Remove content
- Check saved state
- Movie and TV support
- Filtering
- Sorting
- Direct navigation to title details

All user library information is persisted in MongoDB.

---

## Ratings & Reviews

CineVerse supports user-generated title feedback.

Users can:

- Rate movies and TV shows
- Update ratings
- Remove ratings
- Write reviews
- Edit their own reviews
- Delete their own reviews

Review ownership is enforced by the backend.

---

## Performance & Reliability

CineVerse includes several optimizations for a smoother user experience:

- Server-side TMDB response caching
- In-flight duplicate request coalescing
- Automatic retry for temporary TMDB request failures
- Cached response fallback
- Client request timeouts
- AbortController request cancellation
- React route-level lazy loading
- Lazy-loaded poster imagery
- Loading skeletons
- Empty states
- Error states
- Manual retry fallback

Temporary TMDB failures are automatically retried before an error is shown to the user.

---

## Security

The backend includes production-oriented security controls:

- Helmet security headers
- Express signature disabled
- Explicit CORS allowlist
- Global API rate limiting
- Stricter authentication rate limiting
- JWT verification and expiration
- Token-version logout revocation
- bcrypt password hashing
- Password length validation
- Request body size limits
- MongoDB operator and dotted-key filtering
- Prototype-pollution protection
- Production-safe error responses
- Standardized 404 responses
- Duplicate database conflicts mapped to HTTP `409`
- Invalid MongoDB IDs mapped to HTTP `400`
- Authentication responses configured with `no-store` / `no-cache`
- Environment validation
- TMDB credentials kept exclusively on the backend

Real `.env` files and credentials are excluded from version control.

---

## Testing

The project contains automated frontend and backend tests covering areas such as:

- Application smoke testing
- Async UI states
- Media payload normalization
- Discovery controls
- Authentication security
- Backend validation
- Security headers
- Request-size protection
- Safe 404 handling
- JWT signature verification
- User feature validation
- Recommendation weighting

### Current Verified Test Status

Frontend:

```text
Test Suites: 5 passed, 5 total
Tests:       7 passed, 7 total
```

Backend:

```text
Test Suites: 5 passed, 5 total
Tests:       16 passed, 16 total
```

The frontend production build also compiles successfully.

---

## Technology Stack

### Frontend

- React.js
- JavaScript
- Redux Toolkit
- React Router
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

### External API

- TMDB API

### Development & Testing

- Git
- GitHub
- Jest
- React Testing Library
- Supertest

### Production

- Netlify
- Render
- MongoDB Atlas
- TMDB API

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

- Node.js
- npm
- MongoDB or MongoDB Atlas
- Git

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

Production health endpoint:

```text
https://movie-tv-entertainment-platform.onrender.com/api/health
```

The health endpoint verifies that the deployed CineVerse backend is available.

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

- Desktop
- Laptop
- Tablet
- Mobile

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
Netlify
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

### Production Services

**Frontend**

```text
https://cineverse-movie-tv.netlify.app
```

Hosted on Netlify.

**Backend**

```text
https://movie-tv-entertainment-platform.onrender.com
```

Hosted on Render.

**Database**

MongoDB Atlas provides production database persistence.

**Entertainment Data**

TMDB provides movie, TV, cast, poster, backdrop and related entertainment metadata through the backend TMDB proxy.

---

## Production Environment Variables

### Backend — Render

The backend environment variables are configured securely in Render:

```text
NODE_ENV=production
MONGODB_URI=<secret>
JWT_SECRET=<secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=https://cineverse-movie-tv.netlify.app
TMDB_ACCESS_TOKEN=<secret>
```

Render supplies the production `PORT` automatically, so a fixed production port does not need to be configured manually.

### Frontend — Netlify

The production frontend uses:

```text
REACT_APP_API_BASE_URL=https://movie-tv-entertainment-platform.onrender.com/api
REACT_APP_USE_BACKEND_TMDB=true
```

The frontend does not require a TMDB token when backend TMDB proxy mode is enabled.

Real production secrets must never be committed to the repository.

---

## Deployment

CineVerse is deployed using:

- **Frontend:** Netlify
- **Backend:** Render
- **Database:** MongoDB Atlas
- **Entertainment Data:** TMDB API

### Frontend

Production URL:

```text
https://cineverse-movie-tv.netlify.app
```

The React production build is deployed to Netlify.

### Backend

Production URL:

```text
https://movie-tv-entertainment-platform.onrender.com
```

Health endpoint:

```text
https://movie-tv-entertainment-platform.onrender.com/api/health
```

The backend is deployed as a Node.js web service on Render and connects securely to MongoDB Atlas and TMDB.

### Production Integration

The deployed architecture follows this request flow:

```text
Browser
   ↓
Netlify React Frontend
   ↓
Render Express API
   ├── MongoDB Atlas
   └── TMDB API
```

The frontend communicates with the backend through HTTPS using the production API base URL.

---

## Production Verification

The deployed CineVerse application has been verified for:

- Frontend availability
- Backend availability
- API health endpoint
- MongoDB Atlas connectivity
- TMDB-backed movie and TV data
- Frontend-to-backend communication
- Registration and authentication
- Search
- Movie and TV details
- Watchlist and Favorites
- Responsive application behavior

---

## Screenshots

Production screenshots can be added to showcase important CineVerse experiences such as:

- Home
- Movie discovery
- TV discovery
- Search
- Movie/TV details
- Watchlist
- Favorites
- Profile
- Mobile responsive experience

Screenshots should never expose authentication tokens, credentials, environment variables or private browser information.

---

## Future Improvements

Potential future enhancements include:

- Enhanced recommendation intelligence
- Additional profile customization
- Social entertainment features
- Expanded accessibility testing
- Additional end-to-end testing

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
