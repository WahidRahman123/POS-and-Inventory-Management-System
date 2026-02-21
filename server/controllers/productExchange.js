const Decimal = require("decimal.js");
const ProductExchange = require("../models/ProductExchange");

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
      nameSearchQuery = { customerName: { $regex: nameSearch, $options: "i" } };
      searchQuery.push(nameSearchQuery);
    }

    const mainSearch = searchQuery.length !== 0 ? { $and: searchQuery } : {};

    const limit = 10;

    // Pagination
    const skip = (parseInt(page) - 1) * limit;

    const exchanges = await ProductExchange.find(mainSearch)
      .sort({ createdAt: parseInt(order) })
      .skip(skip)
      .limit(limit);

    // Count total documents
    const total = await ProductExchange.countDocuments(mainSearch);

    res.status(201).json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      exchanges,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.createProductExchange = async (req, res) => {
  try {
    const exchanges = req.body;
    const { memo } = exchanges;

    //* Check if the memo exists or not
    const exchangeFound = await ProductExchange.find({ memo })
    if(exchangeFound.length > 0) return res.status(409).json({message: "Exchange Already Existed!"});
    
    //* Exchange creation
    const exchange = new ProductExchange(exchanges);

    const createdExchange = await exchange.save();

    res.status(201).json(createdExchange);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.searchByMemo = async (req, res) => {
  try {
    const { search } = req.query;

    const exchanges = await ProductExchange.find({ memo: { $regex: search, $options: "i" } }, {memo: 1, totalAmount: 1, _id: 0 })

    res.status(201).json(exchanges);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};