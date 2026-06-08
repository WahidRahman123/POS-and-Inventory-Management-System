const Sales = require("../models/Sales");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const SalesTransaction = require("../models/SalesTransaction");
const Decimal = require("decimal.js");
const mongoose = require("mongoose");
const { createCustomDate } = require("../utils/createCustomDate");
const ProductExchange = require("../models/ProductExchange");
const { getNextSequenceForSale } = require("../utils/getNextSequenceForSale");

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

module.exports.createSales = async (req, res) => {
  // const session = await mongoose.startSession();
  try {
    const salesData = req.body;
    const {
      exchangeMemoId,
      // invoiceNo,
      products,
      total = 0,
      due = 0,
      paid = 0,
      createdAt,
      issuedAt,
      advanceBalance,
      ...transactionDetail
    } = salesData;

    let mainTotal = total;
    let mainDue = due;
    let mainPaid = paid;

    // session.startTransaction();

    // const count = await getNextSequenceForSale(session);
    const count = await getNextSequenceForSale();
    if (!count) {
      throw new Error("Sequence generation failed");
    }
    const chars = count.seqChars?.join("");
    const invoiceNo = ("s" + chars + "-" + count.seq).toUpperCase();

    //* Customer Advance Payment Handling
    const customer = await Customer.findById(salesData.customerId);
    if(customer) {
      // 1. Adding advanceBalance to the customer's advanceBalance
      customer.advanceBalance += advanceBalance;

      // 2. advanceBalance adjustment
      if(customer.advanceBalance > 0) {
        const need = mainTotal - mainPaid;

        if(need <= customer.advanceBalance) {
          mainPaid += need;
          customer.advanceBalance -= need;
        } else if (need > advanceBalance) {
          mainPaid += customer.advanceBalance;
          customer.advanceBalance = 0;
        }
      }
    } else {
      throw new Error("Customer does not exist!");
    }
    mainDue = mainTotal - mainPaid;

    const amountToBePaid = new Decimal(customer.total).plus(new Decimal(mainTotal));
    const currentDue = amountToBePaid.minus(new Decimal(mainPaid));

    // i. Transaction Creation
    const transactionDetails = {
      ...transactionDetail,
      refMemo: invoiceNo,
      amountToBePaid: Number(amountToBePaid.toFixed(4)),
      paidAmount: mainPaid,
      date: new Date(),
      currentDue: Number(currentDue.toFixed(4)),
      exchangeMemoId,
    };
    const transaction = new SalesTransaction(transactionDetails);

    const sale = new Sales({
      ...salesData,
      total: mainTotal,
      paid: mainPaid,
      due: mainDue,
      invoiceNo,
      transactionRecords: [transaction._id],
    });

    transaction.salesId = sale._id;
    // await transaction.save({ session });
    await transaction.save();

    if (products && products.length > 0) {
      for (let i = 0; i < products.length; i++) {
        const { productName, quantity } = products[i];
        // const product = await Product.findOne({ name: productName }).session(
        //   session,
        // );
        const product = await Product.findOne({ name: productName });

        if (!product) {
          throw new Error(`Product not found: ${productName}`);
        }

        product.quantity = product.quantity - quantity;
        // await product.save({ session });
        await product.save();
      }
    }

    // ৪. Exchange memo logic (ব্যালেন্স কমানোর লজিক আগের মতই থাকবে)
    if (exchangeMemoId && salesData.exchange > 0) {
      // const memoData =
      //   await ProductExchange.findById(exchangeMemoId).session(session);
      const memoData = await ProductExchange.findById(exchangeMemoId);

      if (memoData) {
        const currentBalance = new Decimal(memoData.remainingBalance);
        const usedAmount = new Decimal(salesData.exchange);
        let newBalance = Number(currentBalance.minus(usedAmount).toFixed(4));

        if (newBalance < 0) newBalance = 0;
        memoData.remainingBalance = newBalance;
        // await memoData.save({ session });
        await memoData.save();
      }
    }

    //* Customer Update
    customer.paid += mainPaid;
    customer.total += mainTotal;
    customer.due = customer.total - customer.paid;
    if(customer.due < 0) {
      customer.advanceBalance += Math.abs(customer.due);
      customer.due = 0;
    }
    customer.salesRecord.push(sale._id);
    await customer.save();

    // const createdSale = await sale.save({ session });
    const createdSale = await sale.save();

    // await session.commitTransaction();
    // session.endSession();

    res.status(201).json(createdSale);
  } catch (error) {
    // if (session.inTransaction()) {
    //   await session.abortTransaction();
    // }
    // session.endSession();
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

    if (date === "t") {
      // Today
      start = new Date();
      start.setHours(0, 0, 0, 0);
      end = new Date();
      end.setHours(23, 59, 59, 999);
    } else if (date === "w") {
      // Weekly
      start = new Date(now);
      const day = start.getDay();
      const diff = day >= 6 ? day - 6 : day + 1;
      start.setDate(start.getDate() - diff);
      start.setHours(0, 0, 0, 0);
      end = new Date();
      end.setHours(23, 59, 59, 999);
    } else if (date === "m") {
      // Monthly
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (date === "y") {
      // Yearly
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
    const {
      dateMode,
      dateSearch,
      dateSearchStart,
      dateSearchEnd,
      productName,
      customerName,
      order = -1,
    } = req.query;
    const searchQuery = [];

    if (dateMode === "range" && dateSearchStart && dateSearchEnd) {
      searchQuery.push({
        createdAt: {
          $gte: new Date(dateSearchStart),
          $lte: new Date(dateSearchEnd),
        },
      });
    } else if (dateMode === "single" && dateSearch) {
      const s = new Date(dateSearch);
      s.setHours(0, 0, 0, 0);
      const e = new Date(dateSearch);
      e.setHours(23, 59, 59, 999);
      searchQuery.push({ createdAt: { $gte: s, $lte: e } });
    }

    if (productName)
      searchQuery.push({
        "products.productName": { $regex: productName, $options: "i" },
      });
    if (customerName)
      searchQuery.push({
        customerName: { $regex: customerName, $options: "i" },
      });

    const mainSearch = searchQuery.length > 0 ? { $and: searchQuery } : {};
    const sales = await Sales.find(mainSearch).sort({
      createdAt: parseInt(order),
    });
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
  // const session = await mongoose.startSession();
  try {
    const { id } = req.params;
    const {
      date,
      amount,
      unchangedAmount,
      cash,
      bankPaymentAmount,
      exchange,
      exchangeMemoId,
      exchangeDetails,
    } = req.body;

    // session.startTransaction();
    // const sale = await Sales.findById(id).session(session);
    const sale = await Sales.findById(id);

    if (!sale) return res.status(404).json({ message: "Sale not found" });

    const saleObj = sale.toObject();
    const {
      invoiceNo,
      due,
      paid,
      products,
      transactionRecords,
      _id,
      _v,
      ...transactionDetail
    } = saleObj;

    const paidAmount = Number(new Decimal(amount).toFixed(4));
    sale.paid = Number(
      new Decimal(sale.paid).plus(new Decimal(amount)).toFixed(4),
    );
    sale.due = Number(
      new Decimal(sale.due).minus(new Decimal(amount)).toFixed(4),
    );

    const transaction = new SalesTransaction({
      ...transactionDetail,
      refMemo: "REF-" + invoiceNo,
      amountToBePaid: due,
      paidAmount,
      date: createCustomDate(date),
      currentDue: sale.due,
      salesId: sale._id,
      cash,
      bankPaymentAmount,
      exchange,
      exchangeMemoId,
      exchangeDetails,
      unchangedPaid: Number(new Decimal(unchangedAmount).toFixed(4)),
      unchangedDue: Number(
        new Decimal(due).minus(new Decimal(unchangedAmount)).toFixed(4),
      ),
    });

    // await transaction.save({ session });
    await transaction.save();
    sale.transactionRecords.push(transaction._id);
    // await sale.save({ session });
    await sale.save();

    if (exchangeMemoId && exchange > 0) {
      // const memoData =
      //   await ProductExchange.findById(exchangeMemoId).session(session);
      const memoData = await ProductExchange.findById(exchangeMemoId);

      if (memoData) {
        const currentBalance = new Decimal(memoData.remainingBalance);
        const usedAmount = new Decimal(exchange);
        let newBalance = Number(currentBalance.minus(usedAmount).toFixed(4));

        if (newBalance < 0) newBalance = 0;
        memoData.remainingBalance = newBalance;
        // await memoData.save({ session });
        await memoData.save();
      }
    }

    // await session.commitTransaction();
    // session.endSession();
    res.status(200).json({ message: "Payment updated successfully" });
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();
    // console.log(error)
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
      const s = new Date(dateSearch);
      s.setHours(0, 0, 0, 0);
      const e = new Date(dateSearch);
      e.setHours(23, 59, 59, 999);
      matchQuery.createdAt = { $gte: s, $lte: e };
    }

    const transactions = await SalesTransaction.find(matchQuery)
      .sort({ date: -1 })
      .populate("salesId");

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
// module.exports.salesDueList = async (req, res) => {
//   try {
//     const { page = 1, order = -1, customerName = "" } = req.query;
//     const limit = 15;
//     const skip = (parseInt(page) - 1) * limit;

//     const queries = [];
//     let nameQuery;
//     const dueQuery = { due: { $gt: 0 } };
//     queries.push(dueQuery);

//     if (customerName) {
//       nameQuery = { customerName: { $regex: customerName, $options: "i" } };
//       queries.push(nameQuery);
//     }

//     const sales = await Sales.find({ $and: queries })
//       .sort({ createdAt: parseInt(order) })
//       .skip(skip)
//       .limit(limit);
//     const total = await Sales.countDocuments({ $and: queries });

//     res.status(200).json({
//       total,
//       page: parseInt(page),
//       pages: Math.ceil(total / limit),
//       sales,
//     });
//   } catch (error) {
//     res.status(500).send("Server Error");
//   }
// };

// ৯. Sales Due List (Customer wise total due)
module.exports.salesDueList = async (req, res) => {
  try {
    const { page = 1, order = -1, customerName = "" } = req.query;
    const limit = 1000;
    const skip = (parseInt(page) - 1) * limit;

    const matchQuery = { due: { $gt: 0 } };

    if (customerName) {
      matchQuery.customerName = { $regex: customerName, $options: "i" };
    }

    const sales = await Sales.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$customerName",
          customerName: { $first: "$customerName" },
          customerPhone: { $first: "$customerPhone" },
          customerEmail: { $first: "$customerEmail" },
          totalDue: { $sum: "$due" },
          lastSaleDate: { $max: "$createdAt" },
        },
      },
      { $sort: { totalDue: parseInt(order) } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const totalCount = await Sales.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$customerName",
        },
      },
      { $count: "total" },
    ]);

    const total = totalCount[0] ? totalCount[0].total : 0;

    res.status(200).json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      sales,
    });
  } catch (error) {
    console.error("Sales Due List Error:", error);
    res.status(500).send("Server Error");
  }
};
// হেল্পার ফাংশন
async function getSalesAndTotal(start, end, order) {
  const sales = await Sales.find({
    createdAt: { $gte: start, $lte: end },
  }).sort({ createdAt: parseInt(order) });
  const total = await Sales.countDocuments({
    createdAt: { $gte: start, $lte: end },
  });
  return { sales, total };
}
