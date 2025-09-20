// import React from 'react'

// const Purchase = () => {
//   return (
//     <div>Purchase</div>
//   )
// }

// export default Purchase

import React from "react";

const Purchase = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-4 md:p-6 font-sans">
      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Purchase Entry</h1>

      {/* Purchase Add Form */}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <input
            type="date"
            placeholder="Date"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Memo"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Supplier Name"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Products Name (comma separated)"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <input
            type="number"
            placeholder="Quantity"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Total Amount"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Paid"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Due"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <button className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium">
          Add Purchase
        </button>
      </div>

      {/* Purchase Report Table */}
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        {/* <h2 className="text-lg sm:text-xl font-semibold mb-4">Purchase Report</h2> */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
  <h2 className="text-lg sm:text-xl font-semibold">Purchase Report</h2>

  {/* Date Search — Right side top */}
  <div className="flex items-center gap-2 ml-auto">
    <label className="text-xs sm:text-sm text-gray-600">Search by Date:</label>
    <input
      type="date"
      className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-36 sm:w-40"
    />
  </div>
</div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs sm:text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Date</th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Memo</th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Supplier</th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Products</th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Qty</th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Total</th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Paid</th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Due</th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Dummy Row */}
              <tr className="hover:bg-gray-50">
                <td className="border px-2 py-1 sm:px-4 sm:py-2">2025-09-20</td>
                <td className="border px-2 py-1 sm:px-4 sm:py-2">MEM-001</td>
                <td className="border px-2 py-1 sm:px-4 sm:py-2">ABC Supplier</td>
                <td className="border px-2 py-1 sm:px-4 sm:py-2">Oil, Filter, Plug</td>
                <td className="border px-2 py-1 sm:px-4 sm:py-2">50</td>
                <td className="border px-2 py-1 sm:px-4 sm:py-2">৳ 15,000</td>
                <td className="border px-2 py-1 sm:px-4 sm:py-2">৳ 10,000</td>
                <td className="border px-2 py-1 sm:px-4 sm:py-2">৳ 5,000</td>
                <td className="border px-2 py-1 sm:px-4 sm:py-2">
                  <div className="flex flex-wrap gap-1">
                    <button className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">
                      Add Payment
                    </button>
                    <button className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                      Print
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Purchase;