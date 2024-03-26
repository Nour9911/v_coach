const PlayerReport = require('../models/PlayerReport');
const Player = require('../models/Player');
const knex = require('knex');
const knexConfig = require('../knexfile');
const db = knex(knexConfig.development);


// Controller function to get player metrics by ID

exports.getPlayerMetrics = async (req, res) => {
  const { playerId, matchId } = req.params;

  try {
    // Retrieve player report for the specified player and match
    const playerReport = await db('player_report')
      .where({
        player_id: playerId,
        match_id: matchId
      })
      .first();

    // Check if playerReport is not null
    if (!playerReport) {
      return res.status(404).json({ error: 'Player metrics not found for the specified match' });
    }

    // Retrieve player data from the players table to get speed and endurance
    const playerData = await db('players').where('id', playerId).first();
    const playerSpeed = playerData.speedtest;
    const playerEndurance = playerData.endurancetest;

    // Perform calculations based on playerReport
    const { control_pass, bad_pass, bad_control, control_shoot, bad_shoot, excellent_pass,
      excellent_control, excellent_shoot, control_and_goal, recup_pass, discipline } = playerReport;

    // Perform your calculations here
    const CP = control_pass || 0;
    const BP = bad_pass || 0;
    const BC = bad_control || 0;
    const CT = control_shoot || 0;
    const BT = bad_shoot || 0;
    const EP = excellent_pass || 0;
    const EC = excellent_control || 0;
    const ET = excellent_shoot || 0;
    const CG = control_and_goal || 0;
    const RP = recup_pass || 0;
    const BD = discipline || 0;

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
  const { teamId, matchId } = req.params;

  try {
    // Retrieve team by team ID
    const teamData = await db('teams').where({ id: teamId }).first();

    if (!teamData) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Retrieve player IDs for the team
    const playerIds = await db('players')
      .where({ team_id: teamId })
      .pluck('id');

    // Retrieve player reports for the specified match and team
    const playerReports = await db('player_report')
      .whereIn('player_id', playerIds)
      .andWhere('match_id', matchId)
      .select(
        'control_pass',
        'bad_pass',
        'bad_control',
        'control_shoot',
        'bad_shoot',
        'excellent_pass',
        'excellent_control',
        'excellent_shoot',
        'control_and_goal',
        'recup_pass',
        'discipline'
      );

    // Aggregate metrics for the team's specified match
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

    // Aggregate player report metrics
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
      totalBD += report.discipline || 0;
      totalAS++; // Incrementing for each player report
      totalGM += report.control_and_goal || 0; // Incrementing for each player report
      totalGR += report.goals_received || 0; // Incrementing for each player report
    });

    // Calculate derived metrics
    const countReports = playerReports.length;
    const EPC = totalCP + totalEP + totalEC; // Touched balls
    const BPC = totalBP + totalBC; // Lost balls
    const GGM = totalGM; // Goals marked
    const GGR = totalGR; // Goals received 
    const BDP = 100 - (totalBD * 9); // Discipline percentage
    const AP = totalAS; // Average pressure
    const P = (EPC === 0) ? 0 : ((EPC - BPC) * 100 / EPC); // Control/Pass (%)
    const T = (totalCT + totalET === 0) ? 0 : ((totalCT + totalET) / (totalCT + totalET + totalBT)) * 100; // Shoot in Frame (%)

    // Recommendations
    const recommendations = [];
    if (BPC > 9) {
      recommendations.push("- Trop de ballons perdus! Ameliorer les passes, Eviter de garder le ballon.");
    }
    if (totalCT < 9) {
      recommendations.push("- Faible taux de tirs au but!");
    }
    if (GGM === 0) {
      recommendations.push("- Faible Realisation! reviser les strategies de l'attaque.");
    }
    if (totalCG > 2) {
      recommendations.push("- Defence fragile: Mauvaise couverture de surface");
    }
    if (BDP <= 80) {
      recommendations.push("Discipline: Manque de respect pour l arbitre et le publique");
    }

    // Calculate TEAM Evaluation
    const TE = (totalAS * getClassValue(teamData.class)) + (totalAS * getContinentValue(teamData.continent));
    const GE = 20 + (TE / 4);

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
      goalsMarked: GGM,
      goalsReceived: GGR,
      averagePressure: AP,
      teamEvaluation: GE,
      mention: M,
      comments: C,
      recommendations: recommendations,
      avgOpponentClass: teamData.class,
      avgOpponentContinent: teamData.continent
    };

    // Send the response to the client
    res.json(responseData);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};


// Helper function to get continent value
const getContinentValue = (continentName) => {
  switch (continentName) {
    case 'Europe':
      return 4;
    case 'America':
      return 3;
    case 'Africa':
      return 4;
    default:
      return 2;
  }
};

// Helper function to get class value
const getClassValue = (className) => {
  switch (className) {
    case 'A':
      return 4;
    case 'B':
      return 3;
    case 'C':
      return 4;
    default:
      return 2;
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
    const { teamId, matchId } = req.params;
    const playerReports = await PlayerReport.getPlayerReportsByTeamAndMatch(teamId, matchId);
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