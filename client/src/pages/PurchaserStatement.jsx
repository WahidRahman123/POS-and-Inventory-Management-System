// PurchaserStatement.jsx
import React from "react";

const PurchaserStatement = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-700 via-maroon-800 to-red-700 p-4 sm:p-6">
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl ring-1 ring-black/5 p-6 space-y-6">
      {/* ---------- Header ---------- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Purchaser Statement</h1>
        <div className="flex gap-2">
          <input type="date" className="border border-gray-300 rounded-md px-3 py-2 text-sm" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">Filter</button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm">Print</button>
        </div>
      </div>

      {/* ---------- Supplier Info Card ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 border rounded-lg p-4 bg-gray-50">
        <div><span className="text-xs text-gray-500">Supplier Name</span><div className="font-semibold">ABC Traders</div></div>
        <div><span className="text-xs text-gray-500">Contact</span><div className="font-semibold">01811223344</div></div>
        <div><span className="text-xs text-gray-500">Email</span><div className="font-semibold">abc@mail.com</div></div>
        <div><span className="text-xs text-gray-500">Total Due</span><div className="font-semibold text-red-600">৳ 1,25,000</div></div>
      </div>

      {/* ---------- Statement Table (Single Product Column) ---------- */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full text-xs sm:text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Date</th>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Memo</th>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Products</th>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Qty</th>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Total</th>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Paid</th>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Due</th>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* ---- Example Row ---- */}
            <tr className="hover:bg-gray-50">
              <td className="border px-2 py-1 sm:px-4 sm:py-2">01-06-2025</td>
              <td className="border px-2 py-1 sm:px-4 sm:py-2">MEMO-1001</td>
              <td className="border px-2 py-1 sm:px-4 sm:py-2 max-w-xs truncate">Laptop, Mouse, Keyboard</td>
              <td className="border px-2 py-1 sm:px-4 sm:py-2">3</td>
              <td className="border px-2 py-1 sm:px-4 sm:py-2">৳ 46,000</td>
              <td className="border px-2 py-1 sm:px-4 sm:py-2">৳ 30,000</td>
              <td className="border px-2 py-1 sm:px-4 sm:py-2 text-red-600 font-semibold">৳ 16,000</td>
              <td className="border px-2 py-1 sm:px-4 sm:py-2">
                <div className="flex flex-wrap gap-1">
                  <button className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Add Payment</button>
                  <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">Print</button>
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={8} className="text-center text-gray-500 py-6">No transactions found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ---------- Summary Card ---------- */}
      <div className="flex justify-end">
        <div className="w-80 border rounded-lg p-4 bg-gray-50 text-sm space-y-2">
          <div className="flex justify-between"><span>Total </span><span className="font-semibold">৳ 1,50,000</span></div>
          <div className="flex justify-between"><span>Total Paid</span><span className="font-semibold">৳ 25,000</span></div>
          <div className="flex justify-between text-base font-bold border-t pt-2"><span>Total Due</span><span className="text-red-600">৳ 1,25,000</span></div>
        </div>
      </div>
    </div>
  </div>
);

export default PurchaserStatement;