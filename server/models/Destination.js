const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Destination = sequelize.define('Destination', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  zone: DataTypes.STRING,
  imageUrl: DataTypes.STRING,
  slug: DataTypes.STRING,
  description: DataTypes.TEXT
});
module.exports = Destination;