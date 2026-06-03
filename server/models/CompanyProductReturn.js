const mongoose = require("mongoose");

const companyProductReturnSchema = new mongoose.Schema({
  memo: {
    type: String,
    required: true,
    trim: true,
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
      ref: "CompanyProductReturnTransaction",
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
  createdAt: {
    type: Date,
    required: true,
  },
  issuedAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model(
  "CompanyProductReturn",
  companyProductReturnSchema,
);
