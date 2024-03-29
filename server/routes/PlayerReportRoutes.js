const express = require('express');
const router = express.Router();
const PlayerReportController = require('../controllers/PlayerReportController');

// Route to get player metrics by player ID
router.get('/:playerId/:matchId/playermetrics', PlayerReportController.getPlayerMetrics);

// Route to get Team metrics by team ID and match ID
router.get('/:teamId/:matchId/teammetrics', PlayerReportController.getTeamMetrics);

// Route to create a new player report entry
router.post('/addreport', PlayerReportController.createPlayerReport);

// Route to retrieve all player reports
router.get('/getreports/:teamId/:matchId', PlayerReportController.getAllPlayerReports);

// Route to retrieve a player report by ID
router.get('/getreport/:reportId', PlayerReportController.getPlayerReportById);

// Route to update a player report
router.put('/updatereport/:reportId', PlayerReportController.updatePlayerReport);

// Route to delete a player report
router.delete('/report/:reportId', PlayerReportController.deletePlayerReport);

module.exports = router;