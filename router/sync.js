const express = require('express');
const router = express.Router();
const controller = require('../controller/sync.js');

router.get('/pullLibraryList', controller.pullLibraryList);
router.post('/pullLibrary', controller.pullLibrary);
router.post('/pushLibrary', controller.pushLibrary);
router.post('/newLibrary', controller.newLibrary);
router.post('/deleteLibrary', controller.deleteLibrary);

module.exports = router;