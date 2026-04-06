const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    seq: {
      type: Number,
      required: true,
    },
    seqChars: [String],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Counter", counterSchema);
