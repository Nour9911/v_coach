const PlayerReport = require('../models/PlayerReport');
const Player = require('../models/Player');

// Controller function to get player metrics by ID
exports.getPlayerMetrics = async (req, res) => {
  const playerId = req.params.playerId;

  try {
    // Retrieve player metrics from the database
    const playerMetrics = await PlayerReport.getPlayerMetricsByPlayerId(playerId);

    // Retrieve player data from the players table to get speed and endurance
    const playerData = await Player.getPlayerById(playerId);
    const playerSpeed = playerData.speedtest;
    const playerEndurance = playerData.endurancetest;

    // Perform calculations
    const CP = playerMetrics.control_pass || 0;
    const BP = playerMetrics.bad_pass || 0;
    const BC = playerMetrics.bad_control || 0;
    const CT = playerMetrics.control_shoot || 0;
    const BT = playerMetrics.bad_shoot || 0;
    const EP = playerMetrics.excellent_pass || 0;
    const EC = playerMetrics.excellent_control || 0;
    const ET = playerMetrics.excellent_shoot || 0;
    const CG = playerMetrics.control_and_goal || 0;
    const RP = playerMetrics.recup_pass || 0;
    const BD = playerMetrics.discipline || 0;

    const BDP = (BD === 0) ? 100 : Math.max(0, 100 - (BD * 9));
    const TB = CP + EP + EC + CT + ET + CG + BP + BC + BT;
    const P = ((EP + EC + CP - (BP + BC)) * 100) / (EP + EC + CP);
    const T = ((CT + ET - BT) * 100) / (CT + ET);
    const G = ((P * 6) + T + playerSpeed + playerEndurance + BDP);
    const GE = Math.floor(G / 10);
    const mention = (GE < 70) ? 'Bad' : (GE < 80) ? 'Local' : (GE < 90) ? 'Continental' : 'International';

    // Construct the response object with the calculated values
    const responseData = {
      controlPassPercentage: P,
      shootInFramePercentage: T,
      playerSpeed,
      playerEndurance,
      disciplinePercentage: BDP,
      playerEvaluation: GE,
      mention
    };

    // Send the response to the client
    res.json(responseData);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};


exports.getTeamMetrics = async (req, res) => {
  const teamId = req.params.teamId;

  try {
    // Fetch team's class and continent from the teams table
    const teamData = await knex('teams')
      .select('class', 'continent')
      .where('id', teamId)
      .first();

    if (!teamData) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Retrieve all player reports for the team
    const matchIds = await knex('matches')
      .where('team_id', teamId)
      .pluck('id');

    const playerReports = await knex('report')
      .whereIn('match_id', matchIds)
      .join('players', 'report.player_id', 'players.id');

  // Aggregate metrics for the team
  let totalCP = 0,
    totalBP = 0,
    totalBC = 0,
    totalCT = 0,
    totalBT = 0,
    totalEP = 0,
    totalEC = 0,
    totalET = 0,
    totalCG = 0,
    totalRP = 0,
    totalAS = 0,
    totalGM = 0,
    totalGR = 0,
    totalBD = 0;

  playerReports.forEach(report => {
    totalCP += report.control_pass || 0;
    totalBP += report.bad_pass || 0;
    totalBC += report.bad_control || 0;
    totalCT += report.control_shoot || 0;
    totalBT += report.bad_shoot || 0;
    totalEP += report.excellent_pass || 0;
    totalEC += report.excellent_control || 0;
    totalET += report.excellent_shoot || 0;
    totalCG += report.control_and_goal || 0;
    totalRP += report.recup_pass || 0;
    totalAS += report.adversary_square_reaching || 0;
    totalGM += report.goals_marked || 0;
    totalGR += report.goals_received || 0;
    totalBD += report.discipline || 0;
  });

const countReports = playerReports.length;

// Calculate derived metrics
const EPC = totalCP + totalEP + totalEC; // Calculate touched balls
const BPC = totalBP + totalBC; // Calculate lost balls
const GGM = totalGM; // Calculate goals marked
const GGR = totalGR; // Calculate goals received
const BDP = (totalBD === 0) ? 100 : Math.max(0, 100 - (totalBD * 9)); // Calculate discipline percentage
const AP = totalAS; // Calculate average pressure

    // Determine team class and continent based on team's data
    let CLASS = 1;
    let CONT = 2;

    // Determine team class based on the fetched class
    if (teamData.class === 'A') {
      CLASS = 4;
    } else if (teamData.class === 'B') {
      CLASS = 3;
    } else if (teamData.class === 'C') {
      CLASS = 2;
    } else if (teamData.class === 'D') {
      CLASS = 1;
    }

    // Determine team continent based on the fetched continent
    if (teamData.continent === 'Europe') {
      CONT = 4;
    } else if (teamData.continent === 'America') {
      CONT = 3;
    } // Add other conditions as needed for different continents

    // Calculate TEAM Evaluation
    const TE = (totalAS * CLASS) + (totalAS * CONT);
    const GE = 20 + TE / 4;

    // Determine mention and comments based on team evaluation
    let M, C;
    if (GE < 20) {
      M = 'BAD';
      C = "- Equipe Mediocre, Tout est a refaire";
    } else if (GE < 40) {
      M = 'WEAK';
      C = "- Equipe faible et necessite beaucoup de travail!";
    } else if (GE < 60) {
      M = 'AVERAGE';
      C = "- l equipe peine a avancer vers le camp de l adversaire.";
    } else if (GE < 80) {
      M = 'GOOD';
      C = "- Moyenne pression sur l adversaire, continuer a ameliorer";
    } else {
      M = 'EXCELLENT';
      C = "- Grande pression sur l adversaire avec grande creation d'occasions de buts. Tres bonne equipe, BRAVO!";
    }

    // Generate response object with calculated values
    const responseData = {
      controlPassPercentage: P,
      shootInFramePercentage: T,
      disciplinePercentage: BDP,
      touchedBalls: EPC,
      lostBalls: BPC,
      shoots: ECT,
      goalsMarked: GGM,
      goalsReceived: GGR,
      averagePressure: AP,
      teamEvaluation: GE,
      mention: M,
      comments: C
    };

    // Send the response to the client
    res.json(responseData);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};




// CRUD operations for Player Report

// Create a new player report entry
exports.createPlayerReport = async (req, res) => {
  const { player_id, position, control_pass, bad_pass, bad_control, control_shoot, bad_shoot, excellent_pass, excellent_control, excellent_shoot, control_and_goal, recup_pass, discipline, match_id } = req.body;
  try {
      const newPlayerReport = await PlayerReport.createPlayerReport({ player_id, position, control_pass, bad_pass, bad_control, control_shoot, bad_shoot, excellent_pass, excellent_control, excellent_shoot, control_and_goal, recup_pass, discipline, match_id });
      res.status(201).json(newPlayerReport);
  } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
  }
};


// Retrieve all player reports
exports.getAllPlayerReports = async (req, res) => {
  try {
    const playerReports = await PlayerReport.getAllPlayerReports();
    res.json(playerReports);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};


// Retrieve a player report by ID
exports.getPlayerReportById = async (req, res) => {
  const reportId = req.params.reportId;
  try {
    const playerReport = await PlayerReport.getPlayerReportById(reportId);
    if (!playerReport) {
      return res.status(404).json({ message: 'Player Report not found' });
    }
    res.json(playerReport);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Update a player report
exports.updatePlayerReport = async (req, res) => {
  const reportId = req.params.reportId;
  const updatedFields = req.body; // Assuming the request body contains all fields including 'id'

  try {
    const updatedPlayerReport = await PlayerReport.updatePlayerReport(reportId, updatedFields);
    if (!updatedPlayerReport) {
      return res.status(404).send({ message: 'Report not found, add your report' });
    }
    res.json(updatedPlayerReport);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};


// Delete a player report
exports.deletePlayerReport = async (req, res) => {
    const reportId = req.params.reportId;
    try {
        const deletedPlayerReport = await PlayerReport.deletePlayerReport(reportId);
        res.json(deletedPlayerReport);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
  };
