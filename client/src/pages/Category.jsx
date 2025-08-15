import React from 'react'

const Category = () => {
  return (
    <div className="bg-slate-50 min-h-screen p-6 font-sans">
  {/* Header */}
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold">Categories</h1>
   
  </div>

  {/* Add New */}
  <div className="max-w-md mb-6">
    <label className="block text-sm font-medium mb-1">Category Name</label>
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Enter Category Name Here"
        className="flex-1 border border-gray-300 rounded-md px-3 py-2"
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
        Add Category
      </button>
    </div>
  </div>

  {/* Table */}
  <div className="overflow-x-auto">
    <table className="w-full bg-white shadow-md rounded-lg text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">Date/Time</th>
          <th className="p-2 text-left">Name</th>
          <th className="p-2 text-left">Created By</th>
          <th className="p-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr className="hover:bg-gray-50">
          <td className="p-2">2023-12-07 11:27:28</td>
          <td className="p-2">Category QQ</td>
          <td className="p-2">admin</td>
          <td className="p-2 text-center">
            <button className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
              Delete
            </button>
          </td>
        </tr>
        <tr className="hover:bg-gray-50">
          <td className="p-2">2023-12-07 11:27:22</td>
          <td className="p-2">Category Three</td>
          <td className="p-2">admin</td>
          <td className="p-2 text-center">
            <button className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
              Delete
            </button>
          </td>
        </tr>
        {/* Repeat rows as needed */}
      </tbody>
    </table>
  </div>
</div>

  )
}

export default Category