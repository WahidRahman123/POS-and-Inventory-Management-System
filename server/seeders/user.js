const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/user");
require("dotenv").config();

const data = {
	name: "ellitebattery",
	password: "12345678",
	role: "admin",
}

const seedCustomers = async () => {
	try {
		await connectDB();

		const user = new User(data);

		await user.save();
		console.log("User seeded successfully");

		process.exit();
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

seedCustomers();