import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const SalesReturnStatement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const returnData = location.state;

  // Sample data if no state passed
  const [returnItem] = useState(
    returnData || {
      customerName: "XYZ Traders",
      customerPhone: "01712-345678",
      customerEmail: "xyz@email.com",
      totalDue: 15000,
      createdAt: "2026-02-15",
      memo: "SR-1290",
      productNames: "LED Bulb 12W",
      quantity: 10,
      totalAmount: 15000,
      paid: 0,
      due: 15000,
    }
  );

  // Sample sales return history
  const [returnHistory] = useState([
    {
      _id: "1",
      date: "15-02-2026",
      memo: "SR-1290",
      products: "LED Bulb 12W",
      qty: 10,
      total: 15000,
      paid: 0,
      due: 15000,
    },
    {
      _id: "2",
      date: "20-01-2026",
      memo: "SR-1291",
      products: "Battery 12V",
      qty: 5,
      total: 25000,
      paid: 10000,
      due: 15000,
    },
  ]);

  const [date, setDate] = useState("");

  // Calculate totals
  const totalAmount = returnHistory.reduce((sum, item) => sum + item.total, 0);
  const totalPaid = returnHistory.reduce((sum, item) => sum + item.paid, 0);
  const totalDue = returnHistory.reduce((sum, item) => sum + item.due, 0);

  const handleFilter = () => {
    console.log("Filter by date:", date);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddPayment = (id) => {
    navigate(`/sales-return-report/${id}/edit-due`);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-4 md:p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Sales Return Statement
        </h1>
        
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="dd-----yyyy"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <button
            onClick={handleFilter}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Filter
          </button>
          <button
            onClick={handlePrint}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Print
          </button>
        </div>
      </div>

      {/* Customer Info Card */}
      <div className="bg-white border border-gray-300 rounded-lg p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Customer Name</p>
            <p className="text-sm font-semibold text-gray-800">
              {returnItem.customerName}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Contact</p>
            <p className="text-sm font-semibold text-gray-800">
              {returnItem.customerPhone || "----"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Email</p>
            <p className="text-sm font-semibold text-gray-800">
              {returnItem.customerEmail || "----"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Due</p>
            <p className="text-sm font-bold text-red-600">
              ৳ {totalDue.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Sales Return History Table */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border-b border-gray-300 px-3 py-3 text-left font-semibold text-gray-700">
                  Date
                </th>
                <th className="border-b border-gray-300 px-3 py-3 text-left font-semibold text-gray-700">
                  Memo
                </th>
                <th className="border-b border-gray-300 px-3 py-3 text-left font-semibold text-gray-700">
                  Products
                </th>
                <th className="border-b border-gray-300 px-3 py-3 text-left font-semibold text-gray-700">
                  Qty
                </th>
                <th className="border-b border-gray-300 px-3 py-3 text-left font-semibold text-gray-700">
                  Total
                </th>
                <th className="border-b border-gray-300 px-3 py-3 text-left font-semibold text-gray-700">
                  Paid
                </th>
                <th className="border-b border-gray-300 px-3 py-3 text-left font-semibold text-gray-700">
                  Due
                </th>
                <th className="border-b border-gray-300 px-3 py-3 text-left font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {returnHistory.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border-b border-gray-300 px-3 py-3">
                    {item.date}
                  </td>
                  <td className="border-b border-gray-300 px-3 py-3">
                    {item.memo}
                  </td>
                  <td className="border-b border-gray-300 px-3 py-3">
                    {item.products}
                  </td>
                  <td className="border-b border-gray-300 px-3 py-3">
                    {item.qty}
                  </td>
                  <td className="border-b border-gray-300 px-3 py-3">
                    ৳{" "}
                    {item.total.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="border-b border-gray-300 px-3 py-3">
                    ৳{" "}
                    {item.paid.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td
                    className={`border-b border-gray-300 px-3 py-3 font-semibold ${
                      item.due > 0 ? "text-red-600" : "text-gray-800"
                    }`}
                  >
                    ৳{" "}
                    {item.due.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="border-b border-gray-300 px-3 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddPayment(item._id)}
                        disabled={item.due === 0}
                        className={`text-xs px-3 py-1.5 rounded text-white font-medium ${
                          item.due > 0
                            ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                            : "bg-green-400 cursor-not-allowed"
                        }`}
                      >
                        Add Payment
                      </button>
                      <Link
                        to="/invoice-sales-return"
                        state={item}
                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded font-medium"
                      >
                        Print
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Card */}
      <div className="flex justify-end">
        <div className="bg-white border border-gray-300 rounded-lg p-4 w-full sm:w-80">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total</span>
              <span className="text-sm font-medium">
                ৳{" "}
                {totalAmount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Paid</span>
              <span className="text-sm font-medium">
                ৳{" "}
                {totalPaid.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="border-t border-gray-300 pt-3 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-800">Total Due</span>
              <span className="text-sm font-bold text-red-600">
                ৳{" "}
                {totalDue.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReturnStatement;