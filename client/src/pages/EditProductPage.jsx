import React from 'react'

const EditProductPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen p-6 font-sans">
  {/* Header */}
  <header className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold">Add New Item</h1>
    <span className="text-sm text-gray-500">Friday, December 2023 | admin</span>
  </header>

  {/* Form Card */}
  <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
    <form>
      <label className="block text-sm font-medium mb-1">Item Name</label>
      <input
        type="text"
        defaultValue="Test Test"
        className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <label className="block text-sm font-medium mb-1">Category</label>
      <select className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option>Category QQ</option>
      </select>

      <label className="block text-sm font-medium mb-1">Price</label>
      <input
        type="number"
        defaultValue="38"
        className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <label className="block text-sm font-medium mb-1">Description</label>
      <textarea
        rows="4"
        defaultValue="This is just a demo test. This is just a demo test. This is just a demo test. This is just a demo test. This is just a demo test."
        className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700"
      >
        Update Item
      </button>
    </form>
  </div>
</div>
  )
}

export default EditProductPage