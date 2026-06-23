const { default: mongoose } = require("mongoose");
const CompanyProductReturn = require("../models/CompanyProductReturn");
const Decimal = require("decimal.js");
const CompanyProductReturnTransaction = require("../models/CompanyProductReturnTransaction");
const { createCustomDate } = require("../utils/createCustomDate");
const { getNextSequenceForOther } = require("../utils/getNextSequenceForOther");
const ProductExchange = require("../models/ProductExchange");
const ProductExchangeStockManagement = require("../models/ProductExchangeStockManagement");
const ScrapProductSell = require("../models/ScrapProductSell");
const ScrapProductSellTransaction = require("../models/ScrapProductSellTransaction");
const Sales = require("../models/Sales");
const SalesTransaction = require("../models/SalesTransaction");
const { getNextSequenceForSale } = require("../utils/getNextSequenceForSale");
const { combineDateWithCurrentTime } = require("../utils/combineDateWithCurrentTime");
const dayjs = require("../utils/date.js");
const Customer = require("../models/Customer.js");

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

    const scrapProductSells = await ScrapProductSell.find(mainSearch)
      .skip(skip)
      .limit(limit);

    // Count total documents
    const total = await ScrapProductSell.countDocuments(mainSearch);

    res.status(201).json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      scrapProductSells,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.createScrapProductSell = async (req, res) => {
  // const session = await mongoose.startSession();
  try {
    const returns = req.body;
    // const { memo } = purchases;
    const {
      createdAt,
      issuedAt,
      products,
      // productName,
      // quantity,
      // qtyInKg,
      // unitPrice,
      // subTotal,
      totalAmount,
      paid,
      due,
      // memo,
      ...transactionDetail
    } = returns;

    const utcCreatedAt = combineDateWithCurrentTime(createdAt);
    const now = dayjs()
      .tz("Asia/Dhaka")
      .utc()
      .toDate();

    const paidAmountForSaleTransaction = 0;

    // session.startTransaction();

    const customer = await Customer.findById(returns.customerId);

    const previousBalanceForSaleTransaction = customer ? customer.currentBalance : 0;

    const amountToBePaidForSaleTransaction = customer ? customer.due : 0;

    if (customer) {
      customer.scrapProductSellAmount += due;
      customer.due += due;
      customer.total += due;
    }

    //* Generate the memo
    // const count = await getNextSequenceForOther(
    //   "CompanyProductReturn",
    //   session,
    // );
    const count = await getNextSequenceForOther("ScrapProductSell");
    if (!count) {
      throw new Error("Failed to generate sequence");
    }
    const memo = "SPS-" + count.seq;

    //* Transaction Creation
    const transactionDetails = {
      ...transactionDetail,
      refMemo: memo,
      amountToBePaid: totalAmount,
      paidAmount: paid,
      date: utcCreatedAt,
      currentDue: due,
    };
    const transaction = new ScrapProductSellTransaction(transactionDetails);

    //* Company Product Return creation
    const scrapProductSell = new ScrapProductSell({
      ...returns,
      memo,
      createdAt: utcCreatedAt,
      issuedAt: now,
      transactionRecords: [transaction._id],
    });

    transaction.scrapProductSellId = scrapProductSell._id;
    // await transaction.save({ session });
    await transaction.save();

    // const createdCompanyProductReturn = await companyProductReturn.save({
    //   session,
    // });
    const createdScrapProductSell = await scrapProductSell.save();

    // Commit
    // await session.commitTransaction();
    // session.endSession();

    for (const product of products) {
      const productExchangeStockSearchData =
        await ProductExchangeStockManagement.findOne({
          productId: product.productId,
        });
      productExchangeStockSearchData.tempQuantity -= product.quantity;
      productExchangeStockSearchData.tempQtyInKg -= product.qtyInKg;
      await productExchangeStockSearchData.save();
    }

    //* Sale creation
    const saleType = "scrap-sell";
    const {
      _id,
      memo: scrapMemo,
      products: scrapProducts,
      transactionRecords,
      totalAmount: scrapTotalAmount,
      createdAt: scrapCreatedAt,
      issuedAt: scrapIssuedAt,
      ...rest
    } = createdScrapProductSell.toObject();

    const utcScrapCreatedAt = combineDateWithCurrentTime(scrapCreatedAt);
    const utcScrapIssuedAt = combineDateWithCurrentTime(scrapIssuedAt);

    const saleCount = await getNextSequenceForSale();

    if (!saleCount) {
      throw new Error("Sequence generation failed");
    }
    const chars = saleCount.seqChars?.join("");
    const invoiceNo = ("s" + chars + "-" + saleCount.seq).toUpperCase();

    const createdSale = await Sales({
      ...rest,
      invoiceNo,
      saleType,
      createdAt: utcScrapCreatedAt,
      issuedAt: utcScrapIssuedAt,
      total: scrapTotalAmount,
    });
    createdSale.scrapProductSellId.push(_id);
    customer.salesRecord.push(createdSale._id);
    await customer.save();


    //* Sale transaction creation
    const countForSaleTransaction = await getNextSequenceForOther("ScrapProductSellForSaleTransaction");
    if (!countForSaleTransaction) {
      throw new Error("Failed to generate sequence");
    }
    const memoForSalesTransaction = "EPS-" + countForSaleTransaction.seq;

    const currentBalanceForSaleTransaction = customer ? customer.currentBalance: 0;
    const currentDueForSaleTransaction = customer ? customer.due : 0;

    const saleTransaction = await SalesTransaction({
      ...rest,
      refMemo: memoForSalesTransaction,
      amountToBePaid: amountToBePaidForSaleTransaction,
      paidAmount: paidAmountForSaleTransaction,
      currentDue: currentDueForSaleTransaction,
      date: utcScrapCreatedAt,
      saleType,
      previousBalance: previousBalanceForSaleTransaction,
      currentBalance: currentBalanceForSaleTransaction,
      unchangedPaid: Number(createdScrapProductSell.paid),
      unchangedDue: Number(createdScrapProductSell.due),
      scrapProductSellId: _id,
      advanceAmount: 0,
      salesId: createdSale._id
    });

    await createdSale.save();
    await saleTransaction.save();

    createdScrapProductSell.salesId = createdSale._id;
    await createdScrapProductSell.save();

    res.status(201).json(createdScrapProductSell);
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();

    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.searchById = async (req, res) => {
  try {
    const { id } = req.params;
    const scrapProductSell = await ScrapProductSell.findById(id);

    if (!scrapProductSell)
      return res.status(409).json({ message: "Invalid ID!" });

    res.status(201).json(scrapProductSell);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.addPayment = async (req, res) => {
  // const session = await mongoose.startSession();

  const { id } = req.params;
  const { date, amount, cash, bankPaymentAmount, unchangedAmount } = req.body;

  const utcDate = combineDateWithCurrentTime(date);

  try {
    // session.startTransaction();
    // const companyProductReturn =
    //   await CompanyProductReturn.findById(id).session(session);
    const scrapProductSell = await ScrapProductSell.findById(id);

    if (scrapProductSell) {
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
      } = scrapProductSell.toObject();

      const unchangedPaid = Number(new Decimal(unchangedAmount).toFixed(4));
      const unchangedDue = Number(
        new Decimal(due).minus(new Decimal(unchangedAmount)).toFixed(4),
      );

      const refMemo = "REF-" + memo;
      const paidAmount = Number(new Decimal(amount).toFixed(4));
      // companyProductReturn.paid = companyProductReturn.paid + amount;
      scrapProductSell.paid = Number(
        new Decimal(paid).plus(new Decimal(amount)).toFixed(4),
      );

      const amountToBePaid = due;
      // companyProductReturn.due = companyProductReturn.due - amount;
      scrapProductSell.due = Number(
        new Decimal(due).minus(new Decimal(amount)).toFixed(4),
      );
      const currentDue = scrapProductSell.due;

      // transaction creation
      const transaction = new ScrapProductSellTransaction({
        ...transactionDetail,
        refMemo,
        amountToBePaid,
        paidAmount,
        date: utcDate,
        currentDue,
        scrapProductSellId: scrapProductSell._id,
        unchangedPaid,
        unchangedDue,
        cash,
        bankPaymentAmount,
      });
      // await transaction.save({ session });
      await transaction.save();

      scrapProductSell.transactionRecords.push(transaction._id);
      // await companyProductReturn.save({ session });
      await scrapProductSell.save();

      // Commit
      // await session.commitTransaction();
      // session.endSession();

      res.status(201).json({ message: "Payment updated successfully" });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();

    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.scrapProductSellStatement = async (req, res) => {
  try {
    const { page = 1, dateSearch = "", customerName = "" } = req.query;

    let searchQuery = [];
    let nameSearchQuery = { customerName };
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

    const transactions = await ScrapProductSellTransaction.find(mainSearch)
      .sort({ date: -1 })
      .populate("scrapProductSellId");

    const result = await ScrapProductSell.aggregate([
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
