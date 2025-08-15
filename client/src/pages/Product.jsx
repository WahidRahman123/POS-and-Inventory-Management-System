import React from 'react'

const Product = () => {
  return (
    <div className="bg-slate-50 min-h-screen p-6 font-sans">

  
  <div className="flex justify-between items-center mb-4">
    <h1 className="text-2xl font-bold">Inventory List</h1>
    <a href="/add-item" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
      Add Item
    </a>
  </div>


  <div className="flex justify-between items-center mb-4">
    <span className="text-sm text-gray-600">Show 10 entries</span>
    <input type="text" placeholder="Search..." className="border border-gray-300 rounded-md px-3 py-1" />
  </div>

 
  <div className="overflow-x-auto">
    <table className="w-full bg-white shadow-md rounded-lg text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">#</th>
          <th className="p-2 text-left">Name</th>
          <th className="p-2 text-left">Category</th>
          <th className="p-2 text-center">Quantity</th>
          <th className="p-2 text-right">Cost Price</th>
          <th className="p-2 text-right">Sale Price</th>
          <th className="p-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
       
        <tr className="hover:bg-gray-50">
          <td className="p-2">1</td>
          <td className="p-2">Test Item</td>
          <td className="p-2">CategoryTest</td>
          
          <td className="p-2 text-center">84</td>
          <td className="p-2 text-right">$23.00</td>
          <td className="p-2 text-right">$38.00</td>
          <td className="p-2 flex gap-2 justify-center">
            <a href="#" className="text-xs bg-green-500 text-white px-2 py-1 rounded">Stock Entry</a>
            <a href="#" className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Update</a>
            <a href="#" className="text-xs bg-red-500 text-white px-2 py-1 rounded">Delete</a>
          </td>
        </tr>
        
      </tbody>
    </table>
  </div>
</div>

  )
}

export default Product
