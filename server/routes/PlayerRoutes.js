const express = require('express');
const router = express.Router();
const playerController = require('../controllers/PlayerController');

// Create a new player
router.post('/addplayers', playerController.createPlayer);

// Get all players for a specific team
router.get('/getplayers/:teamId', playerController.getAllPlayers);

// Get player by ID
router.get('/getplayer/:id', playerController.getPlayerById);

// Update player by ID
router.put('/updateplayer/:id', playerController.updatePlayer);

// Delete player by ID
router.delete('/player/:id', playerController.deletePlayer);

module.exports = router;
