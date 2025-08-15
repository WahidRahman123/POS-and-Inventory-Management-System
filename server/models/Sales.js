const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
    customerName: String,
    address: String,
    productName: {
        type: String,
        required: true,
        trim: true
    },
    sellPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    costPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    subtotal: {
        type: Number,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Sales', salesSchema);