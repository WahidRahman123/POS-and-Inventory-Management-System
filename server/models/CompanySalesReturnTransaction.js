const mongoose = require("mongoose");

const companySalesReturnTransactionSchema = new mongoose.Schema({
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

  payDetails: [
    {
      productName: {
        type: String,
      },
      quantity: {
        type: Number,
        min: 0,
      },
      unitPrice: {    // <--- এটি নতুন যোগ করা হয়েছে টাকার হিসেব ট্র্যাকিং এর জন্য
        type: Number,
        default: 0,
      },
    },
  ],

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

  unchangedPaid: {
    type: Number,
    required: true,
  },
  unchangedDue: {
    type: Number,
    required: true,
  },

  companySalesReturnId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CompanySalesReturn",
  },
});

module.exports = mongoose.model(
  "CompanySalesReturnTransaction",
  companySalesReturnTransactionSchema,
);
