const mongoose = require("mongoose");

const purchaseReturnSchema = new mongoose.Schema({
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
  purchaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Purchase",
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
      purchaseQuantity: {
        //* purchase's quantity
        type: Number,
      },
      purchasePrice: {
        //* purchase's sellPrice
        type: Number,
      },
      subTotal: {
        //* purchase's subTotal
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
      ref: "PurchaseReturnTransaction",
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

module.exports = mongoose.model("PurchaseReturn", purchaseReturnSchema);
