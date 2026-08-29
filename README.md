# CineVerse — Movie & TV Entertainment Platform

CineVerse is a modern Movie & TV entertainment platform designed for discovering, exploring, and personalizing entertainment content.

The application combines a cinematic React interface with a secure Node.js and Express backend, MongoDB persistence, TMDB integration, authentication, personalized recommendations, watchlists, favorites, ratings, reviews, trailers, and responsive user experiences.

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
- Persistent authenticated sessions
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
- Personalized recommendations

Recommendation signals are generated from saved titles, favorites and user ratings.

New users receive popular-content recommendations until enough preference information becomes available.

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

---

## Project Structure

```text
cineverse/
│
├── client/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── .env.example
│
├── server/
│   ├── src/
│   ├── tests/
│   ├── package.json
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

---

## Testing

### Frontend

```bash
cd client
npm test -- --watchAll=false
```

Production build:

```bash
npm run build
```

### Backend

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
Hero experience + content preview
  ↓
Protected action
  ↓
Login / Create Account
  ↓
Authentication
  ↓
Home
  ↓
Complete CineVerse experience
  ↓
Movies / TV Shows / Discover / Search
  ↓
Details / Trailers
  ↓
Watchlist / Favorites
  ↓
Ratings / Reviews
  ↓
Personalized Recommendations
```

---

## Responsive Experience

CineVerse is designed for:

- Desktop
- Laptop
- Tablet
- Mobile

Navigation and content layouts adapt to different screen sizes.

---

## Future Improvements

Potential future enhancements include:

- Production deployment
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