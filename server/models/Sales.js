const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema(
  {
    // customerId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Customer'
    // },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    invoiceNo: {
      type: Number,
      required: true
    },
    remarks: {
      type: String,
      trim: true
    },
    customerName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true
    },
    products: [
      {
        productName: {
          type: String,
          required: true,
          trim: true,
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
        subtotal: {
          type: Number,
          required: true,
        },
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
    paid: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sales", salesSchema);
