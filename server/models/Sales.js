const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
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
    type: String,
    required: true,
  },
  remarks: {
    type: String,
    trim: true,
  },
  saleType: {
    type: String,
    enum: ["normal", "loan", "due-payment", "scrap-sell", "others"],
    // required: true,
    default: "normal"
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
        // required: true,
        trim: true,
      },
      oldSellPrice: {
        type: Number,
        // required: true,
        min: 0,
      },
      sellPrice: {
        type: Number,
        // required: true,
        min: 0,
      },
      costPrice: {
        type: Number,
        // required: true,
        min: 0,
      },
      quantity: {
        type: Number,
        // required: true,
        min: 0,
      },
      subTotal: {
        type: Number,
        // required: true,
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
  scrapProductSellId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ScrapProductSell",
    },
  ],
  totalWithoutDiscount: {
    type: Number,
    // required: true,
    default: 0,
  },
  total: {
    type: Number,
    // required: true,
  },
  totalCost: {
    type: Number,
    // required: true,
    default: 0,
  },
  discount: {
    type: Number,
    // required: true,
    default: 0,
  },
  due: {
    type: Number,
    // required: true,
  },
  loan: {
    type: Number,
    default: 0,
  },
  cash: {
    type: Number,
    // required: true,
  },
  bankPaymentAmount: {
    type: Number,
    // required: true,
  },
  // এক্সচেঞ্জ লজিকের জন্য প্রয়োজনীয় ফিল্ডস
  exchange: {
    type: Number,
    // required: true,
    default: 0,
  },
  exchangeMemoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductExchange",
  },
  // ইনভয়েসে এক্সচেঞ্জ করা পণ্যের লিস্ট দেখানোর জন্য নিচের অবজেক্টটি যোগ করা হয়েছে
  exchangeDetails: {
    memo: String,
    totalAmount: Number,
    remainingBalance: Number,
    products: [
      {
        _id: false,
        productName: String,
        quantity: Number,
        qtyInKg: Number,
        unitPrice: Number,
        subTotal: Number,
      },
    ],
  },
  paid: {
    type: Number,
    // required: true,
  },
  advanceAmount: {
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
});

module.exports = mongoose.model("Sales", salesSchema);
