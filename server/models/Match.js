const knex = require('knex');
const knexConfig = require('../knexfile');
const db = knex(knexConfig.development);

const Match = {
  createMatch: async (date, location, home_team_id, away_team_id) => {
    if (home_team_id === away_team_id) {
      throw new Error('Home team and away team cannot be the same.');
    }
    return db('matches').insert({ date, location, home_team_id, away_team_id }).returning('*');
  },

  getAllMatchesByTeamId: async (teamId) => {
    return db('matches')
      .where('home_team_id', teamId)
      .select('*');
  },

  getMatchById: async (id) => {
    return db('matches').where({ id }).first();
  },

  updateMatch: async (id, date, location, home_team_id, away_team_id) => {
    if (home_team_id === away_team_id) {
      throw new Error('Home team and away team cannot be the same.');
    }
    return db('matches').where({ id }).update({ date, location, home_team_id, away_team_id }).returning('*');
  },

  deleteMatch: async (id) => {
    return db('matches').where({ id }).del().returning('*');
  }
};

module.exports = Match;
