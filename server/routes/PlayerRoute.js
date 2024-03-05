// server/routes/playerRoutes.js

const express = require('express');
const router = express.Router();
const playerController = require('../controllers/PlayerController');

// Create a new player
router.post('/players', playerController.createPlayer);

// Get all players
router.get('/players', playerController.getAllPlayers);

// Get player by ID
router.get('/players/:id', playerController.getPlayerById);

// Update player by ID
router.put('/players/:id', playerController.updatePlayer);

// Delete player by ID
router.delete('/players/:id', playerController.deletePlayer);

module.exports = router;
