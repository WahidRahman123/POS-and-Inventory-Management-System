import React from 'react'

const AddStock = () => {
  return (
       <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg p-6 gap-8">
      {/* Left: Stock Form */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">Add Stock/s</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Stock In</label>
          <input
            type="number"
            placeholder="Enter Stocks To Add"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Add
        </button>
      </div>

      {/* Right: Item Information */}
      <div className="flex-1 border-l border-gray-200 pl-6">
        <h2 className="text-xl font-semibold mb-4">Item Information</h2>
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="w-28 font-medium">ID</span>
            <span>: 12</span>
          </div>
          <div className="flex">
            <span className="w-28 font-medium">Name</span>
            <span>: Test Test</span>
          </div>
          <div className="flex">
            <span className="w-28 font-medium">Category</span>
            <span>: Category QQ</span>
          </div>
          <div className="flex">
            <span className="w-28 font-medium">Description</span>
            <span>: This is just a demo test. This is just a demo test.</span>
          </div>
          <div className="flex">
            <span className="w-28 font-medium">Quantity</span>
            <span>: 0</span>
          </div>
          <div className="flex">
            <span className="w-28 font-medium">Price</span>
            <span>: $38.00</span>
          </div>
        </div>
      </div>
    </div>

  )
}

export default AddStock