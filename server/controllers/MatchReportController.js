// controllers/matchReportController.js

const MatchReport = require('../models/matchReport');

// Create a new match report
exports.createMatchReport = async (req, res) => {
  const { playerId, opponent, result } = req.body;
  try {
    const newMatchReport = await MatchReport.createMatchReport(playerId, opponent, result);
    res.json(newMatchReport);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Get all match reports
exports.getAllMatchReports = async (req, res) => {
  try {
    const allMatchReports = await MatchReport.getAllMatchReports();
    res.json(allMatchReports);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Get a match report by ID
exports.getMatchReportById = async (req, res) => {
  const id = req.params.id;

  try {
    const matchReport = await MatchReport.getMatchReportById(id);
    if (!matchReport) {
      return res.status(404).send({ message: 'Match report not found' });
    }
    res.json(matchReport);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Update a match report
exports.updateMatchReport = async (req, res) => {
  const id = req.params.id;
  const { playerId, opponent, result } = req.body;

  try {
    const updatedMatchReport = await MatchReport.updateMatchReport(id, playerId, opponent, result);
    if (!updatedMatchReport) {
      return res.status(404).send({ message: 'Match report not found' });
    }
    res.json(updatedMatchReport);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Delete a match report
exports.deleteMatchReport = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedMatchReport = await MatchReport.deleteMatchReport(id);
    if (!deletedMatchReport) {
      return res.status(404).send({ message: 'Match report not found' });
    }
    res.json(deletedMatchReport);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
