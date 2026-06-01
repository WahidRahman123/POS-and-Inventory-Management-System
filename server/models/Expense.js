const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    date: { type: Date, required: true, default: Date.now },
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);