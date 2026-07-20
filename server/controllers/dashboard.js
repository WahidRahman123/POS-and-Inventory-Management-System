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
const { combineDateWithCurrentTime } = require('../utils/combineDateWithCurrentTime');
const dayjs = require('../utils/date.js');
const CompanyProductReturn = require("../models/CompanyProductReturn.js");
const ScrapProductSell = require("../models/ScrapProductSell.js");
const PurchaseTransaction = require("../models/PurchaseTransaction.js");

module.exports.index = async (req, res) => {
  try {
    let start = dayjs()
      .tz("Asia/Dhaka")
      .startOf("day")
      .utc()
      .toDate();

    let end = dayjs()
      .tz("Asia/Dhaka")
      .endOf("day")
      .utc()
      .toDate();


    const [
      mainStock,
      sales,
      productExchange,
      purchase,
      purchaseTransaction,
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

            totalAmountOfProductExchange: [
              { $unwind: "$products" },
              {
                $lookup: {
                  from: "productexchangestockmanagements",
                  localField: "products.productId",
                  foreignField: "productId",
                  as: "stock"
                }
              },
              { $unwind: "$stock" },
              {
                $group: {
                  _id: null,
                  totalAmount: {
                    $sum: {
                      $multiply: [
                        "$products.qtyInKg",
                        "$stock.unitPrice",
                        10000
                      ]
                    }
                  }
                }
              }
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

      // ================== PURCHASE TRANSACTION ==================
      // advance e totalAmount = 0, normal e totalAmount = amount
      // totalAmount baki gulo te nai
      //* So the total purchase = normal purchase type's amount/totalAmount.
      PurchaseTransaction.aggregate([
        {
          $facet: {
            purchaseTotalToday: [
              // { $match: { date: { $gte: start, $lte: end } } },
              { $match: { $and: [{ date: { $gte: start, $lte: end } }, { purchaseType: "normal" }] } },
              {
                $group: {
                  _id: null,
                  purchaseTotal: {
                    $sum: { $multiply: ["$amount", 10000] },
                  }
                },
              },
            ],
            advancePaymentTotal: [
              { $match: { date: { $gte: start, $lte: end } } },
              {
                $group: {
                  _id: null,
                  advancePaymentTotal: {
                    $sum: { $multiply: ["$advancePaymentAmount", 10000] },
                  }
                },
              },
            ],
            // quantityDetailsToday: [
            //   { $unwind: "$products" },
            //   {
            //     $group: {
            //       _id: null,
            //       productQuantityTotal: { $sum: "$products.quantity" },
            //     },
            //   },
            // ],
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
        {
          $group: {
            _id: null, productQuantityTotal: { $sum: "$quantity" },
            totalAmount: { $sum: { $multiply: ["$totalAmount", 10000] } }
          }
        },
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
                $sort: { date: -1 }
              },
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

                  // main: {$push:"$$ROOT"},

                  // SA included/ref starts with SA হলে due sum

                  totalSalesDueToday: {
                    $first: "$currentDue"
                  },

                  // DUE-PAY included হলে paidAmount sum
                  totalDuePaidToday: {
                    $sum: {
                      $cond: [
                        {
                          $eq: ["$saleType", "due-payment"],
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

    //* Product Exchange totalAmount calculation - starts
    const companyProductReturn = await CompanyProductReturn.aggregate([
      {
        $facet: {
          total: [
            {
              $unwind: "$products",
            },
            {
              $group: {
                _id: null,
                totalSentItems: { $sum: "$products.quantity" },
                totalWeight: { $sum: "$products.qtyInKg" },
              },
            },
          ],

          totalAmount: [
            {
              $group: {
                _id: null,
                totalAmount: { $sum: { $multiply: ["$totalAmount", 10000] } },
              },
            },
          ],

          totalAmountOfProductExchange: [
            { $unwind: "$products" },
            {
              $lookup: {
                from: "productexchangestockmanagements",
                localField: "products.productId",
                foreignField: "productId",
                as: "stock"
              }
            },
            { $unwind: "$stock" },
            {
              $group: {
                _id: null,
                totalAmount: {
                  $sum: {
                    $multiply: [
                      "$products.qtyInKg",
                      "$stock.unitPrice",
                      10000
                    ]
                  }
                }
              }
            }
          ],
        },
      },
    ]);

    const scrapProductSell = await ScrapProductSell.aggregate([
      {
        $facet: {
          total: [
            {
              $unwind: "$products",
            },
            {
              $group: {
                _id: null,
                totalSentItems: { $sum: "$products.quantity" },
                totalWeight: { $sum: "$products.qtyInKg" },
              },
            },
          ],

          totalAmount: [
            {
              $group: {
                _id: null,
                totalAmount: { $sum: { $multiply: ["$totalAmount", 10000] } },
              },
            },
          ],

          totalAmountOfProductExchange: [
            { $unwind: "$products" },
            {
              $lookup: {
                from: "productexchangestockmanagements",
                localField: "products.productId",
                foreignField: "productId",
                as: "stock"
              }
            },
            { $unwind: "$stock" },
            {
              $group: {
                _id: null,
                totalAmount: {
                  $sum: {
                    $multiply: [
                      "$products.qtyInKg",
                      "$stock.unitPrice",
                      10000
                    ]
                  }
                }
              }
            }
          ],
        },
      },
    ]);


    //* Sales Return caluculation - starts:
    const salesreturnTotalAmount = salesReturnForNewData[0].totalAmount[0] ? salesReturnForNewData[0].totalAmount[0].totalAmount : 0;

    const salesreturnTotalDue = salesReturnForNewData[0].totalAmount[0] ? salesReturnForNewData[0].totalAmount[0].totalDue / 10000 : 0;

    // console.log(companySalesReturn);

    const companySalesReturnTotalAmount = companySalesReturn[0] ? companySalesReturn[0].totalAmount : 0;

    //* Sales Return caluculation - ends:

    const totalSentItemsProductExchange = productExchange[0].quantityDetails[0] ? productExchange[0].quantityDetails[0].productQuantityTotal : 0;
    const totalSentItemsCompanyProductReturn = companyProductReturn[0].total[0] ? companyProductReturn[0].total[0].totalSentItems : 0;
    const totalSentItemsScrapProductSell = scrapProductSell[0].total[0] ? scrapProductSell[0].total[0].totalSentItems : 0;

    const totalWeightProductExchange = productExchange[0].quantityDetails[0] ? productExchange[0].quantityDetails[0].productQuantityInKgTotal : 0;
    const totalWeightCompanyProductReturn = companyProductReturn[0].total[0] ? companyProductReturn[0].total[0].totalWeight : 0;
    const totalWeightScrapProductSell = scrapProductSell[0].total[0] ? scrapProductSell[0].total[0].totalWeight : 0;

    const totalAmountProductExchange = productExchange[0].totalAmountOfProductExchange[0] ? productExchange[0].totalAmountOfProductExchange[0].totalAmount : 0;
    const totalAmountCompanyProductReturn = companyProductReturn[0].totalAmountOfProductExchange[0] ? companyProductReturn[0].totalAmountOfProductExchange[0].totalAmount : 0;
    const totalAmountScrapProductSell = scrapProductSell[0].totalAmountOfProductExchange[0] ? scrapProductSell[0].totalAmountOfProductExchange[0].totalAmount : 0;

    const totalAmountForPE = (totalAmountProductExchange - totalAmountCompanyProductReturn - totalAmountScrapProductSell) / 10000;

    //* Product Exchange totalAmount calculation - starts


    //* Supplier Due calculation:
    const supplierDetails = await Supplier.aggregate([
      {
        $group: {
          _id: null,
          totalDue: { $sum: { $multiply: ["$totalBalance", 10000] } },
        },
      },
    ]);


    //* customers all current due
    const customer = await Customer.aggregate([
      {
        $group: {
          _id: null,
          customerDueTotal: { $sum: { $multiply: ["$due", 10000] } },
          customerAdvanceTotal: { $sum: { $multiply: ["$advanceBalance", 10000] } },
        },
      },
    ]);

    //* customers today's current due
    const customerToday = await Customer.aggregate([
      {
        $match: {
          updatedAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          customerTodayDueTotal: { $sum: { $multiply: ["$due", 10000] } },
          customerTodayAdvanceTotal: { $sum: { $multiply: ["$advanceBalance", 10000] } },
        },
      },
    ]);

    // console.log(customerTodayDue)

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

      purchaseTotalToday:
        purchaseTransaction[0].purchaseTotalToday.length > 0
          ? purchaseTransaction[0].purchaseTotalToday[0].purchaseTotal / 10000
          : 0,
      advancePaymentTotal:
        purchaseTransaction[0].advancePaymentTotal.length > 0
          ? purchaseTransaction[0].advancePaymentTotal[0].advancePaymentTotal / 10000
          : 0,

      exchangeTotalQuantity:
        (totalSentItemsProductExchange - totalSentItemsCompanyProductReturn - totalSentItemsScrapProductSell),

      exchangeTotalQuantityInKg:
        (totalWeightProductExchange - totalWeightCompanyProductReturn - totalWeightScrapProductSell),

      // exchangeTotalQuantity:
      //   productExchange[0].quantityDetails.length > 0
      //     ? productExchange[0].quantityDetails[0].productQuantityTotal
      //     : 0,
      // exchangeTotalQuantityInKg:
      //   productExchange[0].quantityDetails.length > 0
      //     ? productExchange[0].quantityDetails[0].productQuantityInKgTotal
      //     : 0,
      exchangeTotalPrice:
        totalAmountForPE > 0 ? totalAmountForPE : 0,
      // exchangeTotalPrice:
      //   productExchange[0].exchangeDetails.length > 0
      //     ? productExchange[0].exchangeDetails[0].exchangeTotal / 10000
      //     : 0,
      exchangeTotalRemaining:
        productExchange[0].exchangeDetails.length > 0
          ? productExchange[0].exchangeDetails[0].exchangeRemaining / 10000
          : 0,

      salesTotal:
        sales[0].salesDetails.length > 0
          ? sales[0].salesDetails[0].saleTotal / 10000
          : 0,
      // salesDue:
      //   sales[0].salesDetails.length > 0
      //     ? sales[0].salesDetails[0].saleDue / 10000
      //     : 0,
      salesDue:
        customer[0]
          ? customer[0].customerDueTotal / 10000
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
      // salesDueToday:
      //   customerToday[0]
      //     ? customerToday[0].customerTodayDueTotal / 10000
      //     : 0,
      salesDueToday:
        salesTransaction[0].todaysReport[0] ? salesTransaction[0].todaysReport[0].totalSalesDueToday : 0,

      dueCollectionToday:
        salesTransaction[0].todaysReport[0] ? salesTransaction[0].todaysReport[0].totalDuePaidToday / 10000 : 0,

      salesAdvanceToday:
        customerToday[0]
          ? customerToday[0].customerTodayAdvanceTotal / 10000
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
          ? (salesTransaction[0].todaysReport[0].totalSalesDueToday -
            salesTransaction[0].todaysReport[0].totalDuePaidToday) /
          10000
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
        salesreturnTotalDue,
      // totalDueForSalesReturn:
      //   salesReturnForNewData && salesReturnForNewData[0].totalAmount.length > 0
      //     ? salesReturnForNewData[0].totalAmount[0].totalDue / 10000
      //     : 0,

      cardFiveQty: cardFiveQty,
      cardFiveAmount: (salesreturnTotalAmount - companySalesReturnTotalAmount) / 10000,
      cardSixGivenQty: cardSixGivenQty,

      totalAmountQtyForCSR: companyTotalAmountQty,
      totalPaidQtyForCSR: companyTotalPaidQty,
      totalDueQtyForCSR: companyTotalDueQty,
      totalDueForCSR: companyTotalDueValue,
      // totalPaidForCSR: companyTotalAmountValue,
      totalPaidForCSR: companySalesReturnTotalAmount / 10000,
      totalAmountForCSR: companyTotalAmountValue,
      totalReceivedValueForCSR: companyTotalPaidValue,
    };

    // console.log(purchaseTransaction[0].advancePaymentTotal)
    // console.log(result.purchaseTotalToday)

    //* Total ledger value calculation
    //* Total = supplier.totalBalance + 2 + 3 + 4 + 5 - 6 + 7
    // const totalLedgerValue = result.purchaseDue + result.exchangeTotalPrice + result.salesDue + result.totalStockValue + result.cardFiveAmount - result.totalDueForSalesReturn + result.totalPaidForCSR;

    const totalLedgerValue = Number(new Decimal(result.purchaseDue)
      .plus(new Decimal(result.exchangeTotalPrice))
      .plus(new Decimal(result.salesDue))
      .plus(new Decimal(result.totalStockValue))
      .plus(new Decimal(result.cardFiveAmount))
      .minus(new Decimal(result.totalDueForSalesReturn))
      .plus(new Decimal(result.totalPaidForCSR)).toFixed(2));

    res.status(201).json({ ...result, totalLedgerValue });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
