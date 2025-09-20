const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    memo: {
      type: String,
      required: true,
      trim: true,
    },
    supplierName: {
      type: String,
      required: true,
      trim: true
    },
    productNames: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paid: {
      type: Number,
      required: true,
      min: 0,
    },
    due: {
      type: Number,
      required: true,
      min: 0,
    },
    createdAt: {
      type: Date,
      required: true
    }
  }
);

module.exports = mongoose.model("Purchase", purchaseSchema);
