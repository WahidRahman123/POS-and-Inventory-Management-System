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
    // required: true,
  },
  amountToBePaid: {
    //* amountToBePaid = previous due
    type: Number,
    required: true,
  },
  amount: { //* eta holo main value zeta debit credit field er jonno lagbe
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
  previousBalance: {
    type: Number,
    default: 0,
  },
  currentBalance: {
    //* Current Due
    type: Number,
    // required: true,
  },
  transactionType: {
    type: String,
    enum: ["debit", "credit"],
    required: true,
  },
  currentDue: {
    //* Current Due
    type: Number,
    // required: true,
  },
  cash: {
    type: Number,
    // required: true,
  },
  bankPaymentAmount: {
    type: Number,
    // required: true,
  },
  unchangedPaid: {
    type: Number,
    required: true,
  },
  unchangedDue: {
    type: Number,
    required: true,
  },

  purchaseType: {
    type: String,
    enum: ["normal", "advance", "due", "exchangeAdjust"],
    required: true,
  },
  advancePaymentAmount: {
    type: Number,
    default: 0,
    //required: true,
    // min: 0,
  },
  remarks: {
    type: String
  }, 
  adjustmentDetails: [
    {
      _id: false,

      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      productName: {
        type: String,
        required: true,
        trim: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      qtyInKg: {
        type: Number,
        // required: true,
      },
      unitPrice: {
        type: Number,
        required: true,
      },
      subTotal: {
        type: Number,
        required: true,
      },
    },
  ],

  purchaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Purchase",
  },

  companyProductReturnId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CompanyProductReturn",
  },
});

module.exports = mongoose.model(
  "PurchaseTransaction",
  purchaseTransactionSchema,
);
