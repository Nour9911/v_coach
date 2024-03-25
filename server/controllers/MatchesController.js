const Match = require('../models/Match');

// Create a new match
exports.createMatch = async (req, res) => {
  const { date, location, home_team_id, away_team_id } = req.body;
  try {
    const newMatch = await Match.createMatch(date, location, home_team_id, away_team_id);
    res.json(newMatch);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Get all matches
exports.getAllMatches = async (req, res) => {
    const { teamId } = req.params; // Assuming you extract the teamId from the request
  
    try {
      const matches = await Match.getAllMatchesByTeamId(teamId);
      res.json(matches);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  };

// Get a match by ID
exports.getMatchById = async (req, res) => {
  const id = req.params.id;
  try {
    const match = await Match.getMatchById(id);
    if (!match) {
      return res.status(404).send({ message: 'Match not found' });
    }
    res.json(match);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Update a match
exports.updateMatch = async (req, res) => {
  const id = req.params.id;
  const { date, location, home_team_id, away_team_id } = req.body;
  try {
    const updatedMatch = await Match.updateMatch(id, date, location, home_team_id, away_team_id);
    if (!updatedMatch) {
      return res.status(404).send({ message: 'Match not found' });
    }
    res.json(updatedMatch);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Delete a match
exports.deleteMatch = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedMatch = await Match.deleteMatch(id);
    if (!deletedMatch) {
      return res.status(404).send({ message: 'Match not found' });
    }
    res.json(deletedMatch);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
