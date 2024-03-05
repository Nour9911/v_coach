// server/models/player.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Player = sequelize.define('Player', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Player;
