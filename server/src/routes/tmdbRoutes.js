const express = require('express');
const { proxy } = require('../controllers/tmdbController');

const router = express.Router();
router.get(/^\/(.*)/, proxy);

module.exports = router;
