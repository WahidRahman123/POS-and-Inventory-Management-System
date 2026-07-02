import React, { useEffect, useRef, useState } from "react";
import Decimal from "decimal.js";
import { useDispatch, useSelector } from "react-redux";
import {
  addExchange,
  fetchExchanges,
} from "../features/Exchange/exchangeSlice";
import { fetchProductExchangeReportData } from "../features/CompanyProductReturn/companyProductReturnSlice";
import { customerFetch } from "../utils/POS/customerFetch";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBox,
  FaWeightHanging,
  FaMoneyBillWave,
  FaArrowAltCircleRight,
} from "react-icons/fa";
import {
  createScrapProduct,
  searchForScrapProducts,
  setScrapProductsBySearchToEmpty,
} from "../features/ScrapProduct/scrapProductSlice";
import dayjs from "../utils/date.js";

const ProductExchange = () => {
  const { user } = useSelector((state) => state.auth);
  const { exchanges, toggle, page, pages } = useSelector(
    (state) => state.exchange,
  );
  const { productExchangeReportData } = useSelector(
    (state) => state.companyProductReturn,
  );

  // const [activeTab, setActiveTab] = useState("product-exchange");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addLoading, setAddLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    memo: "",
  });

  const [customer, setCustomer] = useState({
    customerId: "",
    customerName: "",
    address: "",
    customerEmail: "",
    customerPhone: "",
  });

  const [name, setName] = useState("");
  const customerNameRef = useRef(null);
  const [disable, setDisable] = useState(false);
  const [data, setData] = useState(null);

  const [currentPage, setCurrentPage] = useState(page);
  const [sortOrder, setSortOrder] = useState(-1);
  const [filterToggler, setFilterToggler] = useState(true);
  const [nameSearch, setNameSearch] = useState("");
  const [date, setDate] = useState("");

  //* Scrap product - starts
  const { scrapProducts, createLoading } = useSelector(
    (state) => state.scrapproduct,
  );
  const [scrapProductName, setScrapProductName] = useState("");
  const handleScrapProductSubmit = async (e) => {
    e.preventDefault();
    if (!scrapProductName) return alert("Please enter a scrap product name!");

    try {
      await dispatch(
        createScrapProduct({ productName: scrapProductName }),
      ).unwrap();
      setScrapProductName("");
    } catch {
      console.log("Add failed!");
    }
  };

  //* Scrap product - ends

  // --- লাইফসাইকেল হুক্স: এক সাথে দুই স্লাইসের ডেটা লোড করার বেস্ট প্র্যাকটিস ---
  useEffect(() => {
    if (user) {
      // এক্সচেঞ্জ টেবিলের ডেটা ফেচ
      dispatch(
        fetchExchanges({
          dateSearch: date,
          nameSearch,
          page: currentPage,
          order: sortOrder,
        }),
      );
    }
  }, [dispatch, user, toggle, filterToggler, sortOrder, currentPage]);

  useEffect(() => {
    if (user) {
      // সামারি কার্ডের ডেটা সঠিক স্লাইস ও সঠিক মেথড দিয়ে ফেচ করা হলো
      dispatch(
        fetchProductExchangeReportData({
          memoSearch: "", // কোম্পানি রিটার্ন স্লাইসের রিকোয়ারমেন্ট অনুযায়ী প্যারামস পাঠানো হলো
          page: currentPage,
        }),
      );
    }
  }, [dispatch, user, toggle, filterToggler, currentPage]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleCustomerNameOnChange = async (e) => {
    const query = e.target.value;
    setName(query);
    if (query) {
      const data = await customerFetch(query);
      setData(data);
    } else {
      setData(null);
    }
  };

  const handleCustomerOnClick = (customerData) => {
    setData(null);
    setName(customerData.name);
    setCustomer({
      customerId: customerData._id,
      customerName: customerData.name,
      address: customerData.address,
      customerEmail: customerData.email,
      customerPhone: customerData.phone,
    });
    setDisable(true);
  };

  useEffect(() => {
    if (!disable && customerNameRef.current) {
      customerNameRef.current.focus();
    }
  }, [disable]);

  //* + Add product section - starts
  const [activeSearchRow, setActiveSearchRow] = useState(null);
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

  const handleProductSearchChange = (id, value) => {
    handleProductChange(id, "productName", value);
    if (value) {
      setActiveSearchRow(id);
      dispatch(searchForScrapProducts(value));
    } else {
      setActiveSearchRow(null);
      dispatch(setScrapProductsBySearchToEmpty());
    }
  };

  const handleProductChange = (id, field, value) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, [field]: value } : product,
      ),
    );
  };

  const handleSelectProductFromSearch = (id, product) => {
    handleProductChange(id, "productName", product.productName);
    handleProductChange(id, "productId", product.productId);
    dispatch(setScrapProductsBySearchToEmpty());
    setActiveSearchRow(null);
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

  const totalQty = products.reduce(
    (acc, p) => acc.plus(new Decimal(Number(p.quantity) || 0)),
    new Decimal(0),
  );
  const totalQtyInKg = products.reduce(
    (acc, p) => acc.plus(new Decimal(Number(p.qtyInKg) || 0)),
    new Decimal(0),
  );
  const totalAmount = products.reduce(
    (acc, p) => acc.plus(new Decimal(Number(p.subTotal) || 0)),
    new Decimal(0),
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (customer.customerId === "") return alert("Select a customer!");

    const newProducts = products.map(({ id, ...rest }) => ({
      ...rest,
      qtyInKg: Number(rest.qtyInKg),
      quantity: Number(rest.quantity),
      unitPrice: Number(rest.unitPrice),
    }));

    const exchangeData = {
      createdAt: formData.date,
      issuedAt: new Date(),
      customerId: customer.customerId,
      customerName: customer.customerName,
      address: customer.address,
      customerEmail: customer.customerEmail,
      customerPhone: customer.customerPhone,
      userId: user._id,
      products: newProducts,
      totalAmount: Number(totalAmount.toFixed(4)),
      remainingBalance: Number(totalAmount.toFixed(4)),
    };

    try {
      setAddLoading(true);
      await dispatch(addExchange(exchangeData)).unwrap();
      setFormData({ date: "" });
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
      setDisable(false);
      setName("");
      setCustomer({
        customerId: "",
        customerName: "",
        address: "",
        customerEmail: "",
        customerPhone: "",
      });
      setData(null);
    } catch (error) {
      console.error("Failed to add exchange!", error);
    } finally {
      setAddLoading(false);
    }
  };

  const handleRowClick = (customerId) => {
    navigate("/product-exchange-statement", { state: { customerId } });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Product Exchange
        </h1>

        {/* --- Functional Financial Summary Section --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Card 1: Total Sent Items (CompanyReturn-এর সাথে অ্যালাইনড) */}
          <div className="bg-white p-5 shadow-sm border-b-4 border-blue-600 rounded-sm">
            <div className="flex items-center gap-3 mb-2 text-blue-600">
              <FaBox size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                Total Stock Items
              </p>
            </div>
            <p className="text-2xl font-black text-gray-800">
              {productExchangeReportData
                ? new Decimal(productExchangeReportData.totalSentItems).toFixed(0)
                : "--"}{" "}
              <span className="text-xs font-normal text-gray-500">Pcs</span>
            </p>
          </div>

          {/* Card 2: Total Weight */}
          <div className="bg-white p-5 shadow-sm border-b-4 border-orange-500 rounded-sm">
            <div className="flex items-center gap-3 mb-2 text-orange-500">
              <FaWeightHanging size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                Total Weight
              </p>
            </div>
            <p className="text-2xl font-black text-gray-800">
              {productExchangeReportData
                ? new Decimal(productExchangeReportData.totalWeight).toFixed(2)
                : "--"}{" "}
              <span className="text-xs font-normal text-gray-500">Kg</span>
            </p>
          </div>

          {/* Card 3: Total Receivable */}
          <div className="bg-gray-900 p-5 shadow-sm border-b-4 border-green-600 rounded-sm">
            <div className="flex items-center gap-3 mb-2 text-green-500">
              <FaMoneyBillWave size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Total Stock Price
              </p>
            </div>
            <p className="text-2xl font-black text-white">
              ৳{" "}
              {productExchangeReportData
                ? new Decimal(productExchangeReportData.totalAmount).toFixed(2)
                : "--"}
            </p>
          </div>

          {/* Card 4: Pending From Co. */}
          {/* <div className="bg-white p-5 shadow-sm border-b-4 border-red-600 rounded-sm">
            <div className="flex items-center gap-3 mb-2 text-red-500">
              <FaArrowAltCircleRight size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                Pending From Co.
              </p>
            </div>
            <p className="text-2xl font-black text-gray-800">
              ৳ {productExchangeReportData ? productExchangeReportData.totalDue : "--"}
            </p>
          </div> */}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8 max-w-5xl mx-auto">
        <div className="mb-5 p-4 border-l-4 border-amber-500 bg-amber-50 rounded-r-md">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-amber-800">
              ♻️ Add Scrap Products
            </label>

            <span className="text-[10px] font-bold px-2 py-1 bg-amber-200 text-amber-800 rounded-full">
              SCRAP
            </span>
          </div>

          <form className="flex gap-2" onSubmit={handleScrapProductSubmit}>
            <input
              type="text"
              value={scrapProductName}
              onChange={(e) => setScrapProductName(e.target.value)}
              placeholder="Enter Scrap Product Name"
              className="flex-1 px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
            />

            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-md cursor-pointer disabled:bg-amber-300 disabled:cursor-not-allowed"
              disabled={createLoading}
            >
              {createLoading ? "Adding..." : "Add Scrap"}
            </button>
          </form>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-x-6 mb-4">
            <div className="relative">
              <label className="block text-sm font-medium mb-1">
                Customer Name
              </label>
              <div className="flex">
                <input
                  type="search"
                  value={name}
                  onChange={handleCustomerNameOnChange}
                  ref={customerNameRef}
                  placeholder="Customer Name"
                  className="block w-[85%] px-3 py-1.5 border border-gray-400 rounded-sm text-sm disabled:bg-gray-300"
                  disabled={disable}
                />
                <button
                  type="button"
                  disabled={!disable}
                  className="bg-red-500 hover:bg-red-600 cursor-pointer ml-2 px-2 py-1 font-bold text-white rounded disabled:bg-red-300 disabled:cursor-not-allowed"
                  onClick={() => {
                    setDisable(false);
                    setName("");
                    setCustomer({
                      customerId: "",
                      customerName: "",
                      address: "",
                      customerEmail: "",
                      customerPhone: "",
                    });
                    setData(null);
                  }}
                >
                  Change
                </button>
              </div>
              {data && (
                <div className="w-[85%] max-h-40 shadow-md overflow-y-auto bg-white absolute z-10 border border-gray-200">
                  <table className="w-full">
                    <tbody>
                      {data.map((d, i) => (
                        <tr
                          key={i}
                          className="p-2 cursor-pointer border-b border-gray-200 hover:bg-gray-100 text-gray-800"
                          onClick={() => handleCustomerOnClick(d)}
                        >
                          <td className="p-2">{d.name}</td>
                          <td className="text-right p-2 text-xs text-gray-500">
                            {d.address}
                          </td>
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
                value={customer.address}
                placeholder="Address"
                disabled
                className="block w-full px-3 py-1.5 border border-gray-400 rounded-sm text-sm bg-gray-200 text-gray-700"
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
                  setFormData((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-400 rounded-md"
                required
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddProduct}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mb-4 cursor-pointer"
          >
            + Add Product
          </button>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3 items-end border-b pb-2 md:border-0"
              >
                <div className="md:col-span-2 relative">
                  <label className="block text-xs text-gray-600 mb-1">
                    Product Name
                  </label>
                  <input
                    type="search"
                    value={product.productName}
                    // onChange={(e) =>
                    //   handleProductChange(
                    //     product.id,
                    //     "productName",
                    //     e.target.value,
                    //   )
                    // }
                    onChange={(e) =>
                      handleProductSearchChange(product.id, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm"
                    required
                  />
                  {activeSearchRow === product.id &&
                    scrapProducts.length > 0 && (
                      <div className="absolute z-50 w-full bg-white shadow-xl border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto">
                        {scrapProducts.map((p, i) => (
                          <div
                            key={i}
                            onClick={() =>
                              handleSelectProductFromSearch(product.id, {
                                productName: p.productName,
                                productId: p._id,
                              })
                            }
                            className="px-3 py-2 border-b border-gray-100 cursor-pointer hover:bg-blue-50"
                          >
                            {p.productName}
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
                    onChange={(e) =>
                      handleProductChange(
                        product.id,
                        "quantity",
                        e.target.value,
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm"
                    step="1"
                    required
                    onWheel={(e) => e.target.blur()}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Qty (kg)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={product.qtyInKg}
                    onChange={(e) => {
                      const kg = e.target.value;
                      handleProductChange(product.id, "qtyInKg", kg);
                      const sub = new Decimal(Number(kg) || 0).mul(
                        new Decimal(Number(product.unitPrice) || 0),
                      );
                      handleProductChange(
                        product.id,
                        "subTotal",
                        Number(sub.toFixed(4)),
                      );
                    }}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm"
                    required
                    onWheel={(e) => e.target.blur()}

                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">
                      Unit Price
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={product.unitPrice}
                      onChange={(e) => {
                        const price = e.target.value;
                        handleProductChange(product.id, "unitPrice", price);

                        const sub = new Decimal(Number(price) || 0).mul(
                          new Decimal(Number(product.qtyInKg) || 0),
                        );
                        handleProductChange(
                          product.id,
                          "subTotal",
                          Number(sub.toFixed(4)),
                        );
                      }}
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm"
                      required
                      onWheel={(e) => e.target.blur()}

                    />
                  </div>
                  {products.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(product.id)}
                      className="px-3 py-2 bg-red-500 text-white rounded-md mt-6"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="border-t border-gray-400 pt-3 mt-3 flex justify-end gap-6 text-sm font-semibold">
              <span>Total Qty: {totalQty.toFixed(0)}</span>
              <span>Total Kg: {totalQtyInKg.toFixed(2)}</span>
              <span className="text-blue-700 font-bold">
                Total: ৳ {totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 disabled:bg-gray-400 cursor-pointer"
            disabled={addLoading}
          >
            {addLoading ? "Adding..." : "Add Exchange"}
          </button>
        </form>
      </div>

      {/* Data Summary Report History Section Container */}
      <div className="bg-white rounded-lg shadow-md p-6 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Exchange Report</h2>
          <div className="flex flex-wrap gap-4 items-end">
            <input
              type="search"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              placeholder="Search Customer"
              className="px-4 py-2 border border-gray-400 rounded-md text-sm"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-4 py-2 border border-gray-400 rounded-md text-sm"
            />
            <button
              onClick={() => setFilterToggler(!filterToggler)}
              className="px-4 py-2 bg-red-500 text-white rounded-md text-sm"
            >
              Filter
            </button>
            <button
              onClick={() => {
                setDate("");
                setNameSearch("");
                setFilterToggler(!filterToggler);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-200 text-sm">
                <th
                  className="border border-gray-400 px-4 py-3 text-left"
                  rowSpan={2}
                >
                  Date
                </th>
                <th
                  className="border border-gray-400 px-4 py-3 text-left"
                  rowSpan={2}
                >
                  Memo
                </th>
                <th
                  className="border border-gray-400 px-4 py-3 text-left"
                  rowSpan={2}
                >
                  Customer
                </th>
                <th
                  className="border border-gray-400 px-4 py-3 text-center"
                  colSpan={4}
                >
                  Products
                </th>
                <th
                  className="border border-gray-400 px-4 py-3 text-left"
                  rowSpan={2}
                >
                  Total
                </th>
                <th
                  className="border border-gray-400 px-4 py-3 text-left text-red-600"
                  rowSpan={2}
                >
                  Remaining
                </th>
                <th
                  className="border border-gray-400 px-4 py-3 text-left"
                  rowSpan={2}
                >
                  Action
                </th>
              </tr>
              <tr className="bg-gray-200 text-xs">
                <th className="border border-gray-400 px-2 py-2 text-left">
                  Product Name
                </th>
                <th className="border border-gray-400 px-2 py-2 text-center">
                  Qty
                </th>
                <th className="border border-gray-400 px-2 py-2 text-center">
                  Kg
                </th>
                <th className="border border-gray-400 px-2 py-2 text-right">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {exchanges && exchanges.length > 0 ? (
                exchanges.map((exchange, idx) => {
                  const rowspan = exchange.products.length;
                  return exchange.products.map((product, pIdx) => (
                    <tr
                      key={`${idx}-${pIdx}`}
                      className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 cursor-pointer`}
                    >
                      {pIdx === 0 && (
                        <>
                          <td
                            onClick={() => handleRowClick(exchange.customerId)}
                            rowSpan={rowspan}
                            className="border border-gray-400 px-4 py-2 text-sm"
                          >
                            {
                              dayjs(exchange.createdAt)
                                .tz("Asia/Dhaka")
                                .format("DD-MM-YYYY")
                            }
                          </td>
                          <td
                            onClick={() => handleRowClick(exchange.customerId)}
                            rowSpan={rowspan}
                            className="border border-gray-400 px-4 py-2 text-sm font-semibold text-blue-600"
                          >
                            {exchange.memo}
                          </td>
                          <td
                            onClick={() => handleRowClick(exchange.customerId)}
                            rowSpan={rowspan}
                            className="border border-gray-400 px-4 py-2 text-sm font-bold"
                          >
                            {exchange.customerName}
                          </td>
                        </>
                      )}
                      <td
                        onClick={() => handleRowClick(exchange.customerId)}
                        className="border border-gray-400 px-2 py-1 text-sm"
                      >
                        {product.productName}
                      </td>
                      <td
                        onClick={() => handleRowClick(exchange.customerId)}
                        className="border border-gray-400 px-2 py-1 text-center text-sm"
                      >
                        {product.quantity}
                      </td>
                      <td
                        onClick={() => handleRowClick(exchange.customerId)}
                        className="border border-gray-400 px-2 py-1 text-center text-sm"
                      >
                        {product.qtyInKg}
                      </td>
                      <td
                        onClick={() => handleRowClick(exchange.customerId)}
                        className="border border-gray-400 px-2 py-1 text-right text-sm"
                      >
                        {product.unitPrice}
                      </td>
                      {pIdx === 0 && (
                        <>
                          <td
                            onClick={() => handleRowClick(exchange.customerId)}
                            rowSpan={rowspan}
                            className="border border-gray-400 px-4 py-2 font-bold text-sm"
                          >
                            {exchange.totalAmount}
                          </td>
                          <td
                            onClick={() => handleRowClick(exchange.customerId)}
                            rowSpan={rowspan}
                            className="border border-gray-400 px-4 py-2 font-bold text-sm text-red-600"
                          >
                            {exchange.remainingBalance}
                          </td>
                          <td
                            rowSpan={rowspan}
                            className="border border-gray-400 px-4 py-2"
                          >
                            <div className="flex flex-col gap-2">
                              <Link
                                to="/product-exchange-statement"
                                state={{ singleMemo: exchange }}
                                className="text-[10px] bg-gray-800 text-white px-2 py-1 rounded hover:bg-black text-center cursor-pointer font-bold"
                              >
                                Memo Stat.
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
                  <td colSpan={11} className="text-center py-10 text-gray-500">
                    No Exchanges Available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="flex justify-center items-center mt-4 gap-2 text-sm">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {pages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, pages))}
              disabled={currentPage === pages}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductExchange;
