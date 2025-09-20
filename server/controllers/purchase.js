const Purchase = require("../models/Purchase");

module.exports.index = async (req, res) => {
  try {
    const { dateSearch = "" } = req.query;

    let searchQuery;

    if (dateSearch) {
      const startOfDay = new Date(dateSearch);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(dateSearch);
      endOfDay.setHours(23, 59, 59, 999);

      searchQuery = {
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      };
    } else {
      searchQuery = {};
    }

    const purchases = await Purchase.find(searchQuery).sort({ createdAt: -1 });

    res.status(201).json(purchases);
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
      purchase.paid = purchase.paid + amount;
      purchase.due = purchase.due - amount;
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