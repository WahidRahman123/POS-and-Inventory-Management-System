// const { default: mongoose } = require("mongoose");
// const CompanySalesReturn = require("../models/CompanySalesReturn");
// const Decimal = require("decimal.js");
// const CompanySalesReturnTransaction = require("../models/CompanySalesReturnTransaction");
// const { createCustomDate } = require("../utils/createCustomDate");
// const { getNextSequenceForOther } = require("../utils/getNextSequenceForOther");
// const SalesReturn = require("../models/SalesReturn");
// const Product = require("../models/Product");
// const SalesReturnStockManagement = require("../models/SalesReturnStockManagement");

// module.exports.index = async (req, res) => {
//   try {
//     const {
//       memoSearch = "",
//       page = 1,
//       // order = -1,
//     } = req.query;

//     let searchQuery = [];
//     let memoSearchQuery;

//     // For memo search:
//     if (memoSearch) {
//       memoSearchQuery = { memo: { $regex: memoSearch, $options: "i" } };
//       searchQuery.push(memoSearchQuery);
//     }

//     const mainSearch = searchQuery.length !== 0 ? { $and: searchQuery } : {};

//     const limit = 10;

//     // Pagination
//     const skip = (parseInt(page) - 1) * limit;

//     const companySalesReturns = await CompanySalesReturn.find(mainSearch)
//       .skip(skip)
//       .limit(limit);

//     // Count total documents
//     const total = await CompanySalesReturn.countDocuments(mainSearch);

//     res.status(201).json({
//       total,
//       page: parseInt(page),
//       pages: Math.ceil(total / limit),
//       companySalesReturns,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

// module.exports.createCompanySalesReturn = async (req, res) => {
//   // const session = await mongoose.startSession();
//   try {
//     const returns = req.body;
//     // const { memo } = purchases;
//     const {
//       createdAt,
//       issuedAt,
//       products,
//       // productName,
//       // quantity,
//       // qtyInKg,
//       // unitPrice,
//       // subTotal,
//       totalAmount,
//       paid,
//       due,
//       totalAmountQty,
//       paidQty,
//       dueQty,
//       // memo,
//       ...transactionDetail
//     } = returns;

//     // session.startTransaction();

//     //* Generate the memo
//     // const count = await getNextSequenceForOther("CompanySalesReturn", session);
//     const count = await getNextSequenceForOther("CompanySalesReturn");
//     if (!count) {
//       throw new Error("Failed to generate sequence");
//     }
//     const memo = "CSR-" + count.seq;

//     const payDetails = [{ productName: "", quantity: 0 }];

//     //* Transaction Creation
//     const transactionDetails = {
//       ...transactionDetail,
//       refMemo: memo,
//       amountToBePaid: totalAmountQty,
//       paidAmount: paidQty,
//       date: createdAt,
//       payDetails,
//       currentDue: dueQty,
//     };
//     const transaction = new CompanySalesReturnTransaction(transactionDetails);

//     //* Company Sales Return creation
//     const companySalesReturn = new CompanySalesReturn({
//       ...returns,
//       memo,
//       transactionRecords: [transaction._id],
//     });

//     transaction.companySalesReturnId = companySalesReturn._id;
//     // await transaction.save({ session });
//     await transaction.save();

//     // const createdCompanySalesReturn = await companySalesReturn.save({
//     //   session,
//     // });
//     const createdCompanySalesReturn = await companySalesReturn.save();

//     //* Eta completely company sales return er searching ta handle korar jonno (ekhane tempReturnQuantity update korbo khali, returnQuantity te haat deoar dorkar nei)
//     for (const product of products) {
//       const salesReturnStockSearchData = await SalesReturnStockManagement.findOne({ productId: product.productId });

//       salesReturnStockSearchData.tempReturnQuantity -= product.quantity;
//       salesReturnStockSearchData.tempReturnQtyInKg -= product.qtyInKg;
      
//       await salesReturnStockSearchData.save();
//     }

//     // Commit
//     // await session.commitTransaction();
//     // session.endSession();

//     res.status(201).json(createdCompanySalesReturn);
//   } catch (error) {
//     // await session.abortTransaction();
//     // session.endSession();

//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

// module.exports.searchById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const companySalesReturn = await CompanySalesReturn.findById(id)
//       .populate({
//         path: "transactionRecords",
//         select: "payDetails",
//       })
//       .lean();

//     if (!companySalesReturn)
//       return res.status(409).json({ message: "Invalid ID!" });

//     //* paid quantity map
//     const paidMap = {};

//     companySalesReturn.transactionRecords.forEach((trx) => {
//       trx.payDetails.forEach((item) => {
//         const productName = item.productName;

//         if (!paidMap[productName]) {
//           paidMap[productName] = 0;
//         }

//         paidMap[productName] += item.quantity || 0;
//       });
//     });

//     //* calculate remaining quantity
//     const products = companySalesReturn.products.map((product) => {
//       const paidQty = paidMap[product.productName] || 0;

//       return {
//         ...product,
//         alreadyPaidQty: paidQty,
//         availableQty: product.quantity - paidQty,
//       };
//     });

//     //* only remaining products
//     companySalesReturn.products = products.filter((p) => p.availableQty > 0);

//     if (companySalesReturn.products.length === 0) {
//       return res.status(409).json({
//         message: "All quantities already adjusted!",
//       });
//     }

//     return res.status(200).json(companySalesReturn);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

// module.exports.addPayment = async (req, res) => {
//   // const session = await mongoose.startSession();

//   const { id } = req.params;
//   const { date, amount, payDetails, unchangedAmount } = req.body;

//   try {
//     // session.startTransaction();
//     // const companySalesReturn =
//     //   await CompanySalesReturn.findById(id).session(session);
//     const companySalesReturn = await CompanySalesReturn.findById(id);

//     if (companySalesReturn) {
//       const {
//         createdAt,
//         issuedAt,
//         products,
//         // productName,
//         // quantity,
//         // qtyInKg,
//         // unitPrice,
//         // subTotal,
//         transactionRecords,
//         totalAmount,
//         paid,
//         due,

//         totalAmountQty,
//         paidQty,
//         dueQty,

//         memo,
//         _id,
//         ...transactionDetail
//       } = companySalesReturn.toObject();

//       const unchangedPaid = Number(new Decimal(unchangedAmount).toFixed(4));
//       const unchangedDue = Number(
//         new Decimal(dueQty).minus(new Decimal(unchangedAmount)).toFixed(4),
//       );

//       const refMemo = "REF-" + memo;
//       const paidAmount = Number(new Decimal(amount).toFixed(4));
//       // companySalesReturn.paid = companySalesReturn.paid + amount;
//       companySalesReturn.paidQty = Number(
//         new Decimal(paidQty).plus(new Decimal(amount)).toFixed(4),
//       );

//       const amountToBePaid = dueQty;
//       // companySalesReturn.dueQty = companySalesReturn.dueQty - amount;
//       companySalesReturn.dueQty = Number(
//         new Decimal(dueQty).minus(new Decimal(amount)).toFixed(4),
//       );
//       const currentDue = companySalesReturn.dueQty;

//       // transaction creation
//       const transaction = new CompanySalesReturnTransaction({
//         ...transactionDetail,
//         refMemo,
//         amountToBePaid,
//         paidAmount,
//         date: createCustomDate(date),
//         currentDue,
//         payDetails,
//         companySalesReturnId: companySalesReturn._id,
//         unchangedPaid,
//         unchangedDue,
//       });
//       // await transaction.save({ session });
//       await transaction.save();

//       companySalesReturn.transactionRecords.push(transaction._id);
//       // await companySalesReturn.save({ session });
//       await companySalesReturn.save();

//       if (payDetails && payDetails.length > 0) {
//         for (let i = 0; i < payDetails.length; i++) {
//           const { productName, quantity } = payDetails[i];
//           // const product = await Product.findOne({ name: productName }).session(
//           //   session,
//           // );
//           const product = await Product.findOne({ name: productName });

//           if (!product) {
//             throw new Error(`Product not found: ${productName}`);
//           }

//           product.quantity = product.quantity + quantity;
//           // await product.save({ session });
//           await product.save();
//         }
//       }

//       // Commit
//       // await session.commitTransaction();
//       // session.endSession();

//       res.status(201).json({ message: "Payment updated successfully" });
//     } else {
//       res.status(404).json({ message: "Not found" });
//     }
//   } catch (error) {
//     // await session.abortTransaction();
//     // session.endSession();

//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

// module.exports.companySalesReturnStatement = async (req, res) => {
//   try {
//     const { page = 1, dateSearch = "", supplierName = "" } = req.query;

//     let searchQuery = [];
//     let nameSearchQuery = { supplierName };
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

//     const transactions = await CompanySalesReturnTransaction.find(mainSearch)
//       .sort({ date: -1 })
//       .populate("companySalesReturnId");

//     const result = await CompanySalesReturn.aggregate([
//       {
//         $match: nameSearchQuery,
//       },
//       {
//         $group: {
//           _id: null,
//           totalAmount: { $sum: "$totalAmountQty" },
//           totalPaid: { $sum: "$paidQty" },
//           totalDue: { $sum: "$dueQty" },
//         },
//       },
//     ]);

//     res.status(201).json({
//       transactions,
//       totalAmount: result.length > 0 ? result[0].totalAmount : 0,
//       totalPaid: result.length > 0 ? result[0].totalPaid : 0,
//       totalDue: result.length > 0 ? result[0].totalDue : 0,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

// module.exports.salesReturnReport = async (req, res) => {
//   try {
//     const salesReturn = await SalesReturn.aggregate([
//       {
//         $facet: {
//           total: [
//             {
//               $unwind: "$products",
//             },
//             {
//               $group: {
//                 _id: null,
//                 totalSentItems: { $sum: "$products.returnQuantity" },
//                 totalWeight: { $sum: "$products.returnQtyInKg" },
//               },
//             },
//           ],

//           totalAmount: [
//             {
//               $group: {
//                 _id: null,
//                 totalAmount: {
//                   $sum: { $multiply: ["$totalReturnValue", 10000] },
//                 },
//               },
//             },
//           ],
//         },
//       },
//     ]);

//     const transactionData = await CompanySalesReturnTransaction.aggregate([
//       {
//         $group: {
//           _id: null,
//           transactiontotalSentItems: { $sum: "$paidAmount" },
//         },
//       },
//     ]);

//     const result = await CompanySalesReturn.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalDue: { $sum: "$dueQty" },
//         },
//       },
//     ]);

//     const transactionSentItems =
//       transactionData[0]?.transactiontotalSentItems || 0;

//     const companyData = await CompanySalesReturn.find();

//     const totalCompanyWeight =
//       companyData && companyData.length
//         ? companyData.reduce((acc, p) => acc + p.qtyInKg, 0)
//         : 0;

//     res.status(201).json({
//       totalSentItems:
//         salesReturn[0].total.length > 0
//           ? salesReturn[0].total[0].totalSentItems - transactionSentItems
//           : 0,
//       totalWeight:
//         salesReturn[0].total.length > 0
//           ? salesReturn[0].total[0].totalWeight - totalCompanyWeight
//           : 0,
//       totalAmount:
//         salesReturn[0].total.length > 0
//           ? salesReturn[0].totalAmount[0].totalAmount / 10000
//           : 0,
//       totalDue: result.length > 0 ? result[0].totalDue : 0,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

// module.exports.salesReturnStockSearchedByProductName = async (req, res) => {
//   try {
//     const { productName } = req.query;
//     const salesReturnStockSearchData = await SalesReturnStockManagement.find({
//       $and: [
//         { productName: { $regex: productName, $options: "i" } },
//         { tempReturnQuantity: { $gt: 0 } },
//       ],
//     });

//     res.status(201).json(salesReturnStockSearchData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

// const { default: mongoose } = require("mongoose");
// const CompanySalesReturn = require("../models/CompanySalesReturn");
// const Decimal = require("decimal.js");
// const CompanySalesReturnTransaction = require("../models/CompanySalesReturnTransaction");
// const { createCustomDate } = require("../utils/createCustomDate");
// const { getNextSequenceForOther } = require("../utils/getNextSequenceForOther");
// const SalesReturn = require("../models/SalesReturn");
// const Product = require("../models/Product");
// const SalesReturnStockManagement = require("../models/SalesReturnStockManagement");

// module.exports.index = async (req, res) => {
//   try {
//     const { memoSearch = "", page = 1 } = req.query;
//     let searchQuery = [];
//     let memoSearchQuery;

//     if (memoSearch) {
//       memoSearchQuery = { memo: { $regex: memoSearch, $options: "i" } };
//       searchQuery.push(memoSearchQuery);
//     }

//     const mainSearch = searchQuery.length !== 0 ? { $and: searchQuery } : {};
//     const limit = 10;
//     const skip = (parseInt(page) - 1) * limit;

//     const companySalesReturns = await CompanySalesReturn.find(mainSearch).skip(skip).limit(limit);
//     const total = await CompanySalesReturn.countDocuments(mainSearch);

//     res.status(201).json({
//       total,
//       page: parseInt(page),
//       pages: Math.ceil(total / limit),
//       companySalesReturns,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

// module.exports.createCompanySalesReturn = async (req, res) => {
//   try {
//     const returns = req.body;
//     const {
//       createdAt,
//       issuedAt,
//       products,
//       totalAmount,
//       paid,
//       due,
//       totalAmountQty,
//       paidQty,
//       dueQty,
//       ...transactionDetail
//     } = returns;

//     const count = await getNextSequenceForOther("CompanySalesReturn");
//     if (!count) {
//       throw new Error("Failed to generate sequence");
//     }
//     const memo = "CSR-" + count.seq;
//     const payDetails = [{ productName: "", quantity: 0 }];

//     const transactionDetails = {
//       ...transactionDetail,
//       refMemo: memo,
//       amountToBePaid: totalAmountQty,
//       paidAmount: paidQty,
//       date: createdAt,
//       payDetails,
//       currentDue: dueQty,
//     };
//     const transaction = new CompanySalesReturnTransaction(transactionDetails);

//     const companySalesReturn = new CompanySalesReturn({
//       ...returns,
//       memo,
//       transactionRecords: [transaction._id],
//     });

//     transaction.companySalesReturnId = companySalesReturn._id;
//     await transaction.save();
//     const createdCompanySalesReturn = await companySalesReturn.save();

//     for (const product of products) {
//       const salesReturnStockSearchData = await SalesReturnStockManagement.findOne({ productId: product.productId });
//       salesReturnStockSearchData.tempReturnQuantity -= product.quantity;
//       salesReturnStockSearchData.tempReturnQtyInKg -= product.qtyInKg;
//       await salesReturnStockSearchData.save();
//     }

//     res.status(201).json(createdCompanySalesReturn);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

// module.exports.searchById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const companySalesReturn = await CompanySalesReturn.findById(id)
//       .populate({
//         path: "transactionRecords",
//         select: "payDetails",
//       })
//       .lean();

//     if (!companySalesReturn)
//       return res.status(409).json({ message: "Invalid ID!" });

//     const paidMap = {};
//     companySalesReturn.transactionRecords.forEach((trx) => {
//       trx.payDetails.forEach((item) => {
//         const productName = item.productName;
//         if (!paidMap[productName]) {
//           paidMap[productName] = 0;
//         }
//         paidMap[productName] += item.quantity || 0;
//       });
//     });

//     const products = companySalesReturn.products.map((product) => {
//       const paidQty = paidMap[product.productName] || 0;
//       return {
//         ...product,
//         alreadyPaidQty: paidQty,
//         availableQty: product.quantity - paidQty,
//       };
//     });

//     companySalesReturn.products = products.filter((p) => p.availableQty > 0);

//     if (companySalesReturn.products.length === 0) {
//       return res.status(409).json({
//         message: "All quantities already adjusted!",
//       });
//     }

//     return res.status(200).json(companySalesReturn);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

// // ================== UPDATED AND RECONSTRUCTED addPayment ==================
// module.exports.addPayment = async (req, res) => {
//   const { id } = req.params;
//   const { date, amount, receiveAmount, payDetails, unchangedAmount } = req.body;

//   try {
//     const companySalesReturn = await CompanySalesReturn.findById(id);

//     if (!companySalesReturn) {
//       return res.status(404).json({ message: "Not found" });
//     }

//     const {
//       dueQty,
//       paidQty,
//       due,
//       paid,
//       memo,
//       ...transactionDetail
//     } = companySalesReturn.toObject();

//     // ১. কোয়ান্টিটি আপডেট (সর্বোচ্চ লিমিট ফ্রন্টএন্ডেই ভ্যালিডেটেড)
//     const receiveQty = Number(amount);
//     companySalesReturn.paidQty = Number(new Decimal(paidQty).plus(new Decimal(receiveQty)).toFixed(4));
//     companySalesReturn.dueQty = Number(new Decimal(dueQty).minus(new Decimal(receiveQty)).toFixed(4));

//     // ২. টাকার অ্যামাউন্ট আপডেট (যা ডাটাবেজে প্লাস-মাইনাস হয়ে ট্র্যাকিং ঠিক রাখবে)
//     const currentReceiveAmount = Number(receiveAmount || 0);
    
//     // মেইন মেমোতে আগে due না থাকলেও বা ০ থাকলেও কারেন্টলি রিসিভড অ্যামাউন্ট সেভ হবে
//     const existingDue = Number(due || 0);
//     const existingPaid = Number(paid || 0);

//     companySalesReturn.paid = Number(new Decimal(existingPaid).plus(new Decimal(currentReceiveAmount)).toFixed(4));
//     companySalesReturn.due = Number(new Decimal(existingDue).minus(new Decimal(currentReceiveAmount)).toFixed(4));

//     // ৩. ট্রানজেকশনের ওল্ড হিস্ট্রি ডেটা
//     const unchangedPaid = Number(new Decimal(unchangedAmount).toFixed(4));
//     const unchangedDue = Number(new Decimal(dueQty).minus(new Decimal(unchangedAmount)).toFixed(4));
//     const refMemo = "REF-" + memo;

//     // ৪. ট্রানজেকশন রেকর্ড তৈরি
//     const transaction = new CompanySalesReturnTransaction({
//       ...transactionDetail,
//       refMemo,
//       amountToBePaid: dueQty,
//       paidAmount: receiveQty,
//       date: createCustomDate(date),
//       currentDue: companySalesReturn.dueQty,
//       payDetails, 
//       companySalesReturnId: companySalesReturn._id,
//       unchangedPaid,
//       unchangedDue,
//     });
    
//     await transaction.save();

//     // ৫. কোম্পানি রিটার্ন ডক আপডেট
//     companySalesReturn.transactionRecords.push(transaction._id);
//     await companySalesReturn.save();

//     // ৬. স্টক ম্যানেজমেন্ট আপডেট
//     if (payDetails && payDetails.length > 0) {
//       for (let i = 0; i < payDetails.length; i++) {
//         const { productName, quantity } = payDetails[i];
//         const product = await Product.findOne({ name: productName });

//         if (!product) {
//           throw new Error(`Product not found: ${productName}`);
//         }

//         product.quantity = product.quantity + Number(quantity);
//         await product.save();
//       }
//     }

//     res.status(201).json({ message: "Payment and Stock updated successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(error.message || "Server Error");
//   }
// };
// module.exports.companySalesReturnStatement = async (req, res) => {
//   try {
//     const { page = 1, dateSearch = "", supplierName = "" } = req.query;
//     let searchQuery = [];
//     let nameSearchQuery = { supplierName };
//     searchQuery.push(nameSearchQuery);

//     let dateSearchQuery;
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
//     const transactions = await CompanySalesReturnTransaction.find(mainSearch)
//       .sort({ date: -1 })
//       .populate("companySalesReturnId");

//     const result = await CompanySalesReturn.aggregate([
//       { $match: nameSearchQuery },
//       {
//         $group: {
//           _id: null,
//           totalAmount: { $sum: "$totalAmountQty" },
//           totalPaid: { $sum: "$paidQty" },
//           totalDue: { $sum: "$dueQty" },
//         },
//       },
//     ]);

//     res.status(201).json({
//       transactions,
//       totalAmount: result.length > 0 ? result[0].totalAmount : 0,
//       totalPaid: result.length > 0 ? result[0].totalPaid : 0,
//       totalDue: result.length > 0 ? result[0].totalDue : 0,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

// module.exports.salesReturnReport = async (req, res) => {
//   try {
//     const salesReturn = await SalesReturn.aggregate([
//       {
//         $facet: {
//           total: [
//             { $unwind: "$products" },
//             {
//               $group: {
//                 _id: null,
//                 totalSentItems: { $sum: "$products.returnQuantity" },
//                 totalWeight: { $sum: "$products.returnQtyInKg" },
//               },
//             },
//           ],
//           totalAmount: [
//             {
//               $group: {
//                 _id: null,
//                 totalAmount: { $sum: { $multiply: ["$totalReturnValue", 10000] } },
//               },
//             },
//           ],
//         },
//       },
//     ]);

//     const transactionData = await CompanySalesReturnTransaction.aggregate([
//       {
//         $group: {
//           _id: null,
//           transactiontotalSentItems: { $sum: "$paidAmount" },
//         },
//       },
//     ]);

//     const result = await CompanySalesReturn.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalDue: { $sum: "$dueQty" },
//         },
//       },
//     ]);

//     const transactionSentItems = transactionData[0]?.transactiontotalSentItems || 0;
//     const companyData = await CompanySalesReturn.find();
//     const totalCompanyWeight = companyData && companyData.length ? companyData.reduce((acc, p) => acc + p.qtyInKg, 0) : 0;

//     res.status(201).json({
//       totalSentItems: salesReturn[0].total.length > 0 ? salesReturn[0].total[0].totalSentItems - transactionSentItems : 0,
//       totalWeight: salesReturn[0].total.length > 0 ? salesReturn[0].total[0].totalWeight - totalCompanyWeight : 0,
//       totalAmount: salesReturn[0].total.length > 0 ? salesReturn[0].totalAmount[0].totalAmount / 10000 : 0,
//       totalDue: result.length > 0 ? result[0].totalDue : 0,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

// module.exports.salesReturnStockSearchedByProductName = async (req, res) => {
//   try {
//     const { productName } = req.query;
//     const salesReturnStockSearchData = await SalesReturnStockManagement.find({
//       $and: [
//         { productName: { $regex: productName, $options: "i" } },
//         { tempReturnQuantity: { $gt: 0 } },
//       ],
//     });

//     res.status(201).json(salesReturnStockSearchData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

const { default: mongoose } = require("mongoose");
const CompanySalesReturn = require("../models/CompanySalesReturn");
const Decimal = require("decimal.js");
const CompanySalesReturnTransaction = require("../models/CompanySalesReturnTransaction");
const { createCustomDate } = require("../utils/createCustomDate");
const { getNextSequenceForOther } = require("../utils/getNextSequenceForOther");
const SalesReturn = require("../models/SalesReturn");
const Product = require("../models/Product");
const SalesReturnStockManagement = require("../models/SalesReturnStockManagement");

module.exports.index = async (req, res) => {
  try {
    const { memoSearch = "", page = 1 } = req.query;
    let searchQuery = [];
    let memoSearchQuery;

    if (memoSearch) {
      memoSearchQuery = { memo: { $regex: memoSearch, $options: "i" } };
      searchQuery.push(memoSearchQuery);
    }

    const mainSearch = searchQuery.length !== 0 ? { $and: searchQuery } : {};
    const limit = 10;
    const skip = (parseInt(page) - 1) * limit;

    const companySalesReturns = await CompanySalesReturn.find(mainSearch).skip(skip).limit(limit);
    const total = await CompanySalesReturn.countDocuments(mainSearch);

    res.status(201).json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      companySalesReturns,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.createCompanySalesReturn = async (req, res) => {
  try {
    const returns = req.body;
    const {
      createdAt,
      issuedAt,
      products,
      totalAmount,
      paid,
      due,
      totalAmountQty,
      paidQty,
      dueQty,
      ...transactionDetail
    } = returns;

    const count = await getNextSequenceForOther("CompanySalesReturn");
    if (!count) {
      throw new Error("Failed to generate sequence");
    }
    const memo = "CSR-" + count.seq;
    const payDetails = [{ productName: "", quantity: 0 }];

    const transactionDetails = {
      ...transactionDetail,
      refMemo: memo,
      amountToBePaid: totalAmountQty,
      paidAmount: paidQty,
      date: createdAt,
      payDetails,
      currentDue: dueQty,
    };
    const transaction = new CompanySalesReturnTransaction(transactionDetails);

    // প্রথমবার ক্রিয়েট করার সময় dueAmount = totalAmount (যেমন: ৬০,০০০) সেট হবে
    const companySalesReturn = new CompanySalesReturn({
      ...returns,
      memo,
      dueAmount: totalAmount || due || 0,
      transactionRecords: [transaction._id],
    });

    transaction.companySalesReturnId = companySalesReturn._id;
    await transaction.save();
    const createdCompanySalesReturn = await companySalesReturn.save();

    for (const product of products) {
      const salesReturnStockSearchData = await SalesReturnStockManagement.findOne({ productId: product.productId });
      salesReturnStockSearchData.tempReturnQuantity -= product.quantity;
      salesReturnStockSearchData.tempReturnQtyInKg -= product.qtyInKg;
      await salesReturnStockSearchData.save();
    }

    res.status(201).json(createdCompanySalesReturn);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.searchById = async (req, res) => {
  try {
    const { id } = req.params;
    const companySalesReturn = await CompanySalesReturn.findById(id)
      .populate({
        path: "transactionRecords",
        select: "payDetails",
      })
      .lean();

    if (!companySalesReturn)
      return res.status(409).json({ message: "Invalid ID!" });

    const paidMap = {};
    companySalesReturn.transactionRecords.forEach((trx) => {
      trx.payDetails.forEach((item) => {
        const productName = item.productName;
        if (!paidMap[productName]) {
          paidMap[productName] = 0;
        }
        paidMap[productName] += item.quantity || 0;
      });
    });

    const products = companySalesReturn.products.map((product) => {
      const paidQty = paidMap[product.productName] || 0;
      return {
        ...product,
        alreadyPaidQty: paidQty,
        availableQty: product.quantity - paidQty,
      };
    });

    companySalesReturn.products = products.filter((p) => p.availableQty > 0);

    return res.status(200).json(companySalesReturn);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// ================== FIXED & PERFECT BUSINESS LOGIC FOR addPayment ==================
// ================== FIXED & PERFECT BUSINESS LOGIC FOR addPayment ==================
module.exports.addPayment = async (req, res) => {
  const { id } = req.params;
  const { date, amount, receiveAmount, payDetails, unchangedAmount } = req.body;

  try {
    const companySalesReturn = await CompanySalesReturn.findById(id);

    if (!companySalesReturn) {
      return res.status(404).json({ message: "Not found" });
    }

    // ফিক্স: _id এবং __v কে আলাদা করে বের করে নেওয়া হলো যাতে এগুলো transactionDetail-এ না ঢোকে
    const {
      _id,
      __v,
      dueQty,
      paidQty,
      dueAmount,
      totalAmount,
      due,
      paid,
      memo,
      ...transactionDetail
    } = companySalesReturn.toObject();

    // ১. কোয়ান্টিটি মাইনাস লজিক (৫ পিস - ৩ পিস = ২ পিস ডিউ)
    const receiveQty = Number(amount);
    companySalesReturn.paidQty = Number(new Decimal(paidQty).plus(new Decimal(receiveQty)).toFixed(4));
    companySalesReturn.dueQty = Number(new Decimal(dueQty).minus(new Decimal(receiveQty)).toFixed(4));

    // ২. টাকার নিখুঁত ব্যালেন্স মাইনাস লজিক (৬০,০০০ টাকা - ৩৬,০০০ টাকা = ২৪,০০০ টাকা ডিউ)
    const currentReceiveAmount = Number(receiveAmount || 0);
    
    // ওল্ড ডাটায় dueAmount জিরো থাকলে ব্যাকওয়ার্ড সেফটির জন্য মেইন totalAmount বা due কে বেইজ ধরবে
    const currentDueAmountBase = (dueAmount && dueAmount > 0) ? dueAmount : (totalAmount || due || 0);

    // নতুন ডিউ অ্যামাউন্ট = আগের ডিউ অ্যামাউন্ট - বর্তমান রিসিভ করা অ্যামাউন্ট
    const updatedDueAmount = Number(new Decimal(currentDueAmountBase).minus(new Decimal(currentReceiveAmount)).toFixed(4));
    companySalesReturn.dueAmount = updatedDueAmount < 0 ? 0 : updatedDueAmount;

    // লেজারের ট্রেডিশনাল paid এবং due ট্র্যাকিং আপডেট
    companySalesReturn.paid = Number(new Decimal(paid || 0).plus(new Decimal(currentReceiveAmount)).toFixed(4));
    companySalesReturn.due = companySalesReturn.dueAmount;

    // ৩. ট্রানজেকশন হিস্ট্রি রেকর্ড প্রিপারেশন
    const unchangedPaid = Number(new Decimal(unchangedAmount).toFixed(4));
    const unchangedDue = Number(new Decimal(dueQty).minus(new Decimal(unchangedAmount)).toFixed(4));
    const refMemo = "REF-" + memo;

    // এখন এই নিউ ট্রানজেকশন অবজেক্টটি একদম ফ্রেশ এবং ইউনিক আইডি পাবে
    const transaction = new CompanySalesReturnTransaction({
      ...transactionDetail,
      refMemo,
      amountToBePaid: currentDueAmountBase, 
      paidAmount: currentReceiveAmount,      
      date: createCustomDate(date),
      currentDue: companySalesReturn.dueAmount, 
      payDetails, 
      companySalesReturnId: companySalesReturn._id, // মেইন মেমোর রেফারেন্স আইডি লিংক করা হলো এখানে
      unchangedPaid,
      unchangedDue,
    });
    
    await transaction.save();

    companySalesReturn.transactionRecords.push(transaction._id);
    await companySalesReturn.save();

    // ৪. মেইন ইনভেন্টরি স্টক প্লাস লজিক
    if (payDetails && payDetails.length > 0) {
      for (let i = 0; i < payDetails.length; i++) {
        const { productName, quantity } = payDetails[i];
        const product = await Product.findOne({ name: productName });

        if (!product) {
          throw new Error(`Product not found: ${productName}`);
        }

        product.quantity = product.quantity + Number(quantity);
        await product.save();
      }
    }

    res.status(201).json({ message: "Stock and balance adjusted successfully" });
  } catch (error) {
    console.error("Error in addPayment:", error);
    res.status(500).send(error.message || "Server Error");
  }
};

module.exports.companySalesReturnStatement = async (req, res) => {
  try {
    const { page = 1, dateSearch = "", supplierName = "" } = req.query;
    let searchQuery = [];
    let nameSearchQuery = { supplierName };
    searchQuery.push(nameSearchQuery);

    let dateSearchQuery;
    if (dateSearch) {
      const startOfDay = new Date(dateSearch);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(dateSearch);
      endOfDay.setHours(23, 59, 59, 999);

      dateSearchQuery = {
        date: { $gte: startOfDay, $lte: endOfDay },
      };
      searchQuery.push(dateSearchQuery);
    }

    const mainSearch = { $and: searchQuery };
    const transactions = await CompanySalesReturnTransaction.find(mainSearch)
      .sort({ date: -1 })
      .populate("companySalesReturnId");

    const result = await CompanySalesReturn.aggregate([
      { $match: nameSearchQuery },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmountQty" },
          totalPaid: { $sum: "$paidQty" },
          totalDue: { $sum: "$dueQty" },
        },
      },
    ]);

    res.status(201).json({
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

// module.exports.salesReturnReport = async (req, res) => {
//   try {
//     const salesReturn = await SalesReturn.aggregate([
//       {
//         $facet: {
//           total: [
//             { $unwind: "$products" },
//             {
//               $group: {
//                 _id: null,
//                 totalSentItems: { $sum: "$products.returnQuantity" },
//                 totalWeight: { $sum: "$products.returnQtyInKg" },
//               },
//             },
//           ],
//           totalAmount: [
//             {
//               $group: {
//                 _id: null,
//                 totalAmount: { $sum: { $multiply: ["$totalReturnValue", 10000] } },
//               },
//             },
//           ],
//         },
//       },
//     ]);

//     const transactionData = await CompanySalesReturnTransaction.aggregate([
//       {
//         $group: {
//           _id: null,
//           transactiontotalSentItems: { $sum: "$paidAmount" },
//         },
//       },
//     ]);

//     const result = await CompanySalesReturn.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalDue: { $sum: "$dueQty" },
//         },
//       },
//     ]);

//     const transactionSentItems = transactionData[0]?.transactiontotalSentItems || 0;
//     const companyData = await CompanySalesReturn.find();
//     const totalCompanyWeight = companyData && companyData.length ? companyData.reduce((acc, p) => acc + p.qtyInKg, 0) : 0;

//     res.status(201).json({
//       totalSentItems: salesReturn[0].total.length > 0 ? salesReturn[0].total[0].totalSentItems - transactionSentItems : 0,
//       totalWeight: salesReturn[0].total.length > 0 ? salesReturn[0].total[0].totalWeight - totalCompanyWeight : 0,
//       totalAmount: salesReturn[0].total.length > 0 ? salesReturn[0].totalAmount[0].totalAmount / 10000 : 0,
//       totalDue: result.length > 0 ? result[0].totalDue : 0,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

module.exports.salesReturnReport = async (req, res) => {
  try {
    // 1. Total Sent Items (Original Return)
    const salesReturn = await SalesReturn.aggregate([
      {
        $facet: {
          total: [
            { $unwind: "$products" },
            {
              $group: {
                _id: null,
                totalSentItems: { $sum: "$products.returnQuantity" },
                totalWeight: { $sum: "$products.returnQtyInKg" },
              },
            },
          ],
        },
      },
    ]);

    // 2. Current Available Stock from SalesReturnStockManagement
    const stockData = await SalesReturnStockManagement.aggregate([
      {
        $group: {
          _id: null,
          availableStock: { $sum: "$tempReturnQuantity" },
          totalWeight: { $sum: "$tempReturnQtyInKg" },
        },
      },
    ]);

    // 3. Total Amount & Due from Company Return
    const companyData = await CompanySalesReturn.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
          totalDue: { $sum: "$dueQty" },
        },
      },
    ]);

    res.status(200).json({
      totalSentItems: salesReturn[0]?.total[0]?.totalSentItems || 0,
      availableStock: stockData[0]?.availableStock || 0,           // ← এটাই মূল কার্ডে দেখাবে
      totalWeight: stockData[0]?.totalWeight || 0,
      totalAmount: companyData[0]?.totalAmount || 0,
      totalDue: companyData[0]?.totalDue || 0,
    });
  } catch (error) {
    console.error("Sales Return Report Error:", error);
    res.status(500).send("Server Error");
  }
};
module.exports.salesReturnStockSearchedByProductName = async (req, res) => {
  try {
    const { productName } = req.query;
    const salesReturnStockSearchData = await SalesReturnStockManagement.find({
      $and: [
        { productName: { $regex: productName, $options: "i" } },
        { tempReturnQuantity: { $gt: 0 } },
      ],
    });

    res.status(201).json(salesReturnStockSearchData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};