import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { addPayment, fetchSaleById } from "../features/sales/salesSlice";
import { FaArrowLeft } from "react-icons/fa";
import Decimal from "decimal.js";
import AsyncSelect from "react-select/async";
import { fetchExchangeByMemo } from "../features/Exchange/exchangeSlice";
import { fetchCustomerByName } from "../features/customer/customerSlice";

const EditDue = () => {
  const { user } = useSelector((state) => state.auth);
  const { saleSearchedById, loading } = useSelector((state) => state.sales);
  const { customerByName, loading: customerLoading } = useSelector(
    (state) => state.customer,
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [due, setDue] = useState(0);
  const [aid, setAid] = useState(null);
  const [date, setDate] = useState("");
  // const [dateRestriction, setDateRestriction] = useState("");
  const { id } = useParams();
  const { state } = useLocation();

  //* Exchange options - starts
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

  const [cashInput, setCashInput] = useState("");
  const [bankPaymentAmount, setBankPaymentAmount] = useState("");
  const [exchangeValue, setExchangeValue] = useState("");
  const [exchangeMemoId, setExchangeMemoId] = useState(null);
  const [maxAvailableBalance, setMaxAvailableBalance] = useState(0);
  const [selectedExchangeData, setSelectedExchangeData] = useState(null); // Full Data Store করার জন্য
  const [remarks, setRemarks] = useState("");

  const cashAndExchange = new Decimal(Number(cashInput || 0)).plus(
    new Decimal(Number(exchangeValue || 0)),
  );
  const totalPaidLive = cashAndExchange.plus(
    new Decimal(Number(bankPaymentAmount || 0)),
  );

  //* Exchange options - ends

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(totalPaidLive) === 0)
      return alert("Please enter a valid payment amount");
    setAid("Run");
    let amount;
    let advanceBalance;
    if (totalPaidLive.greaterThan(new Decimal(customerByName.due))) {
      amount = Number(new Decimal(customerByName.due).toFixed(4));
      advanceBalance = Number(
        totalPaidLive.minus(new Decimal(customerByName.due)).toFixed(4),
      );
    } else {
      amount = Number(totalPaidLive.toFixed(4));
      advanceBalance = 0;
    }

    try {
      await dispatch(
        addPayment({
          id,
          info: {
            date,
            amount,
            saleType: "due-payment",
            name: customerByName.name,
            cash: Number(cashInput || 0),
            advanceBalance,
            bankPaymentAmount: Number(bankPaymentAmount),
            remarks,
            exchange: Number(exchangeValue || 0),
            exchangeMemoId: exchangeMemoId || null,
            exchangeDetails: selectedExchangeData
              ? {
                  memo: selectedExchangeData.memo,
                  totalAmount: selectedExchangeData.totalAmount,
                  remainingBalance: selectedExchangeData.remainingBalance,
                  products: selectedExchangeData.products,
                }
              : null,
            unchangedAmount: Number(totalPaidLive.toFixed(4)),
          },
        }),
      ).unwrap();
      navigate(-1);
    } catch {
      console.log("Payment Failed!");
    } finally {
      setAid(null);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (user && user.role !== "admin") {
      navigate("/");
    }
    if (!state) {
      navigate("/");
    }
  }, [user, navigate, state]);

  useEffect(() => {
    if (user && user.role === "admin") {
      dispatch(fetchCustomerByName({ customerName: state.customerName }));
    }
  }, [dispatch, user]);

  // useEffect(() => {
  //   if (saleSearchedById) {
  //     // setDue(saleSearchedById.due);
  //     const restrictionDate = new Date(saleSearchedById.createdAt)
  //       .toISOString()
  //       .split("T")[0];
  //     setDateRestriction(restrictionDate);
  //   }
  // }, [saleSearchedById]);

  //* Due 0 redirection
  // useEffect(() => {
  //   if (saleSearchedById?.due === 0) {
  //     navigate("/sales-report");
  //   }
  // }, [saleSearchedById]);

  if (user && user.role !== "admin") return null;
  return (
    <>
      <title>{`Customer Due Payment | ${import.meta.env.VITE_COMPANY_NAME}`}</title>
      <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg p-3 sm:p-4 md:p-6 gap-4 md:gap-8">
        {/* Left: Stock Form */}
        <form onSubmit={handleSubmit} className="flex-1">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Add Payment</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={date}
              // min={dateRestriction}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Pay</label>
            <input
              type="number"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              min={0}
              step="any"
              placeholder="Add Payment"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div> */}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Cash</label>
            <input
              type="number"
              value={cashInput}
              onChange={(e) => setCashInput(e.target.value)}
              step="any"
              min={0}
              className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Bank Payment Amount
            </label>
            <input
              type="number"
              value={bankPaymentAmount}
              onChange={(e) => setBankPaymentAmount(e.target.value)}
              step="any"
              min={0}
              className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm"
            />
          </div>

          <div className="mb-4">
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

            <div className="my-4">
              <label className="block text-sm font-medium mb-1">Remarks</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm"
                rows={2}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading && aid}
            className={`text-white px-4 py-2 rounded text-sm ${
              loading && aid
                ? "cursor-not-allowed bg-green-400"
                : "bg-green-500 hover:bg-green-600 cursor-pointer"
            }`}
          >
            {loading && aid ? "Paying..." : "Pay"}
          </button>
        </form>

        {/* Right: Item Information */}
        <div className="flex-1 md:border-l md:border-gray-200 md:pl-6 mt-6 md:mt-0">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Information</h2>
          <div className="space-y-1 text-sm">
            {/* <div className="flex">
              <span className="w-28 font-medium">Sale ID</span>
              <span>: {saleSearchedById?._id}</span>
            </div> */}
            <div className="flex">
              <span className="w-28 font-medium">Customer Name</span>
              <span>: {customerByName?.name}</span>
            </div>
            {/* <div className="flex">
              <span className="w-28 font-medium">Products</span>
              <ul>
                {saleSearchedById?.products?.map((p, i) => (
                  <li key={i}>: {p.productName}</li>
                ))}
              </ul>
            </div> */}
            <div className="flex">
              <span className="w-28 font-medium">Total</span>
              <span>
                : <span className="font-bold">{customerByName?.total}</span>
              </span>
            </div>
            <div className="flex">
              <span className="w-28 font-medium">Paid</span>
              <span>: {customerByName?.paid}</span>
            </div>
            <div className="flex bg-amber-50">
              <span>Current Balance</span>
              <span>
                :{" "}
                <span
                  className={`w-28 ${
                    customerByName?.currentBalance < 0
                      ? "text-red-500 font-bold"
                      : "font-medium"
                  }`}
                >
                  {customerByName?.currentBalance}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm sm:text-base font-medium text-green-600 hover:text-blue-800 cursor-pointer"
        >
          <FaArrowLeft className="mr-1 sm:mr-2" /> Go Back
        </button>
      </div>
    </>
  );
};

export default EditDue;
