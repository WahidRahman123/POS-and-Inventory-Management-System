const mongoose = require("mongoose");

const scrapProductSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ScrapProduct", scrapProductSchema);
