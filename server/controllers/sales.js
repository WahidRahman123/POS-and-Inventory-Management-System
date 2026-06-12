const Sales = require("../models/Sales");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const SalesTransaction = require("../models/SalesTransaction");
const Decimal = require("decimal.js");
const mongoose = require("mongoose");
const { createCustomDate } = require("../utils/createCustomDate");
const ProductExchange = require("../models/ProductExchange");
const { getNextSequenceForSale } = require("../utils/getNextSequenceForSale");
const { getNextSequenceForOther } = require("../utils/getNextSequenceForOther");

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
      customerId = "",
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

    let customer = null;
    //* Customer Advance Payment Handling

    if (!salesData.customerId) {
      customer = await Customer.findOne({ name: salesData.customerName });
    } else {
      customer = await Customer.findById(salesData.customerId);
    }

    //! seeder use korle comment kore nibo
    if (customer) {
      // 1. Adding advanceBalance to the customer's advanceBalance
      customer.advanceBalance += advanceBalance;

      // 2. advanceBalance adjustment
      if (customer.advanceBalance > 0) {
        const need = mainTotal - mainPaid;

        if (need <= customer.advanceBalance) {
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

    let amountToBePaid;

    if (customer.salesRecord.length === 0) {
      amountToBePaid = new Decimal(customer.total).plus(new Decimal(mainTotal));
    } else {
      amountToBePaid = customer.due;
    }
    const currentDue = new Decimal(customer.total)
      .plus(new Decimal(mainTotal))
      .minus(new Decimal(mainPaid).plus(new Decimal(customer.paid)));

    // i. Transaction Creation
    const transactionDetails = {
      ...transactionDetail,
      customerId: customer._id,
      refMemo: invoiceNo,
      amountToBePaid: Number(amountToBePaid.toFixed(4)),
      paidAmount: mainPaid,
      advanceAmount: advanceBalance,
      date: new Date(),
      currentDue: Number(currentDue.toFixed(4)),
      saleTotal: mainTotal,
      exchangeMemoId,
    };
    const transaction = new SalesTransaction(transactionDetails);

    const sale = new Sales({
      ...salesData,
      customerId: customer._id,
      total: mainTotal,
      paid: mainPaid,
      due: mainDue,
      invoiceNo,
      advanceAmount: advanceBalance,
      transactionRecords: [transaction._id],
    });

    transaction.salesId = sale._id;
    // await transaction.save({ session });

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
    if (customer.due < 0) {
      customer.advanceBalance += Math.abs(customer.due);
      customer.due = 0;
    }
    customer.salesRecord.push(sale._id);
    transaction.currentBalance = customer.advanceBalance - customer.due;
    await customer.save();
    await transaction.save();

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
    // const { id } = req.params;
    const {
      date,
      amount,
      name,
      unchangedAmount,
      cash,
      bankPaymentAmount,
      remarks,
      exchange,
      exchangeMemoId,
      advanceBalance,
      exchangeDetails,
    } = req.body;
    let mainAmount = amount;

    // session.startTransaction();

    //* Sales Due Payment
    const count = await getNextSequenceForOther("SalesDuePayment");
    const memo = `DUE-PAY-${count.seq}`;

    //* Customer grabbing
    const customer = await Customer.findOne({ name });
    // console.log(customer);

    if (customer) {
      // 1. Adding advanceBalance to the customer's advanceBalance
      customer.advanceBalance += advanceBalance;

      // 2. advanceBalance adjustment
      if (customer.advanceBalance > 0) {
        const need = customer.due - mainAmount;

        if (need <= customer.advanceBalance) {
          mainAmount += need;
          customer.advanceBalance -= need;
        } else if (need > advanceBalance) {
          mainAmount += customer.advanceBalance;
          customer.advanceBalance = 0;
        }
      }
    } else {
      throw new Error("Customer does not exist!");
    }
    //* customer calculation
    customer.paid = Number(
      new Decimal(customer.paid).plus(new Decimal(mainAmount)).toFixed(4),
    );
    const amountToBePaid = customer.due;

    customer.due = Number(
      new Decimal(customer.total).minus(new Decimal(customer.paid)).toFixed(4),
    );
    if (customer.due < 0) {
      customer.advanceBalance = Number(
        new Decimal(customer.advanceBalance)
          .plus(new Decimal(Math.abs(customer.due)))
          .toFixed(4),
      );
      customer.due = 0;
    }
    currentDue = customer.due;

    const paidAmount = Number(new Decimal(mainAmount).toFixed(4));
    const currentBalance = customer.advanceBalance - customer.due;

    const transaction = new SalesTransaction({
      customerId: customer._id,
      customerName: customer.name,
      address: customer.address,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      refMemo: memo,
      amountToBePaid,
      paidAmount,
      advanceAmount: advanceBalance,
      remarks,
      date: createCustomDate(date),
      currentDue,
      // salesId: sale._id,
      cash,
      bankPaymentAmount,
      exchange,
      exchangeMemoId,
      exchangeDetails,
      currentBalance,
      unchangedPaid: Number(new Decimal(unchangedAmount).toFixed(4)),
      unchangedDue: Number(
        new Decimal(customer.due)
          .minus(new Decimal(unchangedAmount))
          .toFixed(4),
      ),
    });

    // await transaction.save({ session });
    await transaction.save();
    // await sale.save({ session });
    await customer.save();

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
    console.log(error);
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
    // console.log(customerName)
    let matchQuery = { customerName };

    if (dateSearch) {
      const s = new Date(dateSearch);
      s.setHours(0, 0, 0, 0);
      const e = new Date(dateSearch);
      e.setHours(23, 59, 59, 999);
      matchQuery.createdAt = { $gte: s, $lte: e };
    }

    const transactions = await SalesTransaction.find(matchQuery)
      .sort({ date: -1 })
      .populate("salesId")
      .populate("customerId");

    const result = await Customer.findOne({ name: customerName });

    // console.log(result)

    res.status(200).json({
      transactions,
      totalAmount: result.total,
      totalPaid: result.paid + result.advanceBalance,
      totalDue: result.due,
      currentBalance: result.currentBalance,
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

// 9. Sales Due List (Customer wise total due)
module.exports.salesDueList = async (req, res) => {
  try {
    const { page = 1, customerName = "", order = -1 } = req.query;
    const limit = 15;

    // Search Filter
    const searchQuery = {
      name: { $regex: customerName, $options: "i" },
      // due: { $gt: 0 },
    };

    // Pagination
    const skip = (parseInt(page) - 1) * limit;

    const customers = await Customer.find(searchQuery)
      // .sort({ currentBalance: parseInt(order) })
      .skip(skip)
      .limit(limit);

    // Count total documents
    const total = await Customer.countDocuments(searchQuery);

    res.status(201).json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      customers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

//* Helper Function
async function getSalesAndTotal(start, end, order) {
  const sales = await Sales.find({
    createdAt: { $gte: start, $lte: end },
  }).sort({ createdAt: parseInt(order) });
  const total = await Sales.countDocuments({
    createdAt: { $gte: start, $lte: end },
  });
  return { sales, total };
}
