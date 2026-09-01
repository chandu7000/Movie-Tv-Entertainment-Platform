const express = require('express');
const { getSources, getAvailability, getEpisodes, getDemo } = require('../controllers/streamController');

const router = express.Router();
router.get('/demo', getDemo);
router.get('/tv/:tmdbId/episodes', getEpisodes);
router.get('/:mediaType/:tmdbId/availability', getAvailability);
router.get('/:mediaType/:tmdbId', getSources);

module.exports = router;
