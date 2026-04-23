const Decimal = require("decimal.js");
const ProductExchange = require("../models/ProductExchange");
const { getNextSequenceForOther } = require("../utils/getNextSequenceForOther");
const { default: mongoose } = require("mongoose");

// List of all exchanges with pagination and search
module.exports.index = async (req, res) => {
  try {
    const {
      dateSearch = "",
      nameSearch = "",
      page = 1,
      order = -1,
    } = req.query;

    let searchQuery = [];
    let dateSearchQuery;
    let nameSearchQuery;

    // For date search:
    if (dateSearch) {
      const startOfDay = new Date(dateSearch);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(dateSearch);
      endOfDay.setHours(23, 59, 59, 999);

      dateSearchQuery = {
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      };
      searchQuery.push(dateSearchQuery);
    }

    // For name search:
    if (nameSearch) {
      nameSearchQuery = { customerName: { $regex: nameSearch, $options: "i" } };
      searchQuery.push(nameSearchQuery);
    }

    const mainSearch = searchQuery.length !== 0 ? { $and: searchQuery } : {};

    const limit = 10;

    // Pagination
    const skip = (parseInt(page) - 1) * limit;

    const exchanges = await ProductExchange.find(mainSearch)
      .sort({ createdAt: parseInt(order) })
      .skip(skip)
      .limit(limit);

    // Count total documents
    const total = await ProductExchange.countDocuments(mainSearch);

    res.status(201).json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      exchanges,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// Create a new product exchange
module.exports.createProductExchange = async (req, res) => {
  // const session = await mongoose.startSession();
  try {
    const exchanges = req.body;
    const { totalAmount } = exchanges;

    // session.startTransaction();

    //* Generate the memo
    // const count = await getNextSequenceForOther("ProductExchange", session);
    const count = await getNextSequenceForOther("ProductExchange");
    if (!count) {
      throw new Error("Failed to generate sequence");
    }
    const memo = "PE-" + count.seq;

    //* Exchange creation with remainingBalance
    const exchange = new ProductExchange({
      ...exchanges,
      memo,
      remainingBalance: totalAmount,
    });

    // const createdExchange = await exchange.save({ session });
    const createdExchange = await exchange.save();

    // Commit
    // await session.commitTransaction();
    // session.endSession();

    res.status(201).json(createdExchange);
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();

    console.error(error);
    res.status(500).send("Server Error");
  }
};

// // Search memo specifically for POS dropdown
// module.exports.searchByMemo = async (req, res) => {
//   try {
//     const { search } = req.query;

//     const exchanges = await ProductExchange.find(
//       {
//         memo: { $regex: search, $options: "i" },
//       },
//       { memo: 1, totalAmount: 1, remainingBalance: 1, _id: 1 },
//     );

//     res.status(200).json(exchanges);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };
// Search memo specifically for POS dropdown
// module.exports.searchByMemo = async (req, res) => {
//   try {
//     const { search } = req.query;

//     // customerName: 1 যোগ করা হয়েছে যাতে ড্রপডাউনে নাম দেখা যায়
//     const exchanges = await ProductExchange.find(
//       {
//         memo: { $regex: search, $options: "i" },
//       },
//       { memo: 1, totalAmount: 1, remainingBalance: 1, customerName: 1, _id: 1 }
//     );

//     res.status(200).json(exchanges);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

// Search memo specifically for POS dropdown (Updated)
module.exports.searchByMemo = async (req, res) => {
  try {
    const { search } = req.query;

    const exchanges = await ProductExchange.find(
      {
        memo: { $regex: search, $options: "i" },
      },
      // products: 1 যোগ করা হয়েছে যাতে ফ্রন্টএন্ডে মেমোর ভেতরে কি পণ্য আছে তা দেখা যায়
      {
        memo: 1,
        totalAmount: 1,
        remainingBalance: 1,
        customerName: 1,
        products: 1,
        _id: 1,
      },
    );

    res.status(200).json(exchanges);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
