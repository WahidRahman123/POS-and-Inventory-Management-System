import React from 'react'

const SalesReport = () => {
  
  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-2">Sales Report</h1>
      <hr className="mb-4" />

      {/* Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button className="flex items-center border px-4 py-2 bg-white hover:bg-gray-50">
          <span className="mr-2">📅</span> Today's Sales
        </button>
        <button className="flex items-center border px-4 py-2 bg-white hover:bg-gray-50">
          <span className="mr-2">📅</span> This Week
        </button>
        <button className="flex items-center border px-4 py-2 bg-white hover:bg-gray-50">
          <span className="mr-2">📅</span> Monthly Sales
        </button>
        <button className="flex items-center border px-4 py-2 bg-white hover:bg-gray-50">
          <span className="mr-2">📅</span> Annual Sales
        </button>
      </div>

      {/* Today's Report Title */}
      <h2 className="text-xl font-semibold mb-2">Today's Report</h2>
      <hr className="mb-4" />

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Date</th>
              <th className="border px-4 py-2 text-left">Item</th>
              <th className="border px-4 py-2 text-left">Price</th>
              <th className="border px-4 py-2 text-left">Quantity</th>
              <th className="border px-4 py-2 text-left">Sub Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">2023-12-08</td>
              <td className="border px-4 py-2">Test Item</td>
              <td className="border px-4 py-2">$23.00</td>
              <td className="border px-4 py-2">5</td>
              <td className="border px-4 py-2">$115.00</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Total Sales */}
      <div className="mt-4 font-semibold">
        Total Sales Today: <span className="text-green-600">$115</span>
      </div>
    </div>
  

  )
}

export default SalesReport