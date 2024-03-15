// routes/matchReportRoutes.js

const express = require('express');
const router = express.Router();
const matchReportController = require('../controllers/MatchReportController');

// Create a new match report
router.post('/match-reports', matchReportController.createMatchReport);

// Get all match reports
router.get('/match-reports', matchReportController.getAllMatchReports);

// Get match report by ID
router.get('/match-reports/:id', matchReportController.getMatchReportById);

// Update match report by ID
router.put('/match-reports/:id', matchReportController.updateMatchReport);

// Delete match report by ID
router.delete('/match-reports/:id', matchReportController.deleteMatchReport);

module.exports = router;
