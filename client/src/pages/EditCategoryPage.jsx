import React from 'react'

const EditCategoryPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen p-6 font-sans">
  {/* Header */}
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold">Categories</h1>
    <span className="text-sm text-gray-500">Friday, December 2023 | admin</span>
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
        Update Category
      </button>
    </div>
  </div>

  
</div>
  )
}

export default EditCategoryPage