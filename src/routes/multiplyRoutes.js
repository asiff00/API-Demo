const express = require('express');
const router = express.Router();
const multiplyController = require('../controllers/multiplyController');

router.post('/multiply', multiplyController.multiply);

module.exports = router;