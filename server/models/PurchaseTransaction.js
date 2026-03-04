const mongoose = require("mongoose");

const purchaseTransactionSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true,
  },
  currentDue: {
    //* Current Due
    type: Number,
    required: true,
  },
  purchaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Purchase",
  }
});

module.exports = mongoose.model(
  "PurchaseTransaction",
  purchaseTransactionSchema,
);
