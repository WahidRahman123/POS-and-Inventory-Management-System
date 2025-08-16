import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboardResult } from '../features/dashboard/dashboardSlice';

const Dashboard = () => {
  const { dashboardResult, loading, error } = useSelector(state => state.dashboard);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDashboardResult());
  }, [dispatch])
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
        <span className="text-3xl font-bold">{dashboardResult ? `${dashboardResult.totalCost.toLocaleString("en-BD")} ৳` : "-"}</span>
        <span className="mt-2">PURCHASES (BDT)</span>
      </div>
      <div className="bg-blue-800 text-white p-6 rounded-lg flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{dashboardResult ? `${dashboardResult.totalSell.toLocaleString("en-BD")} ৳` : "-"}</span>
        <span className="mt-2">SALES (BDT)</span>
      </div>
      <div className="bg-blue-800 text-white p-6 rounded-lg flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{dashboardResult ? `${dashboardResult.profit.toLocaleString("en-BD")} ৳` : "-"}</span>
        <span className="mt-2">PROFIT (BDT)</span>
      </div>
      {/* <div className="bg-blue-800 text-white p-6 rounded-lg flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{dashboardResult ? dashboardResult.numberOfSales : "-"}</span>
        <span className="mt-2">SALE ORDERS</span>
      </div> */}
      <div className="bg-blue-800 text-white p-6 rounded-lg flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{dashboardResult ? dashboardResult.numberOfProducts : "-"}</span>
        <span className="mt-2">TOTAL ITEMS</span>
      </div>
    </div>
  </div>
</div>


  )
}

export default Dashboard