const Sales = require("../models/Sales");
const Product = require("../models/Product");

module.exports.index = async (req, res) => {
  try {
    const sales = await Sales.aggregate([
      {
        $group: {
          _id: null,
          totalSell: { $sum: "$paid" },
          totalCostInSale: { $sum: "$totalCost" },
          numberOfSales: { $sum: 1 },
        },
      },
    ]);

    const product = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalCost: { $sum: { $multiply: ["$costPrice", "$quantity"] } },
          numberOfProducts: { $sum: 1 },
        },
      },
    ]);

    let result = {
      totalSell: sales[0]?.totalSell || 0,
      totalCost: product[0]?.totalCost || 0,
      numberOfSales: sales[0]?.numberOfSales || 0,
      numberOfProducts: product[0]?.numberOfProducts || 0,
      profit: (sales[0]?.totalSell && sales[0]?.totalCostInSale && sales[0].totalSell - sales[0].totalCostInSale > 0) ? sales[0].totalSell - sales[0].totalCostInSale : 0,
    };

    // if (sales.length > 0 && product.length > 0) {
    //   result = {
    //     totalSell: sales[0].totalSell,
    //     totalCost: product[0].totalCost,
    //     numberOfSales: sales[0].numberOfSales,
    //     numberOfProducts: product[0].numberOfProducts,
    //     profit: sales[0].totalSell - sales[0].totalCostInSale,
    //   };
    // }

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
