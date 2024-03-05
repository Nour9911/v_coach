// server.js

const express = require('express');
const app = express();
const sequelize = require('./config/db'); // Import Sequelize instance
const playerRoutes = require('./routes/PlayerRoute');

// Middleware
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/api', playerRoutes);

// Sync Sequelize models with database
sequelize.sync({ force: true }) // Use { force: true } to drop existing tables
  .then(() => {
    console.log('Database synced successfully');
    // Start the server after syncing the database
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });
