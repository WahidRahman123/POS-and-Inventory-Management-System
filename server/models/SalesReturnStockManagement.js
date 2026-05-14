const mongoose = require("mongoose");

const salesReturnStockManagementSchema = new mongoose.Schema({
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
  tempReturnQuantity: {
    type: Number,
    // required: true,
    min: 1,
  },
  returnQtyInKg: {
    type: Number,
    // required: true,
  },
  tempReturnQtyInKg: {
    type: Number,
    // required: true,
  },
  returnPrice: {
    type: Number,
    required: true,
  },
  tempReturnPrice: {
    type: Number,
    // required: true,
  },
  lineTotal: {
    //* lineTotal = returnQuantity * returnPrice
    type: Number,
    required: true,
  },
  salesReturnRef: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalesReturn",
    },
  ],
});

module.exports = mongoose.model(
  "SalesReturnStockManagement",
  salesReturnStockManagementSchema,
);
