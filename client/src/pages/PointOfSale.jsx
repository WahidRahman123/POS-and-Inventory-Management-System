import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  searchProductsforPOS,
  setProductsBySearchToEmpty,
} from "../features/product/productSlice";
import { addSales, setCreatedSalesToNull } from "../features/sales/salesSlice";
import { useNavigate } from "react-router-dom";
import Decimal from "decimal.js";
import AsyncSelect from "react-select/async";
import CustomerAddForm from "../components/POS/CustomerAddForm";
import CustomerSelect from "../components/POS/CustomerSelect";
import { fetchExchangeByMemo } from "../features/Exchange/exchangeSlice";

const PointOfSale = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { createdSales, loading } = useSelector((state) => state.sales);
  const { productsBySearchforPOS } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const [customDate, setCustomDate] = useState("");

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [cid, setCid] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [discount, setDiscount] = useState(0);
  const [cashInput, setCashInput] = useState("");
  const [bankPaymentAmount, setBankPaymentAmount] = useState("");
  const [exchangeValue, setExchangeValue] = useState("");
  const [loanInput, setLoanInput] = useState("");
  const [exchangeMemoId, setExchangeMemoId] = useState(null);
  const [maxAvailableBalance, setMaxAvailableBalance] = useState(0);
  const [selectedExchangeData, setSelectedExchangeData] = useState(null); // Full Data Store করার জন্য
  const [remarks, setRemarks] = useState("");
  const [customer, setCustomer] = useState({
    customerId: "",
    customerName: "",
    address: "",
    customerEmail: "",
    customerPhone: "",
    currentBalance: ""
  });

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // Calculations
  const orderTotal = selectedProducts.reduce(
    (acc, product) =>
      acc.plus(
        new Decimal(Number(product.qty || 0)).mul(
          new Decimal(Number(product.newSellPrice || 0)),
        ),
      ),
    new Decimal(0),
  );

  const subTotal = orderTotal.minus(new Decimal(Number(discount || 0)));
  const totalWithLoan = subTotal.plus(new Decimal(Number(loanInput || 0)));
  const cashAndExchange = new Decimal(Number(cashInput || 0)).plus(
    new Decimal(Number(exchangeValue || 0)),
  );
  const totalPaidLive = cashAndExchange.plus(
    new Decimal(Number(bankPaymentAmount || 0)),
  );

  const liveDue = totalWithLoan.minus(totalPaidLive).lessThan(0)
    ? "0.00"
    : totalWithLoan.minus(totalPaidLive).toFixed(2);

  const dynamicDue = new Decimal(liveDue).minus(new Decimal(Number(customer.currentBalance)));

  const totalCost = selectedProducts.reduce(
    (acc, product) =>
      acc.plus(
        new Decimal(Number(product.qty || 0)).mul(
          new Decimal(Number(product.costPrice || 0)),
        ),
      ),
    new Decimal(0),
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customer.customerId) return alert("Select a customer!");
    if (selectedProducts.length === 0 && Number(loanInput || 0) <= 0) {
      return alert("Select product or enter loan amount!");
    }

    if (exchangeMemoId && Number(exchangeValue) > maxAvailableBalance) {
      return alert(
        `Insufficient Balance! Available balance is ${maxAvailableBalance}`,
      );
    }

    try {
      setCid("Running");
      const finalProducts = selectedProducts.map((p) => ({
        productId: p._id,
        productName: p.name,
        oldSellPrice: Number(p.sellPrice),
        sellPrice: Number(p.newSellPrice),
        costPrice: Number(p.costPrice),
        quantity: Number(p.qty),
        subTotal: Number(
          new Decimal(p.newSellPrice || 0)
            .mul(new Decimal(p.qty || 0))
            .toFixed(2),
        ),
      }));

      const payload = {
        customerId: customer.customerId,
        userId: user._id,
        remarks: remarks || "",
        customerName: customer.customerName,
        address: customer.address,
        customerEmail: customer.customerEmail,
        customerPhone: customer.customerPhone,
        products: finalProducts,
        totalWithoutDiscount: Number(orderTotal.toFixed(2)),
        total: Number(totalWithLoan.toFixed(2)),
        discount: Number(new Decimal(discount || 0).toFixed(2)),
        loan: Number(loanInput || 0),
        totalCost: Number(totalCost.toFixed(2)),
        cash: Number(cashInput || 0),
        bankPaymentAmount: Number(bankPaymentAmount),
        exchange: Number(exchangeValue || 0),
        exchangeMemoId: exchangeMemoId || null,
        // ইনভয়েসে দেখানোর জন্য পুরো এক্সচেঞ্জ ডিটেইলস পাঠানো হচ্ছে
        exchangeDetails: selectedExchangeData
          ? {
              memo: selectedExchangeData.memo,
              totalAmount: selectedExchangeData.totalAmount,
              remainingBalance: selectedExchangeData.remainingBalance,
              products: selectedExchangeData.products,
            }
          : null,
        due: Number(liveDue),
        paid: Number(
          totalPaidLive.greaterThan(totalWithLoan)
            ? totalWithLoan.toFixed(2)
            : totalPaidLive.toFixed(2),
        ),
        advanceBalance: totalPaidLive.greaterThan(totalWithLoan)
          ? Number(totalPaidLive.minus(totalWithLoan).toFixed(2))
          : 0,
        unchangedPaid: Number(totalPaidLive.toFixed(2)),
        unchangedDue: Number(liveDue),

        createdAt: customDate ? customDate : new Date(),
        issuedAt: new Date(),
      };

      await dispatch(addSales(payload)).unwrap();
      setCid(null);
    } catch (error) {
      console.error("Sales Error Detail:", error);
      alert(`Error: ${error?.message || "Sales Add Failed!"}`);
      setCid(null);
    }
  };

  const loadOptions = async (inputValue, callback) => {
    if (!inputValue) return callback([]);
    try {
      const response = await dispatch(fetchExchangeByMemo(inputValue)).unwrap();
      if (response && Array.isArray(response)) {
        const options = response.map((item) => ({
          label: `${item.memo} - ${item.customerName || "No Name"} (Available: ৳${item.remainingBalance})`,
          value: item.remainingBalance,
          id: item._id,
          fullData: item, // এখানে পুরো ডাটা পাস করা হচ্ছে
        }));
        callback(options);
      }
    } catch (error) {
      callback([]);
    }
  };

  const handleDeleteProduct = (pid) =>
    setSelectedProducts((prev) => prev.filter((p) => p._id !== pid));

  const handleSearchOnChange = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value) dispatch(searchProductsforPOS(e.target.value));
    else dispatch(setProductsBySearchToEmpty());
  };

  const handleSearchOnClick = (pid) => {
    let productToAdd = productsBySearchforPOS.find((p) => p._id === pid);
    if (productToAdd) {
      const foundProduct = selectedProducts.find(
        (p) => p._id === productToAdd._id,
      );
      if (!foundProduct) {
        setSelectedProducts([
          ...selectedProducts,
          { ...productToAdd, qty: 1, newSellPrice: productToAdd.sellPrice },
        ]);
      }
    }
    dispatch(setProductsBySearchToEmpty());
    setSearchValue("");
  };

  useEffect(() => {
    if (createdSales) {
      // ইনভয়েসে যাওয়ার সময় state এ ডাটা পাঠানো
      const data = {
        ...createdSales,
        due: Number(liveDue),
        paid: Number(totalPaidLive.toFixed(2)),
      };
      dispatch(setCreatedSalesToNull());
      navigate("/invoice", { state: data });
    }
  }, [createdSales, dispatch, navigate, liveDue, totalPaidLive]);

  useEffect(() => {
    dispatch(setProductsBySearchToEmpty());
  }, [dispatch]);

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-md rounded-md p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Sale Order</h1>
      <div>
        <label className="block text-sm font-medium mb-1">Add Customer</label>
        <CustomerAddForm />
      </div>

      <form onSubmit={handleSubmit}>
        <CustomerSelect customer={customer} setCustomer={setCustomer} />

        <div className="grid grid-cols-2 gap-x-6 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Search Product
            </label>
            <input
              type="search"
              value={searchValue}
              onChange={handleSearchOnChange}
              placeholder="Search Products..."
              className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm"
            />
            <div
              className={`${productsBySearchforPOS.length > 0 ? "shadow-md px-4 py-2 rounded max-h-50 overflow-y-scroll" : ""}`}
            >
              {productsBySearchforPOS.map((product, index) => (
                <div
                  onClick={() => handleSearchOnClick(product._id)}
                  key={index}
                  className="px-2 py-1 border-b border-gray-300 cursor-pointer hover:bg-gray-100 text-gray-800 text-sm"
                >
                  {product.name}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Enter Custom Date
            </label>
            <div className="flex gap-1.5">
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => setCustomDate("")}
                className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm cursor-pointer hover:bg-blue-600"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <table className="min-w-full border border-gray-300 mb-4">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-1.5 text-xs font-semibold text-gray-700 border-b text-center">
                #
              </th>
              <th className="px-3 py-1.5 text-xs font-semibold text-gray-700 border-b text-left">
                Product Name
              </th>
              <th className="px-3 py-1.5 text-xs font-semibold text-gray-700 border-b text-center">
                Sale Price
              </th>
              <th className="px-3 py-1.5 text-xs font-semibold text-gray-700 border-b text-center">
                Available
              </th>
              <th className="px-3 py-1.5 text-xs font-semibold text-gray-700 border-b text-center">
                Quantity
              </th>
              <th className="px-3 py-1.5 text-xs font-semibold text-gray-700 border-b text-center">
                ItemTotal
              </th>
              <th className="px-3 py-1.5 text-xs font-semibold text-gray-700 border-b text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {selectedProducts.length > 0 ? (
              selectedProducts.map((product, index) => (
                <tr key={index}>
                  <td className="px-3 py-1.5 text-sm border-b text-center">
                    {index + 1}
                  </td>
                  <td className="px-3 py-1.5 text-sm border-b text-left">
                    {product.name}
                  </td>
                  <td className="px-3 py-1.5 text-sm border-b text-center">
                    <input
                      type="number"
                      value={product.newSellPrice}
                      step="any"
                      className="w-[100px] border rounded px-2"
                      onChange={(e) =>
                        setSelectedProducts((prev) =>
                          prev.map((p, i) =>
                            i === index
                              ? { ...p, newSellPrice: e.target.value }
                              : p,
                          ),
                        )
                      }
                    />
                  </td>
                  <td className="px-3 py-1.5 text-sm border-b text-center">
                    {product.quantity}
                  </td>
                  <td className="px-3 py-1.5 text-sm border-b text-center">
                    <input
                      type="number"
                      value={product.qty}
                      className="w-[60px] border rounded px-2"
                      onChange={(e) =>
                        setSelectedProducts((prev) =>
                          prev.map((p, i) =>
                            i === index ? { ...p, qty: e.target.value } : p,
                          ),
                        )
                      }
                    />
                  </td>
                  <td className="px-3 py-1.5 text-sm border-b text-center">
                    ৳{" "}
                    {new Decimal(Number(product.newSellPrice || 0))
                      .mul(new Decimal(Number(product.qty || 0)))
                      .toFixed(2)}
                  </td>
                  <td className="p-2 text-center border-b">
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(product._id)}
                      className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center font-bold px-6 py-3 text-gray-500 text-sm"
                >
                  No Orders Yet
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-end mb-4">
          <div className="w-64 space-y-0.5 text-sm">
            <div className="flex justify-between">
              <span>OrderTotal</span>
              <span>{orderTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Order Discount</span>
              <input
                type="number"
                value={discount}
                step="any"
                onChange={(e) => setDiscount(e.target.value)}
                className="w-[80px] border rounded border-gray-400 px-1 py-0.5"
              />
            </div>
            <div className="flex justify-between font-bold">
              <span>Sub Total</span>
              <span>{subTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 max-w-[50%] mb-4">
          <div>
            <label className="block text-sm font-bold text-red-600 mb-1">
              Give Loan
            </label>
            <input
              type="number"
              value={loanInput}
              onChange={(e) => setLoanInput(e.target.value)}
              step="any"
              className="block w-full px-3 py-1.5 border border-red-300 rounded-sm text-sm"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cash</label>
            <input
              type="number"
              value={cashInput}
              onChange={(e) => setCashInput(e.target.value)}
              step="any"
              className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Bank Payment Amount
            </label>
            <input
              type="number"
              value={bankPaymentAmount}
              onChange={(e) => setBankPaymentAmount(e.target.value)}
              step="any"
              className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Exchange Memo Search
            </label>
            <AsyncSelect
              cacheOptions
              loadOptions={loadOptions}
              defaultOptions
              isClearable
              onChange={(selected) => {
                if (selected) {
                  setExchangeValue(selected.value);
                  setExchangeMemoId(selected.id);
                  setMaxAvailableBalance(selected.value);
                  setSelectedExchangeData(selected.fullData); // পুরো ডাটা এখানে সেভ হবে
                } else {
                  setExchangeValue("");
                  setExchangeMemoId(null);
                  setMaxAvailableBalance(0);
                  setSelectedExchangeData(null);
                }
              }}
              placeholder="Search Memo (Shows Name)..."
            />
            {exchangeMemoId && (
              <div className="mt-2">
                <label className="block text-xs font-semibold text-orange-600 mb-1">
                  Adjust Amount (Max: ৳{maxAvailableBalance})
                </label>
                <input
                  type="number"
                  value={exchangeValue}
                  onChange={(e) => setExchangeValue(e.target.value)}
                  className="block w-full px-3 py-1.5 border border-orange-300 bg-orange-50 rounded-sm text-sm"
                  min={0}
                  max={maxAvailableBalance}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm"
              rows={2}
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <div className="w-64 space-y-0.5 text-sm">
            <div className="flex justify-between font-bold">
              <span>Product Total</span>
              <span>{subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-red-600">
              <span>Loan</span>
              <span>{new Decimal(Number(loanInput || 0)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{totalWithLoan.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Cash</span>
              <span>{new Decimal(Number(cashInput || 0)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Bank Amount</span>
              <span>
                {new Decimal(Number(bankPaymentAmount || 0)).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Exchange</span>
              <span>{new Decimal(Number(exchangeValue || 0)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total Paid</span>
              <span>{totalPaidLive.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold border-t border-gray-300 pt-1">
              <span>Due</span>
              <span>{liveDue}</span>
            </div>
            <div className="flex justify-between font-bold border-b border-gray-300 pt-1">
              <span>Current Balance</span>
              <span>(-) {new Decimal(Number(customer.currentBalance)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold pt-1">
              <span>Net Current Due</span>
              <span>{new Decimal(liveDue).minus(new Decimal(Number(customer.currentBalance))).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading && cid}
          className={`mt-4 w-full text-white font-bold py-2 rounded-sm ${loading && cid ? "bg-blue-500" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading && cid ? "Paying..." : `Pay`}
        </button>
      </form>
    </div>
  );
};

export default PointOfSale;
