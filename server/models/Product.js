const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
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
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    // returnStockOfSale: {
    //   type: Number,
    //   min: 0,
    // },
    // returnStockOfPurchase: {
    //   type: Number,
    //   min: 0,
    // }
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

module.exports = mongoose.model("Product", productSchema);
