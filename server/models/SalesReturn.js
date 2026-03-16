const mongoose = require("mongoose");

const salesReturnSchema = new mongoose.Schema({
  memo: { type: String, required: true },
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
  salesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sales",
  },

  //* which products are being returned
  products: [
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
      saleQuantity: {
        //* sales's quantity
        type: Number,
      },
      salePrice: {
        //* Sales's sellPrice
        type: Number,
      },
      subTotal: {
        //* Sales's subTotal
        type: Number,
        required: true,
      },
      returnQuantity: {
        type: Number,
        // required: true,
        min: 1,
      },
      returnQtyInKg: {
        type: Number,
        // required: true,
      },
      returnPrice: {
        type: Number,
        required: true,
      },
      lineTotal: {
        //* lineTotal = returnQuantity * returnPrice
        type: Number,
        required: true,
      },
    },
  ],

  transactionRecords: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalesReturnTransaction",
    },
  ],

  // Financial Summary
  totalReturnValue: {
    type: Number,
    default: 0,
    required: true,
  },
  due: {
    type: Number,
    required: true,
  },
  paid: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
  },
  issuedAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("SalesReturn", salesReturnSchema);
