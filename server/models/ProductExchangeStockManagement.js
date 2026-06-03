const mongoose = require("mongoose");

const productExchangeStockManagementSchema = new mongoose.Schema({
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
    // required: true,
    min: 1,
  },
  tempQuantity: {
    type: Number,
    // required: true,
    // min: 1,
  },
  qtyInKg: {
    type: Number,
    // required: true,
  },
  tempQtyInKg: {
    type: Number,
    // required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  tempUnitPrice: {
    type: Number,
    // required: true,
  },
  subTotal: {
    //* subTotal = qtyInKg * unitPrice
    type: Number,
    required: true,
  },
  productExchangeRef: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductExchange",
    },
  ],
});

module.exports = mongoose.model(
  "ProductExchangeStockManagement",
  productExchangeStockManagementSchema,
);
