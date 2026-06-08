const mongoose = require("mongoose");

const salesTransactionSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  customerName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
  },
  customerPhone: {
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

  cash: {
    type: Number,
    // required: true,
  },
  bankPaymentAmount: {
    type: Number,
    // required: true,
  },
  exchange: {
    type: Number,
    // required: true,
    default: 0,
  },
  exchangeMemoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductExchange",
  },
  exchangeDetails: {
    memo: String,
    totalAmount: Number,
    remainingBalance: Number,
    products: [
      {
        _id: false,
        productName: String,
        quantity: Number,
        qtyInKg: Number,
        unitPrice: Number,
        subTotal: Number,
      },
    ],
  },

  unchangedPaid: {
    type: Number,
    required: true,
  },
  unchangedDue: {
    type: Number,
    required: true,
  },
  remarks: {
    type: String,
    trim: true,
  },

  salesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sales",
  },
});

module.exports = mongoose.model("SalesTransaction", salesTransactionSchema);
