import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Decimal from "decimal.js";
import {
  addPurchaseReturn,
  fetchPurchaseReturn,
} from "../features/PurchaseReturn/purchaseReturnSlice";
import { useDispatch, useSelector } from "react-redux";

const PurchaseReturn = () => {
  const { user } = useSelector((state) => state.auth);
  const { purchaseReturns, toggle, page, pages } = useSelector(
    (state) => state.purchaseReturn,
  );
  // console.log(purchaseReturns);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: "",
    memo: "",
  });
  const [addLoading, setAddLoading] = useState(false);

  //* Supplier Search Handling Section
  const [name, setName] = useState("");
  const [supplier, setSupplier] = useState({
    supplierId: "",
    supplierName: "",
    address: "",
    supplierEmail: "",
    supplierPhone: "",
  });
  const [data, setData] = useState(null);
  const [disable, setDisable] = useState(false);
  const supplierNameRef = useRef(null);
  const handleSupplierNameOnChange = async (e) => {
    const query = e.target.value;
    setName(query);
    if (query) {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/supplier/purchase`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          params: {
            q: query,
          },
        },
      );

      setData(data);
    } else {
      setData(null);
    }
  };
  const handleSupplierOnClick = (supplierData) => {
    setData(null);
    setName(supplierData.name);
    setSupplier({
      supplierId: supplierData._id,
      supplierName: supplierData.name,
      address: supplierData.address,
      supplierEmail: supplierData.email,
      supplierPhone: supplierData.phone,
    });
    setDisable(true);
  };
  useEffect(() => {
    if (!disable && supplierNameRef.current) {
      supplierNameRef.current.focus();
    }
  }, [disable]);
  //* Supplier Search Handling Section

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
  const [refundReceived, setRefundReceived] = useState("");
  const refundDue = returnAmount.minus(new Decimal(Number(refundReceived)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (supplier.supplierId === "") return alert("Select a supplier!");

    const newProducts = products.map(({ id, ...rest }) => rest);

    const paid = new Decimal(refundReceived).greaterThan(returnAmount)
      ? returnAmount
      : new Decimal(refundReceived);

    const purchaseReturnData = {
      memo: formData.memo,
      createdAt: formData.date,
      issuedAt: new Date(),
      supplierId: supplier.supplierId,
      supplierName: supplier.supplierName,
      address: supplier.address,
      supplierEmail: supplier.supplierEmail,
      supplierPhone: supplier.supplierPhone,
      userId: user._id,
      products: newProducts,
      returnAmount: Number(returnAmount.toFixed(4)),
      refundReceived: Number(paid.toFixed(4)),
      refundDue: refundDue.lessThan(new Decimal(0))
        ? 0
        : Number(refundDue.toFixed(4)),
    };

    try {
      setAddLoading(true);
      await dispatch(addPurchaseReturn(purchaseReturnData)).unwrap();
      setFormData({
        date: "",
        memo: "",
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
      setRefundReceived("");
      //* For Customer Name only
      setDisable(false);
      setName("");
      setSupplier({
        supplierId: "",
        supplierName: "",
        address: "",
        supplierEmail: "",
        supplierPhone: "",
      });
      setData(null);
    } catch (error) {
      console.log("Failed!");
    } finally {
      setAddLoading(false);
    }
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(page);
  const [sortOrder, setSortOrder] = useState(-1);

  const [filterToggler, setFilterToggler] = useState(true);
  const [nameSearch, setNameSearch] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (user) {
      dispatch(
        fetchPurchaseReturn({
          dateSearch: date,
          nameSearch,
          page: currentPage,
          order: sortOrder,
        }),
      );
    }
  }, [dispatch, user, toggle, filterToggler, sortOrder, currentPage]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-4 md:p-6 font-sans">
      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Purchase Return Entry
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8 max-w-5xl mx-auto">
        <form onSubmit={handleSubmit}>
          {/* First Row - Customer Info */}
          <div className="grid grid-cols-2 gap-x-6 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Supplier Name
              </label>
              <div className="flex">
                <input
                  type="search"
                  value={name}
                  onChange={handleSupplierNameOnChange}
                  ref={supplierNameRef}
                  placeholder="Supplier Name"
                  className="block w-[85%] px-3 py-1.5 border border-gray-300 rounded-sm text-sm disabled:bg-gray-300"
                  disabled={disable}
                />
                <button
                  disabled={!disable}
                  className="bg-red-500 hover:bg-red-600 cursor-pointer ml-2 px-2 py-1 font-bold text-white rounded disabled:bg-red-300 disabled:cursor-not-allowed "
                  onClick={() => {
                    setDisable(false);
                    setName("");
                    setSupplier({
                      supplierId: "",
                      supplierName: "",
                      address: "",
                      supplierEmail: "",
                      supplierPhone: "",
                    });
                    setData(null);
                  }}
                >
                  Change
                </button>
              </div>

              <div
                className={`w-[85%] max-h-50 ${
                  data ? "shadow-md overflow-y-scroll" : ""
                }`}
              >
                {data ? (
                  <table className="w-full">
                    <tbody>
                      {data.map((d, i) => (
                        <tr
                          key={i}
                          className="p-2 cursor-pointer border-b border-gray-300 hover:bg-gray-100 text-gray-800"
                          onClick={() => handleSupplierOnClick(d)}
                        >
                          {/* {d.name} */}
                          <td className="p-2">{d.name}</td>
                          <td className="text-center">{d.address}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                value={supplier.address}
                placeholder="Address"
                disabled
                className="block w-full px-3 py-1.5 border border-gray-400 rounded-sm text-sm bg-gray-200 text-gray-700 select-none"
                required
              />
            </div>
          </div>

          {/* Second Row - Date and Memo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Pick A Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                placeholder="dd-----yyyy"
                className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Enter Memo
                </label>
                <input
                  type="text"
                  placeholder="Memo"
                  value={formData.memo}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, memo: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
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

                      const subTotal = new Decimal(Number(e.target.value)).mul(
                        new Decimal(Number(product.unitPrice)),
                      );

                      handleProductChange(
                        product.id,
                        "subTotal",
                        Number(subTotal.toFixed(4)),
                      );
                    }}
                    placeholder="Qty in kg"
                    step="any"
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    required
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
                        ).mul(new Decimal(Number(product.qtyInKg)));

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
                  Total Qty (kg): <strong>{totalQtyInKg.toFixed(0)}</strong>
                </span>
                <span className="text-gray-800 font-semibold">
                  Products Total: ৳ {returnAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Return Amount
              </label>
              <input
                type="number"
                value={returnAmount.toFixed(2)}
                disabled
                className="w-full px-4 py-2 border border-gray-400 rounded-md bg-gray-100 text-gray-600 font-semibold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Refund Received
              </label>
              <input
                type="number"
                value={refundReceived}
                onChange={(e) => setRefundReceived(e.target.value)}
                min={0}
                placeholder="Enter Amount"
                className="w-full px-4 py-2 border border-gray-400 rounded-md text-gray-700 font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Refund Due
              </label>
              <input
                type="number"
                value={refundDue.toFixed(2)}
                disabled
                className="w-full px-4 py-2 border border-gray-400 rounded-md bg-gray-300 text-gray-600 font-semibold"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium transition-colors disabled:bg-blue-500 disabled:cursor-not-allowed"
            disabled={addLoading}
          >
            {addLoading ? "Adding..." : "Add Return"}
          </button>
        </form>
      </div>

      {/* Purchase Return Report Table */}
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg sm:text-xl font-semibold">
              Purchase Return Report
            </h2>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="1">Oldest First</option>
              <option value="-1">Newest First</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 ml-auto">
              <label className="text-xs sm:text-sm text-gray-600">
                Search by Supplier Name:
              </label>
              <input
                type="search"
                placeholder="Supplier Name"
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-36 sm:w-40"
              />
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <label className="text-xs sm:text-sm text-gray-600">
                Search by Date:
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-36 sm:w-40"
              />
            </div>

            <div className="text-right">
              <button
                onClick={() => setFilterToggler(!filterToggler)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 cursor-pointer"
              >
                Filter
              </button>
              <button
                onClick={() => {
                  if (date !== "" || nameSearch !== "") {
                    date !== "" && setDate("");
                    nameSearch !== "" && setNameSearch("");
                    setFilterToggler(!filterToggler);
                  }
                }}
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 cursor-pointer ml-2"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs sm:text-sm border-collapse">
            {/* <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                  Date
                </th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                  Memo
                </th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                  Supplier
                </th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                  Products
                </th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                  Qty
                </th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                  Qty (kg)
                </th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                  Total
                </th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                  Paid
                </th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                  Due
                </th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                  Action
                </th>
              </tr>
            </thead> */}

            <thead>
              <tr className="bg-gray-200">
                <th
                  className="border border-gray-400 px-4 py-3 text-left font-semibold text-gray-700"
                  rowSpan={2}
                >
                  Date
                </th>
                <th
                  className="border border-gray-400 px-4 py-3 text-left font-semibold text-gray-700"
                  rowSpan={2}
                >
                  Memo
                </th>
                <th
                  className="border border-gray-400 px-4 py-3 text-left font-semibold text-gray-700"
                  rowSpan={2}
                >
                  Supplier
                </th>
                <th
                  className="border border-gray-400 px-4 py-3 text-center font-semibold text-gray-700"
                  colSpan={4}
                >
                  Products
                </th>

                <th
                  className="border border-gray-400 px-4 py-3 text-left font-semibold text-gray-700"
                  rowSpan={2}
                >
                  Total
                </th>
                <th
                  className="border border-gray-400 px-4 py-3 text-left font-semibold text-gray-700"
                  rowSpan={2}
                >
                  Refund Received
                </th>
                <th
                  className="border border-gray-400 px-4 py-3 text-left font-semibold text-gray-700"
                  rowSpan={2}
                >
                  Refund Due
                </th>
                <th
                  className="border border-gray-400 px-4 py-3 text-left font-semibold text-gray-700"
                  rowSpan={2}
                >
                  Action
                </th>
              </tr>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 px-4 py-3 text-left font-semibold text-gray-700">
                  Product Names
                </th>
                <th className="border border-gray-400 px-4 py-3 text-left font-semibold text-gray-700">
                  Qty
                </th>
                <th className="border border-gray-400 px-4 py-3 text-left font-semibold text-gray-700">
                  Qty (kg)
                </th>
                <th className="border border-gray-400 px-4 py-3 text-left font-semibold text-gray-700">
                  Unit Price
                </th>
              </tr>
            </thead>
            <tbody>
              {purchaseReturns.length > 0 ? (
                purchaseReturns.map((purchaseReturn, index) => {
                  const rowspan = purchaseReturn.products.length;
                  const isEven = index % 2 === 0;

                  return purchaseReturn.products.map((product, index) => (
                    <tr
                      onClick={(e) => {
                        if (e.target.tagName !== "TD") return;
                        navigate("/purchase-return-statement", { state: purchaseReturn });
                      }}
                      key={index}
                      className={
                        isEven
                          ? "bg-white cursor-pointer"
                          : "bg-gray-50 cursor-pointer"
                      }
                    >
                      {index === 0 && (
                        <>
                          <td
                            rowSpan={rowspan}
                            className="border border-gray-400 px-2 py-1 sm:px-4 sm:py-2"
                          >
                            {new Date(purchaseReturn.createdAt)
                              .toLocaleDateString("en-GB", {
                                timeZone: "Asia/Dhaka",
                              })
                              .replaceAll("/", "-")}
                          </td>
                          <td
                            rowSpan={rowspan}
                            className="border border-gray-400 px-2 py-1 sm:px-4 sm:py-2"
                          >
                            {purchaseReturn.memo}
                          </td>
                          <td
                            rowSpan={rowspan}
                            className="border border-gray-400 px-2 py-1 sm:px-4 sm:py-2"
                          >
                            {purchaseReturn.supplierName}
                          </td>
                        </>
                      )}

                      {/* Product columns */}
                      <td
                        className={`border border-gray-400 px-2 py-1 sm:px-4 sm:py-2 ${
                          index !== purchaseReturn.products.length - 1
                            ? "border-b-gray-200"
                            : ""
                        }`}
                      >
                        {product.productName}
                      </td>
                      <td
                        className={`border border-gray-400 px-2 py-1 sm:px-4 sm:py-2 ${
                          index !== purchaseReturn.products.length - 1
                            ? "border-b-gray-200"
                            : ""
                        }`}
                      >
                        {product.quantity}
                      </td>
                      <td
                        className={`border border-gray-400 px-2 py-1 sm:px-4 sm:py-2 ${
                          index !== purchaseReturn.products.length - 1
                            ? "border-b-gray-200"
                            : ""
                        }`}
                      >
                        {product.qtyInKg}
                      </td>
                      <td
                        className={`border border-gray-400 px-2 py-1 sm:px-4 sm:py-2 ${
                          index !== purchaseReturn.products.length - 1
                            ? "border-b-gray-200"
                            : ""
                        }`}
                      >
                        {product.unitPrice}
                      </td>

                      {index === 0 && (
                        <>
                          <td
                            rowSpan={rowspan}
                            className="border border-gray-400 px-2 py-1 sm:px-4 sm:py-2"
                          >
                            {purchaseReturn.returnAmount}
                          </td>
                          <td
                            rowSpan={rowspan}
                            className="border border-gray-400 px-2 py-1 sm:px-4 sm:py-2"
                          >
                            {purchaseReturn.refundReceived}
                          </td>
                          <td
                            rowSpan={rowspan}
                            className={`border border-gray-400 px-2 py-1 sm:px-4 sm:py-2 ${purchaseReturn?.refundDue > 0 ? "text-red-500 font-bold" : ""}`}
                          >
                            {purchaseReturn.refundDue}
                          </td>
                          <td
                            rowSpan={rowspan}
                            className="border border-gray-400 px-2 py-1 sm:px-4 sm:py-2"
                          >
                            <div className="flex flex-wrap gap-1">
                              <Link
                                onClick={(e) => e.stopPropagation()}
                                to={
                                  purchaseReturn.refundDue > 0
                                    ? `/purchase-return/${purchaseReturn._id}/edit-due`
                                    : "#"
                                }
                                className={`text-xs text-white px-2 py-1 rounded  ${purchaseReturn.refundDue > 0 ? "bg-green-600 hover:bg-green-700 cursor-pointer" : "bg-green-500 cursor-not-allowed"}`}
                              >
                                Add Refund
                              </Link>
                              <Link
                                to="/invoice-purchase-return"
                                state={purchaseReturn}
                                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 cursor-pointer"
                              >
                                Print
                              </Link>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ));
                })
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center text-gray-500 py-10 text-lg select-none"
                  >
                    No Purchase Returns Available.
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
              className={`${
                page === 1
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
              className={`${
                page === pages
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
  );
};

export default PurchaseReturn;
