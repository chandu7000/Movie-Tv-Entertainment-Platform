const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const tmdbRoutes = require('./routes/tmdbRoutes');
const streamRoutes = require('./routes/streamRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { sanitizeRequest, securityHeaders } = require('./middleware/security');

const app = express();
app.disable('x-powered-by');
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000').split(',').map((item) => item.trim()).filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    const error = new Error('Origin is not allowed by CORS.');
    error.status = 403;
    return callback(error);
  },
  credentials: false,
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));
app.use(sanitizeRequest);
app.use(securityHeaders);
if (process.env.NODE_ENV !== 'test') app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 500, standardHeaders: 'draft-7', legacyHeaders: false });
app.use('/api', apiLimiter);

app.get('/api/health', (req, res) => res.json({ success: true, message: 'CineVerse API is running.', data: { timestamp: new Date().toISOString() } }));
app.use('/api/tmdb', tmdbRoutes);
app.use('/api/streams', streamRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
