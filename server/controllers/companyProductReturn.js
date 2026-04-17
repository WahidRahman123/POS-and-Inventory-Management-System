const { default: mongoose } = require("mongoose");
const CompanyProductReturn = require("../models/CompanyProductReturn");
const Decimal = require("decimal.js");
const CompanyProductReturnTransaction = require("../models/CompanyProductReturnTransaction");
const { createCustomDate } = require("../utils/createCustomDate");
const { getNextSequenceForOther } = require("../utils/getNextSequenceForOther");
const ProductExchange = require("../models/ProductExchange");

module.exports.index = async (req, res) => {
  try {
    const {
      memoSearch = "",
      page = 1,
      // order = -1,
    } = req.query;

    let searchQuery = [];
    let memoSearchQuery;

    // For memo search:
    if (memoSearch) {
      memoSearchQuery = { memo: { $regex: memoSearch, $options: "i" } };
      searchQuery.push(memoSearchQuery);
    }

    const mainSearch = searchQuery.length !== 0 ? { $and: searchQuery } : {};

    const limit = 10;

    // Pagination
    const skip = (parseInt(page) - 1) * limit;

    const companyProductReturns = await CompanyProductReturn.find(mainSearch)
      .skip(skip)
      .limit(limit);

    // Count total documents
    const total = await CompanyProductReturn.countDocuments(mainSearch);

    res.status(201).json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      companyProductReturns,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.createCompanyProductReturn = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const returns = req.body;
    // const { memo } = purchases;
    const {
      createdAt,
      issuedAt,
      // products,
      productName,
      quantity,
      qtyInKg,
      unitPrice,
      subTotal,
      totalAmount,
      paid,
      due,
      // memo,
      ...transactionDetail
    } = returns;

    session.startTransaction();

    //* Generate the memo
    const count = await getNextSequenceForOther(
      "CompanyProductReturn",
      session,
    );
    if (!count) {
      throw new Error("Failed to generate sequence");
    }
    const memo = "CPR-" + count.seq;

    //* Transaction Creation
    const transactionDetails = {
      ...transactionDetail,
      refMemo: memo,
      amountToBePaid: totalAmount,
      paidAmount: paid,
      date: createdAt,
      currentDue: due,
    };
    const transaction = new CompanyProductReturnTransaction(transactionDetails);

    //* Company Product Return creation
    const companyProductReturn = new CompanyProductReturn({
      ...returns,
      memo,
      transactionRecords: [transaction._id],
    });

    transaction.companyProductReturnId = companyProductReturn._id;
    await transaction.save({ session });

    const createdCompanyProductReturn = await companyProductReturn.save({
      session,
    });

    // Commit
    await session.commitTransaction();
    session.endSession();

    res.status(201).json(createdCompanyProductReturn);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.searchById = async (req, res) => {
  try {
    const { id } = req.params;
    const companyProductReturn = await CompanyProductReturn.findById(id);

    if (!companyProductReturn)
      return res.status(409).json({ message: "Invalid ID!" });

    res.status(201).json(companyProductReturn);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.addPayment = async (req, res) => {
  const session = await mongoose.startSession();

  const { id } = req.params;
  const { date, amount, unchangedAmount } = req.body;

  try {
    session.startTransaction();
    const companyProductReturn =
      await CompanyProductReturn.findById(id).session(session);

    if (companyProductReturn) {
      const {
        createdAt,
        issuedAt,
        productName,
        quantity,
        qtyInKg,
        unitPrice,
        subTotal,
        transactionRecords,
        totalAmount,
        paid,
        due,
        memo,
        _id,
        ...transactionDetail
      } = companyProductReturn.toObject();

      const unchangedPaid = Number(new Decimal(unchangedAmount).toFixed(4));
      const unchangedDue = Number(
        new Decimal(due).minus(new Decimal(unchangedAmount)).toFixed(4),
      );

      const refMemo = "REF-" + memo;
      const paidAmount = Number(new Decimal(amount).toFixed(4));
      // companyProductReturn.paid = companyProductReturn.paid + amount;
      companyProductReturn.paid = Number(
        new Decimal(paid).plus(new Decimal(amount)).toFixed(4),
      );

      const amountToBePaid = due;
      // companyProductReturn.due = companyProductReturn.due - amount;
      companyProductReturn.due = Number(
        new Decimal(due).minus(new Decimal(amount)).toFixed(4),
      );
      const currentDue = companyProductReturn.due;

      // transaction creation
      const transaction = new CompanyProductReturnTransaction({
        ...transactionDetail,
        refMemo,
        amountToBePaid,
        paidAmount,
        date: createCustomDate(date),
        currentDue,
        companyProductReturnId: companyProductReturn._id,
        unchangedPaid,
        unchangedDue,
      });
      await transaction.save({ session });

      companyProductReturn.transactionRecords.push(transaction._id);
      await companyProductReturn.save({ session });

      // Commit
      await session.commitTransaction();
      session.endSession();

      res.status(201).json({ message: "Payment updated successfully" });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.companyProductReturnStatement = async (req, res) => {
  try {
    const { page = 1, dateSearch = "", supplierName = "" } = req.query;

    let searchQuery = [];
    let nameSearchQuery = { supplierName };
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

    const transactions = await CompanyProductReturnTransaction.find(mainSearch)
      .sort({ date: -1 })
      .populate("companyProductReturnId");

    const result = await CompanyProductReturn.aggregate([
      {
        $match: nameSearchQuery,
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: { $multiply: ["$totalAmount", 10000] } },
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

module.exports.productExchangeReport = async (req, res) => {
  try {
    const productExchange = await ProductExchange.aggregate([
      {
        $facet: {
          total: [
            {
              $unwind: "$products",
            },
            {
              $group: {
                _id: null,
                totalSentItems: { $sum: "$products.quantity" },
                totalWeight: { $sum: "$products.qtyInKg" },
              },
            },
          ],

          totalAmount: [
            {
              $group: {
                _id: null,
                totalAmount: { $sum: { $multiply: ["$totalAmount", 10000] } },
              },
            },
          ],
        },
      },
    ]);

    const companyData = await CompanyProductReturn.find();

    const totalCompanySentItems = companyData && companyData.length ? companyData.reduce((acc, p) => acc + p.quantity, 0) : 0;

    const totalCompanyWeight = companyData && companyData.length ? companyData.reduce((acc, p) => acc + p.qtyInKg, 0) : 0;


    const result = await CompanyProductReturn.aggregate([
      {
        $group: {
          _id: null,
          totalDue: { $sum: { $multiply: ["$due", 10000] } },
        },
      },
    ]);


    res.status(201).json({
      totalSentItems:
        productExchange[0].total.length > 0
          ? productExchange[0].total[0].totalSentItems - totalCompanySentItems
          : 0,
      totalWeight:
        productExchange[0].total.length > 0
          ? productExchange[0].total[0].totalWeight - totalCompanyWeight
          : 0,
      totalAmount:
        productExchange[0].total.length > 0
          ? productExchange[0].totalAmount[0].totalAmount / 10000
          : 0,
      totalDue: result.length > 0 ? result[0].totalDue / 10000 : 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
