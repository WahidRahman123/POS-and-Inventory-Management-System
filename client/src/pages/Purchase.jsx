import { useEffect, useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSupplier } from "../features/supplier/supplierSlice";
// productSlice থেকে প্রয়োজনীয় অ্যাকশন ইম্পোর্ট করা হলো
import {
  searchProductsforPOS,
  setProductsBySearchToEmpty,
} from "../features/product/productSlice";

import {
  addPurchase,
  fetchPurchases,
} from "../features/purchase/purchaseSlice";
import { Link, useNavigate } from "react-router-dom";
import Decimal from "decimal.js";
import axios from "axios";

const Purchase = () => {
  const { user } = useSelector((state) => state.auth);
  const { purchases, toggle, page, pages } = useSelector(
    (state) => state.purchase,
  );
  const { loading: supplierAddLoading } = useSelector(
    (state) => state.supplier,
  );
  // প্রোডাক্ট সার্চ রেজাল্ট স্টোর থেকে আনা হলো
  const { productsBySearchforPOS } = useSelector((state) => state.product);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: "",
    // memo: "",
  });

  // এই স্টেটটি ট্র্যাক করবে বর্তমানে কোন রো (row) তে প্রোডাক্ট সার্চ করা হচ্ছে
  const [activeSearchRow, setActiveSearchRow] = useState(null);

  //* For Date
  const [dateMode, setDateMode] = useState("single");
  const [dateSearch, setDateSearch] = useState("");
  const [rangeDateSearch, setRangeDateSearch] = useState({
    dateSearchStart: "",
    dateSearchEnd: "",
  });

  //* For Supllier Addition - start
  const [supplierToAdd, setSupplierToAdd] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [aid, setAid] = useState(null);
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setSupplierToAdd((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const handleAdd = async (e) => {
    e.preventDefault();
    setAid("Running");
    try {
      await dispatch(addSupplier(supplierToAdd)).unwrap();
      setSupplierToAdd({
        name: "",
        phone: "",
        email: "",
        address: "",
      });
    } catch {
      console.log("Add failed!");
    } finally {
      setAid(null);
    }
  };
  //* For Supllier Addition - end

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

  //* Add Product Section Starts
  const [products, setProducts] = useState([
    {
      id: 1,
      productName: "",
      quantity: "",
      unitPrice: "",
      subTotal: "",
    },
  ]);

  // প্রোডাক্ট সার্চ করার ফাংশন
  const handleProductSearchChange = (id, value) => {
    handleProductChange(id, "productName", value);
    if (value) {
      setActiveSearchRow(id);
      dispatch(searchProductsforPOS(value));
    } else {
      setActiveSearchRow(null);
      dispatch(setProductsBySearchToEmpty());
    }
  };

  // সার্চ রেজাল্ট থেকে প্রোডাক্ট সিলেক্ট করার ফাংশন
  const handleSelectProductFromSearch = (id, productName) => {
    handleProductChange(id, "productName", productName);
    dispatch(setProductsBySearchToEmpty());
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
        productName: "",
        quantity: "",
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
    (acc, p) => acc.plus(new Decimal(Number(p.quantity || 0))),
    new Decimal(0),
  );

  const totalAmount = products.reduce(
    (acc, p) => acc.plus(new Decimal(Number(p.subTotal || 0))),
    new Decimal(0),
  );
  const [paid, setPaid] = useState("");
  const due = totalAmount.minus(new Decimal(Number(paid || 0)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (supplier.supplierId === "") return alert("Select a supplier!");

    const newProducts = products.map(({ id, ...rest }) => rest);

    const newpPaid = new Decimal(Number(paid)).greaterThan(totalAmount)
      ? totalAmount
      : new Decimal(Number(paid));

    const purchaseData = {
      companyMemo: formData.memo,
      createdAt: formData.date,
      issuedAt: new Date(),
      supplierId: supplier.supplierId,
      supplierName: supplier.supplierName,
      address: supplier.address,
      supplierEmail: supplier.supplierEmail,
      supplierPhone: supplier.supplierPhone,
      userId: user._id,
      products: newProducts,
      totalAmount: Number(totalAmount.toFixed(4)),
      paid: Number(newpPaid.toFixed(4)),
      due: due.lessThan(new Decimal(0)) ? 0 : Number(due.toFixed(4)),

      unchangedPaid: Number(paid),
      unchangedDue: Number(due.toFixed(4)),
    };

    try {
      setAddLoading(true);
      await dispatch(addPurchase(purchaseData)).unwrap();
      setFormData({
        date: "",
        memo: ""
      });
      setProducts([
        {
          id: 1,
          productName: "",
          quantity: "",
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
    } finally {
      setAddLoading(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(page);
  const [sortOrder, setSortOrder] = useState(-1);
  const [filterToggler, setFilterToggler] = useState(true);
  const [nameSearch, setNameSearch] = useState("");

  useEffect(() => {
    if (user) {
      const commonParams = {
        nameSearch,
        page: currentPage,
        order: sortOrder,
      };
      if (dateMode === "single") {
        dispatch(fetchPurchases({ ...commonParams, dateMode, dateSearch }));
      } else {
        dispatch(
          fetchPurchases({
            ...commonParams,
            dateMode,
            dateSearchStart: rangeDateSearch.dateSearchStart,
            dateSearchEnd: rangeDateSearch.dateSearchEnd,
          }),
        );
      }
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
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Purchase Entry
      </h1>

      {/* Supplier Entry Form */}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          onSubmit={handleAdd}
        >
          <input
            type="text"
            placeholder="Supplier Name"
            name="name"
            value={supplierToAdd.name}
            onChange={handleOnChange}
            className="border border-gray-300 rounded-md px-3 py-2"
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            name="phone"
            value={supplierToAdd.phone}
            minLength={11}
            maxLength={14}
            onChange={handleOnChange}
            className="border border-gray-300 rounded-md px-3 py-2"
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={supplierToAdd.email}
            onChange={handleOnChange}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="text"
            placeholder="Address"
            name="address"
            value={supplierToAdd.address}
            onChange={handleOnChange}
            className="border border-gray-300 rounded-md px-3 py-2"
            required
          />
          <div className="sm:col-span-2 flex justify-end">
            <button
              disabled={supplierAddLoading && aid}
              className={`text-white px-6 py-2 rounded-md ${supplierAddLoading && aid ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"}`}
            >
              {supplierAddLoading && aid ? "Adding..." : "Add Supplier"}
            </button>
          </div>
        </form>
      </div>

      {/* Main Purchase Add Form */}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-x-6 mb-4">
            <div className="relative">
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
              <label className="block text-sm font-medium mb-1">Address</label>
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
                className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 items-end"
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
                    productsBySearchforPOS.length > 0 && (
                      <div className="absolute z-50 w-full bg-white shadow-xl border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto">
                        {productsBySearchforPOS.map((p, i) => (
                          <div
                            key={i}
                            onClick={() =>
                              handleSelectProductFromSearch(product.id, p.name)
                            }
                            className="px-3 py-2 border-b border-gray-100 cursor-pointer hover:bg-blue-50 text-gray-800 text-sm"
                          >
                            {p.name}
                          </div>
                        ))}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paid
              </label>
              <input
                type="number"
                value={paid}
                onChange={(e) => setPaid(e.target.value)}
                min={0}
                placeholder="Enter Amount"
                className="w-full px-4 py-2 border border-gray-400 rounded-md font-semibold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due
              </label>
              <input
                type="number"
                value={due.toFixed(2)}
                disabled
                className="w-full px-4 py-2 border border-gray-400 rounded-md bg-gray-300 font-semibold"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium disabled:bg-blue-500"
            disabled={addLoading}
          >
            {addLoading ? "Adding..." : "Add Purchase"}
          </button>
        </form>
      </div>

      {/* Purchase Report Table - design stays exactly the same as provided */}
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg sm:text-xl font-semibold">
              Purchase Report
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
                value={nameSearch}
                placeholder="Supplier Name"
                onChange={(e) => setNameSearch(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-36 sm:w-40"
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
                    className="w-4 h-4"
                  />{" "}
                  Single Date
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="dateMode"
                    value="range"
                    checked={dateMode === "range"}
                    onChange={(e) => setDateMode(e.target.value)}
                    className="w-4 h-4"
                  />{" "}
                  Date Range
                </label>
              </div>
            </div>
            {dateMode === "single" ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:ml-auto w-full">
                <label className="text-xs sm:text-sm text-gray-600">
                  Search by Date:
                </label>
                <input
                  type="date"
                  value={dateSearch}
                  onChange={(e) => setDateSearch(e.target.value)}
                  className="w-full sm:w-40 border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                />
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:ml-auto w-full">
                  <label className="text-xs sm:text-sm text-gray-600">
                    Start Date:
                  </label>
                  <input
                    type="date"
                    max={rangeDateSearch.dateSearchEnd}
                    value={rangeDateSearch.dateSearchStart}
                    onChange={(e) =>
                      setRangeDateSearch((p) => ({
                        ...p,
                        dateSearchStart: e.target.value,
                      }))
                    }
                    className="w-full sm:w-40 border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:ml-auto w-full">
                  <label className="text-xs sm:text-sm text-gray-600">
                    End Date:
                  </label>
                  <input
                    type="date"
                    min={rangeDateSearch.dateSearchStart}
                    value={rangeDateSearch.dateSearchEnd}
                    onChange={(e) =>
                      setRangeDateSearch((p) => ({
                        ...p,
                        dateSearchEnd: e.target.value,
                      }))
                    }
                    className="w-full sm:w-40 border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                  />
                </div>
              </>
            )}
            <div className="text-right">
              <button
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 cursor-pointer"
                onClick={() => setFilterToggler(!filterToggler)}
              >
                Filter
              </button>
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 cursor-pointer ml-2"
                onClick={() => {
                  setNameSearch("");
                  setDateSearch("");
                  setRangeDateSearch({
                    dateSearchStart: "",
                    dateSearchEnd: "",
                  });
                  setFilterToggler(!filterToggler);
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th
                  className="border border-gray-400 px-4 py-3 text-left font-semibold"
                  rowSpan={2}
                >
                  Date
                </th>
                <th
                  className="border border-gray-400 px-4 py-3 text-left font-semibold"
                  rowSpan={2}
                >
                  Company Memo
                </th>
                <th
                  className="border border-gray-400 px-4 py-3 text-left font-semibold"
                  rowSpan={2}
                >
                  Supplier
                </th>
                <th
                  className="border border-gray-400 px-4 py-3 text-center font-semibold"
                  colSpan={3}
                >
                  Products
                </th>
                <th
                  className="border border-gray-400 px-4 py-3 text-left font-semibold"
                  rowSpan={2}
                >
                  Total
                </th>
                <th
                  className="border border-gray-400 px-4 py-3 text-left font-semibold"
                  rowSpan={2}
                >
                  Paid
                </th>
                <th
                  className="border border-gray-400 px-4 py-3 text-left font-semibold"
                  rowSpan={2}
                >
                  Due
                </th>
                <th
                  className="border border-gray-400 px-4 py-3 text-left font-semibold"
                  rowSpan={2}
                >
                  Action
                </th>
              </tr>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 px-4 py-3 text-left font-semibold">
                  Product Names
                </th>
                <th className="border border-gray-400 px-4 py-3 text-left font-semibold">
                  Qty
                </th>
                <th className="border border-gray-400 px-4 py-3 text-left font-semibold">
                  Unit Price
                </th>
              </tr>
            </thead>
            <tbody>
              {purchases.length > 0 ? (
                purchases.map((purchase, index) => {
                  const rowspan = purchase.products.length;
                  const isEven = index % 2 === 0;
                  return purchase.products.map((product, pIndex) => (
                    <tr
                      onClick={(e) => {
                        if (e.target.tagName !== "TD") return;
                        navigate("/purchaser-statement", { state: purchase });
                      }}
                      key={`${index}-${pIndex}`}
                      className={
                        isEven
                          ? "bg-white cursor-pointer"
                          : "bg-gray-50 cursor-pointer"
                      }
                    >
                      {pIndex === 0 && (
                        <>
                          <td
                            rowSpan={rowspan}
                            className="border border-gray-400 px-2 py-1 sm:px-4 sm:py-2"
                          >
                            {new Date(purchase.createdAt)
                              .toLocaleDateString("en-GB", {
                                timeZone: "Asia/Dhaka",
                              })
                              .replaceAll("/", "-")}
                          </td>
                          <td
                            rowSpan={rowspan}
                            className="border border-gray-400 px-2 py-1 sm:px-4 sm:py-2"
                          >
                            {purchase.companyMemo || "--" }
                          </td>
                          <td
                            rowSpan={rowspan}
                            className="border border-gray-400 px-2 py-1 sm:px-4 sm:py-2"
                          >
                            {purchase.supplierName}
                          </td>
                        </>
                      )}
                      <td
                        className={`border border-gray-400 px-2 py-1 sm:px-4 sm:py-2 ${pIndex !== purchase.products.length - 1 ? "border-b-gray-200" : ""}`}
                      >
                        {product.productName}
                      </td>
                      <td
                        className={`border border-gray-400 px-2 py-1 sm:px-4 sm:py-2 ${pIndex !== purchase.products.length - 1 ? "border-b-gray-200" : ""}`}
                      >
                        {product.quantity}
                      </td>
                      <td
                        className={`border border-gray-400 px-2 py-1 sm:px-4 sm:py-2 ${pIndex !== purchase.products.length - 1 ? "border-b-gray-200" : ""}`}
                      >
                        {product.unitPrice}
                      </td>
                      {pIndex === 0 && (
                        <>
                          <td
                            rowSpan={rowspan}
                            className="border border-gray-400 px-2 py-1 sm:px-4 sm:py-2"
                          >
                            {purchase.totalAmount}
                          </td>
                          <td
                            rowSpan={rowspan}
                            className="border border-gray-400 px-2 py-1 sm:px-4 sm:py-2"
                          >
                            {purchase.paid}
                          </td>
                          <td
                            rowSpan={rowspan}
                            className={`border border-gray-400 px-2 py-1 sm:px-4 sm:py-2 ${purchase?.due > 0 ? "text-red-500 font-bold" : ""}`}
                          >
                            {purchase.due}
                          </td>
                          <td
                            rowSpan={rowspan}
                            className="border border-gray-400 px-2 py-1 sm:px-4 sm:py-2"
                          >
                            <div className="flex flex-wrap gap-1">
                              <Link
                                onClick={(e) => e.stopPropagation()}
                                to={
                                  purchase.due > 0
                                    ? `/purchase-report/${purchase._id}/edit-due`
                                    : "#"
                                }
                                className={`text-xs text-white px-2 py-1 rounded ${purchase.due > 0 ? "bg-green-600 hover:bg-green-700 cursor-pointer" : "bg-green-50 cursor-not-allowed"}`}
                              >
                                Add Payment
                              </Link>
                              <Link
                                to="/invoice-purchase"
                                state={purchase}
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
                    className="text-center text-gray-500 py-10 text-lg border border-gray-400"
                  >
                    No Purchase Available.
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

export default Purchase;
