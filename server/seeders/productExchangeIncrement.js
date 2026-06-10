const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Product = require("../models/Product");
require("dotenv").config();

// simplified data
const data = require("../data/exchangeStock.json");
const ProductExchange = require("../models/ProductExchange");

const seedProducts = async () => {
  try {
    await connectDB();

    for (const item of data) {
      const { exchangeMemoId, exchange } = item;

      // product search by name
      const existingProduct = await ProductExchange.findById(exchangeMemoId);

      if (existingProduct) {
        // quantity increase
        existingProduct.remainingBalance += exchange;

        await existingProduct.save();

        console.log(
          `Updated: ${exchangeMemoId} | New Balance: ${existingProduct.remainingBalance}`
        );
      } else {
        console.log(`Product Not Found: ${productName}`);
      }
    }

    console.log("All Products Updated Successfully");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedProducts();