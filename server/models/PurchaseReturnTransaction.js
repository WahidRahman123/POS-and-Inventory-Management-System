const mongoose = require("mongoose");

const purchaseReturnTransactionSchema = new mongoose.Schema({
  refMemo: {  
    type: String,
    required: true,
  },
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
  purchaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Purchase",
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

  returnType: {
    type: String,
    enum: ["product", "cash"],
    required: true,
  },

  paymentMethod: { type: String, default: "Cash" },
  exchangeProducts: [
    {
      _id: false,
      productName: {
        type: String,
        //   required: true,
        trim: true,
      },
      quantity: {
        type: Number,
        //   required: true,
        min: 1,
      },
      qtyInKg: {
        type: Number,
        // required: true,
      },
      unitPrice: {
        //* sellPrice
        type: Number,
        //   required: true,
      },
      subTotal: {
        //* unitPrice * quantity
        type: Number,
        //   required: true,
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

  totalExchangeValue: { type: Number, default: 0 },
  adjustmentAmount: { type: Number, default: 0 }, // Positive means customer pays more
  cashRefundAmount: { type: Number, default: 0 },
  note: String,

  purchaseReturnId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PurchaseReturn",
  },
});

module.exports = mongoose.model(
  "PurchaseReturnTransaction",
  purchaseReturnTransactionSchema,
);
