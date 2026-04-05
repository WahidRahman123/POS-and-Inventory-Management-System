// const Sales = require("../models/Sales");
// const Product = require("../models/Product");
// const SalesTransaction = require("../models/SalesTransaction");
// const Decimal = require("decimal.js");
// const { default: mongoose } = require("mongoose");
// const { createCustomDate } = require("../utils/createCustomDate");
// const ProductExchange = require("../models/ProductExchange");

// module.exports.index = async (req, res) => {
//   try {
//     const { page = 1 } = req.query;

//     const limit = 10;
//     const skip = (parseInt(page) - 1) * limit;

//     const sales = await Sales.find({})
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     // Count total documents
//     const total = await Sales.countDocuments({});

//     res.status(201).json({
//       total,
//       page: parseInt(page),
//       pages: Math.ceil(total / limit),
//       sales,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

// module.exports.createSales = async (req, res) => {
//   const session = await mongoose.startSession();
//   try {
//     const sales = req.body;

//     const {
//       exchangeMemoId,
//       invoiceNo,
//       remarks,
//       products,
//       totalWithoutDiscount,
//       total,
//       discount,
//       totalCost,
//       cash,
//       exchange,
//       due,
//       paid,
//       ...transactionDetail
//     } = sales;

//     session.startTransaction();

//     //* Transaction Creation
//     const transactionDetails = {
//       ...transactionDetail,
//       refMemo: invoiceNo,
//       amountToBePaid: total,
//       paidAmount: paid,
//       date: new Date(),
//       currentDue: due,
//     };
//     const transaction = new SalesTransaction(transactionDetails);

//     //* sales creation
//     const sale = new Sales({
//       ...sales,
//       transactionRecords: [transaction._id],
//     });

//     transaction.salesId = sale._id;
//     await transaction.save({ session });

//     for (let i = 0; i < sales.products.length; i++) {
//       const { productName, quantity } = sales.products[i];

//       const product = await Product.findOne({ name: productName }).session(
//         session,
//       );

//       product.quantity = product.quantity - quantity;
//       await product.save({ session });
//     }

//     // ২. এক্সচেঞ্জ মেমো ব্যালেন্স ডিডাকশন (Main Logic)
//     if (exchangeMemoId && exchange > 0) {
//       const memoData = await ProductExchange.findById(exchangeMemoId);

//       if (memoData) {
//         const currentBalance = new Decimal(memoData.remainingBalance);
//         const usedAmount = new Decimal(exchange); // আপনি যা ইচ্ছামতো ইনপুট দিয়েছেন

//         // নতুন ব্যালেন্স ক্যালকুলেট করছি
//         let newBalance = Number(currentBalance.minus(usedAmount).toFixed(4));

//         if (newBalance < 0) {
//           newBalance = 0;
//         }

//         memoData.remainingBalance = newBalance;
//         await memoData.save();
//       }
//     }

//     const createdSale = await sale.save({ session });

//     // Commit
//     await session.commitTransaction();
//     session.endSession();

//     res.status(201).json(createdSale);
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();

//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

// module.exports.searchByDates = async (req, res) => {
//   try {
//     const { date, page = 1, order = -1 } = req.query;

//     if (!date) return res.status(400).json({ message: "Invalid Dates!" });

//     // const limit = 10;
//     // const skip = (parseInt(page) - 1) * limit;

//     // Today's sales:
//     if (date && date === "t") {
//       const startOfDay = new Date();
//       startOfDay.setHours(0, 0, 0, 0);

//       const endOfDay = new Date();
//       endOfDay.setHours(23, 59, 59, 999);

//       const { sales, total } = await getSalesAndTotal(
//         startOfDay,
//         endOfDay,
//         order,
//       );

//       // return res.status(200).json({
//       //   total,
//       //   page: parseInt(page),
//       //   pages: Math.ceil(total / limit),
//       //   sales,
//       // });
//       return res.status(200).json(sales);
//     }

//     // Weekly sales:
//     if (date && date === "w") {
//       const now = new Date();

//       const startOfWeek = new Date(now);
//       startOfWeek.setHours(0, 0, 0, 0);
//       const day = startOfWeek.getDay();
//       const diff = day >= 6 ? day - 6 : day + 1;

//       startOfWeek.setDate(startOfWeek.getDate() - diff);

//       const { sales, total } = await getSalesAndTotal(startOfWeek, now, order);

//       // return res.status(200).json({
//       //   total,
//       //   page: parseInt(page),
//       //   pages: Math.ceil(total / limit),
//       //   sales,
//       // });
//       return res.status(200).json(sales);
//     }

//     // Monthly sales:
//     if (date && date === "m") {
//       const now = new Date();
//       const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//       const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

//       const { sales, total } = await getSalesAndTotal(
//         startOfMonth,
//         endOfMonth,
//         order,
//       );

//       return res.status(200).json(sales);
//       // return res.status(200).json({
//       //   total,
//       //   page: parseInt(page),
//       //   pages: Math.ceil(total / limit),
//       //   sales,
//       // });
//     }

//     // Yearly sales:
//     if (date && date === "y") {
//       const now = new Date();
//       const startOfYear = new Date(now.getFullYear(), 0, 1);
//       const endOfYear = new Date(now.getFullYear() + 1, 0, 1);

//       const { sales, total } = await getSalesAndTotal(
//         startOfYear,
//         endOfYear,
//         order,
//       );

//       return res.status(200).json(sales);
//       // return res.status(200).json({
//       //   total,
//       //   page: parseInt(page),
//       //   pages: Math.ceil(total / limit),
//       //   sales,
//       // });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

// module.exports.searchByIndividualDate = async (req, res) => {
//   try {
//     const {
//       dateMode,
//       dateSearch = "",
//       dateSearchStart = "",
//       dateSearchEnd = "",
//       productName,
//       customerName,
//       order = -1,
//     } = req.query;

//     const searchQuery = [];
//     let dateSearchQuery;
//     let productNameSearchQuery;
//     let customerNameSearchQuery;

//     // For date search:
//     if (dateMode === "range") {
//       if (dateSearchStart && dateSearchEnd) {
//         const startDate = new Date(dateSearchStart);
//         const endDate = new Date(dateSearchEnd);

//         dateSearchQuery = {
//           createdAt: { $gte: startDate, $lte: endDate },
//         };
//         searchQuery.push(dateSearchQuery);
//       }
//     } else if (dateMode === "single") {
//       if (dateSearch) {
//         const startOfDay = new Date(dateSearch);
//         startOfDay.setHours(0, 0, 0, 0);

//         const endOfDay = new Date(dateSearch);
//         endOfDay.setHours(23, 59, 59, 999);

//         dateSearchQuery = {
//           createdAt: { $gte: startOfDay, $lte: endOfDay },
//         };
//         searchQuery.push(dateSearchQuery);
//       }
//     }

//     if (productName) {
//       productNameSearchQuery = {
//         "products.productName": { $regex: productName, $options: "i" },
//       };

//       searchQuery.push(productNameSearchQuery);
//     }

//     if (customerName) {
//       customerNameSearchQuery = {
//         customerName: { $regex: customerName, $options: "i" },
//       };

//       searchQuery.push(customerNameSearchQuery);
//     }

//     const mainSearch = { $and: searchQuery };

//     const sales = await Sales.find(mainSearch).sort({
//       createdAt: parseInt(order),
//     });

//     res.status(201).json(sales);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

// module.exports.searchById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const sale = await Sales.findById(id);

//     res.status(201).json(sale);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

// module.exports.addPayment = async (req, res) => {
//   const session = await mongoose.startSession();

//   const { id } = req.params;
//   const { date, amount, unchangedAmount } = req.body;

//   try {
//     session.startTransaction();
//     const sale = await Sales.findById(id).session(session);

//     if (sale) {
//       const {
//         invoiceNo,
//         remarks,
//         products,
//         salesReturnId,
//         transactionRecords,
//         totalWithoutDiscount,
//         total,
//         totalCost,
//         discount,
//         due,
//         cash,
//         exchange,
//         paid,
//         createdAt,
//         updatedAt,
//         _id,
//         ...transactionDetail
//       } = sale.toObject();

//       const unchangedPaid = Number(new Decimal(unchangedAmount).toFixed(4));
//       const unchangedDue = Number(
//         new Decimal(due).minus(new Decimal(unchangedAmount)).toFixed(4),
//       );

//       const refMemo = "REF-" + invoiceNo;
//       const paidAmount = Number(new Decimal(amount).toFixed(4));
//       // sale.paid = sale.paid + amount;
//       sale.paid = Number(
//         new Decimal(sale.paid).plus(new Decimal(amount)).toFixed(4),
//       );

//       const amountToBePaid = due;
//       // sale.due = sale.due - amount;
//       sale.due = Number(
//         new Decimal(sale.due).minus(new Decimal(amount)).toFixed(4),
//       );
//       const currentDue = sale.due;

//       // transaction creation
//       const transaction = new SalesTransaction({
//         ...transactionDetail,
//         refMemo,
//         amountToBePaid,
//         paidAmount,
//         date: createCustomDate(date),
//         currentDue,
//         salesId: sale._id,
//         unchangedPaid,
//         unchangedDue,
//       });
//       await transaction.save({ session });

//       sale.transactionRecords.push(transaction._id);
//       await sale.save({ session });

//       // Commit
//       await session.commitTransaction();
//       session.endSession();

//       res.status(201).json({ message: "Payment updated successfully" });
//     } else {
//       res.status(404).json({ message: "Sale not found" });
//     }
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();

//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

// module.exports.getTotalSaleCount = async (req, res) => {
//   try {
//     const count = await Sales.countDocuments();

//     res.status(201).json(count);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

// module.exports.salesByCustomerName = async (req, res) => {
//   try {
//     const { page = 1, dateSearch = "", customerName = "" } = req.query;

//     let searchQuery = [];
//     let nameSearchQuery = { customerName };
//     searchQuery.push(nameSearchQuery);

//     let dateSearchQuery;
//     // For date search:
//     if (dateSearch) {
//       const startOfDay = new Date(dateSearch);
//       startOfDay.setHours(0, 0, 0, 0);

//       const endOfDay = new Date(dateSearch);
//       endOfDay.setHours(23, 59, 59, 999);

//       dateSearchQuery = {
//         date: { $gte: startOfDay, $lte: endOfDay },
//       };
//       searchQuery.push(dateSearchQuery);
//     }

//     const mainSearch = { $and: searchQuery };

//     // const limit = 10;

//     // Pagination
//     // const skip = (parseInt(page) - 1) * limit;

//     const transactions = await SalesTransaction.find(mainSearch)
//       .sort({ date: -1 })
//       .populate("salesId");
//     // .skip(skip)
//     // .limit(limit);

//     // Count total Customer
//     // const total = await Purchase.countDocuments(mainSearch);

//     const result = await Sales.aggregate([
//       {
//         $match: nameSearchQuery,
//       },
//       {
//         $group: {
//           _id: null,
//           totalAmount: { $sum: { $multiply: ["$total", 10000] } },
//           totalPaid: { $sum: { $multiply: ["$paid", 10000] } },
//           totalDue: { $sum: { $multiply: ["$due", 10000] } },
//         },
//       },
//     ]);

//     res.status(201).json({
//       // total,
//       // page: parseInt(page),
//       // pages: Math.ceil(total / limit),
//       transactions,
//       totalAmount: result.length > 0 ? result[0].totalAmount / 10000 : 0,
//       totalPaid: result.length > 0 ? result[0].totalPaid / 10000 : 0,
//       totalDue: result.length > 0 ? result[0].totalDue / 10000 : 0,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

// module.exports.salesDueList = async (req, res) => {
//   try {
//     const { page = 1, order = -1 } = req.query;

//     const limit = 15;
//     const skip = (parseInt(page) - 1) * limit;

//     const sales = await Sales.find({ due: { $gt: 0 } })
//       .sort({ createdAt: parseInt(order) })
//       .skip(skip)
//       .limit(limit);

//     // Count total documents
//     const total = await Sales.countDocuments({ due: { $gt: 0 } });

//     res.status(201).json({
//       total,
//       page: parseInt(page),
//       pages: Math.ceil(total / limit),
//       sales,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

// async function getSalesAndTotal(start, end, order, skip, limit) {
//   const sales = await Sales.find({
//     createdAt: { $gte: start, $lte: end },
//   }).sort({ createdAt: parseInt(order) });
//   // .skip(skip)
//   // .limit(limit);

//   const total = await Sales.countDocuments({
//     createdAt: { $gte: start, $lte: end },
//   });

//   return { sales, total };
// }

const Sales = require("../models/Sales");
const Product = require("../models/Product");
const SalesTransaction = require("../models/SalesTransaction");
const Decimal = require("decimal.js");
const mongoose = require("mongoose");
const { createCustomDate } = require("../utils/createCustomDate");
const ProductExchange = require("../models/ProductExchange");

// ১. সকল সেলস লিস্ট দেখার জন্য
module.exports.index = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 10;
    const skip = (parseInt(page) - 1) * limit;

    const sales = await Sales.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Sales.countDocuments({});

    res.status(200).json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      sales,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// ২. নতুন সেলস তৈরি করার মেইন ফাংশন
// module.exports.createSales = async (req, res) => {
//   const session = await mongoose.startSession();
//   try {
//     const salesData = req.body;
//     const {
//       exchangeMemoId,
//       invoiceNo,
//       products,
//       total,
//       due,
//       paid,
//       ...transactionDetail
//     } = salesData;

//     session.startTransaction();

//     // ১. Transaction Creation
//     const transactionDetails = {
//       ...transactionDetail,
//       refMemo: invoiceNo,
//       amountToBePaid: total,
//       paidAmount: paid,
//       date: new Date(),
//       currentDue: due,
//       unchangedPaid: 0,
//       unchangedDue: 0,
//     };
//     const transaction = new SalesTransaction(transactionDetails);

//     // ২. Sales creation
//     const sale = new Sales({
//       ...salesData,
//       transactionRecords: [transaction._id],
//     });

//     transaction.salesId = sale._id;
//     await transaction.save({ session });

//     // ৩. Product stock update
//     if (products && products.length > 0) {
//       for (let i = 0; i < products.length; i++) {
//         const { productName, quantity } = products[i];
//         const product = await Product.findOne({ name: productName }).session(session);

//         if (!product) {
//           throw new Error(`Product not found: ${productName}`);
//         }

//         product.quantity = product.quantity - quantity;
//         await product.save({ session });
//       }
//     }

//     // ৪. Exchange memo logic
//     if (exchangeMemoId && salesData.exchange > 0) {
//       const memoData = await ProductExchange.findById(exchangeMemoId).session(session);

//       if (memoData) {
//         const currentBalance = new Decimal(memoData.remainingBalance);
//         const usedAmount = new Decimal(salesData.exchange);
//         let newBalance = Number(currentBalance.minus(usedAmount).toFixed(4));

//         if (newBalance < 0) newBalance = 0;
//         memoData.remainingBalance = newBalance;
//         await memoData.save({ session });
//       }
//     }

//     const createdSale = await sale.save({ session });

//     await session.commitTransaction();
//     session.endSession();

//     res.status(201).json(createdSale);
//   } catch (error) {
//     if (session.inAtomicityPlaceholder) {
//       await session.abortTransaction();
//     }
//     session.endSession();
//     console.error("Sales Error:", error.message);
//     res.status(500).json({ message: error.message || "Server Error" });
//   }
// };

// ২. নতুন সেলস তৈরি করার মেইন ফাংশন (Updated)
module.exports.createSales = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const salesData = req.body;
    const {
      exchangeMemoId,
      exchangeDetails, // ফ্রন্টএন্ড থেকে পাঠানো হবে
      invoiceNo,
      products,
      total,
      due,
      paid,
      ...transactionDetail
    } = salesData;

    session.startTransaction();

    // ১. Transaction Creation
    const transactionDetails = {
      ...transactionDetail,
      refMemo: invoiceNo,
      amountToBePaid: total,
      paidAmount: paid,
      date: new Date(),
      currentDue: due,
      unchangedPaid: 0,
      unchangedDue: 0,
    };
    const transaction = new SalesTransaction(transactionDetails);

    // ২. Sales creation (এখন এখানে exchangeDetails ও সেভ হবে)
    const sale = new Sales({
      ...salesData,
      transactionRecords: [transaction._id],
    });

    transaction.salesId = sale._id;
    await transaction.save({ session });

    // ৩. Product stock update
    if (products && products.length > 0) {
      for (let i = 0; i < products.length; i++) {
        const { productName, quantity } = products[i];
        const product = await Product.findOne({ name: productName }).session(session);

        if (!product) {
          throw new Error(`Product not found: ${productName}`);
        }

        product.quantity = product.quantity - quantity;
        await product.save({ session });
      }
    }

    // ৪. Exchange memo logic (ব্যালেন্স কমানোর লজিক আগের মতই থাকবে)
    if (exchangeMemoId && salesData.exchange > 0) {
      const memoData = await ProductExchange.findById(exchangeMemoId).session(session);

      if (memoData) {
        const currentBalance = new Decimal(memoData.remainingBalance);
        const usedAmount = new Decimal(salesData.exchange);
        let newBalance = Number(currentBalance.minus(usedAmount).toFixed(4));

        if (newBalance < 0) newBalance = 0;
        memoData.remainingBalance = newBalance;
        await memoData.save({ session });
      }
    }

    const createdSale = await sale.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(createdSale);
  } catch (error) {
    if (session.inTransaction()) { // সংশোধিত চেক
      await session.abortTransaction();
    }
    session.endSession();
    console.error("Sales Error:", error.message);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// ৩. তারিখ অনুযায়ী সার্চ (Report Fix)
module.exports.searchByDates = async (req, res) => {
  try {
    const { date, order = -1 } = req.query;
    if (!date) return res.status(400).json({ message: "Invalid Dates!" });

    let start, end;
    const now = new Date();

    if (date === "t") { // Today
      start = new Date(); start.setHours(0, 0, 0, 0);
      end = new Date(); end.setHours(23, 59, 59, 999);
    } else if (date === "w") { // Weekly
      start = new Date(now);
      const day = start.getDay();
      const diff = day >= 6 ? day - 6 : day + 1;
      start.setDate(start.getDate() - diff);
      start.setHours(0, 0, 0, 0);
      end = new Date(); end.setHours(23, 59, 59, 999);
    } else if (date === "m") { // Monthly
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (date === "y") { // Yearly
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    }

    const { sales } = await getSalesAndTotal(start, end, order);
    res.status(200).json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// ৪. কাস্টম ডেট বা নাম দিয়ে সার্চ
module.exports.searchByIndividualDate = async (req, res) => {
  try {
    const { dateMode, dateSearch, dateSearchStart, dateSearchEnd, productName, customerName, order = -1 } = req.query;
    const searchQuery = [];

    if (dateMode === "range" && dateSearchStart && dateSearchEnd) {
      searchQuery.push({ createdAt: { $gte: new Date(dateSearchStart), $lte: new Date(dateSearchEnd) } });
    } else if (dateMode === "single" && dateSearch) {
      const s = new Date(dateSearch); s.setHours(0, 0, 0, 0);
      const e = new Date(dateSearch); e.setHours(23, 59, 59, 999);
      searchQuery.push({ createdAt: { $gte: s, $lte: e } });
    }

    if (productName) searchQuery.push({ "products.productName": { $regex: productName, $options: "i" } });
    if (customerName) searchQuery.push({ customerName: { $regex: customerName, $options: "i" } });

    const mainSearch = searchQuery.length > 0 ? { $and: searchQuery } : {};
    const sales = await Sales.find(mainSearch).sort({ createdAt: parseInt(order) });
    res.status(200).json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// ৫. আইডি দিয়ে সার্চ
module.exports.searchById = async (req, res) => {
  try {
    const sale = await Sales.findById(req.params.id);
    res.status(200).json(sale);
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

// ৬. পেমেন্ট আপডেট (Add Payment)
module.exports.addPayment = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { id } = req.params;
    const { date, amount, unchangedAmount } = req.body;

    session.startTransaction();
    const sale = await Sales.findById(id).session(session);

    if (!sale) return res.status(404).json({ message: "Sale not found" });

    const saleObj = sale.toObject();
    const { invoiceNo, due, paid, products, transactionRecords, ...transactionDetail } = saleObj;

    const paidAmount = Number(new Decimal(amount).toFixed(4));
    sale.paid = Number(new Decimal(sale.paid).plus(new Decimal(amount)).toFixed(4));
    sale.due = Number(new Decimal(sale.due).minus(new Decimal(amount)).toFixed(4));

    const transaction = new SalesTransaction({
      ...transactionDetail,
      refMemo: "REF-" + invoiceNo,
      amountToBePaid: due,
      paidAmount,
      date: createCustomDate(date),
      currentDue: sale.due,
      salesId: sale._id,
      unchangedPaid: Number(new Decimal(unchangedAmount).toFixed(4)),
      unchangedDue: Number(new Decimal(due).minus(new Decimal(unchangedAmount)).toFixed(4)),
    });

    await transaction.save({ session });
    sale.transactionRecords.push(transaction._id);
    await sale.save({ session });

    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: "Payment updated successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).send("Server Error");
  }
};

// ৭. টোটাল সেলস কাউন্ট
module.exports.getTotalSaleCount = async (req, res) => {
  try {
    const count = await Sales.countDocuments();
    res.status(200).json(count);
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

// ৮. কাস্টমার অনুযায়ী সেলস ও সামারি (Report logic optimized)
module.exports.salesByCustomerName = async (req, res) => {
  try {
    const { dateSearch, customerName } = req.query;
    let matchQuery = { customerName: customerName };

    if (dateSearch) {
      const s = new Date(dateSearch); s.setHours(0, 0, 0, 0);
      const e = new Date(dateSearch); e.setHours(23, 59, 59, 999);
      matchQuery.createdAt = { $gte: s, $lte: e };
    }

    const transactions = await SalesTransaction.find(matchQuery).sort({ date: -1 }).populate("salesId");

    const result = await Sales.aggregate([
      { $match: { customerName: customerName } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$total" },
          totalPaid: { $sum: "$paid" },
          totalDue: { $sum: "$due" },
        },
      },
    ]);

    res.status(200).json({
      transactions,
      totalAmount: result.length > 0 ? result[0].totalAmount : 0,
      totalPaid: result.length > 0 ? result[0].totalPaid : 0,
      totalDue: result.length > 0 ? result[0].totalDue : 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// ৯. ডিউ লিস্ট
module.exports.salesDueList = async (req, res) => {
  try {
    const { page = 1, order = -1 } = req.query;
    const limit = 15;
    const skip = (parseInt(page) - 1) * limit;

    const sales = await Sales.find({ due: { $gt: 0 } }).sort({ createdAt: parseInt(order) }).skip(skip).limit(limit);
    const total = await Sales.countDocuments({ due: { $gt: 0 } });

    res.status(200).json({ total, page: parseInt(page), pages: Math.ceil(total / limit), sales });
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

// হেল্পার ফাংশন
async function getSalesAndTotal(start, end, order) {
  const sales = await Sales.find({ createdAt: { $gte: start, $lte: end } }).sort({ createdAt: parseInt(order) });
  const total = await Sales.countDocuments({ createdAt: { $gte: start, $lte: end } });
  return { sales, total };
}