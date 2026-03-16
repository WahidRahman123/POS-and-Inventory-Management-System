const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema(
  {
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
    invoiceNo: {
      type: Number,
      required: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
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
        oldSellPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        sellPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        costPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        quantity: {
          type: Number,
          required: true,
          min: 0,
        },
        subTotal: {
          type: Number,
          required: true,
        },
      },
    ],
    salesReturnId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SalesReturn",
      },
    ],
    transactionRecords: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SalesTransaction",
      },
    ],
    totalWithoutDiscount: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    due: {
      type: Number,
      required: true,
    },
    cash: {
      type: Number,
      required: true,
    },
    exchange: {
      type: Number,
      required: true,
    },
    paid: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Sales", salesSchema);
