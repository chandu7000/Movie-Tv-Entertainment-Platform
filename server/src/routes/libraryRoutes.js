const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { createLibraryController } = require('../controllers/libraryController');
const createLibraryRouter = (kind) => { const router=express.Router(); const controller=createLibraryController(kind); router.use(requireAuth); router.get('/',controller.list); router.post('/',controller.add); router.get('/check/:mediaType/:tmdbId',controller.check); router.delete('/:mediaType/:tmdbId',controller.remove); return router; };
module.exports = { createLibraryRouter };
