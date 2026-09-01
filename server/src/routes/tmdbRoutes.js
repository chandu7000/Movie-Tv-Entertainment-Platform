const express = require('express');
const { proxy } = require('../controllers/tmdbController');
const { getResolvedTrailer } = require('../controllers/trailerController');

const router = express.Router();

// Resolve the best real trailer before falling back to the generic TMDB proxy.
router.get('/trailer/:mediaType/:id', getResolvedTrailer);
router.get(/^\/(.*)/, proxy);

module.exports = router;
