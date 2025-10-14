import React from 'react'

const ExpenseManagement = () => {
  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-700 via-maroon-800 to-red-700 p-4 sm:p-6">
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl ring-1 ring-black/5 p-6 space-y-6">
      {/* ---------- Header ---------- */}
      <h1 className="text-2xl font-bold text-gray-800">Expense Management</h1>

      {/* ---------- Entry Form ---------- */}
      <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <input type="date" className="border border-gray-300 rounded-md px-3 py-2" required />
        <input type="text" placeholder="Description" className="border border-gray-300 rounded-md px-3 py-2" required />
        <input type="number" placeholder="Amount (৳)" min="0" className="border border-gray-300 rounded-md px-3 py-2" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Add Expense</button>
      </form>

      {/* ---------- Date Search ---------- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">Expense List</h2>
        <div className="flex items-center gap-2">
          <label className="text-xs sm:text-sm text-gray-600">Search by Date:</label>
          <input type="date" className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-36 sm:w-40" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">Filter</button>
        </div>
      </div>

      {/* ---------- Expense Table ---------- */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full text-xs sm:text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Date</th>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Description</th>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-right">Amount (৳)</th>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* ---- Example Row ---- */}
            <tr className="hover:bg-gray-50">
              <td className="border px-2 py-1 sm:px-4 sm:py-2">01-06-2025</td>
              <td className="border px-2 py-1 sm:px-4 sm:py-2">Transport Cost</td>
              <td className="border px-2 py-1 sm:px-4 sm:py-2 text-right">৳ 2,500</td>
              <td className="border px-2 py-1 sm:px-4 sm:py-2 text-center">
                <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">Print</button>
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border px-2 py-1 sm:px-4 sm:py-2">02-06-2025</td>
              <td className="border px-2 py-1 sm:px-4 sm:py-2">Office Rent</td>
              <td className="border px-2 py-1 sm:px-4 sm:py-2 text-right">৳ 15,000</td>
              <td className="border px-2 py-1 sm:px-4 sm:py-2 text-center">
                <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">Print</button>
              </td>
            </tr>
            {/* ---- No-data row ---- */}
            <tr>
              <td colSpan={4} className="text-center text-gray-500 py-6">
                No expenses found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ---------- Summary Card ---------- */}
      <div className="flex justify-end">
        <div className="w-64 border rounded-lg p-4 bg-gray-50 text-sm space-y-2">
          <div className="flex justify-between"><span>Total Expense</span><span className="font-semibold">৳ 17,500</span></div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default ExpenseManagement