import React, { useRef } from "react";
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
import { useEffect } from "react";
import {
  addCompanySalesReturn,
  fetchCompanySalesReturns,
  fetchSalesReturnByProductName,
  fetchSalesReturnReportData,
  setSalesReturnSearchByProductNameToEmpty,
} from "../features/CompanySalesReturn/companySalesReturnSlice";
import {
  searchProductsforPOS,
  setProductsBySearchToEmpty,
} from "../features/product/productSlice";
import dayjs from "../utils/date.js";

const CompanySalesReturn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { productsBySearchforPOS } = useSelector((state) => state.product);
  const {
    companySalesReturns,
    salesReturnReportData,
    companySalesReturnSearchedByProductName,
    addLoading,
    toggle,
    page,
    pages,
  } = useSelector((state) => state.companySalesReturn);
  const [currentPage, setCurrentPage] = useState(page);
  const [memoSearch, setMemoSearch] = useState("");
  //* Supplier Search Handling Section
  const [name, setName] = useState("");
  const [supplier, setSupplier] = useState({
    supplierId: "",
    supplierName: "",
    address: "",
    supplierEmail: "",
    supplierPhone: "",
  });
  // console.log(supplier)
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

  const [formData, setFormData] = useState({
    date: "",
  });

  const handleOnChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //* Company Name Handle - starts
  // const [supplier, setSupplier] = useState("");
  // const loadOptions = async (inputValue, callback) => {
  //   if (!inputValue) return callback([]);
  //   try {
  //     const { data } = await axios.get(
  //       `${import.meta.env.VITE_BACKEND_URI}/api/supplier/purchase`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  //         },
  //         params: {
  //           q: inputValue,
  //         },
  //       },
  //     );
  //     if (data && Array.isArray(data)) {
  //       const options = data.map((item) => ({
  //         label: item.name,
  //         value: item,
  //       }));
  //       callback(options);
  //     }
  //   } catch (error) {
  //     callback([]);
  //   }
  // };
  //* Company Name Handle - ends

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!supplier) return alert("Select a Company!");
    if (supplier.supplierId === "") return alert("Select a Company!");

    const newProducts = products.map(({ id, tempQuantity, tempQtyInKg, ...rest }) => rest);

    const returnData = {
      createdAt: formData.date,
      issuedAt: new Date(),
      // supplierId: supplier._id,
      // supplierName: supplier.name,
      // address: supplier.address,
      // supplierEmail: supplier.email,
      // supplierPhone: supplier.phone,
      supplierId: supplier.supplierId,
      supplierName: supplier.supplierName,
      address: supplier.address,
      supplierEmail: supplier.supplierEmail,
      supplierPhone: supplier.supplierPhone,
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

      totalAmountQty: Number(totalAmountQty),
      paidQty: 0,
      dueQty: Number(totalAmountQty),

      unchangedPaid: 0,
      unchangedDue: Number(totalAmount.toFixed(4)),
    };

    try {
      await dispatch(addCompanySalesReturn(returnData)).unwrap();
      setFormData({
        date: "",
        // productName: "",
        // quantity: "",
        // qtyInKg: "",
        // unitPrice: "",
        // subTotal: "",
      });
      // setSupplier("");
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
      setPaid("");
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
      dispatch(fetchSalesReturnByProductName({ productName: value }));
    } else {
      setActiveSearchRow(null);
      dispatch(setSalesReturnSearchByProductNameToEmpty());
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
            quantity: productData.tempReturnQuantity,
            qtyInKg: productData.tempReturnQtyInKg,

            tempQuantity: productData.tempReturnQuantity,
            tempQtyInKg: productData.tempReturnQtyInKg,
          }
          : product,
      ),
    );

    dispatch(setSalesReturnSearchByProductNameToEmpty());
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

  //* Add Product Section Ends

  const totalQty = products.reduce(
    (acc, p) => acc.plus(new Decimal(Number(p.quantity || 0))),
    new Decimal(0),
  );

  const totalAmount = products.reduce(
    (acc, p) => acc.plus(new Decimal(Number(p.subTotal || 0))),
    new Decimal(0),
  );

  const totalAmountQty = products.reduce(
    (acc, p) => acc.plus(new Decimal(Number(p.quantity || 0))),
    new Decimal(0),
  );

  useEffect(() => {
    if (user) {
      dispatch(
        fetchCompanySalesReturns({
          memoSearch,
          page: currentPage,
        }),
      );
    }
  }, [dispatch, user, toggle, currentPage, memoSearch]);

  useEffect(() => {
    if (user) {
      dispatch(
        fetchSalesReturnReportData({
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
    <>
      <title>{`Sales Return To Company | ${import.meta.env.VITE_COMPANY_NAME}`}</title>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* --- Section 1: Financial Summary (Updated to reflect Cash flow) --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* === SALES RETURN STOCK CARD (FIXED) === */}
            <div
              className="bg-white p-5 shadow-sm border-b-4 border-blue-600 rounded-sm cursor-pointer hover:shadow-md transition"
              onClick={() => navigate("/sales-return")}
            >
              <div className="flex items-center gap-3 mb-2 text-blue-600">
                <FaBox size={20} />
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                  SALES RETURN STOCK
                </p>
              </div>
              <p className="text-3xl font-black text-gray-800">
                {salesReturnReportData?.availableStock || 0}
                <span className="text-base font-normal text-gray-500 ml-1">Pcs</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">Available in Warehouse</p>
            </div>

            {/* <div className="bg-white p-5 shadow-sm border-b-4 border-orange-500 rounded-sm">
            <div className="flex items-center gap-3 mb-2 text-orange-500">
              <FaWeightHanging size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                Total Weight
              </p>
            </div>
            <p className="text-2xl font-black text-gray-800">
              {salesReturnReportData ? salesReturnReportData.totalWeight : "--"}{" "}
              <span className="text-xs">Kg</span>
            </p>
          </div> */}

            {/* <div className="bg-gray-900 p-5 shadow-sm border-b-4 border-green-600 rounded-sm">
            <div className="flex items-center gap-3 mb-2 text-green-500">
              <FaMoneyBillWave size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Total Receivable
              </p>
            </div>
            <p className="text-2xl font-black text-white">
              ৳{" "}
              {salesReturnReportData ? salesReturnReportData.totalAmount : "--"}
            </p>
          </div> */}

            <div className="bg-white p-5 shadow-sm border-b-4 border-red-600 rounded-sm">
              <div className="flex items-center gap-3 mb-2 text-red-500">
                <FaTruck size={20} />
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Pending From Co.
                </p>
              </div>
              <p className="text-2xl font-black text-gray-800">
                {salesReturnReportData
                  ? salesReturnReportData.totalDue + " Pcs"
                  : "--"}
              </p>
            </div>
          </div>

          {/* --- Section 2: Horizontal Entry Form --- */}
          <div className="bg-white p-6 rounded-sm shadow-md mb-8 border-t-4 border-blue-600">
            <h2 className="text-xs font-black mb-4 flex items-center gap-2 text-gray-700 uppercase">
              <FaPlus className="text-blue-600" /> Dispatch New Return to Company
            </h2>

            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-x-6 mb-4">
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">
                      Company Name
                    </label>
                    <div className="flex">
                      <input
                        type="search"
                        value={name}
                        onChange={handleSupplierNameOnChange}
                        ref={supplierNameRef}
                        placeholder="Company Name"
                        className="block w-[85%] px-3 py-1.5 border border-gray-300 rounded-sm text-sm disabled:bg-gray-300"
                        disabled={disable}
                      />
                      <button
                        type="button"
                        disabled={!disable}
                        className="bg-red-500 hover:bg-red-600 cursor-pointer ml-2 px-2 py-1 font-bold text-white rounded disabled:bg-red-300 disabled:cursor-not-allowed"
                        onClick={() => {
                          setDisable(false);
                          setName("");
                          setData(null);
                          setSupplier({
                            supplierId: "",
                            supplierName: "",
                            address: "",
                            supplierEmail: "",
                            supplierPhone: "",
                          });
                        }}
                      >
                        Change
                      </button>
                    </div>
                    {data && (
                      <div className="absolute z-10 w-[85%] bg-white shadow-md border border-gray-300 max-h-50 overflow-y-scroll">
                        <table className="w-full">
                          <tbody>
                            {data.map((d, i) => (
                              <tr
                                key={i}
                                className="p-2 cursor-pointer border-b border-gray-300 hover:bg-gray-100 text-gray-800 text-sm"
                                onClick={() => handleSupplierOnClick(d)}
                              >
                                <td className="p-2">{d.name}</td>
                                <td className="text-center">{d.address}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={supplier.address}
                      placeholder="Address"
                      disabled
                      className="block w-full px-3 py-1.5 border border-gray-400 rounded-sm text-sm bg-gray-200 text-gray-700 select-none"
                    />
                  </div>
                </div>

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
                      className="w-full px-4 py-2 border border-gray-400 rounded-md"
                      required
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium mb-2 cursor-pointer"
                >
                  + Add Product
                </button>

                {/* Products Section */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Products
                  </h3>
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3 items-end"
                    >
                      <div className="md:col-span-2 relative">
                        <label className="block text-xs text-gray-600 mb-1">
                          Product Name
                        </label>
                        <input
                          type="text"
                          value={product.productName}
                          onChange={(e) =>
                            handleProductSearchChange(product.id, e.target.value)
                          }
                          placeholder="Product Name"
                          className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm"
                          required
                        />
                        {/* প্রোডাক্ট সার্চ রেজাল্ট ড্রপডাউন */}
                        {activeSearchRow === product.id &&
                          companySalesReturnSearchedByProductName.length > 0 && (
                            <div className="absolute z-50 w-full bg-white shadow-xl border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto">
                              {/* {productsBySearchforPOS.map((p, i) => (
                              <div
                                key={i}
                                onClick={() =>
                                  handleSelectProductFromSearch(
                                    product.id,
                                    p.name,
                                  )
                                }
                                className="px-3 py-2 border-b border-gray-100 cursor-pointer hover:bg-blue-50 text-gray-800 text-sm"
                              >
                                {p.name}
                              </div>
                            ))} */}

                              {companySalesReturnSearchedByProductName.map(
                                (p, i) => (
                                  <div
                                    key={i}
                                    onClick={() =>
                                      handleSelectProductFromSearch(product.id, p)
                                    }
                                    className="px-3 py-2 border-b border-gray-100 cursor-pointer hover:bg-blue-50 text-gray-800 text-sm"
                                  >
                                    <div className="font-semibold">
                                      {p.productName}
                                    </div>

                                    <div className="flex gap-4 text-[11px] text-gray-500 mt-1">
                                      <span>Qty: {p.tempReturnQuantity}</span>
                                      <span>Weight: {p.tempReturnQtyInKg} Kg</span>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          )}
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
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
                            const sub = new Decimal(Number(qty || 0)).mul(
                              new Decimal(Number(product.unitPrice || 0)),
                            );
                            handleProductChange(
                              product.id,
                              "subTotal",
                              Number(sub.toFixed(4)),
                            );
                          }}
                          placeholder="Qty"
                          min={0}
                          className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
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
                          }}
                          placeholder="Qty"
                          min={0}
                          className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm"
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
                            onWheel={(e) => e.target.blur()}
                            value={product.unitPrice}
                            onChange={(e) => {
                              const price = e.target.value;
                              handleProductChange(product.id, "unitPrice", price);
                              const sub = new Decimal(Number(price || 0)).mul(
                                new Decimal(Number(product.quantity || 0)),
                              );
                              handleProductChange(
                                product.id,
                                "subTotal",
                                Number(sub.toFixed(4)),
                              );
                            }}
                            placeholder="Unit Price"
                            step="any"
                            min={0}
                            className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm"
                            required
                          />
                        </div>
                        {products.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(product.id)}
                            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-gray-400 pt-3 mt-3">
                    <div className="flex justify-end gap-6 text-sm">
                      <span className="text-gray-600">
                        Total Qty: <strong>{totalQty.toFixed(0)}</strong>
                      </span>
                      <span className="text-gray-800 font-semibold">
                        Products Total: ৳ {totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Amount
                    </label>
                    <input
                      type="number"
                      value={totalAmount.toFixed(2)}
                      disabled
                      className="w-full px-4 py-2 border border-gray-400 rounded-md bg-gray-100 font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium disabled:bg-blue-500"
                  disabled={addLoading}
                >
                  {addLoading ? "Saving..." : "Save & Send"}
                </button>
              </form>
            </div>
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
                  <th className="p-4 text-right">Claim Product (Pcs)</th>
                  <th className="p-4 text-center">Product Status</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {companySalesReturns.length > 0 ? (
                  companySalesReturns.map((salesReturn, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-blue-50 transition-colors cursor-pointer group"
                      onClick={() =>
                        navigate("/company-sales-return-statement", {
                          state: salesReturn,
                        })
                      }
                    >
                      <td className="p-4 font-bold text-gray-400 italic font-mono">
                        {
                          dayjs(salesReturn.createdAt)
                            .tz("Asia/Dhaka")
                            .format("DD-MM-YYYY")
                        }
                      </td>
                      <td className="p-4 text-gray-500 uppercase font-black">
                        {salesReturn.memo}
                      </td>
                      <td className="p-4 font-black text-blue-600 group-hover:underline uppercase tracking-tighter">
                        {salesReturn.supplierName}
                      </td>
                      {/* <td className="p-4 font-semibold text-gray-600 uppercase">
                      {salesReturn.productName}
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
                            {salesReturn.products?.map((product, i) => (
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
                      {`${salesReturn.quantity} Pcs | ${salesReturn.qtyInKg} Kg`}
                    </td> */}
                      <td className="p-4 text-center font-black text-gray-800 tracking-tighter text-sm">
                        {salesReturn.totalAmountQty}
                      </td>
                      <td className="p-4 text-center">
                        {salesReturn.dueQty > 0 ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full">
                            <FaExclamationCircle
                              size={10}
                              className="animate-pulse"
                            />
                            <span className="text-[9px] font-black uppercase tracking-tighter italic">
                              {salesReturn.dueQty} Pcs Pending
                            </span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-full">
                            <FaCheckCircle size={10} />
                            <span className="text-[9px] font-black uppercase tracking-tighter">
                              Full Received
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
    </>
  );
};

export default CompanySalesReturn;
