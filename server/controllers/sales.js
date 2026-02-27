const Sales = require("../models/Sales");
const Product = require("../models/Product");
const Decimal = require("decimal.js");

module.exports.index = async (req, res) => {
  try {
    const { page = 1 } = req.query;

    const limit = 10;
    const skip = (parseInt(page) - 1) * limit;

    const sales = await Sales.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Count total documents
    const total = await Sales.countDocuments({});

    res.status(201).json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      sales,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// module.exports.createSales = async (req, res) => {
//   try {
//     const arrayOfResResults = [];
//     const arrayOfSales = req.body;
//     for (let i = 0; i < arrayOfSales.length; i++) {
//       const {
//         customerName,
//         address,
//         productName,
//         sellPrice,
//         costPrice,
//         quantity,
//         subtotal,
//       } = arrayOfSales[i];

//       const sales = new Sales({
//         customerName,
//         address,
//         productName,
//         sellPrice,
//         costPrice,
//         quantity,
//         subtotal,
//       });

//       const createdSales = await sales.save();

//       const product = await Product.findOne({ name: productName });
//       if (!product) {
//         return res
//           .status(404)
//           .json({ message: `Product ${productName} not found` });
//       }
//       product.quantity = product.quantity - quantity;
//       await product.save();

//       //* response result is push into an array so that it can be sent.
//       arrayOfResResults.push(createdSales);
//     }

//     res.status(201).json(arrayOfResResults);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

module.exports.createSales = async (req, res) => {
  try {
    const sales = req.body;

    //* sales creation
    const sale = new Sales(sales);

    for (let i = 0; i < sales.products.length; i++) {
      const { productName, quantity } = sales.products[i];

      const product = await Product.findOne({ name: productName });

      product.quantity = product.quantity - quantity;
      await product.save();
    }

    const createdSale = await sale.save();

    res.status(201).json(createdSale);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.searchByDates = async (req, res) => {
  try {
    const { date, page = 1, order = -1 } = req.query;

    if (!date) return res.status(400).json({ message: "Invalid Dates!" });

    // const limit = 10;
    // const skip = (parseInt(page) - 1) * limit;

    // Today's sales:
    if (date && date === "t") {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const { sales, total } = await getSalesAndTotal(
        startOfDay,
        endOfDay,
        order,
      );

      // return res.status(200).json({
      //   total,
      //   page: parseInt(page),
      //   pages: Math.ceil(total / limit),
      //   sales,
      // });
      return res.status(200).json(sales);
    }

    // Weekly sales:
    if (date && date === "w") {
      const now = new Date();

      const startOfWeek = new Date(now);
      startOfWeek.setHours(0, 0, 0, 0);
      const day = startOfWeek.getDay();
      const diff = day >= 6 ? day - 6 : day + 1;

      startOfWeek.setDate(startOfWeek.getDate() - diff);

      const { sales, total } = await getSalesAndTotal(startOfWeek, now, order);

      // return res.status(200).json({
      //   total,
      //   page: parseInt(page),
      //   pages: Math.ceil(total / limit),
      //   sales,
      // });
      return res.status(200).json(sales);
    }

    // Monthly sales:
    if (date && date === "m") {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      const { sales, total } = await getSalesAndTotal(
        startOfMonth,
        endOfMonth,
        order,
      );

      return res.status(200).json(sales);
      // return res.status(200).json({
      //   total,
      //   page: parseInt(page),
      //   pages: Math.ceil(total / limit),
      //   sales,
      // });
    }

    // Yearly sales:
    if (date && date === "y") {
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear() + 1, 0, 1);

      const { sales, total } = await getSalesAndTotal(
        startOfYear,
        endOfYear,
        order,
      );

      return res.status(200).json(sales);
      // return res.status(200).json({
      //   total,
      //   page: parseInt(page),
      //   pages: Math.ceil(total / limit),
      //   sales,
      // });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.searchByIndividualDate = async (req, res) => {
  try {
    const { date, productName, customerName, order = -1 } = req.query;

    const searchQuery = [];
    let dateSearchQuery;
    let productNameSearchQuery;
    let customerNameSearchQuery;

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      dateSearchQuery = {
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      };

      searchQuery.push(dateSearchQuery);
    }

    if(productName) {
      productNameSearchQuery = {
        "products.productName": { $regex: productName, $options: "i" }
      }

      searchQuery.push(productNameSearchQuery);
    }

    if(customerName) {
      customerNameSearchQuery = {
        customerName: { $regex: customerName, $options: "i" }
      }

      searchQuery.push(customerNameSearchQuery);
    }

    const mainSearch = { $and: searchQuery };

    const sales = await Sales.find(mainSearch).sort({ createdAt: parseInt(order) });

    res.status(201).json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.searchById = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sales.findById(id);

    res.status(201).json(sale);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.addPayment = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const sale = await Sales.findById(id);

    if (sale) {
      // sale.paid = sale.paid + amount;
      sale.paid = Number(
        new Decimal(sale.paid).plus(new Decimal(amount)).toFixed(4),
      );
      // sale.due = sale.due - amount;
      sale.due = Number(
        new Decimal(sale.due).minus(new Decimal(amount)).toFixed(4),
      );
      await sale.save();

      res.status(201).json({ message: "Payment updated successfully" });
    } else {
      res.status(404).json({ message: "Sale not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.getTotalSaleCount = async (req, res) => {
  try {
    const count = await Sales.countDocuments();

    res.status(201).json(count);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports.salesByCustomerName = async (req, res) => {
  try {
    const { page = 1, dateSearch = "", customerName = "" } = req.query;

    let searchQuery = [];
    let nameSearchQuery = { customerName };
    searchQuery.push(nameSearchQuery);

    let dateSearchQuery;
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

    const mainSearch = { $and: searchQuery };

    // const limit = 10;

    // Pagination
    // const skip = (parseInt(page) - 1) * limit;

    const sales = await Sales.find(mainSearch)
      .sort({ createdAt: -1 })
      // .skip(skip)
      // .limit(limit);

    // Count total Customer
    // const total = await Purchase.countDocuments(mainSearch);

    const result = await Sales.aggregate([
      {
        $match: mainSearch
      },
      {
        $group: {
          _id: null,
          totalAmount: {$sum: { $multiply: ['$total', 10000] }},
          totalPaid: {$sum: { $multiply: ['$paid', 10000] }},
          totalDue: {$sum: { $multiply: ['$due', 10000] }}
        }
      }
    ]);

    res.status(201).json({
      // total,
      // page: parseInt(page),
      // pages: Math.ceil(total / limit),
      sales,
      totalAmount: result.length > 0 ? result[0].totalAmount / 10000 : 0,
      totalPaid: result.length > 0 ? result[0].totalPaid / 10000 : 0,
      totalDue: result.length > 0 ? result[0].totalDue / 10000 : 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

async function getSalesAndTotal(start, end, order, skip, limit) {
  const sales = await Sales.find({
    createdAt: { $gte: start, $lte: end },
  }).sort({ createdAt: parseInt(order) });
  // .skip(skip)
  // .limit(limit);

  const total = await Sales.countDocuments({
    createdAt: { $gte: start, $lte: end },
  });

  return { sales, total };
}
