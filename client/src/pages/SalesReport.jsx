// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchSalesByDate } from "../features/sales/salesSlice";
// import { useNavigate } from "react-router-dom";

// const SalesReport = () => {
//   const { user } = useSelector((state) => state.auth);
//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//     }
//     if (user && user.role !== "admin") {
//       navigate("/");
//     }
//   }, []);

//   const { sales, loading, error, totalSales, totalCosts, profit } = useSelector(
//     (state) => state.sales
//   );

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [day, setDay] = useState("Today");

//   const handleOnClick = (query, d) => {
//     setDay(d);
//     dispatch(fetchSalesByDate(query));
//   };

//   useEffect(() => {
//     if (user && user.role === "admin") {
//       // console.log('fetching...')
//       dispatch(fetchSalesByDate("t"));
//     }
//   }, [dispatch]);

//   //? Glimpse Stopper
//   if (user && user.role !== "admin") return;

//   return (
//     <div className="p-6 bg-white min-h-screen">
//       {/* Title */}
//       <h1 className="text-2xl font-bold mb-2">Sales Report</h1>
//       <hr className="mb-4" />

//       {/* Buttons */}
//       <div className="flex flex-wrap gap-2 mb-6">
//         <button
//           onClick={() => handleOnClick("t", "Today")}
//           className="cursor-pointer flex items-center border px-4 py-2 bg-white hover:bg-gray-50"
//         >
//           <span className="mr-2">📅</span> Today's Sales
//         </button>
//         <button
//           onClick={() => handleOnClick("w", "This Week")}
//           className="cursor-pointer flex items-center border px-4 py-2 bg-white hover:bg-gray-50"
//         >
//           <span className="mr-2">📅</span> This Week
//         </button>
//         <button
//           onClick={() => handleOnClick("m", "This Month")}
//           className="cursor-pointer flex items-center border px-4 py-2 bg-white hover:bg-gray-50"
//         >
//           <span className="mr-2">📅</span> Monthly Sales
//         </button>
//         <button
//           onClick={() => handleOnClick("y", "This Year")}
//           className="cursor-pointer flex items-center border px-4 py-2 bg-white hover:bg-gray-50"
//         >
//           <span className="mr-2">📅</span> Annual Sales
//         </button>
//       </div>

//       {/* Today's Report Title */}
//       <h2 className="text-xl font-semibold mb-2">{day}'s Report</h2>
//       <hr className="mb-4" />

//       {/* Total Sales */}
//       {sales.length > 0 ? (
//         <div className="my-4 font-semibold">
//           <div>
//             Total Sales:{" "}
//             <span className="text-green-600">
//               {totalSales ? "৳" : ""} {totalSales.toLocaleString("en-BD")}
//             </span>
//           </div>

//           <div>
//             Total Costs:{" "}
//             <span className="text-green-600">
//               {totalCosts ? "৳" : ""} {totalCosts.toLocaleString("en-BD")}
//             </span>
//           </div>

//           <div>
//             Profit:{" "}
//             <span className="text-green-600">
//               {profit ? "৳" : ""} {profit.toLocaleString("en-BD")}
//             </span>
//           </div>
//         </div>
//       ) : (
//         ""
//       )}
//       <div className="mt-4 font-semibold">
//         Total Sales {day}:
//         <span className="text-green-600">
//           {totalSales ? "৳" : ""} {totalSales}
//         </span>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto border rounded">
//         <table className="min-w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border px-4 py-2 text-left">Date</th>
//               <th className="border px-4 py-2 text-left">Item</th>
//               <th className="border px-4 py-2 text-left">Price</th>
//               <th className="border px-4 py-2 text-left">Quantity</th>
//               <th className="border px-4 py-2 text-left">Sub Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {sales.length > 0 ? (
//               sales.map((sale, index) => (
//                 <tr key={index}>
//                   <td className="border px-4 py-2">
//                     {new Date(sale.createdAt)
//                       .toLocaleDateString("en-GB", { timeZone: "Asia/Dhaka" })
//                       .replaceAll("/", "-")}
//                   </td>
//                   <td className="border px-4 py-2">{sale.productName}</td>
//                   <td className="border px-4 py-2">৳ {sale.sellPrice}</td>
//                   <td className="border px-4 py-2">{sale.quantity}</td>
//                   <td className="border px-4 py-2">৳ {sale.subtotal}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr className="text-center select-none text-gray-500 text-3xl">
//                 <td colSpan={5} className="px-4 py-2">
//                   No Sales Available.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default SalesReport;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalesByDate } from "../features/sales/salesSlice";
import { useNavigate } from "react-router-dom";

const SalesReport = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { sales, loading, error, totalSales, totalCosts, profit } = useSelector(
    (state) => state.sales
  );

  const [day, setDay] = useState("Today");

  const handleOnClick = (query, d) => {
    setDay(d);
    dispatch(fetchSalesByDate(query));
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.role === "admin") {
      dispatch(fetchSalesByDate("t"));
    }
  }, [dispatch, user]);

  if (user && user.role !== "admin") return null;

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-white min-h-screen">
      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-bold mb-2">Sales Report</h1>
      <hr className="mb-4" />

      {/* Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { query: "t", label: "Today" },
          { query: "w", label: "This Week" },
          { query: "m", label: "This Month" },
          { query: "y", label: "This Year" },
        ].map(({ query, label }) => (
          <button
            key={query}
            onClick={() => handleOnClick(query, label)}
            className="flex items-center border px-3 py-1 sm:px-4 sm:py-2 bg-white hover:bg-gray-50 text-xs sm:text-sm cursor-pointer"
          >
            <span className="mr-1 sm:mr-2">📅</span>
            {label}
          </button>
        ))}
      </div>

      {/* Report Title */}
      <h2 className="text-lg sm:text-xl font-semibold mb-2">{day}'s Report</h2>
      <hr className="mb-4" />

      {/* Summary */}
      {sales.length > 0 && (
        <div className="mb-4 text-sm sm:text-base font-semibold space-y-1">
          <div>
            Total Sales:{" "}
            <span className="text-green-600">
              ৳ {totalSales?.toLocaleString("en-BD")}
            </span>
          </div>
          <div>
            Total Costs:{" "}
            <span className="text-green-600">
              ৳ {totalCosts?.toLocaleString("en-BD")}
            </span>
          </div>
          <div>
            Profit:{" "}
            <span className="text-green-600">
              ৳ {profit?.toLocaleString("en-BD")}
            </span>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-xs sm:text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Date</th>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Item</th>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Price</th>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Qty</th>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Sub Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map((sale, index) => (
                <tr key={index}>
                  <td className="border px-2 py-1 sm:px-4 sm:py-2 whitespace-nowrap">
                    {new Date(sale.createdAt)
                      .toLocaleDateString("en-GB", { timeZone: "Asia/Dhaka" })
                      .replaceAll("/", "-")}
                  </td>
                  <td className="border px-2 py-1 sm:px-4 sm:py-2">
                    {sale.productName}
                  </td>
                  <td className="border px-2 py-1 sm:px-4 sm:py-2">
                    ৳ {sale.sellPrice}
                  </td>
                  <td className="border px-2 py-1 sm:px-4 sm:py-2">
                    {sale.quantity}
                  </td>
                  <td className="border px-2 py-1 sm:px-4 sm:py-2">
                    ৳ {sale.subtotal}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-gray-500 py-10 text-lg"
                >
                  No Sales Available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReport;