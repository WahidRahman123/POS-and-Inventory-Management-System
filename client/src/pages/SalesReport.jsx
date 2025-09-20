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
import { fetchSalesByDate, fetchSalesByIndividualDate } from "../features/sales/salesSlice";
import { Link, useNavigate } from "react-router-dom";

const SalesReport = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [date, setDate] = useState("");

  const { sales, loading, error, totalSales, totalCosts, profit } = useSelector(
    (state) => state.sales
  );

  const [day, setDay] = useState("Today");

  const handleOnClick = (query, d) => {
    setDay(d);
    // set the date to empty string
    setDate("");
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-lg sm:text-xl font-semibold">{day}'s Report</h2>

        {/* Date Search — Right side top */}
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-xs sm:text-sm text-gray-600">
            Search by Date:
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              if(e.target.value) {
                setDay(e.target.value)
                // Call the fetchSalesByDate
                dispatch(fetchSalesByIndividualDate(e.target.value));
              } else {
                setDay("Today");
                dispatch(fetchSalesByDate("t"));
              }

            }}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-36 sm:w-40"
          />
        </div>
      </div>
      {/* <h2 className="text-lg sm:text-xl font-semibold mb-2">{day}'s Report</h2>
      <hr className="mb-4" /> */}

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
          <thead className="bg-gray-300">
            {/* <tr>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Date</th>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Item</th>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Price</th>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Qty</th>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Sub Total</th>
            </tr> */}

            <tr>
              <th
                rowSpan={2}
                className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
              >
                Date
              </th>
              <th
                rowSpan={2}
                className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
              >
                Cutomer Name
              </th>
              <th
                colSpan={3}
                className="border px-2 py-1 sm:px-4 sm:py-2 text-center"
              >
                Products
              </th>
              <th
                rowSpan={2}
                className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
              >
                Discount
              </th>
              <th
                rowSpan={2}
                className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
              >
                Total
              </th>
              
              <th
                rowSpan={2}
                className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
              >
                Paid
              </th>
              <th
                rowSpan={2}
                className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
              >
                Due
              </th>
              <th
                rowSpan={2}
                className="border px-2 py-1 sm:px-4 sm:py-2 text-center"
              >
                Action
              </th>
            </tr>
            <tr>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-center">
                Name
              </th>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                Price
              </th>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                Qty
              </th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map((sale, index) => {
                const rowspan = sale.products.length;
                const isEven = index % 2 === 0;

                return sale.products.map((product, index) => (
                  <tr
                    key={index}
                    className={isEven ? "bg-white" : "bg-gray-50"}
                  >
                    {index === 0 && (
                      <>
                        <td
                          rowSpan={rowspan}
                          className="border px-2 py-1 sm:px-4 sm:py-2"
                        >
                          {new Date(sale.createdAt)
                            .toLocaleDateString("en-GB", {
                              timeZone: "Asia/Dhaka",
                            })
                            .replaceAll("/", "-")}
                        </td>
                        <td
                          rowSpan={rowspan}
                          className="border px-2 py-1 sm:px-4 sm:py-2"
                        >
                          {sale.customerName}
                        </td>
                      </>
                    )}

                    {/* Product columns */}
                    <td
                      className={`border px-2 py-1 sm:px-4 sm:py-2 ${
                        index !== sale.products.length - 1
                          ? "border-b-gray-300"
                          : ""
                      }`}
                    >
                      {product.productName}
                    </td>
                    <td
                      className={`border px-2 py-1 sm:px-4 sm:py-2 ${
                        index !== sale.products.length - 1
                          ? "border-b-gray-300"
                          : ""
                      }`}
                    >
                      {product.sellPrice}
                    </td>
                    <td
                      className={`border px-2 py-1 sm:px-4 sm:py-2 ${
                        index !== sale.products.length - 1
                          ? "border-b-gray-300"
                          : ""
                      }`}
                    >
                      {product.quantity}
                    </td>

                    {index === 0 && (
                      <>
                        <td
                          rowSpan={rowspan}
                          className="border px-2 py-1 sm:px-4 sm:py-2"
                        >
                          {sale.discount ? sale.discount : 0}
                        </td>
                        <td
                          rowSpan={rowspan}
                          className="border px-2 py-1 sm:px-4 sm:py-2"
                        >
                          {sale.total}
                        </td>
                        
                        <td
                          rowSpan={rowspan}
                          className="border px-2 py-1 sm:px-4 sm:py-2"
                        >
                          {sale.paid}
                        </td>
                        <td
                          rowSpan={rowspan}
                          className={`border px-2 py-1 sm:px-4 sm:py-2 ${
                            sale.due > 0 ? "text-red-500 font-bold" : ""
                          }`}
                        >
                          {sale.due}
                        </td>
                        {/* <td
                          rowSpan={rowspan}
                          className="border px-2 py-1 sm:px-4 sm:py-2"
                        >
                          <Link to={`/sales-report/${sale._id}/edit-due`} className="text-blue-500 cursor-pointer hover:text-blue-600 hover:underline">Add Payment</Link>
                        </td> */}
                        <td
                          rowSpan={rowspan}
                          className="border px-2 py-1 sm:px-4 sm:py-2"
                        >
                          <div className="flex flex-wrap gap-1">
                            <Link
                              to={
                                sale.due
                                  ? `/sales-report/${sale._id}/edit-due`
                                  : "#"
                              }
                              className={`text-xs text-white px-2 py-1 rounded ${
                                sale.due
                                  ? "bg-green-600 hover:bg-green-700"
                                  : "cursor-no-drop bg-green-500"
                              }`}
                            >
                              Add Payment
                            </Link>
                            <Link
                              to="/invoice"
                              state={sale}
                              className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 cursor-pointer"
                            >
                              Print
                            </Link>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ));
              })
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="text-center text-gray-500 py-10 text-lg select-none"
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
