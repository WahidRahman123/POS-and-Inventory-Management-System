import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Decimal from "decimal.js";
import {
  addPurchaseReturn,
  fetchPurchaseByInvoice,
  fetchPurchaseReturn,
  setPurchaseSearchedByInvoiceToEmpty,
} from "../features/PurchaseReturn/purchaseReturnSlice";
import dayjs from "../utils/date.js";

const PurchaseReturn = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    purchaseReturns,
    purchaseSearchedByInvoice,
    toggle,
    invoiceLoading,
    page,
    pages,
  } = useSelector((state) => state.purchaseReturn);
  const [returnType, setReturnType] = useState("product");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log(purchaseReturns)

  //* For Date
  const [dateMode, setDateMode] = useState("single");
  const [dateSearch, setDateSearch] = useState("");
  const [rangeDateSearch, setRangeDateSearch] = useState({
    dateSearchStart: "",
    dateSearchEnd: "",
  });

  const [currentPage, setCurrentPage] = useState(page);
  const [sortOrder, setSortOrder] = useState(-1);
  const [nameSearch, setNameSearch] = useState("");
  const [filterToggler, setFilterToggler] = useState(false);

  const [data, setData] = useState({
    invoiceNo: "",
    date: "",
  });
  const [cashDetails, setCashDetails] = useState({
    cashRefundAmount: "",
    paymentMethod: "Cash",
    note: "",
  });
  const [originalSaleProducts, setOriginalSaleProducts] = useState([]);

  const handleSaleLoad = async () => {
    if (!data.invoiceNo) alert("Enter an invoice number!");
    try {
      dispatch(fetchPurchaseByInvoice({ memo: data.invoiceNo }));
    } catch (error) { }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!purchaseSearchedByInvoice) return;

    try {
      const now = new Date();
      const newOriginalProducts = originalSaleProducts.map((p, i) => ({
        productName: p.productName,
        purchaseQuantity: Number(p.quantity),
        purchasePrice: Number(p.unitPrice),
        subTotal: Number(p.subTotal),
        returnQuantity: Number(p.returnQuantity),
        returnQtyInKg: Number(p.returnQtyInKg),
        returnPrice: Number(p.returnPrice),
        lineTotal: Number(p.lineTotal),
      }));

      let newExchangeProducts = [];
      if (returnType === "product") {
        newExchangeProducts = products.map((p, i) => {
          return {
            productName: p.productName,
            quantity: Number(p.quantity),
            unitPrice: Number(p.unitPrice),
            qtyInKg: Number(p.qtyInKg),
            subTotal: Number(
              new Decimal(Number(p.unitPrice)).mul(
                new Decimal(Number(p.quantity)),
              ),
            ),
          };
        });
      }

      //* Due and Paid Calculation
      let due = 0;
      let paid = 0;
      if (returnType === "product") {
        paid = totalExchangeValue.greaterThan(totalReturnValue)
          ? Number(totalReturnValue.toFixed(4))
          : Number(totalExchangeValue.toFixed(4));

        due = adjustmentAmount.lessThan(new Decimal(0))
          ? 0
          : Number(adjustmentAmount.toFixed(4));
      }

      if (returnType === "cash") {
        paid = new Decimal(Number(cashDetails.cashRefundAmount)).greaterThan(
          totalReturnValue,
        )
          ? Number(totalReturnValue.toFixed(4))
          : Number(cashDetails.cashRefundAmount);

        const temp = totalReturnValue.minus(
          new Decimal(Number(cashDetails.cashRefundAmount)),
        );

        due = temp.lessThan(new Decimal(0)) ? 0 : Number(temp.toFixed(4));
      }

      const purchaseReturnData = {
        memo: purchaseSearchedByInvoice.memo,
        supplierId: purchaseSearchedByInvoice.supplierId,
        supplierName: purchaseSearchedByInvoice.supplierName,
        address: purchaseSearchedByInvoice.address,
        supplierEmail: purchaseSearchedByInvoice.supplierEmail,
        supplierPhone: purchaseSearchedByInvoice.supplierPhone,
        userId: user._id,
        purchaseId: purchaseSearchedByInvoice._id,
        returnType,

        products: newOriginalProducts,

        exchangeProducts: newExchangeProducts,

        totalReturnValue: Number(totalReturnValue.toFixed(4)),
        due,
        paid,

        totalExchangeValue:
          returnType === "product" ? Number(totalExchangeValue.toFixed(4)) : 0,
        adjustmentAmount:
          returnType === "product" ? Number(adjustmentAmount.toFixed(4)) : 0,

        cashRefundAmount:
          returnType === "cash" ? Number(cashDetails.cashRefundAmount) : 0,
        paymentMethod: returnType === "cash" ? cashDetails.paymentMethod : "",
        note: returnType === "cash" ? cashDetails.note : "",

        createdAt: data.date,
        issuedAt: now,
      };

      await dispatch(addPurchaseReturn(purchaseReturnData)).unwrap();
      setData({
        invoiceNo: "",
        date: "",
      });
      setCashDetails({
        cashRefundAmount: "",
        paymentMethod: "Cash",
        note: "",
      });

      setProducts([
        {
          id: 1,
          productName: "",
          quantity: "",
          qtyInKg: "",
          unitPrice: "",
          subTotal: "",
        },
      ]);
      dispatch(setPurchaseSearchedByInvoiceToEmpty());
    } catch (error) { }
  };

  //* Add Product Section Starts
  const [products, setProducts] = useState([
    {
      id: 1,
      productName: "",
      quantity: "",
      qtyInKg: "",
      unitPrice: "",
      subTotal: "",
    },
  ]);
  const handleProductChange = (id, field, value) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, [field]: value } : product,
      ),
    );
  };

  const handleAddProduct = () => {
    const newId =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    setProducts([
      ...products,
      {
        id: newId,
        productName: "",
        quantity: "",
        qtyInKg: "",
        unitPrice: "",
        subTotal: "",
      },
    ]);
  };

  const handleRemoveProduct = (id) => {
    if (products.length > 1) {
      setProducts(products.filter((product) => product.id !== id));
    }
  };
  //* Add Product Section Ends
  const totalQty = products.reduce(
    (acc, p) => acc.plus(new Decimal(Number(p.quantity))),
    new Decimal(0),
  );
  const totalQtyInKg = products.reduce(
    (acc, p) => acc.plus(new Decimal(Number(p.qtyInKg))),
    new Decimal(0),
  );
  const returnAmount = products.reduce(
    (acc, p) => acc.plus(new Decimal(Number(p.subTotal))),
    new Decimal(0),
  );

  const totalExchangeValue = products.reduce(
    (acc, product) =>
      acc.plus(
        new Decimal(Number(product.quantity)).mul(
          new Decimal(Number(product.unitPrice)),
        ),
      ),
    new Decimal(0),
  );

  const totalSaleValue =
    originalSaleProducts.length > 0
      ? originalSaleProducts.reduce(
        (acc, product) =>
          acc.plus(
            new Decimal(Number(product.quantity)).mul(
              new Decimal(Number(product.unitPrice)),
            ),
          ),
        new Decimal(0),
      )
      : new Decimal(0);

  const totalReturnValue =
    originalSaleProducts.length > 0
      ? originalSaleProducts.reduce(
        (acc, product) => acc.plus(new Decimal(Number(product.lineTotal))),
        new Decimal(0),
      )
      : new Decimal(0);

  const adjustmentAmount = totalReturnValue.minus(totalExchangeValue);

  useEffect(() => {
    if (purchaseSearchedByInvoice?.products?.length > 0) {
      const productsToAdd = purchaseSearchedByInvoice.products.map(
        (purchase) => ({
          ...purchase,
          returnPrice: purchase.unitPrice,
          returnQuantity: "",
          returnQtyInKg: "",
          lineTotal: "",
        }),
      );

      setOriginalSaleProducts(productsToAdd);
    }
  }, [purchaseSearchedByInvoice]);

  useEffect(() => {
    dispatch(setPurchaseSearchedByInvoiceToEmpty());
  }, []);

  //* Fetching purchase returns
  useEffect(() => {
    if (user) {
      if (dateMode === "single") {
        dispatch(
          fetchPurchaseReturn({
            dateMode,
            dateSearch,
            nameSearch,
            page: currentPage,
            order: sortOrder,
          }),
        );
      } else {
        dispatch(
          fetchPurchaseReturn({
            dateMode,
            dateSearchStart: rangeDateSearch.dateSearchStart,
            dateSearchEnd: rangeDateSearch.dateSearchEnd,
            nameSearch,
            page: currentPage,
            order: sortOrder,
          }),
        );
      }
    }
  }, [dispatch, user, toggle, filterToggler, sortOrder, currentPage]);

  if (!user) return null;

  return (
    <>
      <title>{`Purchase Return | ${import.meta.env.VITE_COMPANY_NAME}`}</title>
      <div className="min-h-screen bg-slate-50 p-3 sm:p-4 md:p-6 font-sans">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          Purchase Return Entry
        </h1>

        <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
          {purchaseSearchedByInvoice ? null : (
            <div className="mb-4 flex items-start gap-2 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md text-sm">
              <span className="font-semibold">নির্দেশনা:</span>
              <span>
                পারচেজ রিটার্ন তৈরি করতে মেমো নম্বর লিখে <strong>লোড</strong>{" "}
                বাটনে চাপ দিন।
              </span>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {/* Date and Memo Row */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${purchaseSearchedByInvoice ? "mb-4" : ""}`}
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={data.invoiceNo}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, invoiceNo: e.target.value }))
                  }
                  placeholder="Enter Memo Number"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1"
                  required
                />
                <button
                  type="button"
                  onClick={handleSaleLoad}
                  disabled={invoiceLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {invoiceLoading ? "Loading..." : "Load"}
                </button>
              </div>
              {purchaseSearchedByInvoice ? (
                <div>
                  <input
                    type="date"
                    value={data.date}
                    onChange={(e) =>
                      setData((prev) => ({ ...data, date: e.target.value }))
                    }
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                    required
                  />
                </div>
              ) : (
                ""
              )}
            </div>
            {purchaseSearchedByInvoice ? (
              <>
                {/* Supplier Info Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Supplier Name
                    </label>
                    <div className="flex">
                      <input
                        type="search"
                        value={purchaseSearchedByInvoice.supplierName}
                        disabled
                        placeholder="Supplier Name"
                        className="block w-full px-3 py-1.5 border border-gray-300 bg-gray-200 text-gray-700 rounded-sm text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      placeholder="Address"
                      value={purchaseSearchedByInvoice.address}
                      disabled
                      className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm bg-gray-200 text-gray-700 select-none"
                    />
                  </div>
                </div>

                {/* Original Purchase Products - Auto Loaded */}
                <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                  <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <span>
                      Original Sale Products (Memo: #
                      {purchaseSearchedByInvoice.memo})
                    </span>
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                      Auto Loaded
                    </span>
                  </h3>

                  {/* Original Products */}
                  {originalSaleProducts.length > 0
                    ? originalSaleProducts.map((product, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-8 gap-3 mb-3 items-end bg-white p-3 rounded border border-blue-100"
                      >
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-600 mb-1">
                            Product Name
                          </label>
                          <input
                            type="text"
                            value={product.productName}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Purchase Qty
                          </label>
                          <input
                            type="number"
                            value={product.availableReturnQty}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Purchase Price
                          </label>
                          <input
                            type="number"
                            value={product.unitPrice}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1 text-red-600">
                            Return Price
                          </label>
                          <input
                            type="number"
                            placeholder="Return Price"
                            // min={product.sellPrice}
                            min={0}
                            value={product.returnPrice}
                            onChange={(e) => {
                              setOriginalSaleProducts((prev) =>
                                prev.map((p, i) =>
                                  i === index
                                    ? {
                                      ...p,
                                      returnPrice: e.target.value,
                                      lineTotal: Number(
                                        new Decimal(
                                          Number(p.returnQuantity),
                                        ).mul(
                                          new Decimal(Number(e.target.value)),
                                        ),
                                      ),
                                    }
                                    : p,
                                ),
                              );
                            }}
                            step="any"
                            className="w-full px-3 py-2 border border-red-400 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1 text-red-600">
                            Return Qty
                          </label>
                          <input
                            type="number"
                            placeholder="Qty"
                            min={1}
                            max={product.availableReturnQty}
                            value={product.returnQuantity}
                            onChange={(e) => {
                              setOriginalSaleProducts((prev) =>
                                prev.map((p, i) =>
                                  i === index
                                    ? {
                                      ...p,
                                      returnQuantity: e.target.value,
                                      lineTotal: Number(
                                        new Decimal(
                                          Number(p.returnPrice),
                                        ).mul(
                                          new Decimal(Number(e.target.value)),
                                        ),
                                      ),
                                    }
                                    : p,
                                ),
                              );
                            }}
                            step="any"
                            className="w-full px-3 py-2 border border-red-400 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Qty (kg)
                          </label>
                          <input
                            type="number"
                            placeholder="kg"
                            min={0}
                            value={product.returnQtyInKg}
                            onChange={(e) => {
                              setOriginalSaleProducts((prev) =>
                                prev.map((p, i) =>
                                  i === index
                                    ? {
                                      ...p,
                                      returnQtyInKg: e.target.value,
                                    }
                                    : p,
                                ),
                              );
                            }}
                            step="any"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Line Total
                          </label>
                          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-red-50 text-red-700 font-semibold text-sm">
                            ৳{" "}
                            {new Decimal(Number(product.lineTotal)).toFixed(2)}
                          </div>
                        </div>
                        {originalSaleProducts.length > 1 ? (
                          <button
                            type="button"
                            onClick={() => {
                              setOriginalSaleProducts((prev) =>
                                prev.filter((p, i) => p.productName !== product.productName),
                              );
                            }}
                            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm h-fit mt-5 cursor-pointer"
                          >
                            ×
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    ))
                    : ""}

                  {/* Original Sale Summary */}
                  <div className="border-t border-blue-200 pt-3 mt-3">
                    <div className="flex justify-end gap-6 text-sm">
                      <span className="text-blue-800">
                        Total Sale: <strong>৳ {totalSaleValue.toFixed(2)}</strong>
                      </span>
                      <span className="text-red-600 font-semibold text-lg">
                        Total Return Value:{" "}
                        <strong>৳ {totalReturnValue.toFixed(2)}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Return Type Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* LEFT - Refund by Product */}
                  <div
                    onClick={() => setReturnType("product")}
                    className={`p-4 rounded-lg border-2 cursor-pointer ${returnType === "product"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-gray-50"
                      }`}
                  >
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="returnType"
                        value="product"
                        checked={returnType === "product"}
                        onChange={() => setReturnType("product")}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="font-medium text-gray-700">
                        Refund by Product (Exchange)
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1 ml-6">
                      Take new products from supplier
                    </p>
                  </div>

                  {/* RIGHT - Refund by Cash */}
                  <div
                    onClick={() => setReturnType("cash")}
                    className={`p-4 rounded-lg border-2 cursor-pointer ${returnType === "cash"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-gray-50"
                      }`}
                  >
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="returnType"
                        value="cash"
                        checked={returnType === "cash"}
                        onChange={() => setReturnType("cash")}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="font-medium text-gray-700">
                        Refund by Cash (Money Back)
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1 ml-6">
                      Take cash from supplier
                    </p>
                  </div>
                </div>

                {/* CONDITIONAL SECTIONS */}

                {/* 1. REFUND BY PRODUCT - Multiple Products */}
                {returnType === "product" && (
                  <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-green-800">
                        New Exchange Products
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddProduct}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap cursor-pointer mb-2"
                    >
                      + Add Product
                    </button>

                    {/* Products Section */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        Products
                      </h3>

                      {/* Single Product Row */}
                      {products.map((product, index) => (
                        <div
                          key={product.id}
                          className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3 items-end"
                        >
                          <div className="md:col-span-2">
                            <label className="block text-xs text-gray-600 mb-1">
                              Product Name
                            </label>
                            <input
                              type="text"
                              value={product.productName}
                              onChange={(e) =>
                                handleProductChange(
                                  product.id,
                                  "productName",
                                  e.target.value,
                                )
                              }
                              placeholder="Product Name"
                              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">
                              Quantity
                            </label>
                            <input
                              type="number"
                              value={product.quantity}
                              onChange={(e) => {
                                handleProductChange(
                                  product.id,
                                  "quantity",
                                  e.target.value,
                                );

                                const subTotal = new Decimal(
                                  Number(e.target.value),
                                ).mul(new Decimal(Number(product.unitPrice)));

                                handleProductChange(
                                  product.id,
                                  "subTotal",
                                  Number(subTotal.toFixed(4)),
                                );
                              }}
                              placeholder="Qty"
                              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">
                              Qty (kg)
                            </label>
                            <input
                              type="number"
                              value={product.qtyInKg}
                              onChange={(e) => {
                                handleProductChange(
                                  product.id,
                                  "qtyInKg",
                                  e.target.value,
                                );
                              }}
                              placeholder="Qty in kg"
                              step="any"
                              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <label className="block text-xs text-gray-600 mb-1">
                                Unit Price
                              </label>
                              <input
                                type="number"
                                value={product.unitPrice}
                                onChange={(e) => {
                                  handleProductChange(
                                    product.id,
                                    "unitPrice",
                                    e.target.value,
                                  );

                                  const subTotal = new Decimal(
                                    Number(e.target.value),
                                  ).mul(new Decimal(Number(product.quantity)));

                                  handleProductChange(
                                    product.id,
                                    "subTotal",
                                    Number(subTotal.toFixed(4)),
                                  );
                                }}
                                placeholder="Unit Price"
                                step="any"
                                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                required
                              />
                            </div>
                            {products.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveProduct(product.id)}
                                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Product Total Summary */}
                      <div className="border-t border-gray-400 pt-3 mt-3">
                        <div className="flex justify-end gap-6 text-sm">
                          <span className="text-gray-600">
                            Total Qty: <strong>{totalQty.toFixed(0)}</strong>
                          </span>
                          <span className="text-gray-600">
                            Total Qty (kg):{" "}
                            <strong>{totalQtyInKg.toFixed(0)}</strong>
                          </span>
                          <span className="text-gray-800 font-semibold">
                            Products Total: ৳ {returnAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Exchange Summary */}
                    <div className="border-t border-green-200 pt-3 mt-3">
                      <div className="flex justify-end">
                        <span className="text-green-800 font-semibold text-lg">
                          Total Exchange Value: ৳ {totalExchangeValue.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. REFUND BY CASH - Simple Amount Input */}
                {returnType === "cash" && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                    <h3 className="text-sm font-semibold text-blue-800 mb-3">
                      Cash Refund Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Cash Refund Amount
                        </label>
                        <input
                          type="number"
                          placeholder="Enter refund amount"
                          value={cashDetails.cashRefundAmount}
                          onChange={(e) =>
                            setCashDetails((prev) => ({
                              ...prev,
                              cashRefundAmount: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-2 border border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                          required={returnType === "cash"}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Payment Method
                        </label>
                        <select
                          value={cashDetails.paymentMethod}
                          onChange={(e) =>
                            setCashDetails((prev) => ({
                              ...prev,
                              paymentMethod: e.target.value,
                            }))
                          }
                          required={returnType === "cash"}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          <option value="Cash">Cash</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="Mobile Banking">Mobile Banking</option>
                          <option value="Check">Check</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Reference/Note
                        </label>
                        <input
                          type="text"
                          placeholder="Optional note"
                          value={cashDetails.note}
                          onChange={(e) =>
                            setCashDetails((prev) => ({
                              ...prev,
                              note: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Final Summary */}
                <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-200">
                  <h3 className="text-sm font-semibold text-yellow-800 mb-3">
                    Summary
                  </h3>

                  {returnType === "product" ? (
                    /* Product Exchange Summary */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-white rounded border border-red-200">
                        <div className="text-xs text-gray-600 mb-1">
                          Return Value
                        </div>
                        <div className="text-xl font-bold text-red-600">
                          ৳ {totalReturnValue.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-white rounded border border-green-200">
                        <div className="text-xs text-gray-600 mb-1">
                          Exchange Value
                        </div>
                        <div className="text-xl font-bold text-green-600">
                          ৳ {totalExchangeValue.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-white rounded border border-blue-200">
                        <div className="text-xs text-gray-600 mb-1">
                          {returnType === "product"
                            ? "Adjustment"
                            : "Cash to Pay"}
                        </div>
                        <div className="text-xl font-bold text-blue-600">
                          ৳ {adjustmentAmount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Cash Refund Summary */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-white rounded border border-red-200">
                        <div className="text-xs text-gray-600 mb-1">
                          Total Return Value
                        </div>
                        <div className="text-xl font-bold text-red-600">
                          ৳ {totalReturnValue.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-white rounded border border-blue-200">
                        <div className="text-xs text-gray-600 mb-1">
                          Cash Refund Amount
                        </div>
                        <div className="text-xl font-bold text-blue-600">
                          ৳{" "}
                          {Number(cashDetails.cashRefundAmount).toLocaleString(
                            "en-BD",
                            { minimumFractionDigits: 2 },
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-500 transition-colors cursor-pointer"
                  >
                    Add Return
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setData({
                        invoiceNo: "",
                        date: "",
                      });
                      setCashDetails({
                        cashRefundAmount: "",
                        paymentMethod: "Cash",
                        note: "",
                      });
                      setProducts([
                        {
                          id: 1,
                          productName: "",
                          quantity: "",
                          qtyInKg: "",
                          unitPrice: "",
                          subTotal: "",
                        },
                      ]);
                      dispatch(setPurchaseSearchedByInvoiceToEmpty());
                    }}
                    className="px-6 py-2 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 disabled:cursor-not-allowed disabled:bg-gray-400 transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </>
            ) : (
              ""
            )}
          </form>
        </div>

        {/* Purchase Return Report Table */}
        <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h2 className="text-lg sm:text-xl font-semibold">
              Purchase Return Report
            </h2>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-3">
            <div>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="border border-gray-300 bg-white rounded-md px-3 py-2 text-sm shadow-sm hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="1">Oldest First</option>
                <option value="-1">Newest First</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 w-full lg:w-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:ml-auto w-full">
                <label className="text-xs sm:text-sm text-gray-600">
                  Search by Supplier Name:
                </label>
                <input
                  type="text"
                  value={nameSearch}
                  onChange={(e) => setNameSearch(e.target.value)}
                  placeholder="Supplier Name"
                  className="w-full sm:w-40 border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:ml-auto w-full">
                <div className="flex gap-4 items-center">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="dateMode"
                      value="single"
                      checked={dateMode === "single"}
                      onChange={(e) => setDateMode(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    Single Date
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="dateMode"
                      value="range"
                      checked={dateMode === "range"}
                      onChange={(e) => setDateMode(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    Date Range
                  </label>
                </div>
              </div>

              {dateMode === "single" && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:ml-auto w-full">
                  <label className="text-xs sm:text-sm text-gray-600">
                    Search by Date:
                  </label>
                  <input
                    type="date"
                    value={dateSearch}
                    onChange={(e) => {
                      setDateSearch(e.target.value);
                    }}
                    className="w-full sm:w-40 border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                  />
                </div>
              )}

              {dateMode === "range" && (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:ml-auto w-full">
                    <label className="text-xs sm:text-sm text-gray-600">
                      Start Date:
                    </label>
                    <input
                      type="date"
                      max={
                        rangeDateSearch.dateSearchEnd
                          ? rangeDateSearch.dateSearchEnd
                          : ""
                      }
                      value={rangeDateSearch.dateSearchStart}
                      onChange={(e) => {
                        setRangeDateSearch((prev) => ({
                          ...prev,
                          dateSearchStart: e.target.value,
                        }));
                      }}
                      className="w-full sm:w-40 border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:ml-auto w-full">
                    <label className="text-xs sm:text-sm text-gray-600">
                      End Date:
                    </label>
                    <input
                      type="date"
                      min={
                        rangeDateSearch.dateSearchStart
                          ? rangeDateSearch.dateSearchStart
                          : ""
                      }
                      value={rangeDateSearch.dateSearchEnd}
                      onChange={(e) => {
                        setRangeDateSearch((prev) => ({
                          ...prev,
                          dateSearchEnd: e.target.value,
                        }));
                      }}
                      className="w-full sm:w-40 border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-2 justify-start sm:justify-end  w-full">
                <button
                  onClick={() => {
                    setFilterToggler(!filterToggler);
                  }}
                  className="flex-1 sm:flex-none bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                  type="button"
                >
                  Filter
                </button>
                <button
                  onClick={() => {
                    setNameSearch("");
                    setDateSearch("");
                    setRangeDateSearch({
                      dateSearchStart: "",
                      dateSearchEnd: "",
                    });

                    setFilterToggler(!filterToggler);
                  }}
                  className="flex-1 sm:flex-none bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                  type="button"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-3 text-left">Date</th>
                  <th className="border px-4 py-3 text-left">Memo</th>
                  <th className="border px-4 py-3 text-left">Supplier</th>
                  <th className="border px-4 py-3 text-left">Product Name</th>
                  <th className="border px-4 py-3 text-center">Return Qty</th>
                  <th className="border px-4 py-3 text-center">Qty (KG)</th>
                  <th className="border px-4 py-3 text-center">Return Price</th>
                  <th className="border px-4 py-3 text-center">Line Total</th>
                  <th className="border px-4 py-3 text-left">Type</th>
                  <th className="border px-4 py-3 text-center">Total Return</th>
                  <th className="border px-4 py-3 text-center">Refund</th>
                  <th className="border px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {purchaseReturns.length > 0 ? (
                  purchaseReturns.map((sr) => {
                    const products = sr.products || [];
                    const rowspan = products.length || 1;

                    return products.length > 0 ? (
                      products.map((product, idx) => (
                        <tr key={`${sr._id}-${idx}`} className="hover:bg-gray-50">
                          {idx === 0 && (
                            <>
                              <td rowSpan={rowspan} className="border px-4 py-3">
                                {
                                  dayjs(sr.createdAt)
                                    .tz("Asia/Dhaka")
                                    .format("DD-MM-YYYY")
                                }
                              </td>
                              <td
                                rowSpan={rowspan}
                                className="border px-4 py-3 font-medium"
                              >
                                {sr.memo}
                              </td>
                              <td
                                rowSpan={rowspan}
                                className="border px-4 py-3 cursor-pointer hover:text-blue-600 hover:underline"
                                onClick={() =>
                                  navigate("/purchase-return-statement", {
                                    state: sr,
                                  })
                                }
                              >
                                {sr.supplierName}
                              </td>
                            </>
                          )}

                          <td className="border px-4 py-3">
                            {product.productName}
                          </td>
                          <td className="border px-4 py-3 text-center">
                            {product.returnQuantity}
                          </td>
                          <td className="border px-4 py-3 text-center">
                            {product.returnQtyInKg}
                          </td>
                          <td className="border px-4 py-3 text-center">
                            ৳ {product.returnPrice}
                          </td>
                          <td className="border px-4 py-3 text-center font-medium">
                            ৳ {new Decimal(Number(product.lineTotal)).toFixed(2)}
                          </td>

                          {idx === 0 && (
                            <>
                              <td rowSpan={rowspan} className="border px-4 py-3">
                                {sr.transactionRecords[0].returnType ===
                                  "product" && (
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                      Product
                                    </span>
                                  )}
                                {sr.transactionRecords[0].returnType ===
                                  "cash" && (
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                      Cash
                                    </span>
                                  )}
                              </td>
                              <td
                                rowSpan={rowspan}
                                className="border px-4 py-3 text-red-600 font-semibold text-center"
                              >
                                ৳ {sr.totalReturnValue}
                              </td>
                              <td
                                rowSpan={rowspan}
                                className="border px-4 py-3 text-green-600 font-semibold text-center"
                              >
                                ৳ {sr.paid}
                              </td>
                              <td
                                rowSpan={rowspan}
                                className="border px-4 py-3 text-center"
                              >
                                <div className="flex gap-2 justify-center flex-col">
                                  <Link
                                    to={
                                      sr.due > 0
                                        ? `/purchase-return/${sr._id}/exchange-due`
                                        : "#"
                                    }
                                    className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                                  >
                                    Exchange
                                  </Link>
                                  <Link
                                    to={
                                      sr.due > 0
                                        ? `/purchase-return/${sr._id}/edit-due`
                                        : "#"
                                    }
                                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                                  >
                                    Cash
                                  </Link>
                                  <button
                                    onClick={() =>
                                      navigate("/invoice-sales-return", {
                                        state: sr,
                                      })
                                    }
                                    className="text-xs cursor-pointer bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded"
                                  >
                                    Print
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr key={sr._id}>
                        <td className="border px-4 py-3">
                          {new Date(sr.createdAt)
                            .toLocaleDateString("en-GB")
                            .replaceAll("/", "-")}
                        </td>
                        <td className="border px-4 py-3 font-medium">
                          {sr.memo}
                        </td>
                        <td
                          className="border px-4 py-3 cursor-pointer hover:text-blue-600 hover:underline"
                          onClick={() =>
                            navigate("/sales-return-statement", { state: sr })
                          }
                        >
                          {sr.customerName}
                        </td>
                        <td
                          className="border px-4 py-3 text-gray-500"
                          colSpan={5}
                        >
                          No Products
                        </td>
                        <td className="border px-4 py-3">{sr.returnType}</td>
                        <td className="border px-4 py-3 text-red-600 font-semibold text-center">
                          ৳ {sr.totalReturnValue}
                        </td>
                        <td className="border px-4 py-3 text-green-600 font-semibold text-center">
                          ৳ {sr.paid}
                        </td>
                        <td className="border px-4 py-3 text-center">
                          <button
                            onClick={() =>
                              navigate("/invoice-sales-return", { state: sr })
                            }
                            className="text-xs bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded"
                          >
                            Print
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={12}
                      className="text-center py-12 text-gray-500 border"
                    >
                      No Sales Return Available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pages ? (
            <div className="flex justify-center items-center mt-4 gap-2 text-sm">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className={`${page === 1
                  ? ""
                  : "cursor-pointer hover:bg-black hover:text-white"
                  } px-2 py-1 border rounded  disabled:opacity-50`}
              >
                Prev
              </button>
              <span>
                Page {page} of {pages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, pages))}
                disabled={page === pages}
                className={`${page === pages
                  ? ""
                  : "cursor-pointer hover:bg-black hover:text-white"
                  }  px-2 py-1 border rounded  disabled:opacity-50`}
              >
                Next
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default PurchaseReturn;
