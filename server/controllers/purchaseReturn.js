const Decimal = require("decimal.js");
const PurchaseReturn = require("../models/PurchaseReturn");

module.exports.index = async (req, res) => {
  try {
    const {
      dateSearch = "",
      nameSearch = "",
      page = 1,
      order = -1,
    } = req.query;

    let searchQuery = [];
    let dateSearchQuery;
    let nameSearchQuery;

    // For date search:
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
  try {
    const returns = req.body;
    const { memo } = returns;

    //* Check if the memo exists or not
    const returnFound = await PurchaseReturn.find({ memo })
    if(returnFound.length > 0) return res.status(409).json({message: "Purchase Return Already Existed!"});
    
    //* Exchange creation
    const purchaseReturn = new PurchaseReturn(returns);
    const createdReturn = await purchaseReturn.save();

    //* Product Inventory Adjustment
    
    res.status(201).json(createdReturn);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.addPayment = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const purchaseReturn = await PurchaseReturn.findById(id);

    if (purchaseReturn) {
      // purchaseReturn.refundReceived = purchaseReturn.refundReceived + amount;
      purchaseReturn.refundReceived = Number(
        new Decimal(purchaseReturn.refundReceived).plus(new Decimal(amount)).toFixed(4)
      );
      // purchaseReturn.refundDue = purchaseReturn.refundDue - amount;
      purchaseReturn.refundDue = Number(
        new Decimal(purchaseReturn.refundDue).minus(new Decimal(amount)).toFixed(4)
      );
      await purchaseReturn.save();

      res.status(201).json({ message: "Payment updated successfully" });
    } else {
      res.status(404).json({ message: "Purchase Return not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.searchById = async (req, res) => {
  try {
    const { id } = req.params;
    const purchaseReturn = await PurchaseReturn.findById(id);
    if(!purchaseReturn) return res.status(409).json({ message: "Invalid Id" })

    res.status(201).json(purchaseReturn);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};