// models/matchReport.js

const pool = require('../config/config');

const MatchReport = {
  // Create a new match report
  createMatchReport: async (playerId, opponent, result) => {
    try {
      const query = 'INSERT INTO match_reports (player_id, opponent, result) VALUES ($1, $2, $3) RETURNING *';
      const { rows } = await pool.query(query, [playerId, opponent, result]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Get all match reports with player details
  getAllMatchReports: async () => {
    try {
      const query = 'SELECT match_reports.*, players.name AS player_name FROM match_reports INNER JOIN players ON match_reports.player_id = players.id';
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get a match report by ID with player details
  getMatchReportById: async (id) => {
    try {
      const query = 'SELECT match_reports.*, players.name AS player_name FROM match_reports INNER JOIN players ON match_reports.player_id = players.id WHERE match_reports.id = $1';
      const { rows } = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Update a match report
  updateMatchReport: async (id, playerId, opponent, result) => {
    try {
      const query = 'UPDATE match_reports SET player_id = $1, opponent = $2, result = $3 WHERE id = $4 RETURNING *';
      const { rows } = await pool.query(query, [playerId, opponent, result, id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Delete a match report
  deleteMatchReport: async (id) => {
    try {
      const query = 'DELETE FROM match_reports WHERE id = $1 RETURNING *';
      const { rows } = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
};

module.exports = MatchReport;
