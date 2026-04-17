const { default: mongoose } = require("mongoose");
const CompanySalesReturn = require("../models/CompanySalesReturn");
const Decimal = require("decimal.js");
const CompanySalesReturnTransaction = require("../models/CompanySalesReturnTransaction");
const { createCustomDate } = require("../utils/createCustomDate");
const { getNextSequenceForOther } = require("../utils/getNextSequenceForOther");
const SalesReturn = require("../models/SalesReturn");

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

    const companySalesReturns = await CompanySalesReturn.find(mainSearch)
      .skip(skip)
      .limit(limit);

    // Count total documents
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
      totalAmountQty,
      paidQty,
      dueQty,
      // memo,
      ...transactionDetail
    } = returns;

    session.startTransaction();

    //* Generate the memo
    const count = await getNextSequenceForOther("CompanySalesReturn", session);
    if (!count) {
      throw new Error("Failed to generate sequence");
    }
    const memo = "CSR-" + count.seq;

    //* Transaction Creation
    const transactionDetails = {
      ...transactionDetail,
      refMemo: memo,
      amountToBePaid: totalAmountQty,
      paidAmount: paidQty,
      date: createdAt,
      currentDue: dueQty,
    };
    const transaction = new CompanySalesReturnTransaction(transactionDetails);

    //* Company Sales Return creation
    const companySalesReturn = new CompanySalesReturn({
      ...returns,
      memo,
      transactionRecords: [transaction._id],
    });

    transaction.companySalesReturnId = companySalesReturn._id;
    await transaction.save({ session });

    const createdCompanySalesReturn = await companySalesReturn.save({
      session,
    });

    // Commit
    await session.commitTransaction();
    session.endSession();

    res.status(201).json(createdCompanySalesReturn);
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
    const companySalesReturn = await CompanySalesReturn.findById(id);

    if (!companySalesReturn)
      return res.status(409).json({ message: "Invalid ID!" });

    res.status(201).json(companySalesReturn);
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
    const companySalesReturn =
      await CompanySalesReturn.findById(id).session(session);

    if (companySalesReturn) {
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

        totalAmountQty,
        paidQty,
        dueQty,

        memo,
        _id,
        ...transactionDetail
      } = companySalesReturn.toObject();

      const unchangedPaid = Number(new Decimal(unchangedAmount).toFixed(4));
      const unchangedDue = Number(
        new Decimal(dueQty).minus(new Decimal(unchangedAmount)).toFixed(4),
      );

      const refMemo = "REF-" + memo;
      const paidAmount = Number(new Decimal(amount).toFixed(4));
      // companySalesReturn.paid = companySalesReturn.paid + amount;
      companySalesReturn.paidQty = Number(
        new Decimal(paidQty).plus(new Decimal(amount)).toFixed(4),
      );

      const amountToBePaid = dueQty;
      // companySalesReturn.dueQty = companySalesReturn.dueQty - amount;
      companySalesReturn.dueQty = Number(
        new Decimal(dueQty).minus(new Decimal(amount)).toFixed(4),
      );
      const currentDue = companySalesReturn.dueQty;

      // transaction creation
      const transaction = new CompanySalesReturnTransaction({
        ...transactionDetail,
        refMemo,
        amountToBePaid,
        paidAmount,
        date: createCustomDate(date),
        currentDue,
        companySalesReturnId: companySalesReturn._id,
        unchangedPaid,
        unchangedDue,
      });
      await transaction.save({ session });

      companySalesReturn.transactionRecords.push(transaction._id);
      await companySalesReturn.save({ session });

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

module.exports.companySalesReturnStatement = async (req, res) => {
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

    const transactions = await CompanySalesReturnTransaction.find(mainSearch)
      .sort({ date: -1 })
      .populate("companySalesReturnId");

    const result = await CompanySalesReturn.aggregate([
      {
        $match: nameSearchQuery,
      },
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

module.exports.salesReturnReport = async (req, res) => {
  try {
    const salesReturn = await SalesReturn.aggregate([
      {
        $facet: {
          total: [
            {
              $unwind: "$products",
            },
            {
              $group: {
                _id: null,
                totalSentItems: { $sum: "$products.returnQuantity" },
                totalWeight: { $sum: "$products.returnQtyInKg" },
              },
            },
          ],

          totalAmount: [
            {
              $group: {
                _id: null,
                totalAmount: {
                  $sum: { $multiply: ["$totalReturnValue", 10000] },
                },
              },
            },
          ],
        },
      },
    ]);

    const transactionData = await CompanySalesReturnTransaction.aggregate([
      {
        $group: {
          _id: null,
          transactiontotalSentItems: { $sum: "$paidAmount" },
        },
      },
    ]);

    const result = await CompanySalesReturn.aggregate([
      {
        $group: {
          _id: null,
          totalDue: { $sum: "$dueQty" },
        },
      },
    ]);

    const transactionSentItems =
      transactionData[0]?.transactiontotalSentItems || 0;

    const companyData = await CompanySalesReturn.find();

    const totalCompanyWeight =
      companyData && companyData.length
        ? companyData.reduce((acc, p) => acc + p.qtyInKg, 0)
        : 0;

    res.status(201).json({
      totalSentItems:
        salesReturn[0].total.length > 0
          ? salesReturn[0].total[0].totalSentItems - transactionSentItems
          : 0,
      totalWeight:
        salesReturn[0].total.length > 0
          ? salesReturn[0].total[0].totalWeight - totalCompanyWeight
          : 0,
      totalAmount:
        salesReturn[0].total.length > 0
          ? salesReturn[0].totalAmount[0].totalAmount / 10000
          : 0,
      totalDue: result.length > 0 ? result[0].totalDue : 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
