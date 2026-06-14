const mongoose = require("mongoose");

const companyProductReturnTransactionSchema = new mongoose.Schema({
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
  },
  supplierName: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
  },
  supplierEmail: {
    type: String,
  },
  supplierPhone: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  refMemo: {
    type: String,
    required: true,
  },
  amountToBePaid: {
    //* amountToBePaid = previous due
    type: Number,
    required: true,
  },
  paidAmount: {
    type: Number,
    required: true,
  },
  companyReturnAmount: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    required: true,
  },
  currentDue: {
    //* Current Due
    type: Number,
    required: true,
  },

  unchangedPaid: {
    type: Number,
    required: true,
  },
  unchangedDue: {
    type: Number,
    required: true,
  },

  companyProductReturnId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CompanyProductReturn",
  }
});

module.exports = mongoose.model(
  "CompanyProductReturnTransaction",
  companyProductReturnTransactionSchema,
);
