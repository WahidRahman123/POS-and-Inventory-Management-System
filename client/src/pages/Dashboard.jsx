// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchDashboardResult } from "../features/dashboard/dashboardSlice";
// import { Link, useNavigate } from "react-router-dom";
// import CountUp from "react-countup";
// import Decimal from "decimal.js";

// const Dashboard = () => {
//   const { user } = useSelector((state) => state.auth);
//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//     }
//   }, []);

//   const { dashboardResult, loading, error } = useSelector(
//     (state) => state.dashboard
//   );
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (user) {
//       dispatch(fetchDashboardResult());
//     }
//   }, [dispatch]);

//   return (
//     <div className="min-h-screen bg-gray-100 font-sans flex flex-col lg:flex-row">
//       {/* Sidebar (Responsive - Optional hidden on mobile) */}
//       {/* Sidebar code thakle ekhane add koro */}

//       {/* Main Content */}
//       <div className="flex-1 p-4 sm:p-6">
//         {/* Header */}
//         <div className="flex justify-end mb-4 sm:mb-6 text-xs sm:text-sm text-gray-500"></div>

//         {/* KPI Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
//           {user && user.role === "admin" && (
//             <Link
//               to="/purchase"
//               className="bg-blue-800 text-white p-4 sm:p-6 rounded-lg flex flex-col items-center justify-center shadow-md hover:shadow-lg transition"
//             >
//               <span className="text-2xl sm:text-3xl font-bold">
//                 {dashboardResult ? (
//                   <CountUp
//                     end={dashboardResult.totalSupplierCost}
//                     duration={0.3}
//                     formattingFn={(value) =>
//                       Number(value).toLocaleString("en-BD") + " ৳"
//                     }
//                   />
//                 ) : (
//                   "-"
//                 )}
//               </span>
//               <span className="mt-1 sm:mt-2 text-xs sm:text-sm">
//                 SUPPLIER PURCHASES (BDT)
//               </span>
//             </Link>
//           )}


//           {user && user.role === "admin" && (
//             <Link
//               to="/product"
//               className="bg-blue-800 text-white p-4 sm:p-6 rounded-lg flex flex-col items-center justify-center shadow-md hover:shadow-lg transition"
//             >
//               <span className="text-2xl sm:text-3xl font-bold">
//                 {dashboardResult ? (
//                   <CountUp
//                     end={dashboardResult.totalItemCost}
//                     duration={0.3}
//                     formattingFn={(value) =>
//                       Number(value).toLocaleString("en-BD") + " ৳"
//                     }
//                   />
//                 ) : (
//                   "-"
//                 )}
//               </span>
//               <span className="mt-1 sm:mt-2 text-xs sm:text-sm text-center">
//                 INTERNAL ITEM PURCHASES (BDT)
//               </span>
//             </Link>
//           )}

//           {user && user.role === "admin" && (
//             <Link
//               to="/sales-report"
//               className="bg-blue-800 text-white p-4 sm:p-6 rounded-lg flex flex-col items-center justify-center shadow-md hover:shadow-lg transition"
//             >
//               <span className="text-2xl sm:text-3xl font-bold">
//                 {dashboardResult ? (
//                   <CountUp
//                     end={dashboardResult.totalSell}
//                     duration={0.3}
//                     formattingFn={(value) =>
//                       Number(value).toLocaleString("en-BD") + " ৳"
//                     }
//                   />
//                 ) : (
//                   "-"
//                 )}
//               </span>
//               <span className="mt-1 sm:mt-2 text-xs sm:text-sm">
//                 SALES (BDT)
//               </span>
//             </Link>
//           )}

//           {user && user.role === "admin" && (
//             <div className="bg-blue-800 text-white p-4 sm:p-6 rounded-lg flex flex-col items-center justify-center shadow-md hover:shadow-lg transition">
//               <span className="text-2xl sm:text-3xl font-bold">
//                 {dashboardResult ? (
//                   <CountUp
//                     end={dashboardResult.profit}
//                     duration={0.3}
//                     formattingFn={(value) =>
//                       Number(value).toLocaleString("en-BD") + " ৳"
//                     }
//                   />
//                 ) : (
//                   "-"
//                 )}
//               </span>
//               <span className="mt-1 sm:mt-2 text-xs sm:text-sm">
//                 PROFIT (BDT)
//               </span>
//             </div>
//           )}

//           <Link
//             to="/product"
//             className="bg-blue-800 text-white p-4 sm:p-6 rounded-lg flex flex-col items-center justify-center shadow-md hover:shadow-lg transition"
//           >
//             <span className="text-2xl sm:text-3xl font-bold">
//               {dashboardResult ? (
//                 <CountUp
//                   end={dashboardResult.numberOfProducts}
//                   duration={0.3}
//                   formattingFn={(value) =>
//                     Number(value).toLocaleString("en-BD")
//                   }
//                 />
//               ) : (
//                 "-"
//               )}
//             </span>
//             <span className="mt-1 sm:mt-2 text-xs sm:text-sm">TOTAL ITEMS</span>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardResult } from "../features/dashboard/dashboardSlice";
import { Link } from "react-router-dom";
import CountUp from "react-countup";

/* Row Item */
const Row = ({ label, value, suffix = "" }) => (
  <div className="flex justify-between text-xs sm:text-sm mt-2 text-white/90">
    <span>{label}</span>
    <span className="font-medium">
      <CountUp
        end={value || 0}
        duration={0.4}
        formattingFn={(val) =>
          Number(val).toLocaleString("en-BD") + suffix
        }
      />
    </span>
  </div>
);

/* Standard Card */
const DashboardCard = ({
  title,
  value,
  suffix = "",
  children,
  to = "#",
  color,
}) => (
  <Link to={to} className="h-full">
    <div
      className={`${color} text-white rounded-2xl p-4 sm:p-5 lg:p-6 
      shadow-sm hover:shadow-lg hover:scale-[1.02] transition 
      h-full flex flex-col`}
    >
      {/* Title */}
      <h2 className="text-sm sm:text-base font-medium text-white/80">
        {title}
      </h2>

      {/* Main Value */}
      <div className="mt-2 sm:mt-3">
        <div className="text-xl sm:text-2xl lg:text-3xl font-bold">
          <CountUp
            end={value || 0}
            duration={0.4}
            formattingFn={(val) =>
              Number(val).toLocaleString("en-BD") + suffix
            }
          />
        </div>
      </div>

      {/* Bottom Content */}
      <div className="mt-auto pt-3">{children}</div>
    </div>
  </Link>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboardResult, loading } = useSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardResult());
  }, [dispatch]);

  if (loading || !dashboardResult) {
    return <p className="p-4 sm:p-6">Loading...</p>;
  }

  return (
    <div className="p-3 sm:p-5 lg:p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 items-stretch">

        {/* PURCHASE */}
        <DashboardCard
          title="Total Purchase"
          value={dashboardResult.purchaseTotal}
          suffix=" ৳"
          color="bg-blue-600"
          to="/purchase"
        >
          <Row label="Due" value={dashboardResult.purchaseDue} suffix=" ৳" />
          <Row
            label="Products"
            value={dashboardResult.purchaseTotalQuantity}
          />
        </DashboardCard>

        {/* EXCHANGE */}
        <DashboardCard
          title="Exchange"
          value={dashboardResult.exchangeTotalPrice}
          suffix=" ৳"
          color="bg-purple-600"
          to="/product-exchange"
        >
          <Row label="QTY" value={dashboardResult.exchangeTotalQuantity} />
          <Row
            label="KG"
            value={dashboardResult.exchangeTotalQuantityInKg}
          />
          <Row
            label="Remaining"
            value={dashboardResult.exchangeTotalRemaining}
            suffix=" ৳"
          />
        </DashboardCard>

        {/* SALES */}
        <DashboardCard
          title="Sales"
          value={dashboardResult.salesTotal}
          suffix=" ৳"
          color="bg-green-600"
          to="/sales-report"
        >
          <Row label="Due" value={dashboardResult.salesDue} suffix=" ৳" />
          <Row
            label="Profit"
            value={dashboardResult.salesProfit}
            suffix=" ৳"
          />
        </DashboardCard>

        {/* STOCK */}
        <DashboardCard
          title="Main Stock"
          value={dashboardResult.quantityDetails.mainQuantity}
          color="bg-orange-500"
          to="/product"
        >
          <div className="text-xs text-white/80 mt-2">
            Current Available Quantity
          </div>
        </DashboardCard>

      </div>
    </div>
  );
};

export default Dashboard;