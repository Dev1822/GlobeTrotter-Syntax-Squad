const sequelize = require('../config/database');
const User = require('./User');
const Trip = require('./Trip');
const TripStop = require('./TripStop');
const TripActivity = require('./TripActivity');
const Destination = require('./Destination');
const Expense = require('./Expense');

// Define associations

// User <-> Trip
User.hasMany(Trip, { foreignKey: 'userId', as: 'trips', onDelete: 'CASCADE' });
Trip.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Trip <-> TripStop
Trip.hasMany(TripStop, { foreignKey: 'tripId', as: 'stops', onDelete: 'CASCADE' });
TripStop.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });

// TripStop <-> TripActivity
TripStop.hasMany(TripActivity, { foreignKey: 'stopId', as: 'activities', onDelete: 'CASCADE' });
TripActivity.belongsTo(TripStop, { foreignKey: 'stopId', as: 'stop' });

// Trip <-> Expense
Trip.hasMany(Expense, { foreignKey: 'tripId', as: 'expenses', onDelete: 'CASCADE' });
Expense.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });

// User <-> Expense (owner)
User.hasMany(Expense, { foreignKey: 'userId', as: 'expenses', onDelete: 'CASCADE' });
Expense.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> Expense (payer)
User.hasMany(Expense, { foreignKey: 'payerId', as: 'paidExpenses' });
Expense.belongsTo(User, { foreignKey: 'payerId', as: 'payer' });

module.exports = {
  sequelize,
  User,
  Trip,
  TripStop,
  TripActivity,
  Destination,
  Expense
};
