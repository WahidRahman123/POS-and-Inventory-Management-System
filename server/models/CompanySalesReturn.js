// const mongoose = require("mongoose");

// const companySalesReturnSchema = new mongoose.Schema({
//   memo: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   supplierId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Supplier",
//   },
//   supplierName: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   address: {
//     type: String,
//     required: true,
//   },
//   supplierEmail: {
//     type: String,
//   },
//   supplierPhone: {
//     type: String,
//     required: true,
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   },

//   products: [
//     {
//       _id: false,

//       productId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product",
//       },
//       productName: {
//         type: String,
//         required: true,
//         trim: true,
//       },
//       quantity: {
//         type: Number,
//         required: true,
//         min: 0,
//       },
//       qtyInKg: {
//         type: Number,
//         required: true,
//       },
//       unitPrice: {
//         type: Number,
//         required: true,
//       },
//       subTotal: {
//         type: Number,
//         required: true,
//       },
//     },
//   ],

//   transactionRecords: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "CompanySalesReturnTransaction",
//     },
//   ],
//   totalAmount: {
//     type: Number,
//     required: true,
//     min: 0,
//   },
//   paid: {
//     type: Number,
//     required: true,
//     min: 0,
//   },
//   due: {
//     type: Number,
//     required: true,
//     min: 0,
//   },

//   totalAmountQty: {
//     type: Number,
//     required: true,
//     min: 0,
//   },
//   paidQty: {
//     type: Number,
//     required: true,
//     min: 0,
//   },
//   dueQty: {
//     type: Number,
//     required: true,
//     min: 0,
//   },
//   createdAt: {
//     type: Date,
//     required: true,
//   },
//   issuedAt: {
//     type: Date,
//     required: true,
//   },
// });

// module.exports = mongoose.model("CompanySalesReturn", companySalesReturnSchema);

const mongoose = require("mongoose");

const companySalesReturnSchema = new mongoose.Schema(
  {
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
    },
    supplierPhone: {
      type: String,
    },
    memo: {
      type: String,
      required: true,
      unique: true,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    paid: {
      type: Number,
      default: 0,
    },
    due: {
      type: Number,
      default: 0,
    },
    totalAmountQty: {
      type: Number,
      default: 0,
    },
    paidQty: {
      type: Number,
      default: 0,
    },
    dueQty: {
      type: Number,
      default: 0,
    },
    dueAmount: {
      // <--- টাকার নিখুঁত অবশিষ্টাংশ ট্র্যাকিং ফিল্ড
      type: Number,
      default: 0,
    },
    qtyInKg: {
      type: Number,
      default: 0,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        productName: { type: String },
        quantity: { type: Number },
        qtyInKg: { type: Number },
        costPrice: { type: Number },
        unitPrice: { type: Number },
        totalPrice: { type: Number },
      },
    ],
    transactionRecords: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CompanySalesReturnTransaction",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("CompanySalesReturn", companySalesReturnSchema);
