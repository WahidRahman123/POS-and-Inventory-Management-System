import React from 'react'

const Purchaser = () => {
  return (
     <div className="min-h-screen bg-gradient-to-br from-blue-700 via-maroon-800 to-red-700 p-4 sm:p-6">
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl ring-1 ring-black/5 p-6 space-y-8">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">Supplier Information</h1>

      {/* Entry Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input placeholder="Supplier Name" className="border border-gray-300 rounded-md px-3 py-2" />
        <input placeholder="Phone" className="border border-gray-300 rounded-md px-3 py-2" />
        <input placeholder="Email" type="email" className="border border-gray-300 rounded-md px-3 py-2" />
        <input placeholder="Address" className="border border-gray-300 rounded-md px-3 py-2" />
        <div className="sm:col-span-2 flex justify-end">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">Save Supplier</button>
        </div>
      </div>

      {/* Customer List */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Phone</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Address</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50">
              <td className="px-3 py-2">1</td>
              <td className="px-3 py-2 font-medium">John Doe</td>
              <td className="px-3 py-2">01712345678</td>
              <td className="px-3 py-2">john@mail.com</td>
              <td className="px-3 py-2">123 Street, Dhaka</td>
            </tr>
            <tr>
              <td colSpan={5} className="text-center text-gray-500 py-6">No customers added yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  )
}

export default Purchaser