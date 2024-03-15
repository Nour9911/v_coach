const express = require('express');
const bodyParser = require('body-parser');
const playerRoutes = require('./routes/PlayerRoutes');
const matchReportRoutes = require('./routes/MatchReportRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Player routes
app.use('/api/players', playerRoutes);

// Match report routes
app.use('/api/match-reports', matchReportRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
