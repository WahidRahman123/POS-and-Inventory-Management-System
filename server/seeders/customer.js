const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Customer = require("../models/Customer");
require("dotenv").config();

const customerData = require("../data/customers.json");

const seedCustomers = async () => {
  try {
    await connectDB();

    const result = await Customer.insertMany(customerData);

    console.log("Inserted Successfully");
    console.log(result);

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedCustomers();