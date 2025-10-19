const Purchase = require("../models/Purchase");
const Decimal = require("decimal.js");

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
    const purchases = req.body;

    //* sales creation
    const purchase = new Purchase(purchases);

    const createdPurchase = await purchase.save();

    res.status(201).json(createdPurchase);
  } catch (error) {
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
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const purchase = await Purchase.findById(id);

    if (purchase) {
      // purchase.paid = purchase.paid + amount;
      purchase.paid = Number(
        new Decimal(purchase.paid).plus(new Decimal(amount)).toFixed(4)
      );
      // purchase.due = purchase.due - amount;
      purchase.due = Number(
        new Decimal(purchase.due).minus(new Decimal(amount)).toFixed(4)
      );
      await purchase.save();

      res.status(201).json({ message: "Payment updated successfully" });
    } else {
      res.status(404).json({ message: "Purchase not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
