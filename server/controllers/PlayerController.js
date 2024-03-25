const Player = require('../models/Player');

// Create a new player
exports.createPlayer = async (req, res) => {
  const { name, lastname, birthdate, country, lengh, weight, speedtest, endurancetest, team_id } = req.body;
  try {
    const newPlayer = await Player.createPlayer(name, lastname, birthdate, country, lengh, weight, speedtest, endurancetest, team_id);
    res.json(newPlayer);
    console.log(`Received teamId: ${team_id}`);

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Get all players by team ID
exports.getAllPlayers = async (req, res) => {
  const { teamId } = req.params; // Extract teamId from route parameters

  try {
    const teamPlayers = await Player.getAllPlayersByTeamId(teamId);
    res.json(teamPlayers);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Get a player by ID
exports.getPlayerById = async (req, res) => {
  const id = req.params.id;

  try {
    const player = await Player.getPlayerById(id);
    if (!player) {
      return res.status(404).send({ message: 'Player not found' });
    }
    res.json(player);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Update a player
exports.updatePlayer = async (req, res) => {
  const id = req.params.id;
  const { name, lastname, birthdate, country, lengh, weight, speedtest, endurancetest } = req.body;

  try {
    const updatedPlayer = await Player.updatePlayer(id, name, lastname, birthdate, country, lengh, weight, speedtest, endurancetest);
    if (!updatedPlayer) {
      return res.status(404).send({ message: 'Player not found' });
    }
    res.json(updatedPlayer);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Delete a player
exports.deletePlayer = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedPlayer = await Player.deletePlayer(id);
    if (!deletedPlayer) {
      return res.status(404).send({ message: 'Player not found' });
    }
    res.json(deletedPlayer);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
