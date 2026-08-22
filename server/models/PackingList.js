const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PackingList = sequelize.define('PackingList', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  items: {
    type: DataTypes.JSON,
    defaultValue: []
  }
});
module.exports = PackingList;