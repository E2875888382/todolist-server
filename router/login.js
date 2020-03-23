const express = require('express');
const router = express.Router();
const controller = require('../controller/login.js');

router.get('/getCode', controller.getCode);
router.post('/getAvatar', controller.getAvatar);
router.post('/login', controller.login);
router.post('/register', controller.register);
router.post('/update', controller.update);

module.exports = router;