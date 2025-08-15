import React from 'react'

const Topbar = () => {
  return (
    <div className="bg-white shadow px-6 py-3 flex justify-between items-center">
  <a href="/dashboard"> <h1 className="text-lg font-bold">Dashboard</h1> </a>
  <div className="flex items-center gap-4">
    <input
      type="text"
      placeholder="Search..."
      className="border border-gray-300 rounded-md px-3 py-1 text-sm"
    />
    <span className="text-sm text-gray-600">Admin</span>
    <img
      src="/avatar.png"
      alt="User Avatar"
      className="w-8 h-8 rounded-full border"
    />
  </div>
</div>

  )
}

export default Topbar