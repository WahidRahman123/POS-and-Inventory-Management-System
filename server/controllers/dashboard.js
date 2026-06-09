// const Sales = require("../models/Sales");
// const Product = require("../models/Product");
// const Purchase = require("../models/Purchase");
// const Decimal = require("decimal.js");
// const ProductExchange = require("../models/ProductExchange");
// const PurchaseReturn = require("../models/PurchaseReturn");
// const SalesReturn = require("../models/SalesReturn");
// const CompanySalesReturn = require("../models/CompanySalesReturn");
// const CompanySalesReturnTransaction = require("../models/CompanySalesReturnTransaction");
// const SalesTransaction = require("../models/SalesTransaction");

// // module.exports.index = async (req, res) => {
// //   try {
// //     const sales = await Sales.aggregate([
// //       {
// //         $group: {
// //           _id: null,
// //           totalSell: { $sum: { $multiply: ["$paid", 10000] } },
// //           totalCostInSale: { $sum: { $multiply: ["$totalCost", 10000] } },
// //           numberOfSales: { $sum: 1 },
// //         },
// //       },
// //     ]);

// //     const product = await Product.aggregate([
// //       {
// //         $group: {
// //           _id: null,
// //           totalItemCost: { $sum: { $multiply: ["$costPrice", "$quantity", 10000] } },
// //           numberOfProducts: { $sum: 1 },
// //         },
// //       },
// //     ]);

// //     const purchase = await Purchase.aggregate([
// //       {
// //         $group: {
// //           _id: null,
// //           totalSupplierCost: { $sum: { $multiply: ["$paid", 10000] } },
// //         },
// //       },
// //     ]);

// //     let result = {
// //       totalSell: sales[0] ? sales[0].totalSell / 10000 : 0,
// //       totalSupplierCost: purchase[0]
// //         ? purchase[0].totalSupplierCost / 10000
// //         : 0,
// //       totalItemCost: product[0]
// //         ? product[0].totalItemCost / 10000
// //         : 0,
// //       numberOfSales: sales[0]?.numberOfSales || 0,
// //       numberOfProducts: product[0]?.numberOfProducts || 0,
// //       profit:
// //         sales[0]?.totalSell &&
// //         sales[0]?.totalCostInSale &&
// //         sales[0].totalSell - sales[0].totalCostInSale > 0
// //           ? (sales[0].totalSell - sales[0].totalCostInSale) / 10000
// //           : 0,
// //     };
// //     // console.log(result)

// //     // if (sales.length > 0 && product.length > 0) {
// //     //   result = {
// //     //     totalSell: sales[0].totalSell,
// //     //     totalCost: product[0].totalCost,
// //     //     numberOfSales: sales[0].numberOfSales,
// //     //     numberOfProducts: product[0].numberOfProducts,
// //     //     profit: sales[0].totalSell - sales[0].totalCostInSale,
// //     //   };
// //     // }

// //     res.status(201).json(result);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).send("Server Error");
// //   }
// // };
// module.exports.index = async (req, res) => {
//   try {
//     let start = new Date();
//     start.setHours(0, 0, 0, 0);
//     let end = new Date();
//     end.setHours(23, 59, 59, 999);

//     const [
//       mainStock,
//       sales,
//       productExchange,
//       purchase,
//       purchaseReturn,
//       salesReturn,
//       companySalesReturn,
//       salesTransaction,
//     ] = await Promise.all([
//       Product.aggregate([
//         {
//           $group: {
//             _id: null,
//             totalStock: { $sum: "$quantity" },
//             totalCostPrice: { $sum: { $multiply: ["$costPrice", 10000] } },
//             totalSalePrice: { $sum: { $multiply: ["$sellPrice", 10000] } }
//           },
//         },
//       ]),

//       Sales.aggregate([
//         {
//           $facet: {
//             salesDetails: [
//               {
//                 $group: {
//                   _id: null,
//                   totalSell: { $sum: { $multiply: ["$paid", 10000] } },
//                   totalCostInSale: {
//                     $sum: { $multiply: ["$totalCost", 10000] },
//                   },
//                   numberOfSales: { $sum: 1 },

//                   saleTotal: { $sum: { $multiply: ["$total", 10000] } },
//                   saleDue: { $sum: { $multiply: ["$due", 10000] } },

//                   // totalCash: { $sum: { $multiply: ["$cash", 10000] } },
//                   // totalExchange: { $sum: { $multiply: ["$exchange", 10000] } },
//                 },
//               },
//             ],

//             forStockDetails: [
//               {
//                 $unwind: "$products",
//               },
//               {
//                 $group: {
//                   _id: null,
//                   productQuantityTotal: {
//                     $sum: "$products.quantity",
//                   },
//                 },
//               },
//             ],

//             // dueListDetails: [
//             //   {
//             //     $match: { due: { $gt: 0 } },
//             //   },
//             //   {
//             //     $group: {
//             //       _id: null,
//             //       totalDueFromDueList: { $sum: { $multiply: ["$due", 10000] } },
//             //     },
//             //   },
//             // ],

//             todaysSaleDetails: [
//               {
//                 $match: { createdAt: { $gte: start, $lte: end } },
//               },
//               {
//                 $group: {
//                   _id: null,
//                   saleTotalToday: { $sum: { $multiply: ["$total", 10000] } },
//                   saleDueToday: { $sum: { $multiply: ["$due", 10000] } },
//                   // totalCashToday: { $sum: { $multiply: ["$cash", 10000] } },
//                   // totalExchangeToday: {
//                   //   $sum: { $multiply: ["$exchange", 10000] },
//                   // },
//                 },
//               },
//             ],
//           },
//         },
//       ]),

//       ProductExchange.aggregate([
//         {
//           $facet: {
//             exchangeDetails: [
//               {
//                 $group: {
//                   _id: null,
//                   exchangeTotal: {
//                     $sum: { $multiply: ["$totalAmount", 10000] },
//                   },
//                   exchangeRemaining: {
//                     $sum: { $multiply: ["$remainingBalance", 10000] },
//                   },
//                 },
//               },
//             ],

//             quantityDetails: [
//               {
//                 $unwind: "$products",
//               },
//               {
//                 $group: {
//                   _id: null,
//                   productQuantityTotal: {
//                     $sum: "$products.quantity",
//                   },
//                   productQuantityInKgTotal: {
//                     $sum: "$products.qtyInKg",
//                   },
//                 },
//               },
//             ],
//           },
//         },
//       ]),

//       Purchase.aggregate([
//         {
//           $facet: {
//             purchaseDetails: [
//               {
//                 $group: {
//                   _id: null,
//                   totalSupplierCost: {
//                     $sum: { $multiply: ["$paid", 10000] },
//                   },
//                   purchaseTotal: {
//                     $sum: { $multiply: ["$totalAmount", 10000] },
//                   },
//                   purchaseDue: { $sum: { $multiply: ["$due", 10000] } },
//                 },
//               },
//             ],

//             quantityDetails: [
//               {
//                 $unwind: "$products",
//               },
//               {
//                 $group: {
//                   _id: null,
//                   productQuantityTotal: {
//                     $sum: "$products.quantity",
//                   },
//                 },
//               },
//             ],
//           },
//         },
//       ]),

//       PurchaseReturn.aggregate([
//         {
//           $unwind: "$products",
//         },
//         {
//           $group: {
//             _id: null,
//             productQuantityTotal: {
//               $sum: "$products.returnQuantity",
//             },
//           },
//         },
//       ]),

//       SalesReturn.aggregate([
//         {
//           $unwind: "$products",
//         },
//         {
//           $group: {
//             _id: null,
//             productQuantityTotal: {
//               $sum: "$products.returnQuantity",
//             },
//           },
//         },
//       ]),

//       CompanySalesReturn.aggregate([
//         {
//           $group: {
//             _id: null,
//             productQuantityTotal: {
//               $sum: "$quantity",
//             },
//           },
//         },
//       ]),

//       SalesTransaction.aggregate([
//         {
//           $facet: {
//             allReport: [
//               {
//                 $group: {
//                   _id: null,
//                   totalCash: { $sum: { $multiply: ["$cash", 10000] } },
//                   totalExchange: { $sum: { $multiply: ["$exchange", 10000] } },
//                   totalBankPaymentAmount: { $sum: { $multiply: ["$bankPaymentAmount", 10000] } },
//                 },
//               },
//             ],

//             todaysReport: [
//               {
//                 $match: { date: { $gte: start, $lte: end } },
//               },
//               {
//                 $group: {
//                   _id: null,
//                   totalCashToday: { $sum: { $multiply: ["$cash", 10000] } },
//                   totalExchangeToday: {
//                     $sum: { $multiply: ["$exchange", 10000] },
//                   },
//                   totalBankPaymentAmountToday: { $sum: { $multiply: ["$bankPaymentAmount", 10000] } },
//                 },
//               },
//             ],
//           },
//         },
//       ]),
//     ]);

//     //* For Sales Return Data - starts
//     const salesReturnForNewData = await SalesReturn.aggregate([
//       {
//         $facet: {
//           total: [
//             {
//               $unwind: "$products",
//             },
//             {
//               $group: {
//                 _id: null,
//                 totalSentItems: { $sum: "$products.returnQuantity" },
//                 totalWeight: { $sum: "$products.returnQtyInKg" },
//               },
//             },
//           ],

//           totalAmount: [
//             {
//               $group: {
//                 _id: null,
//                 totalAmount: {
//                   $sum: { $multiply: ["$totalReturnValue", 10000] },
//                 },
//                 totalPaid: {
//                   $sum: { $multiply: ["$paid", 10000] },
//                 },
//                 totalDue: {
//                   $sum: { $multiply: ["$due", 10000] },
//                 },
//               },
//             },
//           ],
//         },
//       },
//     ]);

//     const transactionData = await CompanySalesReturnTransaction.aggregate([
//       {
//         $group: {
//           _id: null,
//           transactiontotalSentItems: { $sum: "$paidAmount" },
//         },
//       },
//     ]);

//     const transactionSentItems =
//       transactionData[0]?.transactiontotalSentItems || 0;

//     const companyData = await CompanySalesReturn.find();

//     const totalCompanyWeight =
//       companyData && companyData.length
//         ? companyData.reduce((acc, p) => acc + p.qtyInKg, 0)
//         : 0;
//     //* For Sales Return Data - ends

//     //* For Company Sales Return Data - starts
//     const companySalesReturnForDashboard = await CompanySalesReturn.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalAmountQty: {
//             $sum: "$totalAmountQty",
//           },
//           totalPaidQty: {
//             $sum: "$paidQty",
//           },
//           totalDueQty: {
//             $sum: "$dueQty",
//           },
//           totalAmount: {
//             $sum: { $multiply: ["$totalAmount", 10000] },
//           },
//           totalPaid: {
//             $sum: { $multiply: ["$paid", 10000] },
//           },
//           totalDue: {
//             $sum: { $multiply: ["$due", 10000] },
//           },
//         },
//       },
//     ]);
//     //* For Company Sales Return Data - ends

//     const mainQuantity = mainStock[0] ? mainStock[0].totalStock : 0;

//     const companySaleReturnQuantity = companySalesReturn[0]
//       ? companySalesReturn[0].productQuantityTotal
//       : 0;

//     const purchaseReturnQuantity = purchaseReturn[0]
//       ? purchaseReturn[0].productQuantityTotal
//       : 0;

//     const salesReturnQuantity = salesReturn[0]
//       ? salesReturn[0].productQuantityTotal
//       : 0;

//     const salesQuantity =
//       sales[0].forStockDetails.length > 0
//         ? sales[0].forStockDetails[0].productQuantityTotal
//         : 0;

//     const quantityDetails = {
//       mainQuantity,
//       companySaleReturnQuantity,
//       purchaseReturnQuantity,
//       salesReturnQuantity,
//       salesQuantity,
//     };

//     let result = {
//       purchaseTotal:
//         purchase[0].purchaseDetails.length > 0
//           ? purchase[0].purchaseDetails[0].purchaseTotal / 10000
//           : 0,
//       purchaseDue:
//         purchase[0].purchaseDetails.length > 0
//           ? purchase[0].purchaseDetails[0].purchaseDue / 10000
//           : 0,
//       purchaseTotalQuantity:
//         purchase[0].quantityDetails.length > 0
//           ? purchase[0].quantityDetails[0].productQuantityTotal
//           : 0,

//       exchangeTotalQuantity:
//         productExchange[0].quantityDetails.length > 0
//           ? productExchange[0].quantityDetails[0].productQuantityTotal
//           : 0,
//       exchangeTotalQuantityInKg:
//         productExchange[0].quantityDetails.length > 0
//           ? productExchange[0].quantityDetails[0].productQuantityInKgTotal
//           : 0,
//       exchangeTotalPrice:
//         productExchange[0].exchangeDetails.length > 0
//           ? productExchange[0].exchangeDetails[0].exchangeTotal / 10000
//           : 0,
//       exchangeTotalRemaining:
//         productExchange[0].exchangeDetails.length > 0
//           ? productExchange[0].exchangeDetails[0].exchangeRemaining / 10000
//           : 0,

//       salesTotal:
//         sales[0].salesDetails.length > 0
//           ? sales[0].salesDetails[0].saleTotal / 10000
//           : 0,
//       salesDue:
//         sales[0].salesDetails.length > 0
//           ? sales[0].salesDetails[0].saleDue / 10000
//           : 0,
//       salesCash:
//         salesTransaction[0].allReport.length > 0
//           ? salesTransaction[0].allReport[0].totalCash / 10000
//           : 0,
//       salesExchange:
//         salesTransaction[0].allReport.length > 0
//           ? salesTransaction[0].allReport[0].totalExchange / 10000
//           : 0,
//       salesBankPaymentAmount:
//         salesTransaction[0].allReport.length > 0
//           ? salesTransaction[0].allReport[0].totalBankPaymentAmount / 10000
//           : 0,
//       salesProfit:
//         sales[0].salesDetails.length > 0
//           ? (sales[0].salesDetails[0].saleTotal -
//               sales[0].salesDetails[0].saleDue) /
//             10000
//           : 0,

//       //* Today Sales Report
//       salesTotalToday:
//         sales[0].todaysSaleDetails.length > 0
//           ? sales[0].todaysSaleDetails[0].saleTotalToday / 10000
//           : 0,
//       salesDueToday:
//         sales[0].todaysSaleDetails.length > 0
//           ? sales[0].todaysSaleDetails[0].saleDueToday / 10000
//           : 0,
//       salesCashToday:
//         salesTransaction[0].todaysReport.length > 0
//           ? salesTransaction[0].todaysReport[0].totalCashToday / 10000
//           : 0,
//       salesExchangeToday:
//         salesTransaction[0].todaysReport.length > 0
//           ? salesTransaction[0].todaysReport[0].totalExchangeToday / 10000
//           : 0,
//       salesBankPaymentAmountToday:
//         salesTransaction[0].todaysReport.length > 0
//           ? salesTransaction[0].todaysReport[0].totalBankPaymentAmountToday / 10000
//           : 0,
//       salesProfitToday:
//         sales[0].todaysSaleDetails.length > 0
//           ? (sales[0].todaysSaleDetails[0].saleTotalToday -
//               sales[0].todaysSaleDetails[0].saleDueToday) /
//             10000
//           : 0,

//       // totalDueFromDueList:
//       //   sales[0].dueListDetails.length > 0
//       //     ? sales[0].dueListDetails[0].totalDueFromDueList / 10000
//       //     : 0,

//       productQuantity: mainQuantity
//         ? mainQuantity +
//           companySaleReturnQuantity +
//           purchaseReturnQuantity -
//           salesReturnQuantity -
//           salesQuantity
//         : 0,
//       totalProductCostPrice: mainStock[0] ? mainStock[0].totalCostPrice / 10000 : 0,
//       totalProductSalePrice: mainStock[0] ? mainStock[0].totalSalePrice / 10000 : 0,

//       quantityDetails,

//       totalSentItemsForSalesReturn:
//         salesReturnForNewData[0].total.length > 0
//           ? salesReturnForNewData[0].total[0].totalSentItems -
//             transactionSentItems
//           : 0,
//       totalWeightForSalesReturn:
//         salesReturnForNewData[0].total.length > 0
//           ? salesReturnForNewData[0].total[0].totalWeight - totalCompanyWeight
//           : 0,
//       totalAmountForSalesReturn:
//         salesReturnForNewData[0].total.length > 0
//           ? salesReturnForNewData[0].totalAmount[0].totalAmount / 10000
//           : 0,
//       totalPaidForSalesReturn:
//         salesReturnForNewData[0].total.length > 0
//           ? salesReturnForNewData[0].totalAmount[0].totalPaid / 10000
//           : 0,
//       totalDueForSalesReturn:
//         salesReturnForNewData[0].total.length > 0
//           ? salesReturnForNewData[0].totalAmount[0].totalDue / 10000
//           : 0,

//       totalAmountQtyForCSR: companySalesReturnForDashboard[0]
//         ? companySalesReturnForDashboard[0].totalAmountQty
//         : 0,
//       totalPaidQtyForCSR: companySalesReturnForDashboard[0]
//         ? companySalesReturnForDashboard[0].totalPaidQty
//         : 0,
//       totalDueQtyForCSR: companySalesReturnForDashboard[0]
//         ? companySalesReturnForDashboard[0].totalDueQty
//         : 0,
//       totalAmountForCSR: companySalesReturnForDashboard[0]
//         ? companySalesReturnForDashboard[0].totalAmount / 10000
//         : 0,
//       totalPaidForCSR: companySalesReturnForDashboard[0]
//         ? companySalesReturnForDashboard[0].totalPaid / 10000
//         : 0,
//       totalDueForCSR: companySalesReturnForDashboard[0]
//         ? companySalesReturnForDashboard[0].totalDue / 10000
//         : 0,
//     };

//     res.status(201).json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

// const Sales = require("../models/Sales");
// const Product = require("../models/Product");
// const Purchase = require("../models/Purchase");
// const Decimal = require("decimal.js");
// const ProductExchange = require("../models/ProductExchange");
// const PurchaseReturn = require("../models/PurchaseReturn");
// const SalesReturn = require("../models/SalesReturn");
// const CompanySalesReturn = require("../models/CompanySalesReturn");
// const CompanySalesReturnTransaction = require("../models/CompanySalesReturnTransaction");
// const SalesTransaction = require("../models/SalesTransaction");

// module.exports.index = async (req, res) => {
//   try {
//     let start = new Date();
//     start.setHours(0, 0, 0, 0);
//     let end = new Date();
//     end.setHours(23, 59, 59, 999);

//     const [
//       mainStock,
//       sales,
//       productExchange,
//       purchase,
//       purchaseReturn,
//       salesReturn,
//       companySalesReturn,
//       salesTransaction,
//     ] = await Promise.all([
//       // ================== MAIN STOCK (UPDATED) ==================
//       Product.aggregate([
//         {
//           $group: {
//             _id: null,
//             totalStockValue: {
//               $sum: { $multiply: ["$quantity", "$costPrice"] }
//             },
//             totalQuantity: { $sum: "$quantity" },
//             totalSalePrice: {
//               $sum: { $multiply: ["$quantity", "$sellPrice"] }
//             },
//             totalCostPrice: {
//               $sum: { $multiply: ["$quantity", "$costPrice"] }
//             }
//           },
//         },
//       ]),

//       Sales.aggregate([
//         {
//           $facet: {
//             salesDetails: [
//               {
//                 $group: {
//                   _id: null,
//                   totalSell: { $sum: { $multiply: ["$paid", 10000] } },
//                   totalCostInSale: {
//                     $sum: { $multiply: ["$totalCost", 10000] },
//                   },
//                   numberOfSales: { $sum: 1 },

//                   saleTotal: { $sum: { $multiply: ["$total", 10000] } },
//                   saleDue: { $sum: { $multiply: ["$due", 10000] } },
//                 },
//               },
//             ],

//             todaysSaleDetails: [
//               {
//                 $match: { createdAt: { $gte: start, $lte: end } },
//               },
//               {
//                 $group: {
//                   _id: null,
//                   saleTotalToday: { $sum: { $multiply: ["$total", 10000] } },
//                   saleDueToday: { $sum: { $multiply: ["$due", 10000] } },
//                 },
//               },
//             ],
//           },
//         },
//       ]),

//       ProductExchange.aggregate([
//         {
//           $facet: {
//             exchangeDetails: [
//               {
//                 $group: {
//                   _id: null,
//                   exchangeTotal: {
//                     $sum: { $multiply: ["$totalAmount", 10000] },
//                   },
//                   exchangeRemaining: {
//                     $sum: { $multiply: ["$remainingBalance", 10000] },
//                   },
//                 },
//               },
//             ],

//             quantityDetails: [
//               {
//                 $unwind: "$products",
//               },
//               {
//                 $group: {
//                   _id: null,
//                   productQuantityTotal: {
//                     $sum: "$products.quantity",
//                   },
//                   productQuantityInKgTotal: {
//                     $sum: "$products.qtyInKg",
//                   },
//                 },
//               },
//             ],
//           },
//         },
//       ]),

//       Purchase.aggregate([
//         {
//           $facet: {
//             purchaseDetails: [
//               {
//                 $group: {
//                   _id: null,
//                   totalSupplierCost: {
//                     $sum: { $multiply: ["$paid", 10000] },
//                   },
//                   purchaseTotal: {
//                     $sum: { $multiply: ["$totalAmount", 10000] },
//                   },
//                   purchaseDue: { $sum: { $multiply: ["$due", 10000] } },
//                 },
//               },
//             ],

//             quantityDetails: [
//               {
//                 $unwind: "$products",
//               },
//               {
//                 $group: {
//                   _id: null,
//                   productQuantityTotal: {
//                     $sum: "$products.quantity",
//                   },
//                 },
//               },
//             ],
//           },
//         },
//       ]),

//       PurchaseReturn.aggregate([
//         {
//           $unwind: "$products",
//         },
//         {
//           $group: {
//             _id: null,
//             productQuantityTotal: {
//               $sum: "$products.returnQuantity",
//             },
//           },
//         },
//       ]),

//       SalesReturn.aggregate([
//         {
//           $unwind: "$products",
//         },
//         {
//           $group: {
//             _id: null,
//             productQuantityTotal: {
//               $sum: "$products.returnQuantity",
//             },
//           },
//         },
//       ]),

//       CompanySalesReturn.aggregate([
//         {
//           $group: {
//             _id: null,
//             productQuantityTotal: {
//               $sum: "$quantity",
//             },
//           },
//         },
//       ]),

//       SalesTransaction.aggregate([
//         {
//           $facet: {
//             allReport: [
//               {
//                 $group: {
//                   _id: null,
//                   totalCash: { $sum: { $multiply: ["$cash", 10000] } },
//                   totalExchange: { $sum: { $multiply: ["$exchange", 10000] } },
//                   totalBankPaymentAmount: { $sum: { $multiply: ["$bankPaymentAmount", 10000] } },
//                 },
//               },
//             ],

//             todaysReport: [
//               {
//                 $match: { date: { $gte: start, $lte: end } },
//               },
//               {
//                 $group: {
//                   _id: null,
//                   totalCashToday: { $sum: { $multiply: ["$cash", 10000] } },
//                   totalExchangeToday: {
//                     $sum: { $multiply: ["$exchange", 10000] },
//                   },
//                   totalBankPaymentAmountToday: { $sum: { $multiply: ["$bankPaymentAmount", 10000] } },
//                 },
//               },
//             ],
//           },
//         },
//       ]),
//     ]);

//     //* For Sales Return Data - starts
//     const salesReturnForNewData = await SalesReturn.aggregate([
//       {
//         $facet: {
//           total: [
//             {
//               $unwind: "$products",
//             },
//             {
//               $group: {
//                 _id: null,
//                 totalSentItems: { $sum: "$products.returnQuantity" },
//                 totalWeight: { $sum: "$products.returnQtyInKg" },
//               },
//             },
//           ],

//           totalAmount: [
//             {
//               $group: {
//                 _id: null,
//                 totalAmount: {
//                   $sum: { $multiply: ["$totalReturnValue", 10000] },
//                 },
//                 totalPaid: {
//                   $sum: { $multiply: ["$paid", 10000] },
//                 },
//                 totalDue: {
//                   $sum: { $multiply: ["$due", 10000] },
//                 },
//               },
//             },
//           ],
//         },
//       },
//     ]);

//     const transactionData = await CompanySalesReturnTransaction.aggregate([
//       {
//         $group: {
//           _id: null,
//           transactiontotalSentItems: { $sum: "$paidAmount" },
//         },
//       },
//     ]);

//     const transactionSentItems =
//       transactionData[0]?.transactiontotalSentItems || 0;

//     const companyData = await CompanySalesReturn.find();

//     const totalCompanyWeight =
//       companyData && companyData.length
//         ? companyData.reduce((acc, p) => acc + p.qtyInKg, 0)
//         : 0;
//     //* For Sales Return Data - ends

//     //* For Company Sales Return Data - starts
//     const companySalesReturnForDashboard = await CompanySalesReturn.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalAmountQty: {
//             $sum: "$totalAmountQty",
//           },
//           totalPaidQty: {
//             $sum: "$paidQty",
//           },
//           totalDueQty: {
//             $sum: "$dueQty",
//           },
//           totalAmount: {
//             $sum: { $multiply: ["$totalAmount", 10000] },
//           },
//           totalPaid: {
//             $sum: { $multiply: ["$paid", 10000] },
//           },
//           totalDue: {
//             $sum: { $multiply: ["$due", 10000] },
//           },
//         },
//       },
//     ]);
//     //* For Company Sales Return Data - ends

//     const mainQuantity = mainStock[0] ? mainStock[0].totalQuantity : 0;

//     const companySaleReturnQuantity = companySalesReturn[0]
//       ? companySalesReturn[0].productQuantityTotal
//       : 0;

//     const purchaseReturnQuantity = purchaseReturn[0]
//       ? purchaseReturn[0].productQuantityTotal
//       : 0;

//     const salesReturnQuantity = salesReturn[0]
//       ? salesReturn[0].productQuantityTotal
//       : 0;

//     const salesQuantity = 0; // তোমার আগের কোডে এটা ছিল না, তাই 0 রাখলাম

//     const quantityDetails = {
//       mainQuantity,
//       companySaleReturnQuantity,
//       purchaseReturnQuantity,
//       salesReturnQuantity,
//       salesQuantity,
//     };

//     let result = {
//       purchaseTotal:
//         purchase[0].purchaseDetails.length > 0
//           ? purchase[0].purchaseDetails[0].purchaseTotal / 10000
//           : 0,
//       purchaseDue:
//         purchase[0].purchaseDetails.length > 0
//           ? purchase[0].purchaseDetails[0].purchaseDue / 10000
//           : 0,
//       purchaseTotalQuantity:
//         purchase[0].quantityDetails.length > 0
//           ? purchase[0].quantityDetails[0].productQuantityTotal
//           : 0,

//       exchangeTotalQuantity:
//         productExchange[0].quantityDetails.length > 0
//           ? productExchange[0].quantityDetails[0].productQuantityTotal
//           : 0,
//       exchangeTotalQuantityInKg:
//         productExchange[0].quantityDetails.length > 0
//           ? productExchange[0].quantityDetails[0].productQuantityInKgTotal
//           : 0,
//       exchangeTotalPrice:
//         productExchange[0].exchangeDetails.length > 0
//           ? productExchange[0].exchangeDetails[0].exchangeTotal / 10000
//           : 0,
//       exchangeTotalRemaining:
//         productExchange[0].exchangeDetails.length > 0
//           ? productExchange[0].exchangeDetails[0].exchangeRemaining / 10000
//           : 0,

//       salesTotal:
//         sales[0].salesDetails.length > 0
//           ? sales[0].salesDetails[0].saleTotal / 10000
//           : 0,
//       salesDue:
//         sales[0].salesDetails.length > 0
//           ? sales[0].salesDetails[0].saleDue / 10000
//           : 0,
//       salesCash:
//         salesTransaction[0].allReport.length > 0
//           ? salesTransaction[0].allReport[0].totalCash / 10000
//           : 0,
//       salesExchange:
//         salesTransaction[0].allReport.length > 0
//           ? salesTransaction[0].allReport[0].totalExchange / 10000
//           : 0,
//       salesBankPaymentAmount:
//         salesTransaction[0].allReport.length > 0
//           ? salesTransaction[0].allReport[0].totalBankPaymentAmount / 10000
//           : 0,
//       salesProfit:
//         sales[0].salesDetails.length > 0
//           ? (sales[0].salesDetails[0].saleTotal -
//             sales[0].salesDetails[0].saleDue) /
//           10000
//           : 0,

//       // Today Sales
//       salesTotalToday:
//         sales[0].todaysSaleDetails.length > 0
//           ? sales[0].todaysSaleDetails[0].saleTotalToday / 10000
//           : 0,
//       salesDueToday:
//         sales[0].todaysSaleDetails.length > 0
//           ? sales[0].todaysSaleDetails[0].saleDueToday / 10000
//           : 0,
//       salesCashToday:
//         salesTransaction[0].todaysReport.length > 0
//           ? salesTransaction[0].todaysReport[0].totalCashToday / 10000
//           : 0,
//       salesExchangeToday:
//         salesTransaction[0].todaysReport.length > 0
//           ? salesTransaction[0].todaysReport[0].totalExchangeToday / 10000
//           : 0,
//       salesBankPaymentAmountToday:
//         salesTransaction[0].todaysReport.length > 0
//           ? salesTransaction[0].todaysReport[0].totalBankPaymentAmountToday / 10000
//           : 0,

//       // ================== MAIN STOCK (UPDATED) ==================
//       totalStockValue: mainStock[0] ? mainStock[0].totalStockValue : 0,
//       totalProductCostPrice: mainStock[0] ? mainStock[0].totalCostPrice / 10000 : 0,
//       totalProductSalePrice: mainStock[0] ? mainStock[0].totalSalePrice / 10000 : 0,

//       quantityDetails,

//       // Sales Return & Company Return (আগের মতো রাখা হয়েছে)
//       totalSentItemsForSalesReturn:
//         salesReturnForNewData && salesReturnForNewData[0].total.length > 0
//           ? salesReturnForNewData[0].total[0].totalSentItems -
//           transactionSentItems
//           : 0,
//       totalAmountForSalesReturn:
//         salesReturnForNewData && salesReturnForNewData[0].totalAmount.length > 0
//           ? salesReturnForNewData[0].totalAmount[0].totalAmount / 10000
//           : 0,
//       totalPaidForSalesReturn:
//         salesReturnForNewData && salesReturnForNewData[0].totalAmount.length > 0
//           ? salesReturnForNewData[0].totalAmount[0].totalPaid / 10000
//           : 0,
//       totalDueForSalesReturn:
//         salesReturnForNewData && salesReturnForNewData[0].totalAmount.length > 0
//           ? salesReturnForNewData[0].totalAmount[0].totalDue / 10000
//           : 0,

//       totalAmountQtyForCSR: companySalesReturnForDashboard[0]
//         ? companySalesReturnForDashboard[0].totalAmountQty
//         : 0,
//       totalPaidQtyForCSR: companySalesReturnForDashboard[0]
//         ? companySalesReturnForDashboard[0].totalPaidQty
//         : 0,
//       totalDueQtyForCSR: companySalesReturnForDashboard[0]
//         ? companySalesReturnForDashboard[0].totalDueQty
//         : 0,
//       totalAmountForCSR: companySalesReturnForDashboard[0]
//         ? companySalesReturnForDashboard[0].totalAmount / 10000
//         : 0,
//       totalPaidForCSR: companySalesReturnForDashboard[0]
//         ? companySalesReturnForDashboard[0].totalPaid / 10000
//         : 0,
//       totalDueForCSR: companySalesReturnForDashboard[0]
//         ? companySalesReturnForDashboard[0].totalDue / 10000
//         : 0,
//     };

//     res.status(201).json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

// const Sales = require("../models/Sales");
// const Product = require("../models/Product");
// const Purchase = require("../models/Purchase");
// const Decimal = require("decimal.js");
// const ProductExchange = require("../models/ProductExchange");
// const PurchaseReturn = require("../models/PurchaseReturn");
// const SalesReturn = require("../models/SalesReturn");
// const CompanySalesReturn = require("../models/CompanySalesReturn");
// const CompanySalesReturnTransaction = require("../models/CompanySalesReturnTransaction");
// const SalesTransaction = require("../models/SalesTransaction");
// const SalesReturnStockManagement = require("../models/SalesReturnStockManagement");
// // তোমার দেওয়া নতুন ট্রানজেকশন মডেলটি এখানে ইমপোর্ট করা হলো
// const SalesReturnTransaction = require("../models/SalesReturnTransaction");

// module.exports.index = async (req, res) => {
//   try {
//     let start = new Date();
//     start.setHours(0, 0, 0, 0);
//     let end = new Date();
//     end.setHours(23, 59, 59, 999);

//     const [
//       mainStock,
//       sales,
//       productExchange,
//       purchase,
//       purchaseReturn,
//       salesReturn,
//       companySalesReturn,
//       salesTransaction
//     ] = await Promise.all([
//       // ================== MAIN STOCK ==================
//       Product.aggregate([
//         {
//           $group: {
//             _id: null,
//             totalStockValue: {
//               $sum: { $multiply: ["$quantity", "$costPrice"] }
//             },
//             totalQuantity: { $sum: "$quantity" },
//             totalSalePrice: {
//               $sum: { $multiply: ["$quantity", "$sellPrice"] }
//             },
//             totalCostPrice: {
//               $sum: { $multiply: ["$quantity", "$costPrice"] }
//             }
//           }
//         }
//       ]),

//       // ================== SALES ==================
//       Sales.aggregate([
//         {
//           $facet: {
//             salesDetails: [
//               {
//                 $group: {
//                   _id: null,
//                   totalSell: { $sum: { $multiply: ["$paid", 10000] } },
//                   totalCostInSale: {
//                     $sum: { $multiply: ["$totalCost", 10000] }
//                   },
//                   numberOfSales: { $sum: 1 },
//                   saleTotal: { $sum: { $multiply: ["$total", 10000] } },
//                   saleDue: { $sum: { $multiply: ["$due", 10000] } }
//                 }
//               }
//             ],
//             todaysSaleDetails: [
//               {
//                 $match: { createdAt: { $gte: start, $lte: end } }
//               },
//               {
//                 $group: {
//                   _id: null,
//                   saleTotalToday: { $sum: { $multiply: ["$total", 10000] } },
//                   saleDueToday: { $sum: { $multiply: ["$due", 10000] } }
//                 }
//               }
//             ]
//           }
//         }
//       ]),

//       // ================== PRODUCT EXCHANGE ==================
//       ProductExchange.aggregate([
//         {
//           $facet: {
//             exchangeDetails: [
//               {
//                 $group: {
//                   _id: null,
//                   exchangeTotal: {
//                     $sum: { $multiply: ["$totalAmount", 10000] }
//                   },
//                   exchangeRemaining: {
//                     $sum: { $multiply: ["$remainingBalance", 10000] }
//                   }
//                 }
//               }
//             ],
//             quantityDetails: [
//               {
//                 $unwind: "$products"
//               },
//               {
//                 $group: {
//                   _id: null,
//                   productQuantityTotal: {
//                     $sum: "$products.quantity"
//                   },
//                   productQuantityInKgTotal: {
//                     $sum: "$products.qtyInKg"
//                   }
//                 }
//               }
//             ]
//           }
//         }
//       ]),

//       // ================== PURCHASE ==================
//       Purchase.aggregate([
//         {
//           $facet: {
//             purchaseDetails: [
//               {
//                 $group: {
//                   _id: null,
//                   totalSupplierCost: {
//                     $sum: { $multiply: ["$paid", 10000] }
//                   },
//                   purchaseTotal: {
//                     $sum: { $multiply: ["$totalAmount", 10000] }
//                   },
//                   purchaseDue: { $sum: { $multiply: ["$due", 10000] } }
//                 }
//               }
//             ],
//             quantityDetails: [
//               {
//                 $unwind: "$products"
//               },
//               {
//                 $group: {
//                   _id: null,
//                   productQuantityTotal: {
//                     $sum: "$products.quantity"
//                   }
//                 }
//               }
//             ]
//           }
//         }
//       ]),

//       // ================== PURCHASE RETURN ==================
//       PurchaseReturn.aggregate([
//         {
//           $unwind: "$products"
//         },
//         {
//           $group: {
//             _id: null,
//             productQuantityTotal: {
//               $sum: "$products.returnQuantity"
//             }
//           }
//         }
//       ]),

//       // ================== SALES RETURN ==================
//       SalesReturn.aggregate([
//         {
//           $unwind: "$products"
//         },
//         {
//           $group: {
//             _id: null,
//             productQuantityTotal: {
//               $sum: "$products.returnQuantity"
//             }
//           }
//         }
//       ]),

//       // ================== COMPANY SALES RETURN ==================
//       CompanySalesReturn.aggregate([
//         {
//           $group: {
//             _id: null,
//             productQuantityTotal: {
//               $sum: "$quantity"
//             }
//           }
//         }
//       ]),

//       // ================== SALES TRANSACTION ==================
//       SalesTransaction.aggregate([
//         {
//           $facet: {
//             allReport: [
//               {
//                 $group: {
//                   _id: null,
//                   totalCash: { $sum: { $multiply: ["$cash", 10000] } },
//                   totalExchange: { $sum: { $multiply: ["$exchange", 10000] } },
//                   totalBankPaymentAmount: { $sum: { $multiply: ["$bankPaymentAmount", 10000] } }
//                 }
//               }
//             ],
//             todaysReport: [
//               {
//                 $match: { date: { $gte: start, $lte: end } }
//               },
//               {
//                 $group: {
//                   _id: null,
//                   totalCashToday: { $sum: { $multiply: ["$cash", 10000] } },
//                   totalExchangeToday: {
//                     $sum: { $multiply: ["$exchange", 10000] }
//                   },
//                   totalBankPaymentAmountToday: { $sum: { $multiply: ["$bankPaymentAmount", 10000] } }
//                 }
//               }
//             ]
//           }
//         }
//       ])
//     ]);

//     //* For Sales Return Data - starts
//     const salesReturnForNewData = await SalesReturn.aggregate([
//       {
//         $facet: {
//           total: [
//             {
//               $unwind: "$products"
//             },
//             {
//               $group: {
//                 _id: null,
//                 totalSentItems: { $sum: "$products.returnQuantity" },
//                 totalWeight: { $sum: "$products.returnQtyInKg" }
//               }
//             }
//           ],
//           totalAmount: [
//             {
//               $group: {
//                 _id: null,
//                 totalAmount: {
//                   $sum: { $multiply: ["$totalReturnValue", 10000] }
//                 },
//                 totalPaid: {
//                   $sum: { $multiply: ["$paid", 10000] }
//                 },
//                 totalDue: {
//                   $sum: { $multiply: ["$due", 10000] }
//                 }
//               }
//             }
//           ]
//         }
//       }
//     ]);

//     const transactionData = await CompanySalesReturnTransaction.aggregate([
//       {
//         $group: {
//           _id: null,
//           transactiontotalSentItems: { $sum: "$paidAmount" }
//         }
//       }
//     ]);

//     const transactionSentItems = transactionData[0]?.transactiontotalSentItems || 0;

//     const companyData = await CompanySalesReturn.find();

//     const totalCompanyWeight = companyData && companyData.length
//         ? companyData.reduce((acc, p) => acc + p.qtyInKg, 0)
//         : 0;
//     //* For Sales Return Data - ends

//     // ৫ নম্বর কার্ড এর কারেন্ট স্টক এগ্রিগেশন
//     const currentReturnStockDetails = await SalesReturnStockManagement.aggregate([
//       {
//         $group: {
//           _id: null,
//           currentQty: { $sum: "$tempReturnQuantity" },
//           currentValue: { $sum: { $multiply: ["$tempReturnQuantity", "$returnPrice"] } }
//         }
//       }
//     ]);

//     // =========================================================================
//     // ৬ নম্বর কার্ডের ফিক্সড লজিক: SalesReturnTransaction থেকে কাস্টমারকে দেওয়া মাল গণনা
//     // =========================================================================
//     const customerExchangeQtyDetails = await SalesReturnTransaction.aggregate([
//       {
//         $match: { returnType: "product" }
//       },
//       {
//         $unwind: { path: "$exchangeProducts", preserveNullAndEmptyArrays: true }
//       },
//       {
//         $group: {
//           _id: null,
//           totalGivenQty: { $sum: { $ifNull: ["$exchangeProducts.quantity", 0] } }
//         }
//       }
//     ]);

//     const cardFiveQty = currentReturnStockDetails[0]?.currentQty || 0;
//     const cardFiveAmount = currentReturnStockDetails[0]?.currentValue || 0;

//     // ডাটাবেজ থেকে পাওয়া টোটাল ডেলিভারি কোয়ান্টিটি
//     const cardSixGivenQty = customerExchangeQtyDetails[0]?.totalGivenQty || 0;

//     //* For Company Sales Return Data - starts
//     const companySalesReturnForDashboard = await CompanySalesReturn.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalAmountQty: { $sum: "$totalAmountQty" },
//           totalPaidQty: { $sum: "$paidQty" },
//           totalDueQty: { $sum: "$dueQty" },
//           totalAmount: { $sum: { $multiply: ["$totalAmount", 10000] } },
//           totalPaid: { $sum: { $multiply: ["$paid", 10000] } },
//           totalDue: { $sum: { $multiply: ["$due", 10000] } }
//         }
//       }
//     ]);

//     const mainQuantity = mainStock[0] ? mainStock[0].totalQuantity : 0;
//     const companySaleReturnQuantity = companySalesReturn[0] ? companySalesReturn[0].productQuantityTotal : 0;
//     const purchaseReturnQuantity = purchaseReturn[0] ? purchaseReturn[0].productQuantityTotal : 0;
//     const salesReturnQuantity = salesReturn[0] ? salesReturn[0].productQuantityTotal : 0;
//     const salesQuantity = 0;

//     const quantityDetails = {
//       mainQuantity,
//       companySaleReturnQuantity,
//       purchaseReturnQuantity,
//       salesReturnQuantity,
//       salesQuantity
//     };

//     let result = {
//       purchaseTotal: purchase[0].purchaseDetails.length > 0 ? purchase[0].purchaseDetails[0].purchaseTotal / 10000 : 0,
//       purchaseDue: purchase[0].purchaseDetails.length > 0 ? purchase[0].purchaseDetails[0].purchaseDue / 10000 : 0,
//       purchaseTotalQuantity: purchase[0].quantityDetails.length > 0 ? purchase[0].quantityDetails[0].productQuantityTotal : 0,

//       exchangeTotalQuantity: productExchange[0].quantityDetails.length > 0 ? productExchange[0].quantityDetails[0].productQuantityTotal : 0,
//       exchangeTotalQuantityInKg: productExchange[0].quantityDetails.length > 0 ? productExchange[0].quantityDetails[0].productQuantityInKgTotal : 0,
//       exchangeTotalPrice: productExchange[0].exchangeDetails.length > 0 ? productExchange[0].exchangeDetails[0].exchangeTotal / 10000 : 0,
//       exchangeTotalRemaining: productExchange[0].exchangeDetails.length > 0 ? productExchange[0].exchangeDetails[0].exchangeRemaining / 10000 : 0,

//       salesTotal: sales[0].salesDetails.length > 0 ? sales[0].salesDetails[0].saleTotal / 10000 : 0,
//       salesDue: sales[0].salesDetails.length > 0 ? sales[0].salesDetails[0].saleDue / 10000 : 0,
//       salesCash: salesTransaction[0].allReport.length > 0 ? salesTransaction[0].allReport[0].totalCash / 10000 : 0,
//       salesExchange: salesTransaction[0].allReport.length > 0 ? salesTransaction[0].allReport[0].totalExchange / 10000 : 0,
//       salesBankPaymentAmount: salesTransaction[0].allReport.length > 0 ? salesTransaction[0].allReport[0].totalBankPaymentAmount / 10000 : 0,
//       salesProfit: sales[0].salesDetails.length > 0 ? (sales[0].salesDetails[0].saleTotal - sales[0].salesDetails[0].saleDue) / 10000 : 0,

//       salesTotalToday: sales[0].todaysSaleDetails.length > 0 ? sales[0].todaysSaleDetails[0].saleTotalToday / 10000 : 0,
//       salesDueToday: sales[0].todaysSaleDetails.length > 0 ? sales[0].todaysSaleDetails[0].saleDueToday / 10000 : 0,
//       salesCashToday: salesTransaction[0].todaysReport.length > 0 ? salesTransaction[0].todaysReport[0].totalCashToday / 10000 : 0,
//       salesExchangeToday: salesTransaction[0].todaysReport.length > 0 ? salesTransaction[0].todaysReport[0].totalExchangeToday / 10000 : 0,
//       salesBankPaymentAmountToday: salesTransaction[0].todaysReport.length > 0 ? salesTransaction[0].todaysReport[0].totalBankPaymentAmountToday / 10000 : 0,

//       totalStockValue: mainStock[0] ? mainStock[0].totalStockValue : 0,
//       totalProductCostPrice: mainStock[0] ? mainStock[0].totalCostPrice / 10000 : 0,
//       totalProductSalePrice: mainStock[0] ? mainStock[0].totalSalePrice / 10000 : 0,

//       quantityDetails,
//       transactionSentItems,

//       totalSentItemsForSalesReturn: salesReturnForNewData && salesReturnForNewData[0].total.length > 0 ? salesReturnForNewData[0].total[0].totalSentItems - transactionSentItems : 0,
//       totalAmountForSalesReturn: salesReturnForNewData && salesReturnForNewData[0].totalAmount.length > 0 ? salesReturnForNewData[0].totalAmount[0].totalAmount / 10000 : 0,
//       totalPaidForSalesReturn: salesReturnForNewData && salesReturnForNewData[0].totalAmount.length > 0 ? salesReturnForNewData[0].totalAmount[0].totalPaid / 10000 : 0,
//       totalDueForSalesReturn: salesReturnForNewData && salesReturnForNewData[0].totalAmount.length > 0 ? salesReturnForNewData[0].totalAmount[0].totalDue / 10000 : 0,

//       cardFiveQty: cardFiveQty,
//       cardFiveAmount: cardFiveAmount,
//       cardSixGivenQty: cardSixGivenQty, // ফ্রন্টএন্ডে এটি ৫ পাস করবে

//       totalAmountQtyForCSR: companySalesReturnForDashboard[0] ? companySalesReturnForDashboard[0].totalAmountQty : 0,
//       totalPaidQtyForCSR: companySalesReturnForDashboard[0] ? companySalesReturnForDashboard[0].totalPaidQty : 0,
//       totalDueQtyForCSR: companySalesReturnForDashboard[0] ? companySalesReturnForDashboard[0].totalDueQty : 0,
//       totalAmountForCSR: companySalesReturnForDashboard[0] ? companySalesReturnForDashboard[0].totalAmount / 10000 : 0,
//       totalPaidForCSR: companySalesReturnForDashboard[0] ? companySalesReturnForDashboard[0].totalPaid / 10000 : 0,
//       totalDueForCSR: companySalesReturnForDashboard[0] ? companySalesReturnForDashboard[0].totalDue / 10000 : 0
//     };

//     res.status(201).json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

// const Sales = require("../models/Sales");
// const Product = require("../models/Product");
// const Purchase = require("../models/Purchase");
// const Decimal = require("decimal.js");
// const ProductExchange = require("../models/ProductExchange");
// const PurchaseReturn = require("../models/PurchaseReturn");
// const SalesReturn = require("../models/SalesReturn");
// const CompanySalesReturn = require("../models/CompanySalesReturn");
// const CompanySalesReturnTransaction = require("../models/CompanySalesReturnTransaction");
// const SalesTransaction = require("../models/SalesTransaction");
// const SalesReturnStockManagement = require("../models/SalesReturnStockManagement");
// const SalesReturnTransaction = require("../models/SalesReturnTransaction");

// module.exports.index = async (req, res) => {
//   try {
//     let start = new Date();
//     start.setHours(0, 0, 0, 0);
//     let end = new Date();
//     end.setHours(23, 59, 59, 999);

//     const [
//       mainStock,
//       sales,
//       productExchange,
//       purchase,
//       purchaseReturn,
//       salesReturn,
//       companySalesReturn,
//       salesTransaction
//     ] = await Promise.all([
//       // ================== MAIN STOCK ==================
//       Product.aggregate([
//         {
//           $group: {
//             _id: null,
//             totalStockValue: { $sum: { $multiply: ["$quantity", "$costPrice"] } },
//             totalQuantity: { $sum: "$quantity" },
//             totalSalePrice: { $sum: { $multiply: ["$quantity", "$sellPrice"] } },
//             totalCostPrice: { $sum: { $multiply: ["$quantity", "$costPrice"] } }
//           }
//         }
//       ]),

//       // ================== SALES ==================
//       Sales.aggregate([
//         {
//           $facet: {
//             salesDetails: [
//               {
//                 $group: {
//                   _id: null,
//                   totalSell: { $sum: { $multiply: ["$paid", 10000] } },
//                   totalCostInSale: { $sum: { $multiply: ["$totalCost", 10000] } },
//                   numberOfSales: { $sum: 1 },
//                   saleTotal: { $sum: { $multiply: ["$total", 10000] } },
//                   saleDue: { $sum: { $multiply: ["$due", 10000] } }
//                 }
//               }
//             ],
//             todaysSaleDetails: [
//               { $match: { createdAt: { $gte: start, $lte: end } } },
//               {
//                 $group: {
//                   _id: null,
//                   saleTotalToday: { $sum: { $multiply: ["$total", 10000] } },
//                   saleDueToday: { $sum: { $multiply: ["$due", 10000] } }
//                 }
//               }
//             ]
//           }
//         }
//       ]),

//       // ================== PRODUCT EXCHANGE ==================
//       ProductExchange.aggregate([
//         {
//           $facet: {
//             exchangeDetails: [
//               {
//                 $group: {
//                   _id: null,
//                   exchangeTotal: { $sum: { $multiply: ["$totalAmount", 10000] } },
//                   exchangeRemaining: { $sum: { $multiply: ["$remainingBalance", 10000] } }
//                 }
//               }
//             ],
//             quantityDetails: [
//               { $unwind: "$products" },
//               {
//                 $group: {
//                   _id: null,
//                   productQuantityTotal: { $sum: "$products.quantity" },
//                   productQuantityInKgTotal: { $sum: "$products.qtyInKg" }
//                 }
//               }
//             ]
//           }
//         }
//       ]),

//       // ================== PURCHASE ==================
//       Purchase.aggregate([
//         {
//           $facet: {
//             purchaseDetails: [
//               {
//                 $group: {
//                   _id: null,
//                   totalSupplierCost: { $sum: { $multiply: ["$paid", 10000] } },
//                   purchaseTotal: { $sum: { $multiply: ["$totalAmount", 10000] } },
//                   purchaseDue: { $sum: { $multiply: ["$due", 10000] } }
//                 }
//               }
//             ],
//             quantityDetails: [
//               { $unwind: "$products" },
//               {
//                 $group: {
//                   _id: null,
//                   productQuantityTotal: { $sum: "$products.quantity" }
//                 }
//               }
//             ]
//           }
//         }
//       ]),

//       // ================== PURCHASE RETURN ==================
//       PurchaseReturn.aggregate([
//         { $unwind: "$products" },
//         { $group: { _id: null, productQuantityTotal: { $sum: "$products.returnQuantity" } } }
//       ]),

//       // ================== SALES RETURN ==================
//       SalesReturn.aggregate([
//         { $unwind: "$products" },
//         { $group: { _id: null, productQuantityTotal: { $sum: "$products.returnQuantity" } } }
//       ]),

//       // ================== COMPANY SALES RETURN ==================
//       CompanySalesReturn.aggregate([
//         { $group: { _id: null, productQuantityTotal: { $sum: "$quantity" } } }
//       ]),

//       // ================== SALES TRANSACTION ==================
//       SalesTransaction.aggregate([
//         {
//           $facet: {
//             allReport: [
//               {
//                 $group: {
//                   _id: null,
//                   totalCash: { $sum: { $multiply: ["$cash", 10000] } },
//                   totalExchange: { $sum: { $multiply: ["$exchange", 10000] } },
//                   totalBankPaymentAmount: { $sum: { $multiply: ["$bankPaymentAmount", 10000] } }
//                 }
//               }
//             ],
//             todaysReport: [
//               { $match: { date: { $gte: start, $lte: end } } },
//               {
//                 $group: {
//                   _id: null,
//                   totalCashToday: { $sum: { $multiply: ["$cash", 10000] } },
//                   totalExchangeToday: { $sum: { $multiply: ["$exchange", 10000] } },
//                   totalBankPaymentAmountToday: { $sum: { $multiply: ["$bankPaymentAmount", 10000] } }
//                 }
//               }
//             ]
//           }
//         }
//       ])
//     ]);

//     //* For Sales Return Data - starts
//     const salesReturnForNewData = await SalesReturn.aggregate([
//       {
//         $facet: {
//           total: [
//             { $unwind: "$products" },
//             {
//               $group: {
//                 _id: null,
//                 totalSentItems: { $sum: "$products.returnQuantity" },
//                 totalWeight: { $sum: "$products.returnQtyInKg" }
//               }
//             }
//           ],
//           totalAmount: [
//             {
//               $group: {
//                 _id: null,
//                 totalAmount: { $sum: { $multiply: ["$totalReturnValue", 10000] } },
//                 totalPaid: { $sum: { $multiply: ["$paid", 10000] } },
//                 totalDue: { $sum: { $multiply: ["$due", 10000] } }
//               }
//             }
//           ]
//         }
//       }
//     ]);

//     const transactionData = await CompanySalesReturnTransaction.aggregate([
//       { $group: { _id: null, transactiontotalSentItems: { $sum: "$paidAmount" } } }
//     ]);

//     const transactionSentItems = transactionData[0]?.transactiontotalSentItems || 0;
//     const companyData = await CompanySalesReturn.find();
//     const totalCompanyWeight = companyData && companyData.length ? companyData.reduce((acc, p) => acc + p.qtyInKg, 0) : 0;
//     //* For Sales Return Data - ends

//     // =========================================================================
//     // ৫ নম্বর কার্ড: দোকানের বর্তমান ড্যামেজ/রিটার্ন স্টক মডিউল
//     // =========================================================================
//     const currentReturnStockDetails = await SalesReturnStockManagement.aggregate([
//       {
//         $group: {
//           _id: null,
//           currentQty: { $sum: "$tempReturnQuantity" },
//           currentValueFlat: { $sum: { $multiply: ["$tempReturnQuantity", "$returnPrice"] } }
//         }
//       }
//     ]);

//     const cardFiveQty = currentReturnStockDetails[0]?.currentQty || 0;
//     const cardFiveAmount = currentReturnStockDetails[0]?.currentValueFlat || 0;

//     // ৬ নম্বর কার্ডের জন্য কাস্টমার এক্সচেঞ্জ প্রোডাক্ট কোয়ান্টিটি কাউন্ট
//     const customerExchangeQtyDetails = await SalesReturnTransaction.aggregate([
//       { $match: { returnType: "product" } },
//       { $unwind: { path: "$exchangeProducts", preserveNullAndEmptyArrays: true } },
//       { $group: { _id: null, totalGivenQty: { $sum: { $ifNull: ["$exchangeProducts.quantity", 0] } } } }
//     ]);
//     const cardSixGivenQty = customerExchangeQtyDetails[0]?.totalGivenQty || 0;

//     // =========================================================================
//     // ৭ নম্বর কার্ড: কোম্পানি রিটার্ন এগ্রিগেশন (ভ্যারিয়েবল ফিক্স করা হলো)
//     // =========================================================================
//     const companySalesReturnForDashboard = await CompanySalesReturn.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalAmountQty: { $sum: "$totalAmountQty" },
//           totalPaidQty: { $sum: "$paidQty" },
//           totalDueQty: { $sum: "$dueQty" },
//           totalAmountRaw: { $sum: { $multiply: ["$totalAmount", 10000] } },
//           totalPaidRaw: { $sum: { $multiply: ["$paid", 10000] } },
//           totalDueRaw: { $sum: { $multiply: ["$due", 10000] } }
//         }
//       }
//     ]);

//     const companyTotalAmountQty = companySalesReturnForDashboard[0] ? companySalesReturnForDashboard[0].totalAmountQty : 0;
//     const companyTotalPaidQty = companySalesReturnForDashboard[0] ? companySalesReturnForDashboard[0].totalPaidQty : 0;
//     const companyTotalDueQty = companySalesReturnForDashboard[0] ? companySalesReturnForDashboard[0].totalDueQty : 0;

//     // ১০,০০০ স্কেলিং রিমুভ করে আসল মান জেনারেট
//     const companyTotalAmountValue = companySalesReturnForDashboard[0] ? (companySalesReturnForDashboard[0].totalAmountRaw / 10000) : 0;
//     const companyTotalPaidValue = companySalesReturnForDashboard[0] ? (companySalesReturnForDashboard[0].totalPaidRaw / 10000) : 0;
//     const companyTotalDueValue = companySalesReturnForDashboard[0] ? (companySalesReturnForDashboard[0].totalDueRaw / 10000) : 0;

//     const mainQuantity = mainStock[0] ? mainStock[0].totalQuantity : 0;
//     const companySaleReturnQuantity = companySalesReturn[0] ? companySalesReturn[0].productQuantityTotal : 0;
//     const purchaseReturnQuantity = purchaseReturn[0] ? purchaseReturn[0].productQuantityTotal : 0;
//     const salesReturnQuantity = salesReturn[0] ? salesReturn[0].productQuantityTotal : 0;
//     const salesQuantity = 0;

//     const quantityDetails = {
//       mainQuantity,
//       companySaleReturnQuantity,
//       purchaseReturnQuantity,
//       salesReturnQuantity,
//       salesQuantity
//     };

//     let result = {
//       purchaseTotal: purchase[0].purchaseDetails.length > 0 ? purchase[0].purchaseDetails[0].purchaseTotal / 10000 : 0,
//       purchaseDue: purchase[0].purchaseDetails.length > 0 ? purchase[0].purchaseDetails[0].purchaseDue / 10000 : 0,
//       purchaseTotalQuantity: purchase[0].quantityDetails.length > 0 ? purchase[0].quantityDetails[0].productQuantityTotal : 0,

//       exchangeTotalQuantity: productExchange[0].quantityDetails.length > 0 ? productExchange[0].quantityDetails[0].productQuantityTotal : 0,
//       exchangeTotalQuantityInKg: productExchange[0].quantityDetails.length > 0 ? productExchange[0].quantityDetails[0].productQuantityInKgTotal : 0,
//       exchangeTotalPrice: productExchange[0].exchangeDetails.length > 0 ? productExchange[0].exchangeDetails[0].exchangeTotal / 10000 : 0,
//       exchangeTotalRemaining: productExchange[0].exchangeDetails.length > 0 ? productExchange[0].exchangeDetails[0].exchangeRemaining / 10000 : 0,

//       salesTotal: sales[0].salesDetails.length > 0 ? sales[0].salesDetails[0].saleTotal / 10000 : 0,
//       salesDue: sales[0].salesDetails.length > 0 ? sales[0].salesDetails[0].saleDue / 10000 : 0,
//       salesCash: salesTransaction[0].allReport.length > 0 ? salesTransaction[0].allReport[0].totalCash / 10000 : 0,
//       salesExchange: salesTransaction[0].allReport.length > 0 ? salesTransaction[0].allReport[0].totalExchange / 10000 : 0,
//       salesBankPaymentAmount: salesTransaction[0].allReport.length > 0 ? salesTransaction[0].allReport[0].totalBankPaymentAmount / 10000 : 0,
//       salesProfit: sales[0].salesDetails.length > 0 ? (sales[0].salesDetails[0].saleTotal - sales[0].salesDetails[0].saleDue) / 10000 : 0,

//       salesTotalToday: sales[0].todaysSaleDetails.length > 0 ? sales[0].todaysSaleDetails[0].saleTotalToday / 10000 : 0,
//       salesDueToday: sales[0].todaysSaleDetails.length > 0 ? sales[0].todaysSaleDetails[0].saleDueToday / 10000 : 0,
//       salesCashToday: salesTransaction[0].todaysReport.length > 0 ? salesTransaction[0].todaysReport[0].totalCashToday / 10000 : 0,
//       salesExchangeToday: salesTransaction[0].todaysReport.length > 0 ? salesTransaction[0].todaysReport[0].totalExchangeToday / 10000 : 0,
//       salesBankPaymentAmountToday: salesTransaction[0].todaysReport.length > 0 ? salesTransaction[0].todaysReport[0].totalBankPaymentAmountToday / 10000 : 0,

//       totalStockValue: mainStock[0] ? mainStock[0].totalStockValue : 0,
//       totalProductCostPrice: mainStock[0] ? mainStock[0].totalCostPrice / 10000 : 0,
//       totalProductSalePrice: mainStock[0] ? mainStock[0].totalSalePrice / 10000 : 0,

//       quantityDetails,
//       transactionSentItems,

//       totalSentItemsForSalesReturn: salesReturnForNewData && salesReturnForNewData[0].total.length > 0 ? salesReturnForNewData[0].total[0].totalSentItems - transactionSentItems : 0,
//       totalAmountForSalesReturn: salesReturnForNewData && salesReturnForNewData[0].totalAmount.length > 0 ? salesReturnForNewData[0].totalAmount[0].totalAmount / 10000 : 0,
//       totalPaidForSalesReturn: salesReturnForNewData && salesReturnForNewData[0].totalAmount.length > 0 ? salesReturnForNewData[0].totalAmount[0].totalPaid / 10000 : 0,
//       totalDueForSalesReturn: salesReturnForNewData && salesReturnForNewData[0].totalAmount.length > 0 ? salesReturnForNewData[0].totalAmount[0].totalDue / 10000 : 0,

//       // ৫ নম্বর কার্ডের ডাটা
//       cardFiveQty: cardFiveQty,
//       cardFiveAmount: cardFiveAmount,
//       cardSixGivenQty: cardSixGivenQty,

//       // ৭ নম্বর কার্ডের ডাটা (কোম্পানি রিটার্ন মডিউল - লাইভ ফিক্স)
//       totalAmountQtyForCSR: companyTotalAmountQty,
//       totalPaidQtyForCSR: companyTotalPaidQty,
//       totalDueQtyForCSR: companyTotalDueQty,

//       // গুরুত্বপূর্ণ ফিক্স: ফ্রন্টএন্ডের মেইন বড় টেক্সট অবজেক্টে এখন 'টোটাল কত টাকার মাল পাঠানো হয়েছে' তা যাবে।
//       totalPaidForCSR: companyTotalAmountValue,    // ফ্রন্টএন্ডের বড় টেক্সট ম্যাপ করা ফিল্ডে Total Amount পাঠানো হলো
//       totalReceivedValueForCSR: companyTotalPaidValue, // কোম্পানি থেকে যদি ক্যাশ/মাল রিসিভ হয় (ঐচ্ছিক ব্যবহারের জন্য)
//       totalDueForCSR: companyTotalDueValue
//     };

//     res.status(201).json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

// const Sales = require("../models/Sales");
// const Product = require("../models/Product");
// const Purchase = require("../models/Purchase");
// const Decimal = require("decimal.js");
// const ProductExchange = require("../models/ProductExchange");
// const PurchaseReturn = require("../models/PurchaseReturn");
// const SalesReturn = require("../models/SalesReturn");
// const CompanySalesReturn = require("../models/CompanySalesReturn");
// const CompanySalesReturnTransaction = require("../models/CompanySalesReturnTransaction");
// const SalesTransaction = require("../models/SalesTransaction");
// const SalesReturnStockManagement = require("../models/SalesReturnStockManagement");
// const SalesReturnTransaction = require("../models/SalesReturnTransaction");

// module.exports.index = async (req, res) => {
//   try {
//     // টাইমজোন ইস্যু ফিক্স করার জন্য ডাইনামিক আজকের ডেট রেঞ্জ (UTC/Local Safe)
//     let start = new Date();
//     start.setHours(0, 0, 0, 0);
//     let end = new Date();
//     end.setHours(23, 59, 59, 999);

//     const [
//       mainStock,
//       sales,
//       productExchange,
//       purchase,
//       purchaseReturn,
//       salesReturn,
//       companySalesReturn,
//       salesTransaction
//     ] = await Promise.all([
//       // ================== MAIN STOCK ==================
//       Product.aggregate([
//         {
//           $group: {
//             _id: null,
//             totalStockValue: { $sum: { $multiply: ["$quantity", "$costPrice"] } },
//             totalQuantity: { $sum: "$quantity" },
//             totalSalePrice: { $sum: { $multiply: ["$quantity", "$sellPrice"] } },
//             totalCostPrice: { $sum: { $multiply: ["$quantity", "$costPrice"] } }
//           }
//         }
//       ]),

//       // ================== SALES (UPDATED & MATCHED EXACTLY) ==================
//       Sales.aggregate([
//         {
//           $facet: {
//             salesDetails: [
//               {
//                 $group: {
//                   _id: null,
//                   totalSell: { $sum: { $multiply: ["$paid", 10000] } },
//                   totalCostInSale: { $sum: { $multiply: ["$totalCost", 10000] } },
//                   numberOfSales: { $sum: 1 },
//                   saleTotal: { $sum: { $multiply: ["$total", 10000] } },
//                   saleDue: { $sum: { $multiply: ["$due", 10000] } }
//                 }
//               }
//             ],
//             todaysSaleDetails: [
//               { $match: { createdAt: { $gte: start, $lte: end } } },
//               {
//                 $group: {
//                   _id: null,
//                   saleTotalToday: { $sum: { $multiply: ["$total", 10000] } },
//                   saleDueToday: { $sum: { $multiply: ["$due", 10000] } }
//                 }
//               }
//             ],
//             // ফিক্সড এগ্রিগেশন: আজকের বিক্রির মোট পিস বা কোয়ান্টিটি সঠিকভাবে বের করার জন্য
//             todaysSaleQuantityDetails: [
//               { $match: { createdAt: { $gte: start, $lte: end } } },
//               { $unwind: { path: "$products", preserveNullAndEmptyArrays: true } },
//               {
//                 $group: {
//                   _id: null,
//                   totalQtyToday: { $sum: { $ifNull: ["$products.quantity", 0] } }
//                 }
//               }
//             ]
//           }
//         }
//       ]),

//       // ================== PRODUCT EXCHANGE ==================
//       ProductExchange.aggregate([
//         {
//           $facet: {
//             exchangeDetails: [
//               {
//                 $group: {
//                   _id: null,
//                   exchangeTotal: { $sum: { $multiply: ["$totalAmount", 10000] } },
//                   exchangeRemaining: { $sum: { $multiply: ["$remainingBalance", 10000] } }
//                 }
//               }
//             ],
//             quantityDetails: [
//               { $unwind: "$products" },
//               {
//                 $group: {
//                   _id: null,
//                   productQuantityTotal: { $sum: "$products.quantity" },
//                   productQuantityInKgTotal: { $sum: "$products.qtyInKg" }
//                 }
//               }
//             ]
//           }
//         }
//       ]),

//       // ================== PURCHASE ==================
//       Purchase.aggregate([
//         {
//           $facet: {
//             purchaseDetails: [
//               {
//                 $group: {
//                   _id: null,
//                   totalSupplierCost: { $sum: { $multiply: ["$paid", 10000] } },
//                   purchaseTotal: { $sum: { $multiply: ["$totalAmount", 10000] } },
//                   purchaseDue: { $sum: { $multiply: ["$due", 10000] } }
//                 }
//               }
//             ],
//             quantityDetails: [
//               { $unwind: "$products" },
//               {
//                 $group: {
//                   _id: null,
//                   productQuantityTotal: { $sum: "$products.quantity" }
//                 }
//               }
//             ]
//           }
//         }
//       ]),

//       // ================== PURCHASE RETURN ==================
//       PurchaseReturn.aggregate([
//         { $unwind: "$products" },
//         { $group: { _id: null, productQuantityTotal: { $sum: "$products.returnQuantity" } } }
//       ]),

//       // ================== SALES RETURN ==================
//       SalesReturn.aggregate([
//         { $unwind: "$products" },
//         { $group: { _id: null, productQuantityTotal: { $sum: "$products.returnQuantity" } } }
//       ]),

//       // ================== COMPANY SALES RETURN ==================
//       CompanySalesReturn.aggregate([
//         { $group: { _id: null, productQuantityTotal: { $sum: "$quantity" } } }
//       ]),

//       // ================== SALES TRANSACTION ==================
//       SalesTransaction.aggregate([
//         {
//           $facet: {
//             allReport: [
//               {
//                 $group: {
//                   _id: null,
//                   totalCash: { $sum: { $multiply: ["$cash", 10000] } },
//                   totalExchange: { $sum: { $multiply: ["$exchange", 10000] } },
//                   totalBankPaymentAmount: { $sum: { $multiply: ["$bankPaymentAmount", 10000] } }
//                 }
//               }
//             ],
//             todaysReport: [
//               { $match: { date: { $gte: start, $lte: end } } },
//               {
//                 $group: {
//                   _id: null,
//                   totalCashToday: { $sum: { $multiply: ["$cash", 10000] } },
//                   totalExchangeToday: { $sum: { $multiply: ["$exchange", 10000] } },
//                   totalBankPaymentAmountToday: { $sum: { $multiply: ["$bankPaymentAmount", 10000] } }
//                 }
//               }
//             ]
//           }
//         }
//       ])
//     ]);

//     //* For Sales Return Data - starts
//     const salesReturnForNewData = await SalesReturn.aggregate([
//       {
//         $facet: {
//           total: [
//             { $unwind: "$products" },
//             {
//               $group: {
//                 _id: null,
//                 totalSentItems: { $sum: "$products.returnQuantity" },
//                 totalWeight: { $sum: "$products.returnQtyInKg" }
//               }
//             }
//           ],
//           totalAmount: [
//             {
//               $group: {
//                 _id: null,
//                 totalAmount: { $sum: { $multiply: ["$totalReturnValue", 10000] } },
//                 totalPaid: { $sum: { $multiply: ["$paid", 10000] } },
//                 totalDue: { $sum: { $multiply: ["$due", 10000] } }
//               }
//             }
//           ]
//         }
//       }
//     ]);

//     const transactionData = await CompanySalesReturnTransaction.aggregate([
//       { $group: { _id: null, transactiontotalSentItems: { $sum: "$paidAmount" } } }
//     ]);

//     const transactionSentItems = transactionData[0]?.transactiontotalSentItems || 0;
//     const companyData = await CompanySalesReturn.find();
//     const totalCompanyWeight = companyData && companyData.length ? companyData.reduce((acc, p) => acc + p.qtyInKg, 0) : 0;
//     //* For Sales Return Data - ends

//     // ৫ নম্বর কার্ড: দোকানের বর্তমান রিটার্ন স্টক
//     const currentReturnStockDetails = await SalesReturnStockManagement.aggregate([
//       {
//         $group: {
//           _id: null,
//           currentQty: { $sum: "$tempReturnQuantity" },
//           currentValueFlat: { $sum: { $multiply: ["$tempReturnQuantity", "$returnPrice"] } }
//         }
//       }
//     ]);

//     const cardFiveQty = currentReturnStockDetails[0]?.currentQty || 0;
//     const cardFiveAmount = currentReturnStockDetails[0]?.currentValueFlat || 0;

//     // ৬ নম্বর কার্ডের জন্য কাস্টমার এক্সচেঞ্জ প্রোডাক্ট কোয়ান্টিটি কাউন্ট
//     const customerExchangeQtyDetails = await SalesReturnTransaction.aggregate([
//       { $match: { returnType: "product" } },
//       { $unwind: { path: "$exchangeProducts", preserveNullAndEmptyArrays: true } },
//       { $group: { _id: null, totalGivenQty: { $sum: { $ifNull: ["$exchangeProducts.quantity", 0] } } } }
//     ]);
//     const cardSixGivenQty = customerExchangeQtyDetails[0]?.totalGivenQty || 0;

//     // ७ নম্বর কার্ড: কোম্পানির রিটার্ন ডেটা এগ্রিগেশন
//     const companySalesReturnForDashboard = await CompanySalesReturn.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalAmountQty: { $sum: "$totalAmountQty" },
//           totalPaidQty: { $sum: "$paidQty" },
//           totalDueQty: { $sum: "$dueQty" },
//           totalAmountRaw: { $sum: { $multiply: ["$totalAmount", 10000] } },
//           totalPaidRaw: { $sum: { $multiply: ["$paid", 10000] } },
//           totalDueRaw: { $sum: { $multiply: ["$due", 10000] } }
//         }
//       }
//     ]);

//     const companyTotalAmountQty = companySalesReturnForDashboard[0] ? companySalesReturnForDashboard[0].totalAmountQty : 0;
//     const companyTotalPaidQty = companySalesReturnForDashboard[0] ? companySalesReturnForDashboard[0].totalPaidQty : 0;
//     const companyTotalDueQty = companySalesReturnForDashboard[0] ? companySalesReturnForDashboard[0].totalDueQty : 0;

//     const companyTotalAmountValue = companySalesReturnForDashboard[0] ? (companySalesReturnForDashboard[0].totalAmountRaw / 10000) : 0;
//     const companyTotalPaidValue = companySalesReturnForDashboard[0] ? (companySalesReturnForDashboard[0].totalPaidRaw / 10000) : 0;
//     const companyTotalDueValue = companySalesReturnForDashboard[0] ? (companySalesReturnForDashboard[0].totalDueRaw / 10000) : 0;

//     const mainQuantity = mainStock[0] ? mainStock[0].totalQuantity : 0;
//     const companySaleReturnQuantity = companySalesReturn[0] ? companySalesReturn[0].productQuantityTotal : 0;
//     const purchaseReturnQuantity = purchaseReturn[0] ? purchaseReturn[0].productQuantityTotal : 0;
//     const salesReturnQuantity = salesReturn[0] ? salesReturn[0].productQuantityTotal : 0;
//     const salesQuantity = 0;

//     const quantityDetails = {
//       mainQuantity,
//       companySaleReturnQuantity,
//       purchaseReturnQuantity,
//       salesReturnQuantity,
//       salesQuantity
//     };

//     let result = {
//       purchaseTotal: purchase[0].purchaseDetails.length > 0 ? purchase[0].purchaseDetails[0].purchaseTotal / 10000 : 0,
//       purchaseDue: purchase[0].purchaseDetails.length > 0 ? purchase[0].purchaseDetails[0].purchaseDue / 10000 : 0,
//       purchaseTotalQuantity: purchase[0].quantityDetails.length > 0 ? purchase[0].quantityDetails[0].productQuantityTotal : 0,

//       exchangeTotalQuantity: productExchange[0].quantityDetails.length > 0 ? productExchange[0].quantityDetails[0].productQuantityTotal : 0,
//       exchangeTotalQuantityInKg: productExchange[0].quantityDetails.length > 0 ? productExchange[0].quantityDetails[0].productQuantityInKgTotal : 0,
//       exchangeTotalPrice: productExchange[0].exchangeDetails.length > 0 ? productExchange[0].exchangeDetails[0].exchangeTotal / 10000 : 0,
//       exchangeTotalRemaining: productExchange[0].exchangeDetails.length > 0 ? productExchange[0].exchangeDetails[0].exchangeRemaining / 10000 : 0,

//       salesTotal: sales[0].salesDetails.length > 0 ? sales[0].salesDetails[0].saleTotal / 10000 : 0,
//       salesDue: sales[0].salesDetails.length > 0 ? sales[0].salesDetails[0].saleDue / 10000 : 0,
//       salesCash: salesTransaction[0].allReport.length > 0 ? salesTransaction[0].allReport[0].totalCash / 10000 : 0,
//       salesExchange: salesTransaction[0].allReport.length > 0 ? salesTransaction[0].allReport[0].totalExchange / 10000 : 0,
//       salesBankPaymentAmount: salesTransaction[0].allReport.length > 0 ? salesTransaction[0].allReport[0].totalBankPaymentAmount / 10000 : 0,
//       salesProfit: sales[0].salesDetails.length > 0 ? (sales[0].salesDetails[0].saleTotal - sales[0].salesDetails[0].saleDue) / 10000 : 0,

//       salesTotalToday: sales[0].todaysSaleDetails.length > 0 ? sales[0].todaysSaleDetails[0].saleTotalToday / 10000 : 0,
//       salesDueToday: sales[0].todaysSaleDetails.length > 0 ? sales[0].todaysSaleDetails[0].saleDueToday / 10000 : 0,

//       // সেফলি রিটার্ন করা ডেটা ম্যাপ করা হলো
//       salesQtyToday: sales[0].todaysSaleQuantityDetails && sales[0].todaysSaleQuantityDetails.length > 0 ? sales[0].todaysSaleQuantityDetails[0].totalQtyToday : 0,

//       salesCashToday: salesTransaction[0].todaysReport.length > 0 ? salesTransaction[0].todaysReport[0].totalCashToday / 10000 : 0,
//       salesExchangeToday: salesTransaction[0].todaysReport.length > 0 ? salesTransaction[0].todaysReport[0].totalExchangeToday / 10000 : 0,
//       salesBankPaymentAmountToday: salesTransaction[0].todaysReport.length > 0 ? salesTransaction[0].todaysReport[0].totalBankPaymentAmountToday / 10000 : 0,

//       totalStockValue: mainStock[0] ? mainStock[0].totalStockValue : 0,
//       totalProductCostPrice: mainStock[0] ? mainStock[0].totalCostPrice / 10000 : 0,
//       totalProductSalePrice: mainStock[0] ? mainStock[0].totalSalePrice / 10000 : 0,

//       quantityDetails,
//       transactionSentItems,

//       totalSentItemsForSalesReturn: salesReturnForNewData && salesReturnForNewData[0].total.length > 0 ? salesReturnForNewData[0].total[0].totalSentItems - transactionSentItems : 0,
//       totalAmountForSalesReturn: salesReturnForNewData && salesReturnForNewData[0].totalAmount.length > 0 ? salesReturnForNewData[0].totalAmount[0].totalAmount / 10000 : 0,
//       totalPaidForSalesReturn: salesReturnForNewData && salesReturnForNewData[0].totalAmount.length > 0 ? salesReturnForNewData[0].totalAmount[0].totalPaid / 10000 : 0,
//       totalDueForSalesReturn: salesReturnForNewData && salesReturnForNewData[0].totalAmount.length > 0 ? salesReturnForNewData[0].totalAmount[0].totalDue / 10000 : 0,

//       cardFiveQty: cardFiveQty,
//       cardFiveAmount: cardFiveAmount,
//       cardSixGivenQty: cardSixGivenQty,

//       totalAmountQtyForCSR: companyTotalAmountQty,
//       totalPaidQtyForCSR: companyTotalPaidQty,
//       totalDueQtyForCSR: companyTotalDueQty,
//       totalDueForCSR: companyTotalDueValue,
//       totalPaidForCSR: companyTotalAmountValue,
//       totalAmountForCSR: companyTotalAmountValue,
//       totalReceivedValueForCSR: companyTotalPaidValue
//     };

//     res.status(201).json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

const Sales = require("../models/Sales");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const Purchase = require("../models/Purchase");
const Decimal = require("decimal.js");
const ProductExchange = require("../models/ProductExchange");
const PurchaseReturn = require("../models/PurchaseReturn");
const SalesReturn = require("../models/SalesReturn");
const CompanySalesReturn = require("../models/CompanySalesReturn");
const CompanySalesReturnTransaction = require("../models/CompanySalesReturnTransaction");
const SalesTransaction = require("../models/SalesTransaction");
const SalesReturnStockManagement = require("../models/SalesReturnStockManagement");
const SalesReturnTransaction = require("../models/SalesReturnTransaction");
const Expense = require("../models/Expense"); // <--- এক্সপেন্স মডেলটি এখানে ইম্পোর্ট করুন
const Supplier = require("../models/Supplier");

module.exports.index = async (req, res) => {
  try {
    let start = new Date();
    start.setHours(0 - 6, 0, 0, 0);

    let end = new Date();
    end.setHours(23 - 6, 59, 59, 999);

    const [
      mainStock,
      sales,
      productExchange,
      purchase,
      purchaseReturn,
      salesReturn,
      companySalesReturn,
      salesTransaction,
      todaysExpenseArray,
    ] = await Promise.all([
      // ================== MAIN STOCK ==================
      Product.aggregate([
        {
          $group: {
            _id: null,
            totalStockValue: {
              $sum: { $multiply: ["$quantity", "$costPrice"] },
            },
            totalQuantity: { $sum: "$quantity" },
            totalSalePrice: {
              $sum: { $multiply: ["$quantity", "$sellPrice"] },
            },
            totalCostPrice: {
              $sum: { $multiply: ["$quantity", "$costPrice"] },
            },
          },
        },
      ]),

      // ================== SALES ==================
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
                },
              },
            ],
            todaysSaleDetails: [
              { $match: { createdAt: { $gte: start, $lte: end } } },
              {
                $group: {
                  _id: null,
                  saleTotalToday: { $sum: { $multiply: ["$total", 10000] } },
                  saleDueToday: { $sum: { $multiply: ["$due", 10000] } },
                  totalCostToday: {
                    $sum: { $multiply: ["$totalCost", 10000] },
                  },
                  totalLoanToday: { $sum: { $multiply: ["$loan", 10000] } },
                },
              },
            ],
            todaysSaleQuantityDetails: [
              { $match: { createdAt: { $gte: start, $lte: end } } },
              {
                $unwind: {
                  path: "$products",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $group: {
                  _id: null,
                  totalQtyToday: {
                    $sum: { $ifNull: ["$products.quantity", 0] },
                  },
                },
              },
            ],
          },
        },
      ]),

      // ================== PRODUCT EXCHANGE ==================
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
              { $unwind: "$products" },
              {
                $group: {
                  _id: null,
                  productQuantityTotal: { $sum: "$products.quantity" },
                  productQuantityInKgTotal: { $sum: "$products.qtyInKg" },
                },
              },
            ],
          },
        },
      ]),

      // ================== PURCHASE ==================
      Purchase.aggregate([
        {
          $facet: {
            purchaseDetails: [
              {
                $group: {
                  _id: null,
                  totalSupplierCost: { $sum: { $multiply: ["$paid", 10000] } },
                  purchaseTotal: {
                    $sum: { $multiply: ["$totalAmount", 10000] },
                  },
                  purchaseDue: { $sum: { $multiply: ["$due", 10000] } },
                },
              },
            ],
            quantityDetails: [
              { $unwind: "$products" },
              {
                $group: {
                  _id: null,
                  productQuantityTotal: { $sum: "$products.quantity" },
                },
              },
            ],
          },
        },
      ]),

      // ================== PURCHASE RETURN ==================
      PurchaseReturn.aggregate([
        { $unwind: "$products" },
        {
          $group: {
            _id: null,
            productQuantityTotal: { $sum: "$products.returnQuantity" },
          },
        },
      ]),

      // ================== SALES RETURN ==================
      SalesReturn.aggregate([
        { $unwind: "$products" },
        {
          $group: {
            _id: null,
            productQuantityTotal: { $sum: "$products.returnQuantity" },
          },
        },
      ]),

      // ================== COMPANY SALES RETURN ==================
      CompanySalesReturn.aggregate([
        { $group: { _id: null, productQuantityTotal: { $sum: "$quantity" } } },
      ]),

      // ================== SALES TRANSACTION ==================
      SalesTransaction.aggregate([
        {
          $facet: {
            allReport: [
              {
                $group: {
                  _id: null,
                  totalCash: { $sum: { $multiply: ["$cash", 10000] } },
                  totalExchange: { $sum: { $multiply: ["$exchange", 10000] } },
                  totalBankPaymentAmount: {
                    $sum: { $multiply: ["$bankPaymentAmount", 10000] },
                  },
                },
              },
            ],
            todaysReport: [
              { $match: { date: { $gte: start, $lte: end } } },
              {
                $group: {
                  _id: null,
                  totalCashToday: { $sum: { $multiply: ["$cash", 10000] } },
                  totalExchangeToday: {
                    $sum: { $multiply: ["$exchange", 10000] },
                  },
                  totalBankPaymentAmountToday: {
                    $sum: { $multiply: ["$bankPaymentAmount", 10000] },
                  },

                  // SA included/ref starts with SA হলে due sum
                  totalSalesDueToday: {
                    $sum: {
                      $cond: [
                        {
                          $regexMatch: {
                            input: "$refMemo",
                            regex: /^SA/,
                          },
                        },
                        { $multiply: ["$currentDue", 10000] },
                        0,
                      ],
                    },
                  },

                  // DUE-PAY included হলে paidAmount sum
                  totalDuePaidToday: {
                    $sum: {
                      $cond: [
                        {
                          $regexMatch: {
                            input: "$refMemo",
                            regex: /DUE-PAY/,
                          },
                        },
                        { $multiply: ["$paidAmount", 10000] },
                        0,
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
      ]),

      // ================== TODAY'S EXPENSES AGGREGATION ==================
      // ২. আজকের নির্দিষ্ট তারিখের সকল খচর বা সাব-খরচ যোগ করার কুয়েরি
      Expense.aggregate([
        {
          $match: {
            date: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: null,
            totalExpenseToday: { $sum: "$amount" }, // <--- আপনার মডেল অনুযায়ী 'amount' ফিক্স করা হলো
          },
        },
      ]),
    ]);

    //* For Sales Return Data - starts
    const salesReturnForNewData = await SalesReturn.aggregate([
      {
        $facet: {
          total: [
            { $unwind: "$products" },
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
                totalPaid: { $sum: { $multiply: ["$paid", 10000] } },
                totalDue: { $sum: { $multiply: ["$due", 10000] } },
              },
            },
          ],
        },
      },
    ]);

    //* Supplier Due calculation:
    const supplierDetails = await Supplier.aggregate([
      {
        $group: {
          _id: null,
          totalDue: { $sum: { $multiply: ["$totalBalance", 10000] } },
        },
      },
    ]);

    // console.log(supplierDetails)

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

    // ৫ নম্বর কার্ড: দোকানের বর্তমান রিটার্ন স্টক
    const currentReturnStockDetails =
      await SalesReturnStockManagement.aggregate([
        {
          $group: {
            _id: null,
            currentQty: { $sum: "$tempReturnQuantity" },
            currentValueFlat: {
              $sum: { $multiply: ["$tempReturnQuantity", "$returnPrice"] },
            },
          },
        },
      ]);

    const cardFiveQty = currentReturnStockDetails[0]?.currentQty || 0;
    const cardFiveAmount = currentReturnStockDetails[0]?.currentValueFlat || 0;

    // ৬ নম্বর কার্ডের জন্য কাস্টমার এক্সচেঞ্জ প্রোডাক্ট কোয়ান্টিটি কাউন্ট
    const customerExchangeQtyDetails = await SalesReturnTransaction.aggregate([
      { $match: { returnType: "product" } },
      {
        $unwind: {
          path: "$exchangeProducts",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: null,
          totalGivenQty: {
            $sum: { $ifNull: ["$exchangeProducts.quantity", 0] },
          },
        },
      },
    ]);
    const cardSixGivenQty = customerExchangeQtyDetails[0]?.totalGivenQty || 0;

    // ७ নম্বর কার্ড: কোম্পানির রিটার্ন ডেটা এগ্রিগেশন
    const companySalesReturnForDashboard = await CompanySalesReturn.aggregate([
      {
        $group: {
          _id: null,
          totalAmountQty: { $sum: "$totalAmountQty" },
          totalPaidQty: { $sum: "$paidQty" },
          totalDueQty: { $sum: "$dueQty" },
          totalAmountRaw: { $sum: { $multiply: ["$totalAmount", 10000] } },
          totalPaidRaw: { $sum: { $multiply: ["$paid", 10000] } },
          totalDueRaw: { $sum: { $multiply: ["$due", 10000] } },
        },
      },
    ]);

    const companyTotalAmountQty = companySalesReturnForDashboard[0]
      ? companySalesReturnForDashboard[0].totalAmountQty
      : 0;
    const companyTotalPaidQty = companySalesReturnForDashboard[0]
      ? companySalesReturnForDashboard[0].totalPaidQty
      : 0;
    const companyTotalDueQty = companySalesReturnForDashboard[0]
      ? companySalesReturnForDashboard[0].totalDueQty
      : 0;

    const companyTotalAmountValue = companySalesReturnForDashboard[0]
      ? companySalesReturnForDashboard[0].totalAmountRaw / 10000
      : 0;
    const companyTotalPaidValue = companySalesReturnForDashboard[0]
      ? companySalesReturnForDashboard[0].totalPaidRaw / 10000
      : 0;
    const companyTotalDueValue = companySalesReturnForDashboard[0]
      ? companySalesReturnForDashboard[0].totalDueRaw / 10000
      : 0;

    const mainQuantity = mainStock[0] ? mainStock[0].totalQuantity : 0;
    const companySaleReturnQuantity = companySalesReturn[0]
      ? companySalesReturn[0].productQuantityTotal
      : 0;
    const purchaseReturnQuantity = purchaseReturn[0]
      ? purchaseReturn[0].productQuantityTotal
      : 0;
    const salesReturnQuantity = salesReturn[0]
      ? salesReturn[0].productQuantityTotal
      : 0;
    const salesQuantity = 0;

    const quantityDetails = {
      mainQuantity,
      companySaleReturnQuantity,
      purchaseReturnQuantity,
      salesReturnQuantity,
      salesQuantity,
    };

    // আজকের মোট খরচের ভ্যালু অ্যাসাইন
    const salesExpenseToday = todaysExpenseArray[0]
      ? todaysExpenseArray[0].totalExpenseToday
      : 0;

    let result = {
      purchaseTotal:
        purchase[0].purchaseDetails.length > 0
          ? purchase[0].purchaseDetails[0].purchaseTotal / 10000
          : 0,
      //* purchaseDue: purchase[0].purchaseDetails.length > 0 ? purchase[0].purchaseDetails[0].purchaseDue / 10000 : 0,

      purchaseDue: supplierDetails[0] ? supplierDetails[0].totalDue / 10000 : 0,
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
      salesBankPaymentAmount:
        salesTransaction[0].allReport.length > 0
          ? salesTransaction[0].allReport[0].totalBankPaymentAmount / 10000
          : 0,
      salesProfit:
        sales[0].salesDetails.length > 0
          ? (sales[0].salesDetails[0].saleTotal -
              sales[0].salesDetails[0].saleDue) /
            10000
          : 0,

      salesTotalToday:
        sales[0].todaysSaleDetails.length > 0
          ? sales[0].todaysSaleDetails[0].saleTotalToday / 10000
          : 0,
      salesDueToday:
        sales[0].todaysSaleDetails.length > 0
          ? sales[0].todaysSaleDetails[0].saleDueToday / 10000
          : 0,

      salesProfitToday:
        sales[0].todaysSaleDetails.length > 0
          ? (sales[0].todaysSaleDetails[0].saleTotalToday -
              (sales[0].todaysSaleDetails[0].totalCostToday +
                sales[0].todaysSaleDetails[0].totalLoanToday)) /
            10000
          : 0,

      salesQtyToday:
        sales[0].todaysSaleQuantityDetails &&
        sales[0].todaysSaleQuantityDetails.length > 0
          ? sales[0].todaysSaleQuantityDetails[0].totalQtyToday
          : 0,

      salesCashToday:
        salesTransaction[0].todaysReport.length > 0
          ? salesTransaction[0].todaysReport[0].totalCashToday / 10000
          : 0,
      salesExchangeToday:
        salesTransaction[0].todaysReport.length > 0
          ? salesTransaction[0].todaysReport[0].totalExchangeToday / 10000
          : 0,
      salesBankPaymentAmountToday:
        salesTransaction[0].todaysReport.length > 0
          ? salesTransaction[0].todaysReport[0].totalBankPaymentAmountToday /
            10000
          : 0,
      advanceToday:
        salesTransaction[0].todaysReport.length > 0
          ? (salesTransaction[0].todaysReport[0].totalSalesDueToday - salesTransaction[0].todaysReport[0].totalDuePaidToday) / 10000
          : 0,

      // ৩. অবজেক্টে আজকের মোট খরচের ফিল্ডটি পুশ করা হলো
      salesExpenseToday: salesExpenseToday,

      totalStockValue: mainStock[0] ? mainStock[0].totalStockValue : 0,
      totalProductCostPrice: mainStock[0]
        ? mainStock[0].totalCostPrice / 10000
        : 0,
      totalProductSalePrice: mainStock[0]
        ? mainStock[0].totalSalePrice / 10000
        : 0,

      quantityDetails,
      transactionSentItems,

      totalSentItemsForSalesReturn:
        salesReturnForNewData && salesReturnForNewData[0].total.length > 0
          ? salesReturnForNewData[0].total[0].totalSentItems -
            transactionSentItems
          : 0,
      totalAmountForSalesReturn:
        salesReturnForNewData && salesReturnForNewData[0].totalAmount.length > 0
          ? salesReturnForNewData[0].totalAmount[0].totalAmount / 10000
          : 0,
      totalPaidForSalesReturn:
        salesReturnForNewData && salesReturnForNewData[0].totalAmount.length > 0
          ? salesReturnForNewData[0].totalAmount[0].totalPaid / 10000
          : 0,
      totalDueForSalesReturn:
        salesReturnForNewData && salesReturnForNewData[0].totalAmount.length > 0
          ? salesReturnForNewData[0].totalAmount[0].totalDue / 10000
          : 0,

      cardFiveQty: cardFiveQty,
      cardFiveAmount: cardFiveAmount,
      cardSixGivenQty: cardSixGivenQty,

      totalAmountQtyForCSR: companyTotalAmountQty,
      totalPaidQtyForCSR: companyTotalPaidQty,
      totalDueQtyForCSR: companyTotalDueQty,
      totalDueForCSR: companyTotalDueValue,
      totalPaidForCSR: companyTotalAmountValue,
      totalAmountForCSR: companyTotalAmountValue,
      totalReceivedValueForCSR: companyTotalPaidValue,
    };

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
