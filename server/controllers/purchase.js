const { default: mongoose } = require("mongoose");
const Purchase = require("../models/Purchase");
const Product = require("../models/Product");
const Decimal = require("decimal.js");
const PurchaseTransaction = require("../models/PurchaseTransaction");
const { createCustomDate } = require("../utils/createCustomDate");
const { getNextSequenceForOther } = require("../utils/getNextSequenceForOther");

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
      nameSearchQuery = { supplierName: { $regex: nameSearch, $options: "i" } };
      searchQuery.push(nameSearchQuery);
    }

    const mainSearch = searchQuery.length !== 0 ? { $and: searchQuery } : {};

    const limit = 10;

    // Pagination
    const skip = (parseInt(page) - 1) * limit;

    const purchases = await Purchase.find(mainSearch)
      .sort({ createdAt: parseInt(order) })
      .skip(skip)
      .limit(limit);

    // Count total documents
    const total = await Purchase.countDocuments(mainSearch);

    // res.status(201).json(purchases);
    res.status(201).json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      purchases,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.createPurchase = async (req, res) => {
  // const session = await mongoose.startSession();
  try {
    const purchases = req.body;
    // const { memo } = purchases;
    const { purchaseType } = purchases;
    const {
      createdAt,
      issuedAt,
      products,
      totalAmount,
      paid,
      due,
      companyMemo,
      ...transactionDetail
    } = purchases;

    // console.log(products);

    // session.startTransaction();

    if (purchaseType === "normal") {
      //* Generate the memo
      // const count = await getNextSequenceForOther("Purchase", session);
      const count = await getNextSequenceForOther("Purchase");
      if (!count) {
        throw new Error("Failed to generate sequence");
      }
      const memo = "P-" + count.seq;

      //* Transaction Creation
      const transactionDetails = {
        ...transactionDetail,
        refMemo: companyMemo,
        amountToBePaid: totalAmount,
        paidAmount: paid,
        date: createdAt,
        currentDue: due,
      };
      const transaction = new PurchaseTransaction(transactionDetails);

      //* Purchase creation
      const purchase = new Purchase({
        ...purchases,
        memo,
        transactionRecords: [transaction._id],
      });

      transaction.purchaseId = purchase._id;
      // await transaction.save({ session });
      await transaction.save();

      // const createdPurchase = await purchase.save({ session });
      const createdPurchase = await purchase.save();

      if (products && products.length > 0) {
        for (let i = 0; i < products.length; i++) {
          const { productId, productName, quantity, unitPrice } = products[i];
          // const product = await Product.findOne({ name: productName }).session(
          //   session,
          // );
          const product = await Product.findById(productId);

          if (!product) {
            throw new Error(`Product not found: ${productName}`);
          }

          product.quantity = product.quantity + quantity;
          product.costPrice = unitPrice;
          // await product.save({ session });
          await product.save();
        }
      }

      // Commit
      // await session.commitTransaction();
      // session.endSession();

      res.status(201).json(createdPurchase);
    } else if (purchaseType === "advance") {
      //* Generate the memo
      // const count = await getNextSequenceForOther("Purchase", session);
      const count = await getNextSequenceForOther("Purchase");
      if (!count) {
        throw new Error("Failed to generate sequence");
      }
      const memo = "PA-" + count.seq;

      //* Transaction Creation
      const transactionDetails = {
        ...transactionDetail,
        refMemo: memo, //! companyMemo replace kore memo use korchi!
        amountToBePaid: totalAmount,
        paidAmount: paid,
        date: createdAt,
        currentDue: due,
      };
      const transaction = new PurchaseTransaction(transactionDetails);

      //* Purchase creation
      const purchase = new Purchase({
        ...purchases,
        memo,
        companyMemo: memo,
        transactionRecords: [transaction._id],
      });

      transaction.purchaseId = purchase._id;
      // await transaction.save({ session });
      await transaction.save();

      // const createdPurchase = await purchase.save({ session });
      const createdPurchase = await purchase.save();

      // Commit
      // await session.commitTransaction();
      // session.endSession();

      res.status(201).json(createdPurchase);
    }
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
    const purchase = await Purchase.findById(id);

    res.status(201).json(purchase);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.addPayment = async (req, res) => {
  // const session = await mongoose.startSession();

  const { id } = req.params;
  const { date, amount, unchangedAmount, cash, bankPaymentAmount } = req.body;

  try {
    // session.startTransaction();
    // const purchase = await Purchase.findById(id).session(session);
    const purchase = await Purchase.findById(id);

    if (purchase) {
      const {
        createdAt,
        issuedAt,
        products,
        transactionRecords,
        totalAmount,
        paid,
        due,
        companyMemo,
        _id,
        ...transactionDetail
      } = purchase.toObject();

      const unchangedPaid = Number(new Decimal(unchangedAmount).toFixed(4));
      const unchangedDue = Number(
        new Decimal(due).minus(new Decimal(unchangedAmount)).toFixed(4),
      );

      const refMemo = "REF-" + companyMemo;
      const paidAmount = Number(new Decimal(amount).toFixed(4));
      // purchase.paid = purchase.paid + amount;
      purchase.paid = Number(
        new Decimal(paid).plus(new Decimal(amount)).toFixed(4),
      );

      const amountToBePaid = due;
      // purchase.due = purchase.due - amount;
      purchase.due = Number(
        new Decimal(due).minus(new Decimal(amount)).toFixed(4),
      );
      const currentDue = purchase.due;

      // transaction creation
      const transaction = new PurchaseTransaction({
        ...transactionDetail,
        refMemo,
        amountToBePaid,
        paidAmount,
        date: createCustomDate(date),
        currentDue,
        purchaseId: purchase._id,
        cash,
        bankPaymentAmount,
        unchangedPaid,
        unchangedDue,
      });
      // await transaction.save({ session });
      await transaction.save();

      purchase.transactionRecords.push(transaction._id);
      // await purchase.save({ session });
      await purchase.save();

      // Commit
      // await session.commitTransaction();
      // session.endSession();

      res.status(201).json({ message: "Payment updated successfully" });
    } else {
      res.status(404).json({ message: "Purchase not found" });
    }
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();

    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.paymentForAdvance = async (req, res) => {
  // const session = await mongoose.startSession();

  const { id } = req.params;
  const { date, productDetails, productTotal } = req.body;

  try {
    // session.startTransaction();
    // const purchase = await Purchase.findById(id).session(session);
    const purchase = await Purchase.findById(id);

    if (purchase) {
      const {
        createdAt,
        issuedAt,
        products,
        transactionRecords,
        totalAmount,
        paid,
        due,
        companyMemo,
        _id,
        ...transactionDetail
      } = purchase.toObject();

      //* purchase Edit
      productDetails.forEach((newItem) => {
        const existingProduct = purchase.products.find(
          (item) => item.productId.toString() === newItem.productId.toString(),
        );

        if (existingProduct) {
          existingProduct.quantity += newItem.quantity;

          existingProduct.unitPrice = newItem.unitPrice;

          existingProduct.subTotal =
            existingProduct.quantity * existingProduct.unitPrice;
        } else {
          purchase.products.push(newItem);
        }
      });

      purchase.totalAmount = Number(
        new Decimal(productTotal).plus(new Decimal(purchase.totalAmount)).toFixed(4),
      );
      
      purchase.due = Number(
        new Decimal(purchase.totalAmount).minus(new Decimal(purchase.paid)).toFixed(4),
      );

      const unchangedPaid = 0;
      const unchangedDue = purchase.due;

      const refMemo = "REF-" + companyMemo;
      const paidAmount = 0;

      const amountToBePaid = 0;
      const currentDue = purchase.due;
      const adjustmentDetails = productDetails;

      // transaction creation
      const transaction = new PurchaseTransaction({
        ...transactionDetail,
        refMemo,
        amountToBePaid,
        paidAmount,
        date: createCustomDate(date),
        currentDue,
        purchaseId: purchase._id,
        unchangedPaid,
        unchangedDue,
        adjustmentDetails
      });
      // await transaction.save({ session });
      await transaction.save();

      purchase.transactionRecords.push(transaction._id);
      // await purchase.save({ session });
      await purchase.save();

      if (productDetails && productDetails.length > 0) {
        for (let i = 0; i < productDetails.length; i++) {
          const { productId, productName, quantity, unitPrice } = productDetails[i];
          // const product = await Product.findOne({ name: productName }).session(
          //   session,
          // );
          const product = await Product.findById(productId);

          if (!product) {
            throw new Error(`Product not found: ${productName}`);
          }

          product.quantity = product.quantity + quantity;
          product.costPrice = unitPrice;
          // await product.save({ session });
          await product.save();
        }
      }

      // Commit
      // await session.commitTransaction();
      // session.endSession();

      res.status(201).json({ message: "Advance adjusts successfully" });
    } else {
      res.status(404).json({ message: "Purchase not found!" });
    }
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();

    console.error(error);
    res.status(500).send("Server Error");
  }
};
