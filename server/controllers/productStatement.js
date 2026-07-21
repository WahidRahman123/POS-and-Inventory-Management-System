const ProductStatement = require("../models/ProductStatement");
const dayjs = require("dayjs");

module.exports.index = async (req, res) => {
  try {
    const { page = 1, productName = "" } = req.query;
    const limit = 10;
    const skip = (parseInt(page) - 1) * limit;

    let nameSearchQuery = {};

    // For name search:
    if (productName) {
      nameSearchQuery = { productName: { $regex: productName, $options: "i" } };
    }

    const productStatements = await ProductStatement.find(nameSearchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ProductStatement.countDocuments(nameSearchQuery);

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
