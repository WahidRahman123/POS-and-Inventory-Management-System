const { default: mongoose } = require("mongoose");
const connectDB = require("../config/db");
const ScrapProduct = require("../models/ScrapProduct");
require("dotenv").config();

const data = {
  productName: "Test Product 1",
};

async function fun() {
  try {
    // await mongoose.connect("mongodb://localhost:27017/pos");
    await connectDB();

    const scrap = await ScrapProduct(data);
    await scrap.save();
    console.log(scrap);
    process.exit(0);
  } catch (error) {
    console.log("Failed!");
    process.exit(1);
  }
}

fun();
