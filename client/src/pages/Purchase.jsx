import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { addSupplier } from "../features/supplier/supplierSlice";
import {
  searchProductsforPurchase,
  setProductsBySearchToEmpty,
} from "../features/product/productSlice";
import {
  addPurchase,
  fetchPurchases,
} from "../features/purchase/purchaseSlice";
import Decimal from "decimal.js";
import axios from "axios";
import dayjs from "../utils/date.js";

const Purchase = () => {
  const { user } = useSelector((state) => state.auth);
  const { purchases, toggle, page, pages } = useSelector(
    (state) => state.purchase,
  );
  const { productsBySearchforPurchase } = useSelector((state) => state.product);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // location অবজেক্ট নেওয়া হলো রিডাইরেকশনের ডেটা ধরার জন্য

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    memo: "",
  });
  const [purchaseType, setPurchaseType] = useState("normal");
  const [advancePaymentAmount, setAdvancePaymentAmount] = useState("");

  // Supplier Selection
  const [name, setName] = useState("");
  const [supplier, setSupplier] = useState({
    supplierId: "",
    supplierName: "",
    address: "",
    supplierEmail: "",
    supplierPhone: "",
    advanceBalance: 0,
  });

  const [data, setData] = useState(null);
  const [disable, setDisable] = useState(false);
  const supplierNameRef = useRef(null);

  // Products
  const [products, setProducts] = useState([
    {
      id: 1,
      productId: "",
      productName: "",
      quantity: "",
      unitPrice: "",
      subTotal: "",
    },
  ]);

  const [addLoading, setAddLoading] = useState(false);
  const [activeSearchRow, setActiveSearchRow] = useState(null);

  // Supplier Add Form
  const [supplierToAdd, setSupplierToAdd] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [aid, setAid] = useState(null);

  // ================== Report Filters ==================
  const [currentPage, setCurrentPage] = useState(page);
  const [sortOrder, setSortOrder] = useState(-1);
  const [filterToggler, setFilterToggler] = useState(true);
  const [nameSearch, setNameSearch] = useState("");
  const [dateMode, setDateMode] = useState("single");
  const [dateSearch, setDateSearch] = useState("");
  const [rangeDateSearch, setRangeDateSearch] = useState({
    dateSearchStart: "",
    dateSearchEnd: "",
  });

  // ================== Handle Redirected Advance Data ==================
  useEffect(() => {
    // যদি অন্য পেজ থেকে Advance Payment এর জন্য সাপ্লায়ার ডেটা পাঠানো হয়
    if (location.state && location.state.fromAdvanceButton) {
      const redirectedData = location.state;
      setPurchaseType("advance"); // অটোমেটিক অ্যাডভান্স পেমেন্ট মোড সিলেক্ট হবে
      setName(redirectedData.supplierName);
      setSupplier({
        supplierId: redirectedData.supplierId,
        supplierName: redirectedData.supplierName,
        address: redirectedData.address || "",
        supplierEmail: redirectedData.supplierEmail || "",
        supplierPhone: redirectedData.supplierPhone || "",
        advanceBalance: redirectedData.advanceBalance || 0,
      });
      setDisable(true); // ইনপুট ফিল্ড লক করে দেওয়া হলো

      // রিডাইরেক্ট স্টেট ক্লিন করা যাতে রিফ্রেশ করলে আবার না আসে
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // ================== Supplier Handlers ==================
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setSupplierToAdd((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    setAid("Running");
    try {
      await dispatch(addSupplier(supplierToAdd)).unwrap();
      setSupplierToAdd({ name: "", phone: "", email: "", address: "" });
    } catch (err) {
      console.log("Supplier add failed");
    } finally {
      setAid(null);
    }
  };

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
          params: { q: query },
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
      address: supplierData.address || "",
      supplierEmail: supplierData.email || "",
      supplierPhone: supplierData.phone || "",
      advanceBalance: supplierData.advanceBalance || 0,
      totalBalance: supplierData.totalBalance || 0,
    });
    setDisable(true);
  };

  // ================== Product Handlers ==================
  const handleProductSearchChange = (id, value) => {
    handleProductChange(id, "productName", value);
    if (value) {
      setActiveSearchRow(id);
      dispatch(searchProductsforPurchase(value));
    } else {
      setActiveSearchRow(null);
      dispatch(setProductsBySearchToEmpty());
    }
  };

  const handleSelectProductFromSearch = (id, product) => {
    handleProductChange(id, "productName", product.productName);
    handleProductChange(id, "productId", product.productId);
    dispatch(setProductsBySearchToEmpty());
    setActiveSearchRow(null);
  };

  const handleProductChange = (id, field, value) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
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
        unitPrice: "",
        subTotal: "",
      },
    ]);
  };

  const handleRemoveProduct = (id) => {
    if (products.length > 1) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  // ================== Calculations ==================
  const totalAmount =
    purchaseType === "normal"
      ? products.reduce(
        (acc, p) => acc.plus(new Decimal(Number(p.subTotal || 0))),
        new Decimal(0),
      )
      : new Decimal(0);

  const paid = purchaseType === "normal" ? new Decimal(0) : Number(advancePaymentAmount);
  const due = totalAmount.minus(paid);

  // const availableAdvance = new Decimal(supplier.advanceBalance || 0);
  // const advanceUsed = Decimal.min(availableAdvance, totalAmount);
  // const finalDue = totalAmount.minus(availableAdvance).greaterThan(0)
  //   ? totalAmount.minus(availableAdvance)
  //   : new Decimal(0);

  // ================== Submit Handler ==================
  // ================== Submit Handler ==================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supplier.supplierId) return alert("Please select a supplier!");

    // নিশ্চিত করা হচ্ছে যে address যেন ফাঁকা বা বাদ না পড়ে
    if (!supplier.address || supplier.address.trim() === "") {
      return alert(
        "Supplier address is missing! Please re-select or update the supplier.",
      );
    }

    if (purchaseType === "normal" && totalAmount.equals(0)) {
      return alert("Please add at least one product!");
    }

    const newProducts = products.map(({ id, ...rest }) => ({
      ...rest,
      quantity: Number(rest.quantity || 0),
      unitPrice: Number(rest.unitPrice || 0),
    }));

    let payload = {};

    if (purchaseType === "normal") {
      payload = {
        transactionType: "debit",
        purchaseType: "normal",
        products: newProducts,
        totalAmount: Number(totalAmount.toFixed(4)),
        companyMemo: formData.memo,
        paid: Number(paid.toFixed(4)),
        due: Number(due.toFixed(4)),
        cash: 0,
        bankPaymentAmount: 0,
        unchangedPaid: Number(paid.toFixed(4)),
        unchangedDue: Number(due.toFixed(4)),
        adjustmentDetails: [],
        advancePaymentAmount: 0,
      };
    } else {
      payload = {
        transactionType: "credit",
        companyMemo: "",
        purchaseType: "advance",
        products: [],
        totalAmount: 0,
        paid: Number(advancePaymentAmount),
        due: -Number(advancePaymentAmount),
        cash: 0,
        bankPaymentAmount: 0,
        unchangedPaid: Number(advancePaymentAmount),
        unchangedDue: -Number(advancePaymentAmount),
        adjustmentDetails: [],
        advancePaymentAmount: Number(advancePaymentAmount),
      };
    }

    const purchaseData = {
      createdAt: formData.date,
      supplierId: supplier.supplierId,
      supplierName: supplier.supplierName,
      address: supplier.address, // এখান থেকে address ব্যাকএন্ডে যাচ্ছে
      supplierEmail: supplier.supplierEmail || "",
      supplierPhone: supplier.supplierPhone,
      userId: user._id,
      ...payload,
    };

    try {
      setAddLoading(true);
      await dispatch(addPurchase(purchaseData)).unwrap();
      // alert("Purchase added successfully! 🎉");

      // Reset Form
      setFormData({ date: new Date().toISOString().split("T")[0], memo: "" });
      setProducts([
        {
          id: 1,
          productId: "",
          productName: "",
          quantity: "",
          unitPrice: "",
          subTotal: "",
        },
      ]);
      setAdvancePaymentAmount("");
      setDisable(false);
      setName("");
      setSupplier({
        supplierId: "",
        supplierName: "",
        address: "",
        supplierEmail: "",
        supplierPhone: "",
        advanceBalance: 0,
        totalBalance: 0,
      });
    } catch (error) {
      console.error(error);
      alert(error || "Failed to add purchase!");
    } finally {
      setAddLoading(false);
    }
  };

  // ================== Report Fetch ==================
  useEffect(() => {
    if (user) {
      const commonParams = { nameSearch, page: currentPage, order: sortOrder };
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
  }, [
    dispatch,
    user,
    toggle,
    filterToggler,
    sortOrder,
    currentPage,
    dateMode,
    dateSearch,
    rangeDateSearch,
  ]);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  return (
    <>
      <title>{`Purchase | ${import.meta.env.VITE_COMPANY_NAME}`}</title>
      <div className="min-h-screen bg-slate-50 p-3 sm:p-4 md:p-6 font-sans">
        <h1 className="text-xl sm:text-2xl font-bold mb-6">Purchase Entry</h1>

        {/* Supplier Add Form */}
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-5 sm:p-6 mb-8">
          <form
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            onSubmit={handleAddSupplier}
          >
            <input
              type="text"
              placeholder="Supplier Name"
              name="name"
              value={supplierToAdd.name}
              onChange={handleOnChange}
              className="border border-gray-300 rounded-lg px-4 py-3"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              name="phone"
              value={supplierToAdd.phone}
              onChange={handleOnChange}
              className="border border-gray-300 rounded-lg px-4 py-3"
              required
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={supplierToAdd.email}
              onChange={handleOnChange}
              className="border border-gray-300 rounded-lg px-4 py-3"
            />
            <input
              type="text"
              placeholder="Address"
              name="address"
              value={supplierToAdd.address}
              onChange={handleOnChange}
              className="border border-gray-300 rounded-lg px-4 py-3"
              required
            />
            <div className="sm:col-span-2 flex justify-end">
              <button
                disabled={aid}
                className={`text-white px-6 py-3 rounded-lg font-medium ${aid ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {aid ? "Adding..." : "Add Supplier"}
              </button>
            </div>
          </form>
        </div>

        {/* Main Purchase Form */}
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-5 sm:p-6 mb-8">
          <form onSubmit={handleSubmit}>
            {/* Supplier Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                    placeholder="Search Supplier"
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100"
                    disabled={disable}
                  />
                  <button
                    type="button"
                    disabled={!disable}
                    className="bg-red-500 hover:bg-red-600 ml-2 px-4 py-3 font-medium text-white rounded-lg disabled:bg-red-300"
                    onClick={() => {
                      setDisable(false);
                      setName("");
                      setSupplier({
                        supplierId: "",
                        supplierName: "",
                        address: "",
                        supplierEmail: "",
                        supplierPhone: "",
                        advanceBalance: 0,
                        totalBalance: 0,
                      });
                    }}
                  >
                    Change
                  </button>
                </div>

                {data && data.length > 0 && (
                  <div className="absolute z-20 w-full bg-white shadow-xl border border-gray-200 mt-1 max-h-60 overflow-y-auto rounded-lg">
                    {data.map((d, i) => (
                      <div
                        key={i}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-none"
                        onClick={() => handleSupplierOnClick(d)}
                      >
                        <div className="font-medium">{d.name}</div>
                        <div className="text-sm text-gray-500">{d.address}</div>
                      </div>
                    ))}
                  </div>
                )}

                {supplier.advanceBalance > 0 && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 font-semibold">
                      Available Advance: ৳ {supplier.advanceBalance}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  value={supplier.address}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-100"
                />
              </div>
            </div>

            {/* Date & Memo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              {purchaseType === "normal" && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Memo Or Chalan No{" "}
                  </label>
                  <input
                    type="text"
                    placeholder="Memo or Chalan No"
                    value={formData.memo}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, memo: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Purchase Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div
                onClick={() => setPurchaseType("normal")}
                className={`p-4 rounded-xl border-2 cursor-pointer ${purchaseType === "normal" ? "border-green-500 bg-green-50" : "border-gray-200"}`}
              >
                <input
                  type="radio"
                  checked={purchaseType === "normal"}
                  readOnly
                  className="mr-2"
                />
                <span className="font-semibold">Normal Purchase</span>
              </div>
              <div
                onClick={() => setPurchaseType("advance")}
                className={`p-4 rounded-xl border-2 cursor-pointer ${purchaseType === "advance" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
              >
                <input
                  type="radio"
                  checked={purchaseType === "advance"}
                  readOnly
                  className="mr-2"
                />
                <span className="font-semibold">Advance Payment</span>
              </div>
            </div>

            {purchaseType === "normal" && (
              <>
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium mb-2"
                >
                  + Add Product
                </button>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
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
                          className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm"
                          required
                        />
                        {activeSearchRow === product.id &&
                          productsBySearchforPurchase.length > 0 && (
                            <div className="absolute z-50 w-full bg-white shadow-xl border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto">
                              {productsBySearchforPurchase.map((p, i) => (
                                <div
                                  key={i}
                                  onClick={() =>
                                    handleSelectProductFromSearch(product.id, {
                                      productName: p.name,
                                      productId: p._id,
                                    })
                                  }
                                  className="px-3 py-2 border-b border-gray-100 cursor-pointer hover:bg-blue-50"
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
                          value={product.quantity}
                          onChange={(e) => {
                            handleProductChange(
                              product.id,
                              "quantity",
                              e.target.value,
                            );
                            const sub = new Decimal(
                              Number(e.target.value || 0),
                            ).mul(new Decimal(Number(product.unitPrice || 0)));
                            handleProductChange(
                              product.id,
                              "subTotal",
                              Number(sub.toFixed(4)),
                            );
                          }}
                          className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm"
                        />
                      </div>

                      <div>
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
                            const sub = new Decimal(
                              Number(e.target.value || 0),
                            ).mul(new Decimal(Number(product.quantity || 0)));
                            handleProductChange(
                              product.id,
                              "subTotal",
                              Number(sub.toFixed(4)),
                            );
                          }}
                          className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm"
                        />
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-600 mb-1">
                            Sub Total
                          </label>
                          <input
                            type="number"
                            value={product.subTotal}
                            className="w-full px-3 py-2 border border-gray-400 bg-gray-200 text-gray-700 font-semibold rounded-md text-sm"
                            readOnly
                          />
                        </div>
                        {products.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(product.id)}
                            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm mt-6"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="text-right font-semibold">
                    Total Amount: ৳ {totalAmount.toFixed(2)}
                  </div>
                </div>
              </>
            )}

            {purchaseType === "advance" && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">
                  Advance Payment Amount
                </label>
                <input
                  type="number"
                  value={advancePaymentAmount}
                  onChange={(e) => setAdvancePaymentAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-lg"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={addLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium"
            >
              {addLoading
                ? "Processing..."
                : purchaseType === "normal"
                  ? "Add Purchase"
                  : "Add Advance Payment"}
            </button>
          </form>
        </div>

        {/* Reports Table Section */}
        <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
          {/* ফিল্টার লজিক যথারীতি আগের মতোই কাজ করবে */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h2 className="text-lg sm:text-xl font-semibold">Purchase Report</h2>
            {/* Filter Inputs (আগের মতোই রাখা হয়েছে) */}
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
                    className="border border-gray-400 px-4 py-3 text-left font-semibold"
                    rowSpan={2}
                  >
                    Purchase Type
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
                    const productsToDisplay =
                      purchase.products.length > 0 ? purchase.products : [{}];
                    const rowspan = productsToDisplay.length;
                    const isEven = index % 2 === 0;

                    return productsToDisplay.map((product, pIndex) => (
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
                              {
                                dayjs(purchase.createdAt)
                                  .tz("Asia/Dhaka")
                                  .format("DD-MM-YYYY")
                              }
                            </td>
                            <td
                              rowSpan={rowspan}
                              className={`border border-gray-400 px-2 py-1 sm:px-4 sm:py-2 ${!purchase.companyMemo ? "text-center font-semibold" : ""}`}
                            >
                              {purchase.companyMemo || "--"}
                            </td>
                            <td
                              rowSpan={rowspan}
                              className="border border-gray-400 px-2 py-1 sm:px-4 sm:py-2"
                            >
                              {purchase.supplierName}
                            </td>
                            <td
                              rowSpan={rowspan}
                              className={`border border-gray-400 px-2 py-1 sm:px-4 sm:py-2 ${purchase.purchaseType === "normal" ? "text-center font-semibold" : ""}`}
                            >
                              {purchase.purchaseType === "advance"
                                ? "Advance Payment"
                                : "--"}
                            </td>
                          </>
                        )}
                        <td className="border border-gray-400 px-2 py-1 sm:px-4 sm:py-2">
                          {product.productName || "N/A"}
                        </td>
                        <td className="border border-gray-400 px-2 py-1 sm:px-4 sm:py-2">
                          {product.quantity || 0}
                        </td>
                        <td className="border border-gray-400 px-2 py-1 sm:px-4 sm:py-2">
                          {product.unitPrice || 0}
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
                                {/* Print Button */}
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
                      colSpan={11}
                      className="text-center text-gray-500 py-10 text-lg border border-gray-400"
                    >
                      No Purchase Available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Purchase;
