import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { addPayment } from "../features/purchase/purchaseSlice";
import Decimal from "decimal.js";

const EditPurchaseDue = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [cashInput, setCashInput] = useState("");
  const [bankPaymentAmount, setBankPaymentAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState("");

  const data = location.state || {};
  const isSupplierLevel = data.isSupplierLevel === true;

  const supplierName = data.supplierName;
  const totalDue = isSupplierLevel ? data.totalDue : (data.due || 0);
  const purchaseId = isSupplierLevel ? null : data._id;

  const totalPaidLive = new Decimal(Number(cashInput || 0)).plus(
    new Decimal(Number(bankPaymentAmount || 0))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(totalPaidLive) <= 0) {
      return alert("Please enter a valid payment amount!");
    }

    setLoading(true);

    try {
      const payload = {
        amount: Number(totalPaidLive.toFixed(4)),
        date,
        cash: Number(cashInput || 0),
        remarks,
        bankPaymentAmount: Number(bankPaymentAmount || 0),
        unchangedAmount: Number(totalPaidLive.toFixed(4)),
      };

      if (isSupplierLevel) {
        payload.supplierId = data.supplierId;
        payload.isSupplierLevel = true;
      } else {
        payload.id = purchaseId;
      }

      await dispatch(addPayment(payload)).unwrap();

      alert("Due Payment Successful! 🎉");

      // Force refresh statement page
      navigate("/purchase");
      // অথবা সরাসরি statement এ যেতে চাইলে:
      // navigate("/purchaser-statement", { state: data });

    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment Failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) navigate("/login");
    if (!data.supplierName) navigate("/purchase");
  }, [user, data, navigate]);

  return (
    <>
      <title>{`Purchase Due Payment | ${import.meta.env.VITE_COMPANY_NAME}`}</title>
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
              {isSupplierLevel ? "Supplier Due Payment" : "Due Payment"}
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-green-600 hover:text-green-800"
            >
              <FaArrowLeft /> Back
            </button>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <p className="font-semibold text-lg">{supplierName}</p>
            <p className="text-red-600 font-bold text-xl mt-2">
              Total Due: ৳ {Number(totalDue).toLocaleString()}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Payment Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Payment Amount</label>
              <input
                type="number"
                value={totalPaidLive}
                onChange={(e) => {
                  const val = e.target.value;
                  setCashInput(val);
                  setBankPaymentAmount("0");
                }}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-xl font-semibold"
                placeholder="Enter amount"
                min="0"
                step="any"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm mb-1">Cash</label>
                <input
                  type="number"
                  value={cashInput}
                  onChange={(e) => setCashInput(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Bank</label>
                <input
                  type="number"
                  value={bankPaymentAmount}
                  onChange={(e) => setBankPaymentAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
              </div>
            </div>
            <div className="w-full mb-6">
              <label className="block text-sm mb-1">Remarks</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm"
                rows={2}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 rounded-lg text-lg font-semibold"
            >
              {loading ? "Processing..." : "Confirm Due Payment"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditPurchaseDue;