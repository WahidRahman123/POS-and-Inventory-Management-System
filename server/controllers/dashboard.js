const Sales = require("../models/Sales");
const Product = require("../models/Product");
const Purchase = require("../models/Purchase");
const Decimal = require("decimal.js");
const ProductExchange = require("../models/ProductExchange");
const PurchaseReturn = require("../models/PurchaseReturn");
const SalesReturn = require("../models/SalesReturn");
const CompanySalesReturn = require("../models/CompanySalesReturn");
const CompanySalesReturnTransaction = require("../models/CompanySalesReturnTransaction");
const SalesTransaction = require("../models/SalesTransaction");

// module.exports.index = async (req, res) => {
//   try {
//     const sales = await Sales.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalSell: { $sum: { $multiply: ["$paid", 10000] } },
//           totalCostInSale: { $sum: { $multiply: ["$totalCost", 10000] } },
//           numberOfSales: { $sum: 1 },
//         },
//       },
//     ]);

//     const product = await Product.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalItemCost: { $sum: { $multiply: ["$costPrice", "$quantity", 10000] } },
//           numberOfProducts: { $sum: 1 },
//         },
//       },
//     ]);

//     const purchase = await Purchase.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalSupplierCost: { $sum: { $multiply: ["$paid", 10000] } },
//         },
//       },
//     ]);

//     let result = {
//       totalSell: sales[0] ? sales[0].totalSell / 10000 : 0,
//       totalSupplierCost: purchase[0]
//         ? purchase[0].totalSupplierCost / 10000
//         : 0,
//       totalItemCost: product[0]
//         ? product[0].totalItemCost / 10000
//         : 0,
//       numberOfSales: sales[0]?.numberOfSales || 0,
//       numberOfProducts: product[0]?.numberOfProducts || 0,
//       profit:
//         sales[0]?.totalSell &&
//         sales[0]?.totalCostInSale &&
//         sales[0].totalSell - sales[0].totalCostInSale > 0
//           ? (sales[0].totalSell - sales[0].totalCostInSale) / 10000
//           : 0,
//     };
//     // console.log(result)

//     // if (sales.length > 0 && product.length > 0) {
//     //   result = {
//     //     totalSell: sales[0].totalSell,
//     //     totalCost: product[0].totalCost,
//     //     numberOfSales: sales[0].numberOfSales,
//     //     numberOfProducts: product[0].numberOfProducts,
//     //     profit: sales[0].totalSell - sales[0].totalCostInSale,
//     //   };
//     // }

//     res.status(201).json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };
module.exports.index = async (req, res) => {
  try {
    let start = new Date();
    start.setHours(0, 0, 0, 0);
    let end = new Date();
    end.setHours(23, 59, 59, 999);

    const [
      mainStock,
      sales,
      productExchange,
      purchase,
      purchaseReturn,
      salesReturn,
      companySalesReturn,
      salesTransaction,
    ] = await Promise.all([
      Product.aggregate([
        {
          $group: {
            _id: null,
            totalStock: { $sum: "$quantity" },
          },
        },
      ]),

      Sales.aggregate([
        {
          $facet: {
            salesDetails: [
              {
                $group: {
                  _id: null,
                  totalSell: { $sum: { $multiply: ["$paid", 10000] } },
                  totalCostInSale: {
                    $sum: { $multiply: ["$totalCost", 10000] },
                  },
                  numberOfSales: { $sum: 1 },

                  saleTotal: { $sum: { $multiply: ["$total", 10000] } },
                  saleDue: { $sum: { $multiply: ["$due", 10000] } },

                  // totalCash: { $sum: { $multiply: ["$cash", 10000] } },
                  // totalExchange: { $sum: { $multiply: ["$exchange", 10000] } },
                },
              },
            ],

            forStockDetails: [
              {
                $unwind: "$products",
              },
              {
                $group: {
                  _id: null,
                  productQuantityTotal: {
                    $sum: "$products.quantity",
                  },
                },
              },
            ],

            todaysSaleDetails: [
              {
                $match: { createdAt: { $gte: start, $lte: end } },
              },
              {
                $group: {
                  _id: null,
                  saleTotalToday: { $sum: { $multiply: ["$total", 10000] } },
                  saleDueToday: { $sum: { $multiply: ["$due", 10000] } },
                  // totalCashToday: { $sum: { $multiply: ["$cash", 10000] } },
                  // totalExchangeToday: {
                  //   $sum: { $multiply: ["$exchange", 10000] },
                  // },
                },
              },
            ],
          },
        },
      ]),

      ProductExchange.aggregate([
        {
          $facet: {
            exchangeDetails: [
              {
                $group: {
                  _id: null,
                  exchangeTotal: {
                    $sum: { $multiply: ["$totalAmount", 10000] },
                  },
                  exchangeRemaining: {
                    $sum: { $multiply: ["$remainingBalance", 10000] },
                  },
                },
              },
            ],

            quantityDetails: [
              {
                $unwind: "$products",
              },
              {
                $group: {
                  _id: null,
                  productQuantityTotal: {
                    $sum: "$products.quantity",
                  },
                  productQuantityInKgTotal: {
                    $sum: "$products.qtyInKg",
                  },
                },
              },
            ],
          },
        },
      ]),

      Purchase.aggregate([
        {
          $facet: {
            purchaseDetails: [
              {
                $group: {
                  _id: null,
                  totalSupplierCost: {
                    $sum: { $multiply: ["$paid", 10000] },
                  },
                  purchaseTotal: {
                    $sum: { $multiply: ["$totalAmount", 10000] },
                  },
                  purchaseDue: { $sum: { $multiply: ["$due", 10000] } },
                },
              },
            ],

            quantityDetails: [
              {
                $unwind: "$products",
              },
              {
                $group: {
                  _id: null,
                  productQuantityTotal: {
                    $sum: "$products.quantity",
                  },
                },
              },
            ],
          },
        },
      ]),

      PurchaseReturn.aggregate([
        {
          $unwind: "$products",
        },
        {
          $group: {
            _id: null,
            productQuantityTotal: {
              $sum: "$products.returnQuantity",
            },
          },
        },
      ]),

      SalesReturn.aggregate([
        {
          $unwind: "$products",
        },
        {
          $group: {
            _id: null,
            productQuantityTotal: {
              $sum: "$products.returnQuantity",
            },
          },
        },
      ]),

      CompanySalesReturn.aggregate([
        {
          $group: {
            _id: null,
            productQuantityTotal: {
              $sum: "$quantity",
            },
          },
        },
      ]),

      SalesTransaction.aggregate([
        {
          $facet: {
            allReport: [
              {
                $group: {
                  _id: null,
                  totalCash: { $sum: { $multiply: ["$cash", 10000] } },
                  totalExchange: { $sum: { $multiply: ["$exchange", 10000] } },
                },
              },
            ],

            todaysReport: [
              {
                $match: { date: { $gte: start, $lte: end } },
              },
              {
                $group: {
                  _id: null,
                  totalCashToday: { $sum: { $multiply: ["$cash", 10000] } },
                  totalExchangeToday: {
                    $sum: { $multiply: ["$exchange", 10000] },
                  },
                },
              },
            ],
          },
        },
      ]),
    ]);

    //* For Sales Return Data - starts
    const salesReturnForNewData = await SalesReturn.aggregate([
      {
        $facet: {
          total: [
            {
              $unwind: "$products",
            },
            {
              $group: {
                _id: null,
                totalSentItems: { $sum: "$products.returnQuantity" },
                totalWeight: { $sum: "$products.returnQtyInKg" },
              },
            },
          ],

          totalAmount: [
            {
              $group: {
                _id: null,
                totalAmount: {
                  $sum: { $multiply: ["$totalReturnValue", 10000] },
                },
                totalPaid: {
                  $sum: { $multiply: ["$paid", 10000] },
                },
                totalDue: {
                  $sum: { $multiply: ["$due", 10000] },
                },
              },
            },
          ],
        },
      },
    ]);

    const transactionData = await CompanySalesReturnTransaction.aggregate([
      {
        $group: {
          _id: null,
          transactiontotalSentItems: { $sum: "$paidAmount" },
        },
      },
    ]);

    const transactionSentItems =
      transactionData[0]?.transactiontotalSentItems || 0;

    const companyData = await CompanySalesReturn.find();

    const totalCompanyWeight =
      companyData && companyData.length
        ? companyData.reduce((acc, p) => acc + p.qtyInKg, 0)
        : 0;
    //* For Sales Return Data - ends

    //* For Company Sales Return Data - starts
    const companySalesReturnForDashboard = await CompanySalesReturn.aggregate([
      {
        $group: {
          _id: null,
          totalAmountQty: {
            $sum: "$totalAmountQty",
          },
          totalPaidQty: {
            $sum: "$paidQty",
          },
          totalDueQty: {
            $sum: "$dueQty",
          },
          totalAmount: {
            $sum: { $multiply: ["$totalAmount", 10000] },
          },
          totalPaid: {
            $sum: { $multiply: ["$paid", 10000] },
          },
          totalDue: {
            $sum: { $multiply: ["$due", 10000] },
          },
        },
      },
    ]);
    //* For Company Sales Return Data - ends

    const mainQuantity = mainStock[0] ? mainStock[0].totalStock : 0;

    const companySaleReturnQuantity = companySalesReturn[0]
      ? companySalesReturn[0].productQuantityTotal
      : 0;

    const purchaseReturnQuantity = purchaseReturn[0]
      ? purchaseReturn[0].productQuantityTotal
      : 0;

    const salesReturnQuantity = salesReturn[0]
      ? salesReturn[0].productQuantityTotal
      : 0;

    const salesQuantity =
      sales[0].forStockDetails.length > 0
        ? sales[0].forStockDetails[0].productQuantityTotal
        : 0;

    const quantityDetails = {
      mainQuantity,
      companySaleReturnQuantity,
      purchaseReturnQuantity,
      salesReturnQuantity,
      salesQuantity,
    };

    let result = {
      purchaseTotal:
        purchase[0].purchaseDetails.length > 0
          ? purchase[0].purchaseDetails[0].purchaseTotal / 10000
          : 0,
      purchaseDue:
        purchase[0].purchaseDetails.length > 0
          ? purchase[0].purchaseDetails[0].purchaseDue / 10000
          : 0,
      purchaseTotalQuantity:
        purchase[0].quantityDetails.length > 0
          ? purchase[0].quantityDetails[0].productQuantityTotal
          : 0,

      exchangeTotalQuantity:
        productExchange[0].quantityDetails.length > 0
          ? productExchange[0].quantityDetails[0].productQuantityTotal
          : 0,
      exchangeTotalQuantityInKg:
        productExchange[0].quantityDetails.length > 0
          ? productExchange[0].quantityDetails[0].productQuantityInKgTotal
          : 0,
      exchangeTotalPrice:
        productExchange[0].exchangeDetails.length > 0
          ? productExchange[0].exchangeDetails[0].exchangeTotal / 10000
          : 0,
      exchangeTotalRemaining:
        productExchange[0].exchangeDetails.length > 0
          ? productExchange[0].exchangeDetails[0].exchangeRemaining / 10000
          : 0,

      salesTotal:
        sales[0].salesDetails.length > 0
          ? sales[0].salesDetails[0].saleTotal / 10000
          : 0,
      salesDue:
        sales[0].salesDetails.length > 0
          ? sales[0].salesDetails[0].saleDue / 10000
          : 0,
      salesCash:
        salesTransaction[0].allReport.length > 0
          ? salesTransaction[0].allReport[0].totalCash / 10000
          : 0,
      salesExchange:
        salesTransaction[0].allReport.length > 0
          ? salesTransaction[0].allReport[0].totalExchange / 10000
          : 0,
      salesProfit:
        sales[0].salesDetails.length > 0
          ? (sales[0].salesDetails[0].saleTotal -
              sales[0].salesDetails[0].saleDue) /
            10000
          : 0,

      //* Today Sales Report
      salesTotalToday:
        sales[0].todaysSaleDetails.length > 0
          ? sales[0].todaysSaleDetails[0].saleTotalToday / 10000
          : 0,
      salesDueToday:
        sales[0].todaysSaleDetails.length > 0
          ? sales[0].todaysSaleDetails[0].saleDueToday / 10000
          : 0,
      salesCashToday:
        salesTransaction[0].todaysReport.length > 0
          ? salesTransaction[0].todaysReport[0].totalCashToday / 10000
          : 0,
      salesExchangeToday:
        salesTransaction[0].todaysReport.length > 0
          ? salesTransaction[0].todaysReport[0].totalExchangeToday / 10000
          : 0,
      salesProfitToday:
        sales[0].todaysSaleDetails.length > 0
          ? (sales[0].todaysSaleDetails[0].saleTotalToday -
              sales[0].todaysSaleDetails[0].saleDueToday) /
            10000
          : 0,

      productQuantity: mainQuantity
        ? mainQuantity +
          companySaleReturnQuantity +
          purchaseReturnQuantity -
          salesReturnQuantity -
          salesQuantity
        : 0,

      quantityDetails,

      totalSentItemsForSalesReturn:
        salesReturnForNewData[0].total.length > 0
          ? salesReturnForNewData[0].total[0].totalSentItems -
            transactionSentItems
          : 0,
      totalWeightForSalesReturn:
        salesReturnForNewData[0].total.length > 0
          ? salesReturnForNewData[0].total[0].totalWeight - totalCompanyWeight
          : 0,
      totalAmountForSalesReturn:
        salesReturnForNewData[0].total.length > 0
          ? salesReturnForNewData[0].totalAmount[0].totalAmount / 10000
          : 0,
      totalPaidForSalesReturn:
        salesReturnForNewData[0].total.length > 0
          ? salesReturnForNewData[0].totalAmount[0].totalPaid / 10000
          : 0,
      totalDueForSalesReturn:
        salesReturnForNewData[0].total.length > 0
          ? salesReturnForNewData[0].totalAmount[0].totalDue / 10000
          : 0,

      totalAmountQtyForCSR: companySalesReturnForDashboard[0]
        ? companySalesReturnForDashboard[0].totalAmountQty
        : 0,
      totalPaidQtyForCSR: companySalesReturnForDashboard[0]
        ? companySalesReturnForDashboard[0].totalPaidQty
        : 0,
      totalDueQtyForCSR: companySalesReturnForDashboard[0]
        ? companySalesReturnForDashboard[0].totalDueQty
        : 0,
      totalAmountForCSR: companySalesReturnForDashboard[0]
        ? companySalesReturnForDashboard[0].totalAmount / 10000
        : 0,
      totalPaidForCSR: companySalesReturnForDashboard[0]
        ? companySalesReturnForDashboard[0].totalPaid / 10000
        : 0,
      totalDueForCSR: companySalesReturnForDashboard[0]
        ? companySalesReturnForDashboard[0].totalDue / 10000
        : 0,
    };

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
