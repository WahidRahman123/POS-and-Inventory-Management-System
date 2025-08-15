import React from 'react'

const PointOfSale = () => {
  return (
   <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md p-6">
  <h1 className="text-2xl font-bold text-gray-800 mb-4">Sale Order</h1>

  {/* Customer */}
  <div className="grid grid-cols-2 gap-x-6 mb-4">
    <div>
      <label className="block text-sm font-medium mb-1">CustomerName</label>
      <input type="text"  defaultValue="Customer1" 
             className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm" />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Address</label>
      <input type="text" defaultValue="Customer Address" 
             className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm" />
    </div>
  </div>
<div className="grid grid-cols-2 gap-x-6 mb-4"><div>
      <label className="block text-sm font-medium mb-1">Search Product</label>
      <input type="text" defaultValue="Search Product" 
             className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm" />
 </div>
 </div>
  

  {/* Table */}
  <table className="min-w-full border border-gray-300 mb-4">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-3 py-1.5 text-xs font-semibold text-gray-700 border-b">#</th>
        <th className="px-3 py-1.5 text-xs font-semibold text-gray-700 border-b">Product Name</th>
        <th className="px-3 py-1.5 text-xs font-semibold text-gray-700 border-b">Sale Price</th>
        <th className="px-3 py-1.5 text-xs font-semibold text-gray-700 border-b">Qty</th>
        <th className="px-3 py-1.5 text-xs font-semibold text-gray-700 border-b">Unit</th>
        
        <th className="px-3 py-1.5 text-xs font-semibold text-gray-700 border-b">ItemTotal</th>
        <th className="px-3 py-1.5 text-xs font-semibold text-gray-700 border-b">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="px-3 py-1.5 text-sm text-gray-800 border-b">1</td>
        <td className="px-3 py-1.5 text-sm text-gray-800 border-b">Product1</td>
        <td className="px-3 py-1.5 text-sm text-gray-800 border-b">150.00</td>
        <td className="px-3 py-1.5 text-sm text-gray-800 border-b">1</td>
        
        <td className="px-3 py-1.5 text-sm text-gray-800 border-b">1</td>
        <td className="px-3 py-1.5 text-sm text-gray-800 border-b">150.00</td>
        <td className="p-2 text-center">
            <button className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
              Delete
            </button>
          </td>
      </tr>
    </tbody>
  </table>

  {/* Totals */}
  <div className="flex justify-end mb-4">
    <div className="w-64 space-y-0.5 text-sm">
      <div className="flex justify-between">
        <span className="font-medium">OrderTotal(1pack,piece)</span>
        <span className="font-medium">150.00</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">Order&nbsp;Discount</span>
        <span className="font-medium">0</span>
      </div>
      <div className="flex justify-between font-bold">
        <span>Sub&nbsp;Total</span>
        <span>150.00</span>
      </div>
    </div>
  </div>

  {/* Payment */}
  <div className="grid grid-cols-2 gap-x-6 mb-4">
    <div>
      <label className="block text-sm font-medium mb-1">Cash</label>
      <input defaultValue="150.00" readOnly
             className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm" />
    </div>
    
  </div>
  

 

  {/* Footer */}
  <div className="flex justify-end mt-4">
    <div className="w-64 space-y-0.5 text-sm">
      <div className="flex justify-between font-bold">
        <span>Total</span><span>150.00</span>
      </div>
      <div className="flex justify-between font-bold">
        <span>Paid</span><span>150.00</span>
      </div>
      <div className="flex justify-between font-bold">
        <span>Due</span><span>0.00</span>
      </div>
    </div>
  </div>

  <button className="mt-4 w-full bg-blue-600 text-white font-bold py-2 rounded-sm">
    Pay&nbsp;150.00
  </button>
</div>
  )
}

export default PointOfSale