import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardResult } from "../features/dashboard/dashboardSlice";
import { useNavigate } from "react-router-dom";
import CountUp from 'react-countup';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  const { dashboardResult, loading, error } = useSelector(
    (state) => state.dashboard
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(user) {
      dispatch(fetchDashboardResult());
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col lg:flex-row">
  {/* Sidebar (Responsive - Optional hidden on mobile) */}
  {/* Sidebar code thakle ekhane add koro */}

  {/* Main Content */}
  <div className="flex-1 p-4 sm:p-6">
    {/* Header */}
    <div className="flex justify-end mb-4 sm:mb-6 text-xs sm:text-sm text-gray-500"></div>

    {/* KPI Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {user && user.role === "admin" && (
        <div className="bg-blue-800 text-white p-4 sm:p-6 rounded-lg flex flex-col items-center justify-center shadow-md hover:shadow-lg transition">
          <span className="text-2xl sm:text-3xl font-bold">
            {dashboardResult
              ? <CountUp end={dashboardResult.totalCost} duration={0.3} formattingFn={(value) => Number(value).toLocaleString('en-BD') + ' ৳'}/> 
              : "-"}
          </span>
          <span className="mt-1 sm:mt-2 text-xs sm:text-sm">PURCHASES (BDT)</span>
        </div>
      )}

      {user && user.role === "admin" && (
        <div className="bg-blue-800 text-white p-4 sm:p-6 rounded-lg flex flex-col items-center justify-center shadow-md hover:shadow-lg transition">
          <span className="text-2xl sm:text-3xl font-bold">
            {dashboardResult
              ? <CountUp end={dashboardResult.totalSell} duration={0.3} formattingFn={(value) => Number(value).toLocaleString('en-BD') + ' ৳'}/>
              : "-"}
          </span>
          <span className="mt-1 sm:mt-2 text-xs sm:text-sm">SALES (BDT)</span>
        </div>
      )}

      {user && user.role === "admin" && (
        <div className="bg-blue-800 text-white p-4 sm:p-6 rounded-lg flex flex-col items-center justify-center shadow-md hover:shadow-lg transition">
          <span className="text-2xl sm:text-3xl font-bold">
            {dashboardResult
              ? <CountUp end={dashboardResult.profit} duration={0.3} formattingFn={(value) => Number(value).toLocaleString('en-BD') + ' ৳'}/>
              : "-"}
          </span>
          <span className="mt-1 sm:mt-2 text-xs sm:text-sm">PROFIT (BDT)</span>
        </div>
      )}

      <div className="bg-blue-800 text-white p-4 sm:p-6 rounded-lg flex flex-col items-center justify-center shadow-md hover:shadow-lg transition">
        <span className="text-2xl sm:text-3xl font-bold">
          {dashboardResult ? <CountUp end={dashboardResult.numberOfProducts} duration={0.3} formattingFn={(value) => Number(value).toLocaleString('en-BD')} /> : "-"}
        </span>
        <span className="mt-1 sm:mt-2 text-xs sm:text-sm">TOTAL ITEMS</span>
      </div>
    </div>
  </div>
</div>

    // <div className="min-h-screen bg-gray-100 font-sans flex">
    //   {/* Sidebar */}

    //   {/* Main Content */}
    //   <div className="flex-1 p-6">
    //     {/* Header */}
    //     <div className="flex justify-end mb-6 text-sm text-gray-500"></div>

    //     {/* KPI Cards */}
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    //       {user && user.role === "admin" ? (
    //         <div className="bg-blue-800 text-white p-6 rounded-lg flex flex-col items-center justify-center">
    //           <span className="text-3xl font-bold">
    //             {dashboardResult
    //               ? `${dashboardResult.totalCost.toLocaleString("en-BD")} ৳`
    //               : "-"}
    //           </span>
    //           <span className="mt-2">PURCHASES (BDT)</span>
    //         </div>
    //       ) : (
    //         ""
    //       )}
    //       {user && user.role === "admin" ? (
    //         <div className="bg-blue-800 text-white p-6 rounded-lg flex flex-col items-center justify-center">
    //           <span className="text-3xl font-bold">
    //             {dashboardResult
    //               ? `${dashboardResult.totalSell.toLocaleString("en-BD")} ৳`
    //               : "-"}
    //           </span>
    //           <span className="mt-2">SALES (BDT)</span>
    //         </div>
    //       ) : (
    //         ""
    //       )}

    //       {user && user.role === "admin" ? (
    //         <div className="bg-blue-800 text-white p-6 rounded-lg flex flex-col items-center justify-center">
    //           <span className="text-3xl font-bold">
    //             {dashboardResult
    //               ? `${dashboardResult.profit.toLocaleString("en-BD")} ৳`
    //               : "-"}
    //           </span>
    //           <span className="mt-2">PROFIT (BDT)</span>
    //         </div>
    //       ) : (
    //         ""
    //       )}
    //       {/* <div className="bg-blue-800 text-white p-6 rounded-lg flex flex-col items-center justify-center">
    //     <span className="text-3xl font-bold">{dashboardResult ? dashboardResult.numberOfSales : "-"}</span>
    //     <span className="mt-2">SALE ORDERS</span>
    //   </div> */}
    //       <div className="bg-blue-800 text-white p-6 rounded-lg flex flex-col items-center justify-center">
    //         <span className="text-3xl font-bold">
    //           {dashboardResult ? dashboardResult.numberOfProducts : "-"}
    //         </span>
    //         <span className="mt-2">TOTAL ITEMS</span>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Dashboard;
