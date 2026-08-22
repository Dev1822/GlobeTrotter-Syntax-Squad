const { Expense, Trip, sequelize } = require('../models');

// Get all expenses for a user (across all trips) - for analytics
exports.getAllUserExpenses = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 100);
    const skip = (page - 1) * limit;

    const { rows: expenses, count: total } = await Expense.findAndCountAll({
      where: { userId: req.user.id },
      include: [{ model: Trip, as: 'trip', attributes: ['name', 'startDate', 'endDate'] }],
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
    console.error("getAllUserExpenses error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Create a new expense
exports.createExpense = async (req, res) => {
  try {
    const { trip, amount, currency, category, description, date } = req.body;
    const targetTripId = Number(trip);
    if (isNaN(targetTripId)) {
      return res.status(400).json({ message: "Invalid trip identifier" });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number greater than zero." });
    }

    const tripExists = await Trip.findOne({
      where: { id: targetTripId, userId: req.user.id }
    });

    if (!tripExists) {
      return res.status(404).json({ message: "Trip not found or unauthorized" });
    }
    const expenseDate = date ? new Date(date) : new Date();
    if (isNaN(expenseDate.getTime())) {
      return res.status(400).json({
        message: "Invalid expense date.",
      });
    }
    
    const expense = await Expense.create({
      userId: req.user.id,
      payerId: req.user.id,
      tripId: targetTripId,
      amount: parsedAmount,
      currency: currency || "INR",
      category: category || "Other",
      description: description?.trim() || category || "Expense",
      date: expenseDate,
    });

    res.json(expense);
  } catch (err) {
    console.error("createExpense error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all expenses for a specific trip
exports.getTripExpenses = async (req, res) => {
  try {
    const tripId = Number(req.params.tripId);
    if (isNaN(tripId)) {
      return res.status(400).json({ message: "Invalid trip identifier" });
    }

    const tripExists = await Trip.findOne({
      where: { id: tripId, userId: req.user.id }
    });

    if (!tripExists) {
      return res.status(404).json({ message: "Trip not found or unauthorized" });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(200, parseInt(req.query.limit) || 100);
    const skip = (page - 1) * limit;

    const { rows: expenses, count: total } = await Expense.findAndCountAll({
      where: { tripId: tripId },
      order: [['date', 'DESC'], ['id', 'DESC']],
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
    console.error("getTripExpenses error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get expense by ID
exports.getExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense record not found" });
    }

    res.json(expense);
  } catch (err) {
    console.error("getExpense error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update expense
exports.updateExpense = async (req, res) => {
  try {
    let expense = await Expense.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense record not found" });
    }

    const { amount, currency, category, description, date } = req.body;

    const expenseFields = {};
    if (amount !== undefined) {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res
          .status(400)
          .json({ message: "Amount must be a positive number greater than zero." });
      }
      expenseFields.amount = parsedAmount;
    }
    if (currency) expenseFields.currency = currency;
    if (category) expenseFields.category = category;
    if (description !== undefined) expenseFields.description = description.trim() || category || "Expense";
    if (date) {
      const expenseDate = new Date(date);
      if (isNaN(expenseDate.getTime())) {
        return res.status(400).json({
          message: "Invalid expense date.",
        });
      }
      expenseFields.date = expenseDate;
    }

    await expense.update(expenseFields);

    res.json(expense);
  } catch (err) {
    console.error("updateExpense error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense record not found" });
    }

    await expense.destroy();
    res.json({ message: "Expense removed" });
  } catch (err) {
    console.error("deleteExpense error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get expense summary by category for a trip
exports.getExpenseSummary = async (req, res) => {
  try {
    const tripId = Number(req.params.tripId);
    if (isNaN(tripId)) {
      return res.status(400).json({ message: "Invalid trip identifier" });
    }

    const tripExists = await Trip.findOne({
      where: { id: tripId, userId: req.user.id }
    });

    if (!tripExists) {
      return res.status(404).json({ message: "Trip not found or unauthorized" });
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
      ]
    });

    res.json(summary);
  } catch (err) {
    console.error("getExpenseSummary error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
