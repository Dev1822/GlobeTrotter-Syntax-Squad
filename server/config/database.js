const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || 'globetrotter',
  process.env.MYSQL_USER || 'root',
  process.env.MYSQL_PASSWORD || '',
  {
    host: process.env.MYSQL_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, // Set to console.log to see SQL queries
  }
);

module.exports = sequelize;
