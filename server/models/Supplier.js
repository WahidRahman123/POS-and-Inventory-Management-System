const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
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
    // ================== নতুন ফিল্ড ==================
  advanceBalance: {
    type: Number,
    default: 0
  },
  balance: {
    type: Number,
    default: 0
  },

  //* Main Balance
  totalBalance: {
    type: Number,
    default: 0
  },
  companyReturnBalance: {   //* Company aaj porjonto koto taka return balance koreche seta rakhchi
    type: Number,
    default: 0
  },
    
}, { timestamps: true })

module.exports = mongoose.model('Supplier', supplierSchema);