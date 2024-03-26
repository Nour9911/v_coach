const knex = require('knex');
const knexConfig = require('../knexfile');
const db = knex(knexConfig.development);

const PlayerReport = {
  // Function to retrieve player metrics by player ID
  getPlayerMetricsByPlayerId: async (playerId) => {
    try {
      const playerMetrics = await db('player_report').where({ player_id: playerId }).first();
      return playerMetrics;
    } catch (error) {
      throw error;
    }
  },

// Function to retrieve team metrics by match ID
getTeamMetricsByMatchId: async (matchId) => {
  try {
    // Implement logic to retrieve team metrics by match ID
    const teamMetrics = await db('player_report').where({ match_id: matchId }).first();
    return teamMetrics;
  } catch (error) {
    throw error;
  }
},

  // Function to create a new player report entry
  createPlayerReport: async (reportData) => {
    try {
      const newReport = await db('player_report').insert(reportData).returning('*');
      return newReport;
    } catch (error) {
      throw error;
    }
  },

  // Function to retrieve all player reports
  getPlayerReportsByTeamAndMatch: async (teamId, matchId) => {
    try {
      const reports = await db('player_report')
        .join('players', 'player_report.player_id', '=', 'players.id')
        .where({ 'players.team_id': teamId, 'player_report.match_id': matchId })
        .select('player_report.*');
      return reports;
    } catch (error) {
      throw error;
    }
  },

  // Function to retrieve a player report by ID
  getPlayerReportById: async (reportId) => {
    try {
      const report = await db('player_report').where({ id: reportId }).first();
      return report;
    } catch (error) {
      throw error;
    }
  },

  // Function to update a player report
  // Function to update a player report
  // Function to update a player report
  updatePlayerReport: async (reportId, updatedFields) => {
    try {
      const updatedReport = await db('player_report').where({ id: reportId }).update(updatedFields).returning('*');
      return updatedReport;
    } catch (error) {
      throw error;
    }
  },



  // Function to delete a player report
  deletePlayerReport: async (reportId) => {
    try {
      const deletedReport = await db('player_report').where({ id: reportId }).del().returning('*');
      return deletedReport;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = PlayerReport;