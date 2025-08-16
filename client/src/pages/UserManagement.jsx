import React from 'react'

const UserManagement = () => {
  return (
    <div className="bg-slate-50 min-h-screen p-6 font-sans">
  {/* Header */}
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold">User Management</h1>
   
  </div>

 {/* Add New User */}
<div className="flex items-center justify-center  bg-gray-50 mb-5">
  <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
    <label className="block text-sm font-medium mb-1">Username</label>
    <input
      type="text"
      placeholder="Username"
      className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
    />
    <label className="block text-sm font-medium mb-1">Password</label>
    <input
      type="password"
      placeholder="Password"
      className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
    />
    
    <label className="block text-sm font-medium mb-1">Account Type</label>
    <select className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4">
      <option>Admin</option>
      <option>Cashier</option>
    </select>
    <button className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700">
      Add New User
    </button>
  </div>
</div>


  {/* All Users Table */}
  <div className="overflow-x-auto">
    <table className="w-full bg-white shadow-md rounded-lg text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">Username</th>
          <th className="p-2 text-left">Account Type</th>
          <th className="p-2 text-left">Date/Time Created</th>
          <th className="p-2 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr className="hover:bg-gray-50">
          <td className="p-2">admin</td>
          <td className="p-2">Admin</td>
          <td className="p-2">2023-12-07 11:38:12</td>
          <td className="p-2 text-center">
            <button className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
              Delete User
            </button>
          </td>
        </tr>
        <tr className="hover:bg-gray-50">
          <td className="p-2">cashier</td>
          <td className="p-2">Cashier</td>
          <td className="p-2">2023-12-07 08:46:00</td>
          <td className="p-2 text-center">
            <button className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
              Delete User
            </button>
          </td>
        </tr>
        <tr className="hover:bg-gray-50">
          <td className="p-2">clerk</td>
          <td className="p-2">Clerk</td>
          <td className="p-2">2023-12-07 08:45:50</td>
          <td className="p-2 text-center">
            <button className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
              Delete User
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

  )
}

export default UserManagement