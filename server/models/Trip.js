const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Trip = sequelize.define('Trip', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: true
  },
  coverImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  description: DataTypes.TEXT,
  budget: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('planned', 'ongoing', 'completed'),
    defaultValue: 'planned'
  },
  shareToken: DataTypes.STRING,
  shareEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Trip;