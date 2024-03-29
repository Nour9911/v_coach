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

  getAllTeams: async () => {
    return db('teams').select('*');
  }

};

module.exports = Team;
