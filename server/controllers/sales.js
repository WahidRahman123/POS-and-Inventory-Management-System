const Sales = require("../models/Sales");
const Product = require("../models/Product");

module.exports.index = async (req, res) => {
  try {
    const sales = await Sales.find({});

    res.status(201).json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.createSales = async (req, res) => {
  try {
    const arrayOfResResults = [];
    const arrayOfSales = req.body;
    for (let i = 0; i < arrayOfSales.length; i++) {
      const {
        customerName,
        address,
        productName,
        sellPrice,
        costPrice,
        quantity,
        subtotal,
      } = arrayOfSales[i];


      const sales = new Sales({
        customerName,
        address,
        productName,
        sellPrice,
        costPrice,
        quantity,
        subtotal,
      });

      const createdSales = await sales.save();

      const product = await Product.findOne({ name: productName });
      product.quantity = product.quantity - quantity;
      await product.save();

      //* response result is push into an array so that it can be sent.
      arrayOfResResults.push(createdSales);
    }

    res.status(201).json(arrayOfResResults);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.searchByDates = async (req, res) => {
  try {
    const date = req.query.d;

    if (!date) return res.status(400).json({ message: "Invalid Dates!" });

    // Today's sales:
    if (date && date == "t") {
      const now = new Date();
      const sales = await Sales.find({ createdAt: { $eq: now } });

      if (sales) {
        return res.status(200).json(sales);
      } else {
        return res.status(404).json({ message: "Sales not found" });
      }
    }

    // Weekly sales:
    if (date && date == "w") {
      const now = new Date();

      const startOfWeek = new Date(now);
      startOfWeek.setHours(0, 0, 0, 0);
      const day = startOfWeek.getDay();
      const diff = day >= 6 ? day - 6 : day + 1;

      startOfWeek.setDate(startOfWeek.getDate() - diff);

      const sales = await Sales.find({
        createdAt: { $gte: startOfWeek, $lte: now },
      });

      if (sales) {
        return res.status(200).json(sales);
      } else {
        return res.status(404).json({ message: "Sales not found" });
      }
    }

    // Monthly sales:
    if (date && date == "m") {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      const sales = await Sales.find({
        createdAt: { $gte: startOfMonth, $lt: endOfMonth },
      });

      if (sales) {
        return res.status(200).json(sales);
      } else {
        return res.status(404).json({ message: "Sales not found" });
      }
    }

    // Yearly sales:
    if (date && date == "y") {
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear() + 1, 0, 1);

      const sales = await Sales.find({
        createdAt: { $gte: startOfYear, $lt: endOfYear },
      });

      if (sales) {
        return res.status(200).json(sales);
      } else {
        return res.status(404).json({ message: "Sales not found" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
