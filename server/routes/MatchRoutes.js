const express = require('express');
const router = express.Router();
const MatchController = require('../controllers/MatchesController');

// Create a new match
router.post('/addmatches', MatchController.createMatch);

// Get all matches for a specific team
router.get('/getallmatches/:teamId', MatchController.getAllMatches);

// Get a match by ID
router.get('/getmatch/:id', MatchController.getMatchById);

// Update a match
router.put('/updatematch/:id', MatchController.updateMatch);

// Delete a match
router.delete('/match/:id', MatchController.deleteMatch);

module.exports = router;
