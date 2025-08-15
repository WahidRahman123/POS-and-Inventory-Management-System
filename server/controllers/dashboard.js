const Sales = require('../models/Sales');
const Product = require('../models/Product');

module.exports.index = async (req, res) => {
  try {
    
    const sales = await Sales.aggregate([
        {
            $group: {
                _id: null,
                totalSell: { $sum: "$subtotal" },
                totalCostInSale: { $sum: { $multiply: ["$costPrice", "$quantity"] } },
                numberOfSales: { $sum: 1 }
            }
        }
    ])

    const product = await Product.aggregate([
        {
            $group: {
                _id: null,
                totalCost: { $sum: { $multiply: ["$costPrice", "$quantity"] } },
                numberOfProducts: { $sum: 1 }
            }
            
        }
    ]);

    const result = {
        totalSell: sales[0].totalSell,
        totalCost: product[0].totalCost,
        numberOfSales: sales[0].numberOfSales,
        numberOfProducts: product[0].numberOfProducts,
        profit: sales[0].totalSell - sales[0].totalCostInSale
    }

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
