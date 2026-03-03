import React, { useState } from "react";
import { Link } from "react-router-dom";

const SalesReturn = () => {
  const [returnType, setReturnType] = useState("product");
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-4 md:p-6 font-sans">
      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Sales Return Entry
      </h1>

      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
        {/* Customer Info Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Customer Name
            </label>
            <div className="flex">
              <input
                type="search"
                placeholder="Customer Name"
                className="block w-[85%] px-3 py-1.5 border border-gray-300 rounded-sm text-sm"
              />
              <button
                type="button"
                className="bg-red-500 hover:bg-red-600 cursor-pointer ml-2 px-2 py-1 font-bold text-white rounded"
              >
                Change
              </button>
            </div>

            {/* Customer Dropdown */}
            <div className="w-[85%] max-h-50 shadow-md overflow-y-scroll">
              <table className="w-full">
                <tbody>
                  <tr className="p-2 cursor-pointer border-b border-gray-300 hover:bg-gray-100 text-gray-800">
                    <td className="p-2">XYZ Traders</td>
                    <td className="text-center">Dhaka</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              placeholder="Address"
              disabled
              className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm bg-gray-200 text-gray-700 select-none"
            />
          </div>
        </div>

        {/* Date and Memo Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <input
              type="date"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Memo Number"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1"
            />
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Load
            </button>
          </div>
        </div>

        <form>
          {/* Original Sale Products - Auto Loaded */}
          <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <span>Original Sale Products (Memo: #12345)</span>
              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                Auto Loaded
              </span>
            </h3>

            {/* Product 1 - With Return Price */}
            <div className="grid grid-cols-1 md:grid-cols-8 gap-3 mb-3 items-end bg-white p-3 rounded border border-blue-100">
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-600 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value="LED Bulb 12W"
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Sale Qty
                </label>
                <input
                  type="number"
                  value="10"
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Sale Price
                </label>
                <input
                  type="number"
                  value="1500"
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 text-red-600">
                  Return Price
                </label>
                <input
                  type="number"
                  placeholder="Return Price"
                  className="w-full px-3 py-2 border border-red-400 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 text-red-600">
                  Return Qty
                </label>
                <input
                  type="number"
                  placeholder="Qty"
                  className="w-full px-3 py-2 border border-red-400 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Qty (kg)
                </label>
                <input
                  type="number"
                  placeholder="kg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Line Total
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-red-50 text-red-700 font-semibold text-sm">
                  ৳ 0
                </div>
              </div>
            </div>

            {/* Original Sale Summary */}
            <div className="border-t border-blue-200 pt-3 mt-3">
              <div className="flex justify-end gap-6 text-sm">
                <span className="text-blue-800">
                  Total Sale: <strong>৳ 25,000</strong>
                </span>
                <span className="text-red-600 font-semibold text-lg">
                  Total Return Value: <strong>৳ 0</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Return Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* LEFT - Refund by Product */}
            <div 
              onClick={() => setReturnType("product")}
              className={`p-4 rounded-lg border-2 cursor-pointer ${
                returnType === "product" 
                  ? "border-green-500 bg-green-50" 
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="returnType"
                  value="product"
                  checked={returnType === "product"}
                  onChange={() => setReturnType("product")}
                  className="w-4 h-4 text-green-600"
                />
                <span className="font-medium text-gray-700">
                  Refund by Product (Exchange)
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Give new products to customer
              </p>
            </div>

            {/* RIGHT - Refund by Cash */}
            <div 
              onClick={() => setReturnType("cash")}
              className={`p-4 rounded-lg border-2 cursor-pointer ${
                returnType === "cash" 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="returnType"
                  value="cash"
                  checked={returnType === "cash"}
                  onChange={() => setReturnType("cash")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="font-medium text-gray-700">
                  Refund by Cash (Money Back)
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Give cash to customer
              </p>
            </div>
          </div>

          {/* CONDITIONAL SECTIONS */}

          {/* 1. REFUND BY PRODUCT - Multiple Products */}
          {returnType === "product" && (
            <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-green-800">
                  New Exchange Products
                </h3>
                <button
                  type="button"
                  className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm font-medium"
                >
                  + Add Product
                </button>
              </div>

              {/* Exchange Product Row */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-3 items-end">
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="Product Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Qty
                  </label>
                  <input
                    type="number"
                    placeholder="Qty"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Qty (kg)
                  </label>
                  <input
                    type="number"
                    placeholder="kg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Unit Price
                  </label>
                  <input
                    type="number"
                    placeholder="Price"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">
                      Total
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-green-100 text-green-700 font-semibold text-sm">
                      ৳ 0
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm h-fit mt-5"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Exchange Summary */}
              <div className="border-t border-green-200 pt-3 mt-3">
                <div className="flex justify-end">
                  <span className="text-green-800 font-semibold text-lg">
                    Total Exchange Value: ৳ 0
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 2. REFUND BY CASH - Simple Amount Input */}
          {returnType === "cash" && (
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
                    className="w-full px-4 py-2 border border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Payment Method
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    <option>Cash</option>
                    <option>Bank Transfer</option>
                    <option>Mobile Banking</option>
                    <option>Check</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Reference/Note
                  </label>
                  <input
                    type="text"
                    placeholder="Optional note"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Final Summary */}
          <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-200">
            <h3 className="text-sm font-semibold text-yellow-800 mb-3">
              Summary
            </h3>
            
            {returnType === "product" ? (
              /* Product Exchange Summary */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white rounded border border-red-200">
                  <div className="text-xs text-gray-600 mb-1">Return Value</div>
                  <div className="text-xl font-bold text-red-600">৳ 0</div>
                </div>
                <div className="text-center p-3 bg-white rounded border border-green-200">
                  <div className="text-xs text-gray-600 mb-1">Exchange Value</div>
                  <div className="text-xl font-bold text-green-600">৳ 0</div>
                </div>
                <div className="text-center p-3 bg-white rounded border border-blue-200">
                  <div className="text-xs text-gray-600 mb-1">
                    {returnType === "product" ? "Adjustment" : "Cash to Pay"}
                  </div>
                  <div className="text-xl font-bold text-blue-600">৳ 0</div>
                </div>
              </div>
            ) : (
              /* Cash Refund Summary */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white rounded border border-red-200">
                  <div className="text-xs text-gray-600 mb-1">Total Return Value</div>
                  <div className="text-xl font-bold text-red-600">৳ 0</div>
                </div>
                <div className="text-center p-3 bg-white rounded border border-blue-200">
                  <div className="text-xs text-gray-600 mb-1">Cash Refund Amount</div>
                  <div className="text-xl font-bold text-blue-600">৳ 0</div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {!isEditing ? (
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Return
              </button>
            ) : (
              <button
                type="button"
                className="px-6 py-2 bg-yellow-500 text-white font-medium rounded-md hover:bg-yellow-600 transition-colors"
              >
                Update Return
              </button>
            )}
            
            <button
              type="button"
              className="px-6 py-2 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Sales Return Report Table */}
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h2 className="text-lg sm:text-xl font-semibold">
            Sales Return Report
          </h2>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 ml-auto">
              <label className="text-xs sm:text-sm text-gray-600">
                Search by Customer:
              </label>
              <input
                type="search"
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-36 sm:w-40"
              />
            </div>
            <div className="text-right">
              <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 cursor-pointer">
                Filter
              </button>
              <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 cursor-pointer ml-2">
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs sm:text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Date</th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Memo</th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Customer</th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Type</th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Return</th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Refund</th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50 cursor-pointer">
                <td className="border px-2 py-1 sm:px-4 sm:py-2">15-02-2026</td>
                <td className="border px-2 py-1 sm:px-4 sm:py-2">#12345</td>
                <td className="border px-2 py-1 sm:px-4 sm:py-2">XYZ Traders</td>
                <td className="border px-2 py-1 sm:px-4 sm:py-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    Product
                  </span>
                </td>
                <td className="border px-2 py-1 sm:px-4 sm:py-2 text-red-600">৳ 5,000</td>
                <td className="border px-2 py-1 sm:px-4 sm:py-2 text-green-600">৳ 5,000</td>
                <td className="border px-2 py-1 sm:px-4 sm:py-2">
                  <div className="flex gap-1">
                    <button className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
                      Edit
                    </button>
                    <Link to="/invoice-sales-return" className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
                      Print
                    </Link>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 cursor-pointer">
                <td className="border px-2 py-1 sm:px-4 sm:py-2">20-01-2026</td>
                <td className="border px-2 py-1 sm:px-4 sm:py-2">#12346</td>
                <td className="border px-2 py-1 sm:px-4 sm:py-2">ABC Electronics</td>
                <td className="border px-2 py-1 sm:px-4 sm:py-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    Cash
                  </span>
                </td>
                <td className="border px-2 py-1 sm:px-4 sm:py-2 text-red-600">৳ 15,000</td>
                <td className="border px-2 py-1 sm:px-4 sm:py-2 text-blue-600">৳ 15,000</td>
                <td className="border px-2 py-1 sm:px-4 sm:py-2">
                  <div className="flex gap-1">
                    <button className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
                      Edit
                    </button>
                    <Link to="/invoice-sales-return" className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
                      Print
                    </Link>
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

export default SalesReturn;