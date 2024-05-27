const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController'); // Ensure this path is correct

// Login route
router.post('/login', AuthController.login);

// Get all teams route
router.get('/teams', AuthController.getAllTeams);

// Register route
router.post('/register', AuthController.register); // Ensure this line is correct

module.exports = router;
