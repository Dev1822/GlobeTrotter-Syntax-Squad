const { User, Trip, Destination } = require("../models");
const sequelize = require("../config/database");

exports.getStats = async (req, res) => {
  try {
    const userCount = await User.count();
    const tripCount = await Trip.count();
    const destinationCount = await Destination.count();

    // In a real app, you might want to query most popular destinations
    // For now, we return basic counts
    res.json({
      userCount,
      tripCount,
      destinationCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'createdAt', 'authProvider']
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
