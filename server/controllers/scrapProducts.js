const ScrapProduct = require("../models/ScrapProduct");

module.exports.searchForScrapProduct = async (req, res) => {
  try {
    const { productName } = req.query;
    const scrapProducts = await ScrapProduct.find({ productName: {$regex: productName, $options: "i"} });

    res.status(201).json(scrapProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.createScrapProducts = async (req, res) => {
  const { productName } = req.body;
  try {
    const scrapProduct = new ScrapProduct({
      productName
    });

    await scrapProduct.save();

    res.status(201).json({ message: "Product created successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
