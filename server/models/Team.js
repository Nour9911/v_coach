const knex = require('knex');
const knexConfig = require('../knexfile');
const db = knex(knexConfig.development);
const bcrypt = require('bcrypt');

const Team = {
  // Function to find team by team_name
  getTeamByTeamName: async (team_name) => {
    return db('teams').where({ team_name }).first();
  },

  // Function to hash a password
  hashPassword: async (password) => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  },

  // Function to create a new team with a hashed password
  createTeam: async (team_name, password, team_class, country, continent) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return db('teams').insert({
      team_name,
      password: hashedPassword,
      class: team_class,
      date: new Date(),
      country,
      continent
    }).returning('*');
  },

  getAllTeams: async () => {
    return db('teams').select('*');
  }
};

module.exports = Team;
