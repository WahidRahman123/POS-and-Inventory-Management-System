const { default: mongoose } = require("mongoose");
const Purchase = require("../models/Purchase");
const Product = require("../models/Product");
const Supplier = require("../models/Supplier");
const Decimal = require("decimal.js");
const PurchaseTransaction = require("../models/PurchaseTransaction");
const { createCustomDate } = require("../utils/createCustomDate");
const { getNextSequenceForOther } = require("../utils/getNextSequenceForOther");
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
  try {
    const {
      supplierId,
      purchaseType,
      totalAmount = 0,
      paid = 0,
      due = 0,
      advancePaymentAmount = 0,
      companyMemo = "",
      products = [],
      createdAt,
      supplierName,
      address,
      supplierEmail,
      supplierPhone,
      transactionType,
      userId,
    } = req.body;

    const utcCreatedAt = combineDateWithCurrentTime(createdAt);
    const now = dayjs()
      .tz("Asia/Dhaka")
      .utc()
      .toDate();

    // Get Supplier's Current Balance BEFORE this transaction
    const supplier = await Supplier.findById(supplierId);
    if (!supplier)
      return res.status(404).json({ message: "Supplier not found" });

    const previousBalance = new Decimal(supplier.totalBalance || 0);

    // Generate Memo
    const count =
      purchaseType === "normal"
        ? await getNextSequenceForOther("PurchaseNormal")
        : await getNextSequenceForOther("PurchaseAdvance");

    const memo =
      purchaseType === "advance" ? `PA-${count.seq}` : `P-${count.seq}`;

    const purchase = new Purchase({
      supplierId,
      supplierName,
      address,
      supplierEmail,
      supplierPhone,
      userId,
      purchaseType,
      memo,
      companyMemo: companyMemo || memo,
      products,
      totalAmount: Number(totalAmount),
      paid: Number(paid),
      due: Number(due),
      advancePaymentAmount: Number(advancePaymentAmount),
      createdAt: utcCreatedAt,
      issuedAt: now,
    });

    // Calculate New Balance
    let newBalance = previousBalance;
    const amountToBePaid = supplier.totalBalance;

    if (purchaseType === "advance") {
      newBalance = previousBalance.plus(paid);
    } else {
      newBalance = previousBalance.minus(totalAmount);

      // Stock Update
      for (let item of products) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { quantity: item.quantity },
          costPrice: item.unitPrice,
        });
      }
    }

    // Update Supplier
    supplier.totalBalance = Number(newBalance.toFixed(4));
    const currentBalance = supplier.totalBalance;

    // Transaction
    const transaction = new PurchaseTransaction({
      supplierId,
      supplierName,
      address,
      supplierEmail,
      supplierPhone,
      userId,
      refMemo: memo,
      amountToBePaid,
      amount: purchaseType === "advance" ? Number(paid) : Number(totalAmount),
      paidAmount: purchaseType === "advance" ? Number(paid) : 0,
      currentDue: Number(due),
      currentBalance,
      previousBalance: Number(previousBalance.toFixed(4)),
      date: utcCreatedAt,
      purchaseId: purchase._id,
      purchaseType,
      transactionType,
      advancePaymentAmount: Number(advancePaymentAmount),
      unchangedPaid: Number(paid),
      unchangedDue: Number(due),
    });

    purchase.transactionRecords = [transaction._id];

    await transaction.save();
    await supplier.save();
    purchase.previousBalance = Number(previousBalance.toFixed(4));
    purchase.currentBalance = currentBalance;
    const createdPurchase = await purchase.save();

    // Important: Send balance data for Invoice
    res.status(201).json({
      ...createdPurchase.toObject(),
      previousBalance: Number(previousBalance.toFixed(2)),
      currentBalance: Number(newBalance.toFixed(2)),
    });
  } catch (error) {
    console.error("Create Purchase Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};
// module.exports.createPurchase = async (req, res) => {
//   // const session = await mongoose.startSession();
//   try {
//     const purchases = req.body;
//     // const { memo } = purchases;
//     const { purchaseType } = purchases;
//     const {
//       createdAt,
//       issuedAt,
//       products,
//       totalAmount,
//       paid,
//       due,
//       companyMemo,
//       ...transactionDetail
//     } = purchases;

//     // console.log(products);

//     // session.startTransaction();

//     if (purchaseType === "normal") {
//       //* Generate the memo
//       // const count = await getNextSequenceForOther("Purchase", session);
//       const count = await getNextSequenceForOther("Purchase");
//       if (!count) {
//         throw new Error("Failed to generate sequence");
//       }
//       const memo = "P-" + count.seq;

//       //* Transaction Creation
//       const transactionDetails = {
//         ...transactionDetail,
//         refMemo: companyMemo,
//         amountToBePaid: totalAmount,
//         paidAmount: paid,
//         date: createdAt,
//         currentDue: due,
//       };
//       const transaction = new PurchaseTransaction(transactionDetails);

//       //* Purchase creation
//       const purchase = new Purchase({
//         ...purchases,
//         memo,
//         transactionRecords: [transaction._id],
//       });

//       transaction.purchaseId = purchase._id;
//       // await transaction.save({ session });
//       await transaction.save();

//       // const createdPurchase = await purchase.save({ session });
//       const createdPurchase = await purchase.save();

//       if (products && products.length > 0) {
//         for (let i = 0; i < products.length; i++) {
//           const { productId, productName, quantity, unitPrice } = products[i];
//           // const product = await Product.findOne({ name: productName }).session(
//           //   session,
//           // );
//           const product = await Product.findById(productId);

//           if (!product) {
//             throw new Error(`Product not found: ${productName}`);
//           }

//           product.quantity = product.quantity + quantity;
//           product.costPrice = unitPrice;
//           // await product.save({ session });
//           await product.save();
//         }
//       }

//       // Commit
//       // await session.commitTransaction();
//       // session.endSession();

//       res.status(201).json(createdPurchase);
//     } else if (purchaseType === "advance") {
//       //* Generate the memo
//       // const count = await getNextSequenceForOther("Purchase", session);
//       const count = await getNextSequenceForOther("Purchase");
//       if (!count) {
//         throw new Error("Failed to generate sequence");
//       }
//       const memo = "PA-" + count.seq;

//       //* Transaction Creation
//       const transactionDetails = {
//         ...transactionDetail,
//         refMemo: memo, //! companyMemo replace kore memo use korchi!
//         amountToBePaid: totalAmount,
//         paidAmount: paid,
//         date: createdAt,
//         currentDue: due,
//       };
//       const transaction = new PurchaseTransaction(transactionDetails);

//       //* Purchase creation
//       const purchase = new Purchase({
//         ...purchases,
//         memo,
//         companyMemo: memo,
//         transactionRecords: [transaction._id],
//       });

//       transaction.purchaseId = purchase._id;
//       // await transaction.save({ session });
//       await transaction.save();

//       // const createdPurchase = await purchase.save({ session });
//       const createdPurchase = await purchase.save();

//       // Commit
//       // await session.commitTransaction();
//       // session.endSession();

//       res.status(201).json(createdPurchase);
//     }
//   } catch (error) {
//     // await session.abortTransaction();
//     // session.endSession();

//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };
// module.exports.createPurchase = async (req, res) => {
//   try {
//     const {
//       supplierId,
//       purchaseType,
//       totalAmount = 0,
//       paid = 0,
//       due = 0,
//       advancePaymentAmount = 0,
//       companyMemo = "",
//       products = [],
//       createdAt,
//       advanceUsed = 0,
//       ...rest
//     } = req.body;

//     // Generate Memo
//     const count = await getNextSequenceForOther("Purchase");
//     if (!count) throw new Error("Failed to generate memo");

//     const memo = purchaseType === "advance" ? `PA-${count.seq}` : `P-${count.seq}`;

//     const purchase = new Purchase({
//       supplierId,
//       supplierName: rest.supplierName,
//       address: rest.address,
//       supplierEmail: rest.supplierEmail,
//       supplierPhone: rest.supplierPhone,
//       userId: rest.userId,
//       purchaseType,
//       memo,
//       companyMemo: companyMemo || memo,
//       products,
//       totalAmount: Number(totalAmount),
//       paid: Number(paid),
//       due: Number(due),
//       advancePaymentAmount: Number(advancePaymentAmount),
//       createdAt: createdAt || new Date(),
//       issuedAt: new Date(),
//     });

//     // ================== Advance Balance Logic ==================
//     if (purchaseType === "advance" && advancePaymentAmount > 0) {
//       await Supplier.findByIdAndUpdate(supplierId, {
//         $inc: { advanceBalance: Number(advancePaymentAmount) }
//       });
//     }

//     if (purchaseType === "normal" && advanceUsed > 0) {
//       await Supplier.findByIdAndUpdate(supplierId, {
//         $inc: { advanceBalance: -Number(advanceUsed) }
//       });
//     }

//     // Stock Update for Normal Purchase
//     if (purchaseType === "normal" && products?.length > 0) {
//       for (let item of products) {
//         await Product.findByIdAndUpdate(item.productId, {
//           $inc: { quantity: item.quantity },
//           costPrice: item.unitPrice
//         });
//       }
//     }

//     // ================== Transaction Record ==================
//     const transaction = new PurchaseTransaction({
//       supplierId,
//       supplierName: rest.supplierName,
//       address: rest.address,
//       supplierEmail: rest.supplierEmail,
//       supplierPhone: rest.supplierPhone,
//       userId: rest.userId,
//       refMemo: memo,
//       amountToBePaid: Number(totalAmount),
//       paidAmount: Number(paid),
//       currentDue: Number(due),
//       date: createdAt || new Date(),
//       purchaseId: purchase._id,
//       purchaseType,
//       advancePaymentAmount: Number(advancePaymentAmount),

//       // Required Fields
//       unchangedPaid: Number(paid),
//       unchangedDue: Number(due),
//     });

//     purchase.transactionRecords = [transaction._id];

//     await transaction.save();
//     const createdPurchase = await purchase.save();

//     res.status(201).json(createdPurchase);

//   } catch (error) {
//     console.error("Create Purchase Error:", error);
//     res.status(500).json({ message: error.message || "Server Error" });
//   }
// };
// module.exports.createPurchase = async (req, res) => {
//   try {
//     const {
//       supplierId,
//       purchaseType,
//       totalAmount = 0,
//       paid = 0,
//       due = 0,
//       advancePaymentAmount = 0,
//       companyMemo = "",
//       products = [],
//       createdAt,
//       advanceUsed = 0,
//       supplierName,
//       address,
//       supplierEmail,
//       supplierPhone,
//       userId,
//       ...rest
//     } = req.body;

//     // Generate Memo
//     const count = await getNextSequenceForOther("Purchase");
//     if (!count) throw new Error("Failed to generate memo");

//     const memo = purchaseType === "advance" ? `PA-${count.seq}` : `P-${count.seq}`;

//     const purchase = new Purchase({
//       supplierId,
//       supplierName,
//       address,
//       supplierEmail,
//       supplierPhone,
//       userId,
//       purchaseType,
//       memo,
//       companyMemo: companyMemo || memo,
//       products,
//       totalAmount: Number(totalAmount),
//       paid: Number(paid),
//       due: Number(due),
//       advancePaymentAmount: Number(advancePaymentAmount),
//       createdAt: createdAt || new Date(),
//       issuedAt: new Date(),
//     });

//     // ================== Balance Logic ==================
//     const supplier = await Supplier.findById(supplierId);
//     if (!supplier) throw new Error("Supplier not found");

//     if (purchaseType === "advance" && advancePaymentAmount > 0) {
//       supplier.balance = Number(new Decimal(supplier.balance || 0).plus(advancePaymentAmount).toFixed(4));
//     }

//     if (purchaseType === "normal" && advanceUsed > 0) {
//       supplier.balance = Number(new Decimal(supplier.balance || 0).minus(advanceUsed).toFixed(4));
//     }

//     await supplier.save();

//     // Stock Update
//     if (purchaseType === "normal" && products?.length > 0) {
//       for (let item of products) {
//         await Product.findByIdAndUpdate(item.productId, {
//           $inc: { quantity: item.quantity },
//           costPrice: item.unitPrice
//         });
//       }
//     }

//     // ================== Transaction Record ==================
//     const transaction = new PurchaseTransaction({
//       supplierId,
//       supplierName,
//       address,
//       supplierEmail,
//       supplierPhone,
//       userId,
//       refMemo: memo,
//       amountToBePaid: Number(totalAmount),
//       paidAmount: Number(paid),
//       currentDue: Number(due),
//       date: createdAt || new Date(),
//       purchaseId: purchase._id,
//       purchaseType,
//       advancePaymentAmount: Number(advancePaymentAmount),
//       unchangedPaid: Number(paid),
//       unchangedDue: Number(due),
//     });

//     purchase.transactionRecords = [transaction._id];

//     await transaction.save();
//     const createdPurchase = await purchase.save();

//     res.status(201).json(createdPurchase);

//   } catch (error) {
//     console.error("Create Purchase Error:", error);
//     res.status(500).json({ message: error.message || "Server Error" });
//   }
// };
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

// module.exports.addPayment = async (req, res) => {
//   // const session = await mongoose.startSession();

//   const { id } = req.params;
//   const { date, amount, unchangedAmount, cash, bankPaymentAmount } = req.body;

//   try {
//     // session.startTransaction();
//     // const purchase = await Purchase.findById(id).session(session);
//     const purchase = await Purchase.findById(id);

//     if (purchase) {
//       const {
//         createdAt,
//         issuedAt,
//         products,
//         transactionRecords,
//         totalAmount,
//         paid,
//         due,
//         companyMemo,
//         _id,
//         ...transactionDetail
//       } = purchase.toObject();

//       const unchangedPaid = Number(new Decimal(unchangedAmount).toFixed(4));
//       const unchangedDue = Number(
//         new Decimal(due).minus(new Decimal(unchangedAmount)).toFixed(4),
//       );

//       const refMemo = "REF-" + companyMemo;
//       const paidAmount = Number(new Decimal(amount).toFixed(4));
//       // purchase.paid = purchase.paid + amount;
//       purchase.paid = Number(
//         new Decimal(paid).plus(new Decimal(amount)).toFixed(4),
//       );

//       const amountToBePaid = due;
//       // purchase.due = purchase.due - amount;
//       purchase.due = Number(
//         new Decimal(due).minus(new Decimal(amount)).toFixed(4),
//       );
//       const currentDue = purchase.due;

//       // transaction creation
//       const transaction = new PurchaseTransaction({
//         ...transactionDetail,
//         refMemo,
//         amountToBePaid,
//         paidAmount,
//         date: createCustomDate(date),
//         currentDue,
//         purchaseId: purchase._id,
//         cash,
//         bankPaymentAmount,
//         unchangedPaid,
//         unchangedDue,
//       });
//       // await transaction.save({ session });
//       await transaction.save();

//       purchase.transactionRecords.push(transaction._id);
//       // await purchase.save({ session });
//       await purchase.save();

//       // Commit
//       // await session.commitTransaction();
//       // session.endSession();

//       res.status(201).json({ message: "Payment updated successfully" });
//     } else {
//       res.status(404).json({ message: "Purchase not found" });
//     }
//   } catch (error) {
//     // await session.abortTransaction();
//     // session.endSession();

//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

module.exports.addPayment = async (req, res) => {
  try {
    const {
      id,
      supplierId,
      isSupplierLevel,
      amount,
      date,
      cash,
      bankPaymentAmount,
      unchangedAmount,
    } = req.body;

    const utcDate = combineDateWithCurrentTime(date);

    let purchase;

    if (isSupplierLevel) {
      // Supplier Level Due Payment
      purchase = await Purchase.findOne({ supplierId: supplierId });
      if (!purchase) {
        return res
          .status(404)
          .json({ message: "No purchase found for this supplier" });
      }
    } else {
      // Individual Purchase Due Payment
      purchase = await Purchase.findById(id);
      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }
    }

    const paidAmount = Number(amount);
    const previousDue = Number(purchase.due);

    // Update Purchase
    purchase.paid = Number(
      new Decimal(purchase.paid).plus(paidAmount).toFixed(4),
    );
    purchase.due = Number(
      new Decimal(previousDue).minus(paidAmount).toFixed(4),
    );

    // Create Transaction
    const transaction = new PurchaseTransaction({
      supplierId: purchase.supplierId,
      supplierName: purchase.supplierName,
      address: purchase.address,
      supplierEmail: purchase.supplierEmail,
      supplierPhone: purchase.supplierPhone,
      userId: purchase.userId,
      refMemo: "REF-" + purchase.memo,
      amountToBePaid: previousDue,
      paidAmount: paidAmount,
      currentDue: purchase.due,
      date: utcDate,
      cash: Number(cash || 0),
      bankPaymentAmount: Number(bankPaymentAmount || 0),
      unchangedPaid: Number(unchangedAmount || paidAmount),
      unchangedDue: previousDue,
      purchaseId: purchase._id,
      purchaseType: purchase.purchaseType,
    });

    await transaction.save();
    purchase.transactionRecords.push(transaction._id);

    await purchase.save();

    res.status(201).json({ message: "Payment updated successfully" });
  } catch (error) {
    console.error("Add Payment Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

module.exports.paymentForAdvance = async (req, res) => {
  // const session = await mongoose.startSession();

  const { id } = req.params;
  const { date, productDetails, productTotal } = req.body;

  const utcDate = combineDateWithCurrentTime(date);

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
        new Decimal(productTotal)
          .plus(new Decimal(purchase.totalAmount))
          .toFixed(4),
      );

      purchase.due = Number(
        new Decimal(purchase.totalAmount)
          .minus(new Decimal(purchase.paid))
          .toFixed(4),
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
        date: utcDate,
        currentDue,
        purchaseId: purchase._id,
        unchangedPaid,
        unchangedDue,
        adjustmentDetails,
      });
      // await transaction.save({ session });
      await transaction.save();

      purchase.transactionRecords.push(transaction._id);
      // await purchase.save({ session });
      await purchase.save();

      if (productDetails && productDetails.length > 0) {
        for (let i = 0; i < productDetails.length; i++) {
          const { productId, productName, quantity, unitPrice } =
            productDetails[i];
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

// Supplier Level Due Payment
// Supplier Level Due Payment
// module.exports.supplierDuePayment = async (req, res) => {
//   try {
//     const { supplierId, amount, date, cash, bankPaymentAmount, unchangedAmount } = req.body;

//     if (!supplierId) {
//       return res.status(400).json({ message: "Supplier ID is required" });
//     }

//     const purchase = await Purchase.findOne({ supplierId });
//     if (!purchase) {
//       return res.status(404).json({ message: "No purchase found for this supplier" });
//     }

//     const paidAmount = Number(amount);
//     const previousDue = Number(purchase.due);

//     purchase.paid = Number(new Decimal(purchase.paid).plus(paidAmount).toFixed(4));
//     purchase.due = Number(new Decimal(previousDue).minus(paidAmount).toFixed(4));

//     const transaction = new PurchaseTransaction({
//       supplierId: purchase.supplierId,
//       supplierName: purchase.supplierName,
//       address: purchase.address,
//       supplierEmail: purchase.supplierEmail,
//       supplierPhone: purchase.supplierPhone,
//       userId: purchase.userId,
//       refMemo: "REF-DUE-" + purchase.memo,
//       amountToBePaid: previousDue,
//       paidAmount: paidAmount,
//       currentDue: purchase.due,
//       date: date || new Date(),
//       cash: Number(cash || 0),
//       bankPaymentAmount: Number(bankPaymentAmount || 0),
//       unchangedPaid: Number(unchangedAmount || paidAmount),
//       unchangedDue: previousDue,
//       purchaseId: purchase._id,
//       purchaseType: "normal",
//       advancePaymentAmount: 0,        // ← এটা যোগ করো
//     });

//     await transaction.save();
//     purchase.transactionRecords.push(transaction._id);
//     await purchase.save();

//     res.status(201).json({ message: "Supplier Due Payment updated successfully" });

//   } catch (error) {
//     console.error("Supplier Due Payment Error:", error);
//     res.status(500).json({ message: error.message || "Server Error" });
//   }
// };

// Supplier Level Due Payment
// module.exports.supplierDuePayment = async (req, res) => {
//   try {
//     const { supplierId, amount, date, cash, bankPaymentAmount, unchangedAmount } = req.body;

//     if (!supplierId) {
//       return res.status(400).json({ message: "Supplier ID is required" });
//     }

//     // Find latest purchase of this supplier
//     const purchase = await Purchase.findOne({ supplierId }).sort({ createdAt: -1 });
//     if (!purchase) {
//       return res.status(404).json({ message: "No purchase found for this supplier" });
//     }

//     const paidAmount = Number(amount);
//     const previousDue = Number(purchase.due);

//     // Update Purchase Due
//     purchase.paid = Number(new Decimal(purchase.paid).plus(paidAmount).toFixed(4));
//     purchase.due = Number(new Decimal(previousDue).minus(paidAmount).toFixed(4));

//     // Create Transaction with all required fields
//     const transaction = new PurchaseTransaction({
//       supplierId: purchase.supplierId,
//       supplierName: purchase.supplierName,
//       address: purchase.address,
//       supplierEmail: purchase.supplierEmail || "",
//       supplierPhone: purchase.supplierPhone,
//       userId: purchase.userId,
//       refMemo: "REF-DUE-" + purchase.memo,
//       amountToBePaid: previousDue,
//       paidAmount: paidAmount,
//       currentDue: purchase.due,
//       date: date || new Date(),
//       cash: Number(cash || 0),
//       bankPaymentAmount: Number(bankPaymentAmount || 0),
//       unchangedPaid: Number(unchangedAmount || paidAmount),
//       unchangedDue: previousDue,
//       purchaseId: purchase._id,
//       purchaseType: "normal",
//       advancePaymentAmount: 0,
//     });

//     await transaction.save();
//     purchase.transactionRecords.push(transaction._id);
//     await purchase.save();

//     res.status(201).json({ message: "Supplier Due Payment updated successfully" });

//   } catch (error) {
//     console.error("Supplier Due Payment Error:", error);
//     res.status(500).json({ message: error.message || "Server Error" });
//   }
// };

// শেষের supplierDuePayment ফাংশনটা পুরোটা এই কোড দিয়ে replace করো
// module.exports.supplierDuePayment = async (req, res) => {
//   try {
//     const { supplierId, amount, date, cash = 0, bankPaymentAmount = 0 } = req.body;

//     if (!supplierId || Number(amount) <= 0) {
//       return res.status(400).json({ message: "Supplier ID and valid amount required" });
//     }

//     const supplier = await Supplier.findById(supplierId);
//     if (!supplier) return res.status(404).json({ message: "Supplier not found" });

//     const paidAmount = Number(amount);
//     const previousBalance = new Decimal(supplier.balance || 0);

//     // 🔥 Supplier Balance আপডেট (এটাই মূল জিনিস)
//     supplier.balance = Number(previousBalance.minus(paidAmount).toFixed(4));
//     await supplier.save();

//     // Reference এর জন্য latest purchase নাও
//     const latestPurchase = await Purchase.findOne({ supplierId }).sort({ createdAt: -1 });

//     const transaction = new PurchaseTransaction({
//       supplierId,
//       supplierName: supplier.name,
//       address: supplier.address,
//       supplierEmail: supplier.email || "",
//       supplierPhone: supplier.phone,
//       userId: req.user?.id || null,
//       refMemo: `DUE-PAY-${latestPurchase ? latestPurchase.memo : 'SUP'}`,  // ← আরও সুন্দর
//       amountToBePaid: 0,
//       paidAmount: paidAmount,
//       currentDue: Number(supplier.balance),
//       date: date || new Date(),
//       cash: Number(cash),
//       bankPaymentAmount: Number(bankPaymentAmount),
//       unchangedPaid: paidAmount,
//       unchangedDue: Number(previousBalance),
//       purchaseType: "normal",
//       advancePaymentAmount: 0,
//       purchaseId: latestPurchase ? latestPurchase._id : null,
//     });

//     await transaction.save();

//     res.status(201).json({
//       message: "Supplier Due Payment recorded successfully",
//       currentBalance: supplier.balance
//     });

//   } catch (error) {
//     console.error("Supplier Due Payment Error:", error);
//     res.status(500).json({ message: error.message || "Server Error" });
//   }
// };

// supplierDuePayment ফাংশনের ভিতরে এই অংশটা আপডেট করো
module.exports.supplierDuePayment = async (req, res) => {
  try {
    const {
      supplierId,
      amount,
      date,
      cash = 0,
      remarks,
      bankPaymentAmount = 0,
    } = req.body;

    const utcDate = combineDateWithCurrentTime(date);

    console.log(amount);

    if (!supplierId || Number(amount) <= 0) {
      return res
        .status(400)
        .json({ message: "Supplier ID and valid amount required" });
    }

    const supplier = await Supplier.findById(supplierId);
    if (!supplier)
      return res.status(404).json({ message: "Supplier not found" });

    const paidAmount = Number(amount);
    const previousBalance = new Decimal(supplier.totalBalance);
    const amountToBePaid = supplier.totalBalance;

    // Supplier Balance Update
    supplier.totalBalance = Number(previousBalance.plus(paidAmount).toFixed(4));

    const currentBalance = supplier.totalBalance;
    await supplier.save();

    // Generate Independent Memo for Due Payment
    const count = await getNextSequenceForOther("PurchaseDue"); // নতুন সিকোয়েন্স
    const memo = `DUE-PAY-${count.seq}`;

    const transaction = new PurchaseTransaction({
      supplierId,
      supplierName: supplier.name,
      address: supplier.address,
      supplierEmail: supplier.email || "",
      supplierPhone: supplier.phone,
      userId: req.user?.id || null,
      refMemo: memo, // ← এখন স্বাধীন
      amountToBePaid: Number(amountToBePaid),
      paidAmount,
      remarks,
      amount: Number(amount),
      currentDue: currentBalance,
      currentBalance,
      date: utcDate,
      cash: Number(cash),
      bankPaymentAmount: Number(bankPaymentAmount),
      unchangedPaid: paidAmount,
      unchangedDue: Number(previousBalance),
      purchaseType: "due",
      transactionType: "credit",
      advancePaymentAmount: 0,
      purchaseId: null, // Due payment এ কোনো specific purchase এর সাথে যুক্ত না
    });

    await transaction.save();

    res.status(201).json({
      message: "Supplier Due Payment recorded successfully",
      currentBalance: supplier.totalBalance,
      memo: memo,
    });
  } catch (error) {
    console.error("Supplier Due Payment Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// Get Supplier Overall Balance List for Purchase Dashboard
module.exports.getSupplierDueList = async (req, res) => {
  try {
    const { supplierName = "", order = -1 } = req.query;

    let query = {};

    // লাইভ সার্চ ফিল্টার
    if (supplierName) {
      query.name = { $regex: supplierName, $options: "i" };
    }

    // 💡 আপনার প্রোজেক্টের আসল Supplier কালেকশন থেকে ডাটা রিড করা
    const suppliers = await Supplier.find(query).sort({ totalBalance: Number(order) });

    // ডাটা কনসোল লগ দিয়ে চেক করা (ডিবাগিং এর জন্য, ডাটা না আসলে টার্মিনালে দেখতে পারবেন)
    // console.log("Total Suppliers Found in DB:", suppliers.length);

    // ম্যাপ করার সময় কোনো ফিল্ড ফাকা থাকলে বা ডিফাইন না থাকলে ডিফোল্ট ভ্যালু সেট করা
    let supplierBalances = suppliers.map((supplier) => ({
      supplierId: supplier._id,
      supplierName: supplier.name || "Unknown Supplier",
      supplierPhone: supplier.phone || "N/A",
      address: supplier.address || "",
      overallBalance:
        typeof supplier.balance !== "undefined" ? supplier.balance : 0,
      totalBalance: supplier.totalBalance || 0,
    }));

    // সর্টিং লজিক
    // supplierBalances.sort((a, b) => {
    //   if (order === -1) {
    //     return b.overallBalance - a.overallBalance;
    //   } else {
    //     return a.overallBalance - b.overallBalance;
    //   }
    // });

    // সাকসেস রেসপন্স পাঠানো
    return res.status(200).json({
      success: true,
      supplierBalances,
    });
  } catch (error) {
    console.error("Error in getSupplierDueList:", error);
    return res.status(500).json({
      message: "Supplier Balance List Fetching Failed!",
      error: error.message,
    });
  }
};
