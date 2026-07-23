const mongoose = require("mongoose");

const productStatementSchema = new mongoose.Schema(
	{
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
		},
		productName: {
			type: String,
			required: true,
		},

		customerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Customer",
		},
		supplierId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Supplier",
		},
		customerName: {
			type: String,
		},
		supplierName: {
			type: String,
		},

		transactionType: {
			type: String,
			required: true,
		},
		referenceId: {
			type: String,
		},

		previousQuantity: {
			type: Number,
			required: true,
			min: 0,
		},
		quantityAmount: {
			type: Number,
			required: true,
			min: 0,
		},
		CurrentQuantity: {
			type: Number,
			required: true,
			min: 0,
		},

		status: {
			type: String,
			enum: ["increased", "decreased", "unchanged", "created"],
			required: true,
		},

		date: {
			type: Date,
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true, toJSON: { virtuals: true } }
);

module.exports = mongoose.model("ProductStatement", productStatementSchema);
