const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Login route
router.post('/login', AuthController.login);

module.exports = router;
