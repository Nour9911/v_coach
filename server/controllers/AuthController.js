const bcrypt = require('bcrypt');
const Team = require('../models/Team');

exports.login = async (req, res) => {
  const { team_name, password } = req.body;

  try {
    // Check if the team exists
    const team = await Team.getTeamByTeamName(team_name);
    if (!team) {
      return res.status(400).json({ message: 'Invalid team name or password' });
    }

    // Check if the provided password matches the stored password
    const passwordMatch = await bcrypt.compare(password, team.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid team name or password' });
    }

    // Passwords match
    return res.json({ message: 'Login successful' });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.getAllTeams();
    res.json(teams);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// New function to handle team registration
exports.register = async (req, res) => {
  const { team_name, password, team_class, country, continent } = req.body;

  try {
    // Check if the team already exists
    const existingTeam = await Team.getTeamByTeamName(team_name);
    if (existingTeam) {
      return res.status(400).json({ message: 'Team already exists' });
    }

    // Create the new team
    const newTeam = await Team.createTeam(team_name, password, team_class, country, continent);
    res.status(201).json(newTeam);

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
