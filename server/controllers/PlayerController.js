// server/controllers/playerController.js

const Player = require('../models/player');

// Create a new player
exports.createPlayer = async (req, res) => {
  try {
    const { name, age, position } = req.body;
    const player = await Player.create({ name, age, position });
    res.status(201).json(player);
  } catch (error) {
    res.status(500).json({ error: 'Unable to create player' });
  }
};

// Get all players
exports.getAllPlayers = async (req, res) => {
  try {
    const players = await Player.findAll();
    res.status(200).json(players);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch players' });
  }
};

// Get player by ID
exports.getPlayerById = async (req, res) => {
  try {
    const { id } = req.params;
    const player = await Player.findByPk(id);
    if (player) {
      res.status(200).json(player);
    } else {
      res.status(404).json({ error: 'Player not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch player' });
  }
};

// Update player by ID
exports.updatePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, position } = req.body;
    const player = await Player.findByPk(id);
    if (player) {
      await player.update({ name, age, position });
      res.status(200).json(player);
    } else {
      res.status(404).json({ error: 'Player not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Unable to update player' });
  }
};

// Delete player by ID
exports.deletePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const player = await Player.findByPk(id);
    if (player) {
      await player.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Player not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete player' });
  }
};
