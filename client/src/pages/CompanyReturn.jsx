import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTruck,
  FaBox,
  FaWeightHanging,
  FaMoneyBillWave,
  FaPlus,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { useState } from "react";
import Decimal from "decimal.js";
import { useDispatch, useSelector } from "react-redux";
import {
  addCompanyProductReturn,
  fetchCompanyProductReturnById,
  fetchCompanyProductReturns,
  fetchProductExchangeReportData,
} from "../features/CompanyProductReturn/companyProductReturnSlice";
import { useEffect } from "react";
import {
  fetchProductExchangeStockByProductName,
  setProductExchangeStockByProductNameToEmpty,
} from "../features/ProductExchangeStock/productExchangeStockSlice";

const CompanyReturn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    companyProductReturns,
    productExchangeReportData,
    addLoading,
    toggle,
    page,
    pages,
  } = useSelector((state) => state.companyProductReturn);
  const { productExchangeStockSearchedByProductName } = useSelector(
    (state) => state.productExchangeStock,
  );

  const [currentPage, setCurrentPage] = useState(page);
  const [memoSearch, setMemoSearch] = useState("");
  const [formData, setFormData] = useState({
    date: "",
    // productName: "",
    // quantity: "",
    // qtyInKg: "",
    // unitPrice: "",
    // subTotal: "",
  });

  const handleOnChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //* Company Name Handle - starts
  const [supplier, setSupplier] = useState("");
  const loadOptions = async (inputValue, callback) => {
    if (!inputValue) return callback([]);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/supplier/purchase`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          params: {
            q: inputValue,
          },
        },
      );
      if (data && Array.isArray(data)) {
        const options = data.map((item) => ({
          label: item.name,
          value: item,
        }));
        callback(options);
      }
    } catch (error) {
      callback([]);
    }
  };
  //* Company Name Handle - ends

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supplier) return alert("Select a Company!");

    const newProducts = products.map(
      ({ id, tempQuantity, tempQtyInKg, ...rest }) => ({
        ...rest,
        unitPrice: Number(rest.unitPrice),
        quantity: Number(rest.quantity),
        qtyInKg: Number(rest.qtyInKg),
      }),
    );

    const returnData = {
      createdAt: formData.date,
      issuedAt: new Date(),
      supplierId: supplier._id,
      supplierName: supplier.name,
      address: supplier.address,
      supplierEmail: supplier.email,
      supplierPhone: supplier.phone,
      userId: user._id,

      // productName: formData.productName,
      // quantity: Number(formData.quantity),
      // qtyInKg: Number(formData.qtyInKg),
      // unitPrice: Number(formData.unitPrice),
      // subTotal: Number(formData.subTotal),

      products: newProducts,

      totalAmount: Number(totalAmount.toFixed(4)),
      paid: 0,
      due: Number(totalAmount.toFixed(4)),

      unchangedPaid: 0,
      unchangedDue: Number(totalAmount.toFixed(4)),
    };

    try {
      await dispatch(addCompanyProductReturn(returnData)).unwrap();
      setFormData({
        date: "",
        // productName: "",
        // quantity: "",
        // qtyInKg: "",
        // unitPrice: "",
        // subTotal: "",
      });
      setProducts([
        {
          id: 1,
          productId: "",
          productName: "",
          quantity: "",
          qtyInKg: "",
          tempQuantity: "",
          tempQtyInKg: "",
          unitPrice: "",
          subTotal: "",
        },
      ]);
      setSupplier("");
    } catch (error) {
      console.log("Failed!");
    }
  };

  //* Add Product Section Starts
  const [products, setProducts] = useState([
    {
      id: 1,
      productId: "",
      productName: "",
      quantity: "",
      qtyInKg: "",
      tempQuantity: "",
      tempQtyInKg: "",
      unitPrice: "",
      subTotal: "",
    },
  ]);

  // প্রোডাক্ট সার্চ করার ফাংশন
  const handleProductSearchChange = (id, value) => {
    handleProductChange(id, "productName", value);
    if (value) {
      setActiveSearchRow(id);
      dispatch(fetchProductExchangeStockByProductName({ productName: value }));
    } else {
      setActiveSearchRow(null);
      dispatch(setProductExchangeStockByProductNameToEmpty());
    }
  };

  // সার্চ রেজাল্ট থেকে প্রোডাক্ট সিলেক্ট করার ফাংশন
  // const handleSelectProductFromSearch = (id, productName) => {
  //   handleProductChange(id, "productName", productName);
  //   dispatch(setSalesReturnSearchByProductNameToEmpty());
  //   setActiveSearchRow(null);
  // };

  const handleSelectProductFromSearch = (id, productData) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              productId: productData.productId,
              productName: productData.productName,
              quantity: productData.tempQuantity,
              qtyInKg: productData.tempQtyInKg,

              tempQuantity: productData.tempQuantity,
              tempQtyInKg: productData.tempQtyInKg,
            }
          : product,
      ),
    );

    dispatch(setProductExchangeStockByProductNameToEmpty());
    setActiveSearchRow(null);
  };

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
        productId: "",
        productName: "",
        quantity: "",
        qtyInKg: "",
        tempQuantity: "",
        tempQtyInKg: "",
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
  const [activeSearchRow, setActiveSearchRow] = useState(null);

  const totalQty = products.reduce(
    (acc, p) => acc.plus(new Decimal(Number(p.quantity || 0))),
    new Decimal(0),
  );
  const totalQtyInKg = products.reduce(
    (acc, p) => acc.plus(new Decimal(Number(p.qtyInKg || 0))),
    new Decimal(0),
  );

  const totalAmount = products.reduce(
    (acc, p) => acc.plus(new Decimal(Number(p.subTotal || 0))),
    new Decimal(0),
  );
  //* Add Product Section Ends

  useEffect(() => {
    if (user) {
      dispatch(
        fetchCompanyProductReturns({
          memoSearch,
          page: currentPage,
        }),
      );
    }
  }, [dispatch, user, toggle, currentPage, memoSearch]);

  useEffect(() => {
    if (user) {
      dispatch(
        fetchProductExchangeReportData({
          memoSearch,
          page: currentPage,
        }),
      );
    }
  }, [dispatch, user, toggle]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* --- Section 1: Financial Summary (Updated to reflect Cash flow) --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 shadow-sm border-b-4 border-blue-600 rounded-sm">
            <div className="flex items-center gap-3 mb-2 text-blue-600">
              <FaBox size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                Total Sent Items
              </p>
            </div>
            <p className="text-2xl font-black text-gray-800">
              {productExchangeReportData
                ? productExchangeReportData.totalSentItems
                : "--"}{" "}
              <span className="text-xs">Pcs</span>
            </p>
          </div>

          <div className="bg-white p-5 shadow-sm border-b-4 border-orange-500 rounded-sm">
            <div className="flex items-center gap-3 mb-2 text-orange-500">
              <FaWeightHanging size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                Total Weight
              </p>
            </div>
            <p className="text-2xl font-black text-gray-800">
              {productExchangeReportData
                ? productExchangeReportData.totalWeight
                : "--"}{" "}
              <span className="text-xs">Kg</span>
            </p>
          </div>

          <div className="bg-gray-900 p-5 shadow-sm border-b-4 border-green-600 rounded-sm">
            <div className="flex items-center gap-3 mb-2 text-green-500">
              <FaMoneyBillWave size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Total Receivable
              </p>
            </div>
            <p className="text-2xl font-black text-white">
              ৳{" "}
              {productExchangeReportData
                ? productExchangeReportData.totalAmount
                : "--"}
            </p>
          </div>

          <div className="bg-white p-5 shadow-sm border-b-4 border-red-600 rounded-sm">
            <div className="flex items-center gap-3 mb-2 text-red-500">
              <FaTruck size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                Pending From Co.
              </p>
            </div>
            <p className="text-2xl font-black text-gray-800">
              ৳{" "}
              {productExchangeReportData
                ? productExchangeReportData.totalDue
                : "--"}
            </p>
          </div>
        </div>

        {/* --- Section 2: Horizontal Entry Form --- */}
        <div className="bg-white p-6 rounded-sm shadow-md mb-8 border-t-4 border-blue-600">
          <h2 className="text-xs font-black mb-4 flex items-center gap-2 text-gray-700 uppercase">
            <FaPlus className="text-blue-600" /> Dispatch New Return to Company
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* TOP SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* DATE */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">
                  Dispatch Date
                </label>

                <input
                  type="date"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold outline-none focus:border-blue-600"
                  value={formData.date}
                  onChange={(e) => handleOnChange("date", e.target.value)}
                  required
                />
              </div>

              {/* COMPANY */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">
                  Select Company
                </label>

                <AsyncSelect
                  className="text-sm font-semibold"
                  cacheOptions
                  loadOptions={loadOptions}
                  defaultOptions
                  isClearable
                  value={
                    supplier ? { label: supplier.name, value: supplier } : null
                  }
                  noOptionsMessage={() => "No Company Found!"}
                  components={{ DropdownIndicator: () => null }}
                  onChange={(selected) => {
                    selected ? setSupplier(selected.value) : setSupplier("");
                  }}
                  placeholder="Search..."
                />
              </div>
            </div>

            {/* PRODUCTS SECTION */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              {/* HEADER */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-700">
                  Products
                </h3>

                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition cursor-pointer"
                >
                  + Add Product
                </button>
              </div>

              {/* PRODUCTS */}
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    {/* PRODUCT NAME */}
                    <div className="md:col-span-5 relative">
                      <label className="block text-xs text-gray-600 mb-1 font-semibold">
                        Product Name
                      </label>

                      <input
                        type="text"
                        value={product.productName}
                        onChange={(e) =>
                          handleProductSearchChange(product.id, e.target.value)
                        }
                        placeholder="Product Name"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                        required
                      />

                      {/* SEARCH DROPDOWN */}
                      {activeSearchRow === product.id &&
                        productExchangeStockSearchedByProductName.length >
                          0 && (
                          <div className="absolute z-50 w-full bg-white shadow-xl border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto">
                            {productExchangeStockSearchedByProductName.map(
                              (p, i) => (
                                <div
                                  key={i}
                                  onClick={() =>
                                    handleSelectProductFromSearch(product.id, p)
                                  }
                                  className="px-3 py-3 border-b border-gray-100 cursor-pointer hover:bg-blue-50 text-sm"
                                >
                                  <div className="font-semibold">
                                    {p.productName}
                                  </div>

                                  <div className="flex gap-4 text-[11px] text-gray-500 mt-1">
                                    <span>Qty: {p.tempQuantity}</span>
                                    <span>Weight: {p.tempQtyInKg} Kg</span>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        )}
                    </div>

                    {/* QUANTITY */}
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-600 mb-1 font-semibold">
                        Quantity
                      </label>

                      <input
                        type="number"
                        onWheel={(e) => e.target.blur()}
                        value={product.quantity}
                        max={product.tempQuantity}
                        onChange={(e) => {
                          const qty = e.target.value;

                          handleProductChange(product.id, "quantity", qty);
                        }}
                        min={0}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    {/* WEIGHT */}
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-600 mb-1 font-semibold">
                        Weight
                      </label>

                      <input
                        type="number"
                        onWheel={(e) => e.target.blur()}
                        value={product.qtyInKg}
                        max={product.tempQtyInKg}
                        onChange={(e) => {
                          const qtyInKg = e.target.value;

                          handleProductChange(product.id, "qtyInKg", qtyInKg);

                          const sub = new Decimal(Number(qtyInKg || 0)).mul(
                            new Decimal(Number(product.unitPrice || 0)),
                          );

                          handleProductChange(
                            product.id,
                            "subTotal",
                            Number(sub.toFixed(4)),
                          );
                        }}
                        min={0}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    {/* UNIT PRICE */}
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-600 mb-1 font-semibold">
                        Unit Price
                      </label>

                      <input
                        type="number"
                        onWheel={(e) => e.target.blur()}
                        value={product.unitPrice}
                        onChange={(e) => {
                          const price = e.target.value;

                          handleProductChange(product.id, "unitPrice", price);

                          const sub = new Decimal(Number(price || 0)).mul(
                            new Decimal(Number(product.qtyInKg || 0)),
                          );

                          handleProductChange(
                            product.id,
                            "subTotal",
                            Number(sub.toFixed(4)),
                          );
                        }}
                        step="any"
                        min={0}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    {/* DELETE BUTTON */}
                    <div className="md:col-span-1">
                      {products.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(product.id)}
                          className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg text-sm font-bold transition"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>

                  {/* SUBTOTAL */}
                  <div className="mt-4 flex justify-end">
                    <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold text-blue-700">
                      Total: ৳ {Number(product.subTotal || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}

              {/* FOOTER */}
              <div className="border-t border-gray-200 pt-4 mt-5 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex gap-6 text-sm">
                  <span className="font-semibold text-gray-600">
                    Total Qty:
                    <strong className="ml-1 text-black">
                      {totalQty.toFixed(0)}
                    </strong>
                  </span>
                  <span className="font-semibold text-gray-600">
                    Total Weight:
                    <strong className="ml-1 text-black">
                      {totalQtyInKg.toFixed(0)}
                    </strong>
                  </span>

                  <span className="font-semibold text-gray-600">
                    Grand Total:
                    <strong className="ml-1 text-blue-700">
                      ৳ {totalAmount.toFixed(2)}
                    </strong>
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={addLoading}
                  className="bg-blue-700 hover:bg-black text-white px-8 py-3 rounded-xl text-sm font-black tracking-wider transition disabled:bg-blue-400"
                >
                  {addLoading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
                  ) : (
                    "Save & Send"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* --- Section 3: History Table (Payment Focused) --- */}
        <div className="bg-white shadow-xl border-t-4 border-gray-800 overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <h2 className="text-[10px] font-black uppercase text-gray-600 tracking-widest">
              Company Payment Tracking
            </h2>
            <input
              type="search"
              value={memoSearch}
              onChange={(e) => setMemoSearch(e.target.value)}
              placeholder="Search Memo..."
              className="text-[10px] border px-3 py-1.5 outline-none w-48 font-bold"
            />
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100 text-[10px] uppercase font-black text-gray-500 border-b">
                <th className="p-4">Date</th>
                <th className="p-4">Memo</th>
                <th className="p-4">Company</th>
                <th className="p-4">Product Info</th>
                {/* <th className="p-4 text-center">Dispatch Qty</th> */}
                <th className="p-4 text-right">Claim Amount (৳)</th>
                <th className="p-4 text-center">Payment Status</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {companyProductReturns.length > 0 ? (
                companyProductReturns.map((productReturn, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-blue-50 transition-colors cursor-pointer group"
                    onClick={() =>
                      navigate("/company-statement", { state: productReturn })
                    }
                  >
                    <td className="p-4 font-bold text-gray-400 italic font-mono">
                      {new Date(productReturn.createdAt)
                        .toLocaleDateString("en-GB", {
                          timeZone: "Asia/Dhaka",
                        })
                        .replaceAll("/", "-")}
                    </td>
                    <td className="p-4 text-gray-500 uppercase font-black">
                      {productReturn.memo}
                    </td>
                    <td className="p-4 font-black text-blue-600 group-hover:underline uppercase tracking-tighter">
                      {productReturn.supplierName}
                    </td>
                    {/* <td className="p-4 font-semibold text-gray-600 uppercase">
                      {productReturn.productName}
                    </td> */}
                    <td className="p-4">
                      <table className="w-full text-[10px] uppercase">
                        <thead>
                          <tr className="text-gray-400 border-b">
                            <th className="text-left pb-1">Product</th>
                            <th className="text-center pb-1">Qty</th>
                            <th className="text-center pb-1">Weight</th>
                            <th className="text-right pb-1">Unit</th>
                          </tr>
                        </thead>

                        <tbody>
                          {productReturn.products?.map((product, i) => (
                            <tr key={i} className="text-gray-700 font-bold">
                              <td className="py-1 pr-2">
                                {product.productName}
                              </td>

                              <td className="text-center">
                                {product.quantity}
                              </td>

                              <td className="text-center">
                                {product.qtyInKg} Kg
                              </td>

                              <td className="text-right">
                                ৳ {product.unitPrice}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                    {/* <td className="p-4 text-center font-black">
                      {`${productReturn.quantity} Pcs | ${productReturn.qtyInKg} Kg`}
                    </td> */}
                    <td className="p-4 text-right font-black text-gray-800 tracking-tighter text-sm">
                      ৳ {productReturn.totalAmount}
                    </td>
                    <td className="p-4 text-center">
                      {productReturn.due > 0 ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full">
                          <FaExclamationCircle
                            size={10}
                            className="animate-pulse"
                          />
                          <span className="text-[9px] font-black uppercase tracking-tighter italic">
                            ৳ {productReturn.due} Pending
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-full">
                          <FaCheckCircle size={10} />
                          <span className="text-[9px] font-black uppercase tracking-tighter">
                            Full Paid
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center text-gray-500 py-10 text-lg border-b border-gray-400"
                  >
                    No Return Available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination logic remains unchanged */}
        {pages > 0 && (
          <div className="flex justify-center items-center mt-4 gap-2 text-sm">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`${page === 1 ? "" : "cursor-pointer hover:bg-black hover:text-white"} px-2 py-1 border rounded disabled:opacity-50`}
            >
              Prev
            </button>
            <span>
              Page {page} of {pages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, pages))}
              disabled={page === pages}
              className={`${page === pages ? "" : "cursor-pointer hover:bg-black hover:text-white"} px-2 py-1 border rounded disabled:opacity-50`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyReturn;
