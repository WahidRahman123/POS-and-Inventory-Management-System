const Decimal = require("decimal.js");
const PurchaseReturn = require("../models/PurchaseReturn");
const Purchase = require("../models/Purchase");
const Product = require("../models/Product");
const PurchaseReturnTransaction = require("../models/PurchaseReturnTransaction");
const { createCustomDate } = require("../utils/createCustomDate");
const { default: mongoose } = require("mongoose");
const { combineDateWithCurrentTime } = require("../utils/combineDateWithCurrentTime");
const dayjs = require("../utils/date.js");

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
        const startDate = dayjs(dateSearchStart)
          .tz("Asia/Dhaka")
          .startOf("day")
          .utc()
          .toDate();

        const endDate = dayjs(dateSearchEnd)
          .tz("Asia/Dhaka")
          .endOf("day")
          .utc()
          .toDate();

        dateSearchQuery = {
          createdAt: { $gte: startDate, $lte: endDate },
        };
        searchQuery.push(dateSearchQuery);
      }
    } else if (dateMode === "single") {
      if (dateSearch) {
        const startOfDay = dayjs(dateSearch)
          .tz("Asia/Dhaka")
          .startOf("day")
          .utc()
          .toDate();

        const endOfDay = dayjs(dateSearch)
          .tz("Asia/Dhaka")
          .endOf("day")
          .utc()
          .toDate();

        dateSearchQuery = {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        };
        searchQuery.push(dateSearchQuery);
      }
    }

    // For name search:
    if (nameSearch) {
      nameSearchQuery = { supplierName: { $regex: nameSearch, $options: "i" } };
      searchQuery.push(nameSearchQuery);
    }

    const mainSearch = searchQuery.length !== 0 ? { $and: searchQuery } : {};

    const limit = 10;

    // Pagination
    const skip = (parseInt(page) - 1) * limit;

    const returns = await PurchaseReturn.find(mainSearch)
      .populate({
        path: "transactionRecords",
        select: "returnType",
        // options: { limit: 1 },
      })
      .sort({ createdAt: parseInt(order) })
      .skip(skip)
      .limit(limit);

    // Count total documents
    const total = await PurchaseReturn.countDocuments(mainSearch);

    res.status(201).json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      purchaseReturns: returns,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.createPurchaseReturn = async (req, res) => {
  // const session = await mongoose.startSession();
  try {
    const purchaseReturns = req.body;

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
    } = purchaseReturns;

    const utcCreatedAt = combineDateWithCurrentTime(createdAt);
    const now = dayjs()
      .tz("Asia/Dhaka")
      .utc()
      .toDate();

    const { purchaseId } = purchaseReturns;

    // session.startTransaction();

    // const s = await Purchase.findById(purchaseId, "purchaseReturnId");
    // const memoLength = s.purchaseReturnId.length + 1;
    // const newMemo = memo + memoLength;

    //* Transaction Creation
    const transactionDetails = {
      ...commonDetails,
      refMemo: memo,
      amountToBePaid: totalReturnValue,
      paidAmount: paid,
      date: utcCreatedAt,
      currentDue: due,

      returnType,
      exchangeProducts,
      totalExchangeValue,
      adjustmentAmount,
      cashRefundAmount,
      paymentMethod,
      note,
    };
    const transaction = new PurchaseReturnTransaction(transactionDetails);

    //* Purchase creation
    const purchaseReturn = new PurchaseReturn({
      ...commonDetails,
      memo,
      products,
      transactionRecords: [transaction._id],
      totalReturnValue,
      due,
      paid,
      createdAt: utcCreatedAt,
      issuedAt: now,
    });

    transaction.purchaseReturnId = purchaseReturn._id;
    // await transaction.save({ session });
    await transaction.save();

    // const createdPurchaseReturn = await purchaseReturn.save({ session });
    const createdPurchaseReturn = await purchaseReturn.save();

    //* Insertion of purchaseReturn ID in purchase
    // const purchaseFound = await Purchase.findById(purchaseReturns.purchaseId).session(
    //   session,
    // );
    const purchaseFound = await Purchase.findById(purchaseReturns.purchaseId);

    if (purchaseFound) {
      purchaseFound.purchaseReturnId.push(createdPurchaseReturn._id);
      // await purchaseFound.save({ session });
      await purchaseFound.save();
    }

    //* Add returned products to return stock
    for (const product of purchaseReturns.products) {
      if (product.returnQuantity > 0) {
        const productFound = await Product.findById(product.productId);
        if (productFound) {
          productFound.returnStock =
            (productFound.returnStock || 0) + product.returnQuantity;
          await productFound.save();
        }
      }
    }

    // Commit
    // await session.commitTransaction();
    // session.endSession();

    res.status(201).json(createdPurchaseReturn);
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();

    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.addPaymentByExchange = async (req, res) => {
  // const session = await mongoose.startSession();

  const { id } = req.params;
  const { amount, date, ...rest } = req.body;

  const utcDate = combineDateWithCurrentTime(date);

  try {
    // session.startTransaction();
    // const purchaseReturn = await PurchaseReturn.findById(id).session(session);
    const purchaseReturn = await PurchaseReturn.findById(id);

    if (purchaseReturn) {
      const paidAmount = Number(new Decimal(amount).toFixed(4));
      // purchase.paid = purchase.paid + amount;
      purchaseReturn.paid = Number(
        new Decimal(purchaseReturn.paid).plus(new Decimal(amount)).toFixed(4),
      );

      const amountToBePaid = purchaseReturn.due;
      // purchase.due = purchase.due - amount;
      purchaseReturn.due = Number(
        new Decimal(purchaseReturn.due).minus(new Decimal(amount)).toFixed(4),
      );
      const currentDue = purchaseReturn.due;

      // transaction creation
      const transaction = new PurchaseReturnTransaction({
        ...rest,
        date: utcDate,
        amountToBePaid,
        paidAmount,
        currentDue,
      });
      // await transaction.save({ session });
      await transaction.save();

      purchaseReturn.transactionRecords.push(transaction._id);
      // await purchaseReturn.save({ session });
      await purchaseReturn.save();

      // Commit
      // await session.commitTransaction();
      // session.endSession();

      res.status(201).json({ message: "Payment updated successfully" });
    } else {
      res.status(404).json({ message: "Purchase Return not found" });
    }
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();

    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.addPaymentByCash = async (req, res) => {
  // const session = await mongoose.startSession();

  const { id } = req.params;
  const { amount, date, ...rest } = req.body;

  const utcDate = combineDateWithCurrentTime(date);

  try {
    // session.startTransaction();
    // const purchaseReturn = await PurchaseReturn.findById(id).session(session);
    const purchaseReturn = await PurchaseReturn.findById(id);

    if (purchaseReturn) {
      const paidAmount = Number(new Decimal(amount).toFixed(4));
      // purchase.paid = purchase.paid + amount;
      purchaseReturn.paid = Number(
        new Decimal(purchaseReturn.paid).plus(new Decimal(amount)).toFixed(4),
      );

      const amountToBePaid = purchaseReturn.due;
      // purchase.due = purchase.due - amount;
      purchaseReturn.due = Number(
        new Decimal(purchaseReturn.due).minus(new Decimal(amount)).toFixed(4),
      );
      const currentDue = purchaseReturn.due;

      // transaction creation
      const transaction = new PurchaseReturnTransaction({
        ...rest,
        date: utcDate,
        amountToBePaid,
        paidAmount,
        currentDue,
      });
      // await transaction.save({ session });
      await transaction.save();

      purchaseReturn.transactionRecords.push(transaction._id);
      // await purchaseReturn.save({ session });
      await purchaseReturn.save();

      // Commit
      // await session.commitTransaction();
      // session.endSession();

      res.status(201).json({ message: "Payment updated successfully" });
    } else {
      res.status(404).json({ message: "Purchase Return not found" });
    }
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();

    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.purchaseReturnStatement = async (req, res) => {
  try {
    const { page = 1, dateSearch = "", supplierName = "" } = req.query;

    let searchQuery = [];
    let nameSearchQuery = { supplierName };
    searchQuery.push(nameSearchQuery);

    let dateSearchQuery;
    // For date search:
    if (dateSearch) {
      const startOfDay = dayjs(dateSearch)
        .tz("Asia/Dhaka")
        .startOf("day")
        .utc()
        .toDate();

      const endOfDay = dayjs(dateSearch)
        .tz("Asia/Dhaka")
        .endOf("day")
        .utc()
        .toDate();

      dateSearchQuery = {
        date: { $gte: startOfDay, $lte: endOfDay },
      };
      searchQuery.push(dateSearchQuery);
    }

    const mainSearch = { $and: searchQuery };

    const transactions = await PurchaseReturnTransaction.find(mainSearch)
      .sort({ date: -1 })
      .populate("purchaseReturnId");

    const result = await PurchaseReturn.aggregate([
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

module.exports.purchaseByInvoice = async (req, res) => {
  try {
    const { memo } = req.query;

    const purchase = await Purchase.findOne({ memo: memo.toUpperCase() })
      .populate({
        path: "purchaseReturnId",
        select: "products.productName products.returnQuantity",
      })
      .lean();

    if (!purchase)
      return res.status(409).json({ message: "Invalid Invoice No!" });

    //* Map to store returned quantities
    const returnedMap = {};

    purchase.purchaseReturnId.forEach((ret) => {
      ret.products.forEach((p) => {
        const pid = p.productName;

        if (!returnedMap[pid]) {
          returnedMap[pid] = 0;
        }

        returnedMap[pid] += p.returnQuantity || 0;
      });
    });

    //* Calculate available return for each sale product
    const products = purchase.products.map((p) => {
      const pid = p.productName;
      const returnedQty = returnedMap[pid] || 0;

      return {
        ...p,
        alreadyReturned: returnedQty,
        availableReturnQty: p.quantity - returnedQty,
      };
    });

    purchase.products = products.filter((p) => p.availableReturnQty > 0);

    if (purchase.products.length === 0)
      return res.status(409).json({ message: "All items already returned!" });

    res.status(201).json(purchase);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.purchaseReturnById = async (req, res) => {
  try {
    const { id } = req.params;
    const purchaseReturn = await PurchaseReturn.findById(id);

    if (!purchaseReturn)
      return res.status(409).json({ message: "Invalid ID!" });

    res.status(201).json(purchaseReturn);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
