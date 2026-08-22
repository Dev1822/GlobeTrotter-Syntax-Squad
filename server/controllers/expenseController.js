const { Expense, Trip, sequelize } = require('../models');

// Get all expenses for a user (across all trips) - for analytics
exports.getAllUserExpenses = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const { rows: expenses, count: total } = await Expense.findAndCountAll({
      where: { userId: req.user.id },
      include: [{ model: Trip, attributes: ['destination', 'startDate', 'endDate'] }],
      order: [['date', 'DESC']],
      offset: skip,
      limit: limit,
    });

    const totalPages = Math.ceil(total / limit);

    res.json({
      data: expenses,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Create a new expense
exports.createExpense = async (req, res) => {
  try {
    const { trip, amount, currency, category, description, date } = req.body;
    if (typeof trip !== "string" && typeof trip !== "number") {
      return res.status(400).json({ msg: "Invalid trip identifier" });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res
        .status(400)
        .json({ msg: "Amount must be a positive number greater than zero." });
    }

    const tripExists = await Trip.findOne({
      where: { id: trip, userId: req.user.id }
    });

    if (!tripExists) {
      return res.status(404).json({ msg: "Trip not found or unauthorized" });
    }
    const expenseDate = new Date(date || Date.now());

    if (isNaN(expenseDate.getTime())) {
      return res.status(400).json({
        msg: "Invalid expense date.",
      });
    }
    if (
      expenseDate < tripExists.startDate ||
      expenseDate > tripExists.endDate
    ) {
      return res.status(400).json({
        msg: `Expense date must be between ${new Date(tripExists.startDate).toDateString()} and ${new Date(tripExists.endDate).toDateString()}.`,
      });
    }
    
    const expense = await Expense.create({
      userId: req.user.id,
      tripId: trip,
      amount: parsedAmount,
      currency,
      category,
      description,
      date: expenseDate,
    });

    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get all expenses for a specific trip
exports.getTripExpenses = async (req, res) => {
  try {
    const { tripId } = req.params;

    const tripExists = await Trip.findOne({
      where: { id: tripId, userId: req.user.id }
    });

    if (!tripExists) {
      return res.status(404).json({ msg: "Trip not found or unauthorized" });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const { rows: expenses, count: total } = await Expense.findAndCountAll({
      where: { tripId: tripId },
      order: [['date', 'DESC']],
      offset: skip,
      limit: limit,
    });

    const totalPages = Math.ceil(total / limit);

    res.json({
      data: expenses,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get expense by ID
exports.getExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!expense) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Update expense
exports.updateExpense = async (req, res) => {
  try {
    let expense = await Expense.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!expense) {
      return res.status(403).json({ message: "Access denied" });
    }

    const trip = await Trip.findByPk(expense.tripId);
    if (!trip) {
      return res.status(404).json({
        msg: "Associated trip not found.",
      });
    }

    const { amount, currency, category, description, date } = req.body;

    if (amount !== undefined) {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res
          .status(400)
          .json({ msg: "Amount must be a positive number greater than zero." });
      }
    }

    const expenseFields = {};
    if (amount !== undefined) expenseFields.amount = parseFloat(amount);
    if (currency) expenseFields.currency = currency;
    if (category) expenseFields.category = category;
    if (description) expenseFields.description = description;
    if (date) {
      const expenseDate = new Date(date);

      if (isNaN(expenseDate.getTime())) {
        return res.status(400).json({
          msg: "Invalid expense date.",
        });
      }

      if (expenseDate < trip.startDate || expenseDate > trip.endDate) {
        return res.status(400).json({
          msg: `Expense date must be between ${new Date(trip.startDate).toDateString()} and ${new Date(trip.endDate).toDateString()}.`,
        });
      }

      expenseFields.date = expenseDate;
    }

    await expense.update(expenseFields);

    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Delete expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!expense) {
      return res.status(403).json({ message: "Access denied" });
    }

    await expense.destroy();
    res.json({ msg: "Expense removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get expense summary by category for a trip
exports.getExpenseSummary = async (req, res) => {
  try {
    const { tripId } = req.params;

    const tripExists = await Trip.findOne({
      where: { id: tripId, userId: req.user.id }
    });

    if (!tripExists) {
      return res.status(404).json({ msg: "Trip not found or unauthorized" });
    }

    const summary = await Expense.findAll({
      attributes: [
        'category',
        'currency',
        [sequelize.fn('sum', sequelize.col('amount')), 'totalAmount'],
        [sequelize.fn('count', sequelize.col('id')), 'count']
      ],
      where: { tripId: tripExists.id },
      group: ['category', 'currency'],
      order: [
        ['category', 'ASC'],
        [sequelize.literal('totalAmount'), 'DESC']
      ]
    });

    res.json(summary);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
