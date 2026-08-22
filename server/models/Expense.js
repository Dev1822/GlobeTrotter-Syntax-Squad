const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Expense = sequelize.define('Expense', {
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  category: DataTypes.STRING,
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});
module.exports = Expense;