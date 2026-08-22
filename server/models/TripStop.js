const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TripStop = sequelize.define('TripStop', {
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  startDate: DataTypes.DATE,
  endDate: DataTypes.DATE,
  orderIndex: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});
module.exports = TripStop;