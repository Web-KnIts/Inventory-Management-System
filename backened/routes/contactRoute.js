const express = require('express');
const authenticate = require('../middleware/authenticate');
const contactUs = require('../controller/contactController');
const router = express.Router();

router.post('/',authenticate,contactUs);

module.exports = router;
