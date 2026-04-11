const { default: mongoose } = require("mongoose");
const Decimal = require("decimal.js");
const Sales = require("../models/Sales");
const SalesReturn = require("../models/SalesReturn");
const SalesReturnTransaction = require("../models/SalesReturnTransaction");
const Product = require("../models/Product");
const { createCustomDate } = require("../utils/createCustomDate");


module.exports.index = async (req, res) => {
  try {
    const {
      dateMode,
      dateSearch = "",
      dateSearchStart = "",
      dateSearchEnd = "",
      nameSearch = "",
      page = 1,
      order = -1,
    } = req.query;

    let searchQuery = [];
    let dateSearchQuery;
    let nameSearchQuery;

    // For date search:
    if (dateMode === "range") {
      if (dateSearchStart && dateSearchEnd) {
        const startDate = new Date(dateSearchStart);
        const endDate = new Date(dateSearchEnd);

        dateSearchQuery = {
          createdAt: { $gte: startDate, $lte: endDate },
        };
        searchQuery.push(dateSearchQuery);
      }
    } else if (dateMode === "single") {
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

    const salesReturns = await SalesReturn.find(mainSearch)
      .populate({
        path: "transactionRecords",
        select: "returnType",
        // options: { limit: 1 },
      })
      .sort({ createdAt: parseInt(order) })
      .skip(skip)
      .limit(limit);

    // Count total documents
    const total = await SalesReturn.countDocuments(mainSearch);

    // res.status(201).json(purchases);
    res.status(201).json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      salesReturns,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.createSalesReturn = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const salesReturns = req.body;
    // console.log(salesReturns);
    // return
    const {
      memo,
      returnType,
      products,
      exchangeProducts,
      totalReturnValue,
      due,
      paid,
      totalExchangeValue,
      adjustmentAmount,
      cashRefundAmount,
      paymentMethod,
      note,
      createdAt,
      issuedAt,
      ...commonDetails
    } = salesReturns;

    const { salesId } = salesReturns;
    // const { salesId } = salesReturns;

    //* Check if the memo exists or not
    // const returnFound = await SalesReturn.find({ memo });
    // if (returnFound.length > 0)
    //   return res.status(409).json({ message: "Memo Already Existed!" });

    session.startTransaction();

    // const s = await Sales.findById(salesId, "salesReturnId");
    // const memoLength = s.salesReturnId.length + 1;
    // const newMemo = memo + memoLength;

    //* Transaction Creation
    const transactionDetails = {
      ...commonDetails,
      refMemo: memo,
      amountToBePaid: totalReturnValue,
      paidAmount: paid,
      date: createdAt,
      currentDue: due,

      returnType,
      exchangeProducts,
      totalExchangeValue,
      adjustmentAmount,
      cashRefundAmount,
      paymentMethod,
      note,
    };
    const transaction = new SalesReturnTransaction(transactionDetails);

    //* sales creation
    const salesReturn = new SalesReturn({
      ...commonDetails,
      memo: memo,
      products,
      transactionRecords: [transaction._id],
      totalReturnValue,
      due,
      paid,
      createdAt,
      issuedAt,
    });

    transaction.salesReturnId = salesReturn._id;
    await transaction.save({ session });

    const createdSalesReturn = await salesReturn.save({ session });

    //* Inventory Adjustment for ExchangeProducts
    if (salesReturns.returnType === "product") {
      for (const product of salesReturns.exchangeProducts) {
        {
          const productFound = await Product.findById(
            product.productId,
          ).session(session);

          if (productFound) {
            productFound.quantity = productFound.quantity - product.quantity;
            // console.log(productFound);
            await productFound.save({ session });
          }
        }
      }
    }

    //* Insertion of salesReturn ID in sales
    const saleFound = await Sales.findById(salesReturns.salesId).session(
      session,
    );

    if (saleFound) {
      saleFound.salesReturnId.push(createdSalesReturn._id);
      await saleFound.save({ session });
    }

    // Commit
    await session.commitTransaction();
    session.endSession();

    res.status(201).json(createdSalesReturn);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.addPaymentByExchange = async (req, res) => {
  const session = await mongoose.startSession();

  const { id } = req.params;
  const { amount, date, ...rest } = req.body;

  try {
    session.startTransaction();
    const salesReturn = await SalesReturn.findById(id).session(session);

    if (salesReturn) {
      const paidAmount = Number(new Decimal(amount).toFixed(4));
      // purchase.paid = purchase.paid + amount;
      salesReturn.paid = Number(
        new Decimal(salesReturn.paid).plus(new Decimal(amount)).toFixed(4),
      );

      const amountToBePaid = salesReturn.due;
      // purchase.due = purchase.due - amount;
      salesReturn.due = Number(
        new Decimal(salesReturn.due).minus(new Decimal(amount)).toFixed(4),
      );
      const currentDue = salesReturn.due;

      // transaction creation
      const transaction = new SalesReturnTransaction({
        ...rest,
        date: createCustomDate(date),
        amountToBePaid,
        paidAmount,
        currentDue,
      });
      await transaction.save({ session });

      salesReturn.transactionRecords.push(transaction._id);
      await salesReturn.save({ session });

      //* Inventory Adjustment for ExchangeProducts
      for (const product of transaction.exchangeProducts) {
        {
          const productFound = await Product.findById(
            product.productId,
          ).session(session);

          if (productFound) {
            productFound.quantity = productFound.quantity - product.quantity;
            // console.log(productFound);
            await productFound.save({ session });
          }
        }
      }

      // Commit
      await session.commitTransaction();
      session.endSession();

      res.status(201).json({ message: "Payment updated successfully" });
    } else {
      res.status(404).json({ message: "Sales Return not found" });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.addPaymentByCash = async (req, res) => {
  const session = await mongoose.startSession();

  const { id } = req.params;
  const { amount, date, ...rest } = req.body;

  try {
    session.startTransaction();
    const salesReturn = await SalesReturn.findById(id).session(session);

    if (salesReturn) {
      const paidAmount = Number(new Decimal(amount).toFixed(4));
      // purchase.paid = purchase.paid + amount;
      salesReturn.paid = Number(
        new Decimal(salesReturn.paid).plus(new Decimal(amount)).toFixed(4),
      );

      const amountToBePaid = salesReturn.due;
      // purchase.due = purchase.due - amount;
      salesReturn.due = Number(
        new Decimal(salesReturn.due).minus(new Decimal(amount)).toFixed(4),
      );
      const currentDue = salesReturn.due;

      // transaction creation
      const transaction = new SalesReturnTransaction({
        ...rest,
        date: createCustomDate(date),
        amountToBePaid,
        paidAmount,
        currentDue,
      });
      await transaction.save({ session });

      salesReturn.transactionRecords.push(transaction._id);
      await salesReturn.save({ session });

      // Commit
      await session.commitTransaction();
      session.endSession();

      res.status(201).json({ message: "Payment updated successfully" });
    } else {
      res.status(404).json({ message: "Sales Return not found" });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.salesReturnStatement = async (req, res) => {
  try {
    const { page = 1, dateSearch = "", customerName = "" } = req.query;

    let searchQuery = [];
    let nameSearchQuery = { customerName };
    searchQuery.push(nameSearchQuery);

    let dateSearchQuery;
    // For date search:
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

    const transactions = await SalesReturnTransaction.find(mainSearch)
      .sort({ date: -1 })
      .populate("salesReturnId");

    const result = await SalesReturn.aggregate([
      {
        $match: nameSearchQuery,
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: { $multiply: ["$totalReturnValue", 10000] } },
          totalPaid: { $sum: { $multiply: ["$paid", 10000] } },
          totalDue: { $sum: { $multiply: ["$due", 10000] } },
        },
      },
    ]);

    res.status(201).json({
      transactions,
      totalAmount: result.length > 0 ? result[0].totalAmount / 10000 : 0,
      totalPaid: result.length > 0 ? result[0].totalPaid / 10000 : 0,
      totalDue: result.length > 0 ? result[0].totalDue / 10000 : 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// module.exports.saleByInvoice = async (req, res) => {
//   try {
//     const { invoiceNo } = req.query;
//     const sale = await Sales.findOne({ invoiceNo })
//       .populate({
//         path: "salesReturnId",
//         select: "products",
//       })
//       .lean();

//     if (!sale) return res.status(409).json({ message: "Sale Not Found!" });

//     res.status(201).json(sale);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

module.exports.saleByInvoice = async (req, res) => {
  try {
    const { invoiceNo } = req.query;

    const sale = await Sales.findOne({ invoiceNo: invoiceNo.toUpperCase() })
      .populate({
        path: "salesReturnId",
        select: "products.productId products.returnQuantity",
      })
      .lean();

    if (!sale) return res.status(409).json({ message: "Invalid Invoice No!" });

    //* Map to store returned quantities
    const returnedMap = {};

    sale.salesReturnId.forEach((ret) => {
      ret.products.forEach((p) => {
        const pid = p.productId.toString();

        if (!returnedMap[pid]) {
          returnedMap[pid] = 0;
        }

        returnedMap[pid] += p.returnQuantity || 0;
      });
    });

    //* Calculate available return for each sale product
    const products = sale.products.map((p) => {
      const pid = p.productId.toString();
      const returnedQty = returnedMap[pid] || 0;

      return {
        ...p,
        alreadyReturned: returnedQty,
        availableReturnQty: p.quantity - returnedQty,
      };
    });

    sale.products = products.filter((p) => p.availableReturnQty > 0);

    if (sale.products.length === 0)
      return res.status(409).json({ message: "All items already returned!" });

    res.status(201).json(sale);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.salesReturnById = async (req, res) => {
  try {
    const { id } = req.params;
    const salesReturn = await SalesReturn.findById(id);

    if (!salesReturn) return res.status(409).json({ message: "Invalid ID!" });

    res.status(201).json(salesReturn);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
