const express = require('express');
const router = express.Router();
const apiKeyController = require('../controllers/apiKeyController');
const authMiddleware = require('../middleware/auth');

router.post('/create-api-key', authMiddleware, apiKeyController.createApiKey);
router.get('/user-data', authMiddleware, apiKeyController.getUserData);

module.exports = router;