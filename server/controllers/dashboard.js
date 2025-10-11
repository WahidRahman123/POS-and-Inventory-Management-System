const Sales = require("../models/Sales");
const Product = require("../models/Product");
const Purchase = require("../models/Purchase");
const Decimal = require("decimal.js");

module.exports.index = async (req, res) => {
  try {
    const sales = await Sales.aggregate([
      {
        $group: {
          _id: null,
          totalSell: { $sum: { $multiply: ["$paid", 10000] } },
          totalCostInSale: { $sum: { $multiply: ["$totalCost", 10000] } },
          numberOfSales: { $sum: 1 },
        },
      },
    ]);

    const product = await Product.aggregate([
      {
        $group: {
          _id: null,
          numberOfProducts: { $sum: 1 },
        },
      },
    ]);

    const purchase = await Purchase.aggregate([
      {
        $group: {
          _id: null,
          totalCost: { $sum: { $multiply: ["$paid", 10000] } },
        },
      },
    ]);

    let result = {
      totalSell: sales[0] ? sales[0].totalSell / 10000 : 0,
      totalCost: purchase[0] ? purchase[0].totalCost / 10000 : 0,
      numberOfSales: sales[0]?.numberOfSales || 0,
      numberOfProducts: product[0]?.numberOfProducts || 0,
      profit:
        sales[0]?.totalSell &&
        sales[0]?.totalCostInSale &&
        sales[0].totalSell - sales[0].totalCostInSale > 0
          ? (sales[0].totalSell - sales[0].totalCostInSale) / 10000
          : 0,
    };
    // console.log(result)

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
