import React, { useEffect, useRef, useState } from "react";
import Decimal from "decimal.js";
import { useDispatch, useSelector } from "react-redux";
import {
  addExchange,
  fetchExchanges,
} from "../features/Exchange/exchangeSlice";
import { customerFetch } from "../utils/POS/customerFetch";
import { Link, useNavigate } from "react-router-dom";

const ProductExchange = () => {
  const { user } = useSelector((state) => state.auth);
  const { exchanges, toggle, page, pages } = useSelector(
    (state) => state.exchange,
  );

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

    const newProducts = products.map(({ id, ...rest }) => rest);

    const exchangeData = {
      // memo: formData.memo,
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
      remainingBalance: Number(totalAmount.toFixed(4)), // Initial balance
    };

    try {
      setAddLoading(true);
      await dispatch(addExchange(exchangeData)).unwrap();
      setFormData({ date: "" });
      setProducts([
        { id: 1, productName: "", quantity: "", qtyInKg: "", unitPrice: "", subTotal: "" },
      ]);
      setDisable(false);
      setName("");
      setCustomer({ customerId: "", customerName: "", address: "", customerEmail: "", customerPhone: "" });
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
  const [date, setDate] = useState("");

  useEffect(() => {
    if (user) {
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
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleRowClick = (customerId) => {
    navigate("/product-exchange-statement", { state: { customerId } });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Product Exchange</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8 max-w-5xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-x-6 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Customer Name</label>
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
                    setCustomer({ customerId: "", customerName: "", address: "", customerEmail: "", customerPhone: "" });
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
                          <td className="text-right p-2 text-xs text-gray-500">{d.address}</td>
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
                value={customer.address}
                placeholder="Address"
                disabled
                className="block w-full px-3 py-1.5 border border-gray-400 rounded-sm text-sm bg-gray-200 text-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pick A Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-400 rounded-md"
                required
              />
            </div>
            {/* <div>
              <label className="block text-sm font-medium mb-1">Enter Memo</label>
              <input
                type="text"
                placeholder="Memo"
                value={formData.memo}
                onChange={(e) => setFormData((prev) => ({ ...prev, memo: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-400 rounded-md"
                required
              />
            </div> */}
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
              <div key={product.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3 items-end border-b pb-2 md:border-0">
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={product.productName}
                    onChange={(e) => handleProductChange(product.id, "productName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(product.id, "quantity", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Qty (kg)</label>
                  <input
                    type="number"
                    step="any"
                    value={product.qtyInKg}
                    onChange={(e) => {
                      const kg = e.target.value;
                      handleProductChange(product.id, "qtyInKg", kg);
                      const sub = new Decimal(Number(kg) || 0).mul(new Decimal(Number(product.unitPrice) || 0));
                      handleProductChange(product.id, "subTotal", Number(sub.toFixed(4)));
                    }}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">Unit Price</label>
                    <input
                      type="number"
                      step="any"
                      value={product.unitPrice}
                      onChange={(e) => {
                        const price = e.target.value;
                        handleProductChange(product.id, "unitPrice", price);
                        
                        const sub = new Decimal(Number(price) || 0).mul(new Decimal(Number(product.qtyInKg) || 0));
                        handleProductChange(product.id, "subTotal", Number(sub.toFixed(4)));
                      }}
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm"
                      required
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
              <span className="text-blue-700 font-bold">Total: ৳ {totalAmount.toFixed(2)}</span>
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
              <button onClick={() => setFilterToggler(!filterToggler)} className="px-4 py-2 bg-red-500 text-white rounded-md text-sm">Filter</button>
              <button onClick={() => {setDate(""); setNameSearch(""); setFilterToggler(!filterToggler)}} className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm">Clear</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-200 text-sm">
                <th className="border border-gray-400 px-4 py-3 text-left" rowSpan={2}>Date</th>
                <th className="border border-gray-400 px-4 py-3 text-left" rowSpan={2}>Memo</th>
                <th className="border border-gray-400 px-4 py-3 text-left" rowSpan={2}>Customer</th>
                <th className="border border-gray-400 px-4 py-3 text-center" colSpan={4}>Products</th>
                <th className="border border-gray-400 px-4 py-3 text-left" rowSpan={2}>Total</th>
                <th className="border border-gray-400 px-4 py-3 text-left text-red-600" rowSpan={2}>Remaining</th>
                <th className="border border-gray-400 px-4 py-3 text-left" rowSpan={2}>Action</th>
              </tr>
              <tr className="bg-gray-200 text-xs">
                <th className="border border-gray-400 px-2 py-2 text-left">Product Name</th>
                <th className="border border-gray-400 px-2 py-2 text-center">Qty</th>
                <th className="border border-gray-400 px-2 py-2 text-center">Kg</th>
                <th className="border border-gray-400 px-2 py-2 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {exchanges.length > 0 ? (
                exchanges.map((exchange, idx) => {
                  const rowspan = exchange.products.length;
                  return exchange.products.map((product, pIdx) => (
                    <tr 
                      key={`${idx}-${pIdx}`} 
                      className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 cursor-pointer`}
                    >
                      {pIdx === 0 && (
                        <>
                          <td onClick={() => handleRowClick(exchange.customerId)} rowSpan={rowspan} className="border border-gray-400 px-4 py-2 text-sm">
                            {new Date(exchange.createdAt).toLocaleDateString("en-GB").replaceAll("/", "-")}
                          </td>
                          <td onClick={() => handleRowClick(exchange.customerId)} rowSpan={rowspan} className="border border-gray-400 px-4 py-2 text-sm font-semibold text-blue-600">{exchange.memo}</td>
                          <td onClick={() => handleRowClick(exchange.customerId)} rowSpan={rowspan} className="border border-gray-400 px-4 py-2 text-sm font-bold">{exchange.customerName}</td>
                        </>
                      )}
                      <td onClick={() => handleRowClick(exchange.customerId)} className="border border-gray-400 px-2 py-1 text-sm">{product.productName}</td>
                      <td onClick={() => handleRowClick(exchange.customerId)} className="border border-gray-400 px-2 py-1 text-center text-sm">{product.quantity}</td>
                      <td onClick={() => handleRowClick(exchange.customerId)} className="border border-gray-400 px-2 py-1 text-center text-sm">{product.qtyInKg}</td>
                      <td onClick={() => handleRowClick(exchange.customerId)} className="border border-gray-400 px-2 py-1 text-right text-sm">{product.unitPrice}</td>
                      {pIdx === 0 && (
                        <>
                          <td onClick={() => handleRowClick(exchange.customerId)} rowSpan={rowspan} className="border border-gray-400 px-4 py-2 font-bold text-sm">{exchange.totalAmount}</td>
                          <td onClick={() => handleRowClick(exchange.customerId)} rowSpan={rowspan} className="border border-gray-400 px-4 py-2 font-bold text-sm text-red-600">
                            {exchange.remainingBalance}
                          </td>
                          <td rowSpan={rowspan} className="border border-gray-400 px-4 py-2">
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
                <tr><td colSpan={11} className="text-center py-10 text-gray-500">No Exchanges Available.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="flex justify-center items-center mt-4 gap-2 text-sm">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
            <span>Page {page} of {pages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, pages))} disabled={currentPage === pages} className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductExchange;