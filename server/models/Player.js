const knex = require('knex');
const knexConfig = require('../knexfile');
const db = knex(knexConfig.development);

const Player = {

  createPlayer: async (name, lastname, birthdate, lengh, weight, speedtest, endurancetest, team_id) => {
    return db('players').insert({ name, lastname, birthdate, lengh, weight, speedtest, endurancetest, team_id}).returning('*');
  },

  getAllPlayersByTeamId: async (team_id) => {
    return db('players').where({ team_id: team_id }).select('*');
  },
  getPlayerById: async (id) => {
    return db('players').where({ id }).first();
  },
  updatePlayer: async (id, name, lastname, birthdate, lengh, weight, speedtest, endurancetest) => {
    return db('players').where({ id }).update({ name, lastname, birthdate, lengh, weight, speedtest, endurancetest }).returning('*');
  },
  deletePlayer: async (id) => {
    return db('players').where({ id }).del().returning('*');
  }

};

module.exports = Player;
