const express = require('express');
const bodyParser = require('body-parser');
const playerRoutes = require('./routes/PlayerRoutes');
const loginRoutes = require('./routes/AuthRoutes');
const PlayerReportRoutes = require('./routes/PlayerReportRoutes');
const MatchesRoutes = require('./routes/MatchRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Team routes
app.use('/api/auth', loginRoutes);

// Player routes
app.use('/api/players', playerRoutes);

// Match routes
app.use('/api/matches', MatchesRoutes);

// Match report routes
app.use('/api/player-reports', PlayerReportRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
