import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Decimal from "decimal.js";
import {
  addPaymentByExchange,
  fetchSalesReturnById,
} from "../features/SalesReturn/salesReturnSlice";

const EditSRCashDue = () => {
  const { user } = useSelector((state) => state.auth);
  const { salesReturnSearchedById, loading } = useSelector(
    (state) => state.salesReturn,
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [aid, setAid] = useState(null);
  const { id } = useParams();
  const [dateRestriction, setDateRestriction] = useState("");
  

  const [date, setDate] = useState("");
  const [cashDetails, setCashDetails] = useState({
    cashRefundAmount: "",
    paymentMethod: "Cash",
    note: "",
  });

  const returnValue = salesReturnSearchedById
    ? new Decimal(salesReturnSearchedById.due)
    : new Decimal(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAid("Run");
    try {
      //* Amount Calculation
      const amount = new Decimal(
        Number(cashDetails.cashRefundAmount)
      ).greaterThan(returnValue)
        ? Number(returnValue.toFixed(4))
        : Number(new Decimal(Number(cashDetails.cashRefundAmount)).toFixed(4));

      const transactionData = {
        amount,

        date,
        refMemo: "REF-" + salesReturnSearchedById.memo,
        customerId: salesReturnSearchedById.customerId,
        customerName: salesReturnSearchedById.customerName,
        address: salesReturnSearchedById.address,
        customerEmail: salesReturnSearchedById.customerEmail,
        customerPhone: salesReturnSearchedById.customerPhone,
        userId: user._id,
        salesId: salesReturnSearchedById.salesId,
        returnType: "cash",
        exchangeProducts: [],
        totalExchangeValue: 0,
        adjustmentAmount: 0,
        cashRefundAmount: Number(new Decimal(Number(cashDetails.cashRefundAmount)).toFixed(4)),
        paymentMethod: cashDetails.paymentMethod,
        note: cashDetails.note,
        salesReturnId: salesReturnSearchedById._id,
      };
      // return;
      await dispatch(
        addPaymentByExchange({
          id,
          info: transactionData,
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
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.role === "admin") {
      dispatch(fetchSalesReturnById(id));
    }
  }, [dispatch, user]);

  //* Due 0 redirection
  useEffect(() => {
    if(salesReturnSearchedById) {
      const restrictionDate = new Date(salesReturnSearchedById.createdAt)
        .toISOString()
        .split("T")[0];
      setDateRestriction(restrictionDate);
    }
    if (salesReturnSearchedById?.due === 0) {
      navigate("/sales-return");
    }
  }, [salesReturnSearchedById]);

  if (user && user.role !== "admin") return null;
  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-3 sm:p-4 md:p-6 space-y-6">
        {/* Return Summary Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-sm font-semibold text-gray-600 mb-3">
            Return Summary
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-50 rounded-md p-3">
              <p className="text-gray-500 text-xs">Customer</p>
              <p className="font-semibold text-gray-800">
                {salesReturnSearchedById?.customerName}
              </p>
            </div>

            <div className="bg-red-50 rounded-md p-3">
              <p className="text-red-500 text-xs">Total Return</p>
              <p className="font-semibold text-red-600">
                ৳ {salesReturnSearchedById?.totalReturnValue}
              </p>
            </div>

            <div className="bg-green-50 rounded-md p-3">
              <p className="text-green-500 text-xs">Refunded</p>
              <p className="font-semibold text-green-600">
                ৳ {salesReturnSearchedById?.paid}
              </p>
            </div>

            <div className="bg-blue-50 rounded-md p-3">
              <p className="text-blue-500 text-xs">Adjustment Due</p>
              <p className="font-semibold text-blue-600">
                ৳ {salesReturnSearchedById?.due}
              </p>
            </div>
          </div>
        </div>

        {/* Left: Stock Form */}
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">
              Refund by Cash (Money Back)
            </h2>
            <p className="text-xs text-gray-500 mt-1">Give cash to customer</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Pick A Date
            </label>
            <input
              type="date"
              value={date}
              min={dateRestriction}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

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
                  required
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
                  required
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

          {/* Final Summary */}
          <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-200">
            <h3 className="text-sm font-semibold text-yellow-800 mb-3">
              Summary
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white rounded border border-red-200">
                <div className="text-xs text-gray-600 mb-1">Return Value</div>
                <div className="text-xl font-bold text-red-600">
                  ৳ {returnValue.toFixed(2)}
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
            {loading && aid ? "Adding..." : "Add Return"}
          </button>
        </form>
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

export default EditSRCashDue;
