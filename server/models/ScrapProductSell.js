const mongoose = require("mongoose");

const scrapProductSellSchema = new mongoose.Schema({
  memo: {
    type: String,
    required: true,
    trim: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  customerName: {
    type: String,
    required: true,
    trim: true,
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

  products: [
    {
      _id: false,
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ScrapProduct",
      },
      productName: {
        type: String,
        required: true,
        trim: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 0,
      },
      qtyInKg: {
        type: Number,
        required: true,
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
  transactionRecords: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ScrapProductSellTransaction",
    },
  ],
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

  cash: {
    type: Number,
    // required: true,
  },
  bankPaymentAmount: {
    type: Number,
    // required: true,
  },

  createdAt: {
    type: Date,
    required: true,
  },
  issuedAt: {
    type: Date,
    required: true,
  },
  salesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sales",
  },
});

module.exports = mongoose.model("ScrapProductSell", scrapProductSellSchema);