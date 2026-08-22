const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TripActivity = sequelize.define('TripActivity', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: DataTypes.DATE,
  startTime: DataTypes.TIME,
  endTime: DataTypes.TIME,
  location: DataTypes.STRING,
  notes: DataTypes.TEXT,
  cost: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  orderIndex: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});
module.exports = TripActivity;