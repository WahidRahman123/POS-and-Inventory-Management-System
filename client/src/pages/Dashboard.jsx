import React from 'react'

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans flex">
  {/* Sidebar */}
  

  {/* Main Content */}
  <div className="flex-1 p-6">
    {/* Header */}
    <div className="flex justify-end mb-6 text-sm text-gray-500">
      
    </div>

    {/* KPI Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-blue-800 text-white p-6 rounded-lg flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">11</span>
        <span className="mt-2">PURCHASES</span>
      </div>
      <div className="bg-blue-800 text-white p-6 rounded-lg flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">8</span>
        <span className="mt-2">SALES</span>
      </div>
      <div className="bg-blue-800 text-white p-6 rounded-lg flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">6</span>
        <span className="mt-2">PROFIT</span>
      </div>
      <div className="bg-blue-800 text-white p-6 rounded-lg flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">2</span>
        <span className="mt-2">SALE ORDERS</span>
      </div>
      <div className="bg-blue-800 text-white p-6 rounded-lg flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">2</span>
        <span className="mt-2">TOTAL ITEMS</span>
      </div>
    </div>
  </div>
</div>


  )
}

export default Dashboard