const ProductStatement = require("../models/ProductStatement");
const dayjs = require("../utils/date.js");

module.exports.index = async (req, res) => {
  try {
    const { page = 1, productName = "", dateSearch = "" } = req.query;
    const limit = 10;
    const skip = (parseInt(page) - 1) * limit;

    let searchQuery = [];
    let nameSearchQuery;
    let dateSearchQuery;

    // For Date Search:
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

    // For name search:
    if (productName) {
      nameSearchQuery = { productName: { $regex: productName, $options: "i" } };
      searchQuery.push(nameSearchQuery);
    }

    const mainSearch = searchQuery.length !== 0 ? { $and: searchQuery } : {};

    const productStatements = await ProductStatement.find(mainSearch)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ProductStatement.countDocuments(mainSearch);

    res.status(200).json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      productStatements,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};