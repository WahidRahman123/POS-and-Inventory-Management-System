const mongoose = require("mongoose");

const salesReturnTransactionSchema = new mongoose.Schema({
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
  salesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sales",
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
  refMemo: {
    type: String,
    required: true,
  },

  //* which products are being returned
  products: [
    {
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
        required: true,
        min: 1,
      },
      returnQtyInKg: {
        type: Number,
        required: true,
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

  paymentMethod: { type: String, default: "Cash" },
  exchangeProducts: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      productName: {
        type: String,
        //   required: true,
        trim: true,
      },
      quantity: {
        type: Number,
        //   required: true,
        min: 1,
      },
      qtyInKg: {
        type: Number,
        // required: true,
      },
      unitPrice: {
        //* sellPrice
        type: Number,
        //   required: true,
      },
      subTotal: {
        //* unitPrice * quantity
        type: Number,
        //   required: true,
      },
    },
  ],

  amountToBePaid: {
    //* amountToBePaid = previous due
    type: Number,
    required: true,
  },
  paidAmount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  currentDue: {
    //* Current Due
    type: Number,
    required: true,
  },
  salesReturnId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SalesReturn",
  },
});

module.exports = mongoose.model(
  "SalesReturnTransaction",
  salesReturnTransactionSchema,
);
