const Expense = require('../models/Expense');
const { combineDateWithCurrentTime } = require('../utils/combineDateWithCurrentTime');
const dayjs = require('../utils/date.js');

// Get All Expenses with Pagination & Date Filter
exports.index = async (req, res) => {
  try {
    const { page = 1, dateSearch = "" } = req.query;
    const limit = 20;
    const skip = (parseInt(page) - 1) * limit;

    let query = {};
    if (dateSearch) {
      const start = dayjs(dateSearch)
        .tz("Asia/Dhaka")
        .startOf("day")
        .utc()
        .toDate();

      const end = dayjs(dateSearch)
        .tz("Asia/Dhaka")
        .endOf("day")
        .utc()
        .toDate();

      query.date = { $gte: start, $lte: end };
    }

    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Expense.countDocuments(query);

    res.json({
      expenses,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Add Multiple Expenses
exports.createMultipleExpenses = async (req, res) => {
  try {
    const { date, expenses } = req.body;

    const utcDate = combineDateWithCurrentTime(date);

    if (!date || !Array.isArray(expenses) || expenses.length === 0) {
      return res.status(400).json({ message: "Date and at least one expense required" });
    }

    const expenseDocs = expenses.map(item => ({
      date: utcDate,
      description: item.description,
      amount: Number(item.amount),
      userId: req.user._id
    }));

    const savedExpenses = await Expense.insertMany(expenseDocs);

    res.status(201).json({ 
      message: `${savedExpenses.length} expenses added successfully`,
      count: savedExpenses.length 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Total Expense
exports.getTotalExpense = async (req, res) => {
  try {
    const result = await Expense.aggregate([
      { $group: { _id: null, totalExpense: { $sum: "$amount" } } }
    ]);
    res.json({ totalExpense: result[0]?.totalExpense || 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};