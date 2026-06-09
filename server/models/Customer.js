const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },

    total: {
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
    salesRecord: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sales",
      },
    ],
    advanceBalance: {
      type: Number,
      default: 0,
    },

    currentBalance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

customerSchema.pre("save", function (next) {
  this.currentBalance = this.advanceBalance - this.due;
  next();
});

module.exports = mongoose.model("Customer", customerSchema);
