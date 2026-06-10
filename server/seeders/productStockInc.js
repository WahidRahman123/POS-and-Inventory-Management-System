const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Product = require("../models/Product");
require("dotenv").config();

// simplified data
const data = require("../data/products.json");

const seedProducts = async () => {
  try {
    await connectDB();

    for (const item of data) {
      const { productName, quantity } = item;

      // product search by name
      const existingProduct = await Product.findOne({ name: productName });

      if (existingProduct) {
        // quantity increase
        existingProduct.quantity += quantity;

        await existingProduct.save();

        console.log(
          `Updated: ${productName} | New Quantity: ${existingProduct.quantity}`
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