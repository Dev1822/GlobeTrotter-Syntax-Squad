const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PackingList = sequelize.define('PackingList', {
  items: {
    type: DataTypes.JSON,
    defaultValue: []
  }
});
module.exports = PackingList;