// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchSalesDueList } from "../features/sales/salesSlice";
// import { Link, useNavigate } from "react-router-dom";

// const SalesDueList = () => {
//   const { user } = useSelector((state) => state.auth);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { salesOfDues, page, pages } = useSelector((state) => state.sales);

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(page);
//   const [sortOrder, setSortOrder] = useState(-1);

//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//     }
//     if (user && user.role !== "admin") {
//       navigate("/");
//     }
//   }, [user, navigate]);

//   useEffect(() => {
//     if (user && user.role === "admin") {
//       dispatch(
//         fetchSalesDueList({
//           page: currentPage,
//           order: sortOrder
//         }),
//       );
//     }
//   }, [dispatch, user, currentPage, sortOrder]);

//   if (user && user.role !== "admin") return null;

//   return (
//     <div className="p-3 sm:p-4 md:p-6 bg-white min-h-screen">
//       {/* Title */}
//       <div className="flex justify-between items-center mb-2">
//         <h1 className="text-xl sm:text-2xl font-bold">Sales Report</h1>
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-800 hover:text-white transition duration-200 cursor-pointer"
//         >
//           ← Back
//         </button>
//       </div>
//       <hr className="mb-4" />

//       <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-3">
//         <div>
//           <select
//             value={sortOrder}
//             onChange={(e) => setSortOrder(e.target.value)}
//             className="border border-gray-300 bg-white rounded-md px-3 py-2 text-sm shadow-sm hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
//           >
//             <option value="1">Oldest First</option>
//             <option value="-1">Newest First</option>
//           </select>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full text-xs sm:text-sm border-collapse">
//           <thead className="bg-gray-300">
//             <tr>
//               <th
//                 rowSpan={2}
//                 className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
//               >
//                 Date
//               </th>
//               <th
//                 rowSpan={2}
//                 className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
//               >
//                 Cutomer Name
//               </th>
//               <th
//                 colSpan={3}
//                 className="border px-2 py-1 sm:px-4 sm:py-2 text-center"
//               >
//                 Products
//               </th>
//               <th
//                 rowSpan={2}
//                 className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
//               >
//                 Discount
//               </th>
//               <th
//                 rowSpan={2}
//                 className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
//               >
//                 Total
//               </th>

//               <th
//                 rowSpan={2}
//                 className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
//               >
//                 Paid
//               </th>
//               <th
//                 rowSpan={2}
//                 className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
//               >
//                 Due
//               </th>
//               <th
//                 rowSpan={2}
//                 className="border px-2 py-1 sm:px-4 sm:py-2 text-center"
//               >
//                 Action
//               </th>
//             </tr>
//             <tr>
//               <th className="border px-2 py-1 sm:px-4 sm:py-2 text-center">
//                 Name
//               </th>
//               <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
//                 Price
//               </th>
//               <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
//                 Qty
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {salesOfDues.length > 0 ? (
//               salesOfDues.map((sale, index) => {
//                 const rowspan = sale.products.length;
//                 const isEven = index % 2 === 0;

//                 return sale.products.map((product, index) => (
//                   <tr
//                     key={index}
//                     className={isEven ? "bg-white" : "bg-gray-50"}
//                   >
//                     {index === 0 && (
//                       <>
//                         <td
//                           rowSpan={rowspan}
//                           className="border px-2 py-1 sm:px-4 sm:py-2"
//                         >
//                           {new Date(sale.createdAt)
//                             .toLocaleDateString("en-GB", {
//                               timeZone: "Asia/Dhaka",
//                             })
//                             .replaceAll("/", "-")}
//                         </td>
//                         <td
//                           rowSpan={rowspan}
//                           className="border px-2 py-1 sm:px-4 sm:py-2"
//                         >
//                           {sale.customerName}
//                         </td>
//                       </>
//                     )}

//                     <td
//                       className={`border px-2 py-1 sm:px-4 sm:py-2 ${
//                         index !== sale.products.length - 1
//                           ? "border-b-gray-300"
//                           : ""
//                       }`}
//                     >
//                       {product.productName}
//                     </td>
//                     <td
//                       className={`border px-2 py-1 sm:px-4 sm:py-2 ${
//                         index !== sale.products.length - 1
//                           ? "border-b-gray-300"
//                           : ""
//                       }`}
//                     >
//                       {product.sellPrice}
//                     </td>
//                     <td
//                       className={`border px-2 py-1 sm:px-4 sm:py-2 ${
//                         index !== sale.products.length - 1
//                           ? "border-b-gray-300"
//                           : ""
//                       }`}
//                     >
//                       {product.quantity}
//                     </td>

//                     {index === 0 && (
//                       <>
//                         <td
//                           rowSpan={rowspan}
//                           className="border px-2 py-1 sm:px-4 sm:py-2"
//                         >
//                           {sale.discount ? sale.discount : 0}
//                         </td>
//                         <td
//                           rowSpan={rowspan}
//                           className="border px-2 py-1 sm:px-4 sm:py-2"
//                         >
//                           {sale.total}
//                         </td>

//                         <td
//                           rowSpan={rowspan}
//                           className="border px-2 py-1 sm:px-4 sm:py-2"
//                         >
//                           {sale.paid}
//                         </td>
//                         <td
//                           rowSpan={rowspan}
//                           className={`border px-2 py-1 sm:px-4 sm:py-2 ${
//                             sale.due > 0 ? "text-red-500 font-bold" : ""
//                           }`}
//                         >
//                           {sale.due}
//                         </td>
//                         <td
//                           rowSpan={rowspan}
//                           className="border px-2 py-1 sm:px-4 sm:py-2"
//                         >
//                           <div className="flex flex-wrap gap-1">
//                             <Link
//                               to={`/sales-report/${sale._id}/edit-due`}
//                               className="text-xs text-white px-2 py-1 rounded bg-green-600 hover:bg-green-700"
//                             >
//                               Add Payment
//                             </Link>
//                             <Link
//                               to="/invoice"
//                               state={sale}
//                               className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 cursor-pointer"
//                             >
//                               Print
//                             </Link>
//                           </div>
//                         </td>
//                       </>
//                     )}
//                   </tr>
//                 ));
//               })
//             ) : (
//               <tr>
//                 <td
//                   colSpan={10}
//                   className="text-center text-gray-500 py-10 text-lg select-none border"
//                 >
//                   No Sales Available.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>

//         {/* Pagination */}
//         {pages ? (
//           <div className="flex justify-center items-center mt-4 gap-2 text-sm">
//             <button
//               onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//               disabled={page === 1}
//               className={`${
//                 page === 1
//                   ? ""
//                   : "cursor-pointer hover:bg-black hover:text-white"
//               } px-2 py-1 border rounded  disabled:opacity-50`}
//             >
//               Prev
//             </button>
//             <span>
//               Page {page} of {pages}
//             </span>
//             <button
//               onClick={() => setCurrentPage((p) => Math.min(p + 1, pages))}
//               disabled={page === pages}
//               className={`${
//                 page === pages
//                   ? ""
//                   : "cursor-pointer hover:bg-black hover:text-white"
//               }  px-2 py-1 border rounded  disabled:opacity-50`}
//             >
//               Next
//             </button>
//           </div>
//         ) : (
//           ""
//         )}
//       </div>
//     </div>
//   );
// };

// export default SalesDueList;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchSalesDueList } from "../features/sales/salesSlice";
// import { Link, useNavigate } from "react-router-dom";

// const SalesDueList = () => {
//   const { user } = useSelector((state) => state.auth);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { salesOfDues, page, pages } = useSelector((state) => state.sales);

//   const [customerName, setCustomerName] = useState("");
//   // Pagination
//   const [currentPage, setCurrentPage] = useState(page);
//   const [sortOrder, setSortOrder] = useState(-1);

//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//     }
//     if (user && user.role !== "admin") {
//       navigate("/");
//     }
//   }, [user, navigate]);

//   useEffect(() => {
//     if (user && user.role === "admin") {
//       dispatch(
//         fetchSalesDueList({
//           customerName,
//           page: currentPage,
//           order: sortOrder,
//         }),
//       );
//     }
//   }, [dispatch, user, currentPage, sortOrder, customerName]);

//   if (user && user.role !== "admin") return null;

//   return (
//     <div className="p-3 sm:p-4 md:p-6 bg-white min-h-screen">
//       {/* Title */}
//       <div className="flex justify-between items-center mb-2">
//         <h1 className="text-xl sm:text-2xl font-bold">Sales Due List</h1>
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-800 hover:text-white transition duration-200 cursor-pointer"
//         >
//           ← Back
//         </button>
//       </div>
//       <hr className="mb-4" />

//       <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-3">
//         <div>
//           <select
//             value={sortOrder}
//             onChange={(e) => setSortOrder(e.target.value)}
//             className="border border-gray-300 bg-white rounded-md px-3 py-2 text-sm shadow-sm hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
//           >
//             <option value="1">Oldest First</option>
//             <option value="-1">Newest First</option>
//           </select>
//         </div>
//         <div>
//           <input
//           type="search"
//           placeholder="Customer Name Search"
//           value={customerName}
//           onChange={(e) => setCustomerName(e.target.value)}
//           className="border border-gray-300 rounded px-4 py-2 w-full sm:w-auto"
//         />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full text-xs sm:text-sm border-collapse">
//           <thead className="bg-gray-300">
//             <tr>
//               <th
//                 rowSpan={2}
//                 className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
//               >
//                 Date
//               </th>
//               <th
//                 rowSpan={2}
//                 className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
//               >
//                 Customer Name
//               </th>
//               <th
//                 colSpan={3}
//                 className="border px-2 py-1 sm:px-4 sm:py-2 text-center"
//               >
//                 Products
//               </th>
//               <th
//                 rowSpan={2}
//                 className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
//               >
//                 Discount
//               </th>
//               <th
//                 rowSpan={2}
//                 className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
//               >
//                 Total
//               </th>
//               <th
//                 rowSpan={2}
//                 className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
//               >
//                 Paid
//               </th>
//               <th
//                 rowSpan={2}
//                 className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
//               >
//                 Due
//               </th>
//               <th
//                 rowSpan={2}
//                 className="border px-2 py-1 sm:px-4 sm:py-2 text-center"
//               >
//                 Action
//               </th>
//             </tr>
//             <tr>
//               <th className="border px-2 py-1 sm:px-4 sm:py-2 text-center">
//                 Name
//               </th>
//               <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
//                 Price
//               </th>
//               <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
//                 Qty
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {salesOfDues.length > 0 ? (
//               salesOfDues.map((sale, saleIndex) => {
//                 // Handle cases where products might be empty (e.g. POS sales)
//                 const productsToDisplay =
//                   sale.products.length > 0 ? sale.products : [{}];
//                 const rowspan = productsToDisplay.length;
//                 const isEven = saleIndex % 2 === 0;

//                 return productsToDisplay.map((product, pIndex) => (
//                   <tr
//                     onClick={(e) => {
//                       if (e.target.tagName !== "TD") return;

//                       navigate("/customer-statement", {
//                         state: sale,
//                       });
//                     }}
//                     key={`${saleIndex}-${pIndex}`}
//                     className={isEven ? "bg-white cursor-pointer" : "bg-gray-50 cursor-pointer"}
//                   >
//                     {pIndex === 0 && (
//                       <>
//                         <td
//                           rowSpan={rowspan}
//                           className="border px-2 py-1 sm:px-4 sm:py-2"
//                         >
//                           {new Date(sale.createdAt)
//                             .toLocaleDateString("en-GB", {
//                               timeZone: "Asia/Dhaka",
//                             })
//                             .replaceAll("/", "-")}
//                         </td>
//                         <td
//                           rowSpan={rowspan}
//                           className="border px-2 py-1 sm:px-4 sm:py-2"
//                         >
//                           {sale.customerName}
//                         </td>
//                       </>
//                     )}

//                     <td className="border px-2 py-1 sm:px-4 sm:py-2">
//                       {product.productName || "N/A"}
//                     </td>
//                     <td className="border px-2 py-1 sm:px-4 sm:py-2">
//                       {product.sellPrice || 0}
//                     </td>
//                     <td className="border px-2 py-1 sm:px-4 sm:py-2">
//                       {product.quantity || 0}
//                     </td>

//                     {pIndex === 0 && (
//                       <>
//                         <td
//                           rowSpan={rowspan}
//                           className="border px-2 py-1 sm:px-4 sm:py-2"
//                         >
//                           {sale.discount || 0}
//                         </td>
//                         <td
//                           rowSpan={rowspan}
//                           className="border px-2 py-1 sm:px-4 sm:py-2"
//                         >
//                           {sale.total}
//                         </td>
//                         <td
//                           rowSpan={rowspan}
//                           className="border px-2 py-1 sm:px-4 sm:py-2"
//                         >
//                           {sale.paid}
//                         </td>
//                         <td
//                           rowSpan={rowspan}
//                           className={`border px-2 py-1 sm:px-4 sm:py-2 ${
//                             sale.due > 0 ? "text-red-500 font-bold" : ""
//                           }`}
//                         >
//                           {sale.due}
//                         </td>
//                         <td
//                           rowSpan={rowspan}
//                           className="border px-2 py-1 sm:px-4 sm:py-2"
//                         >
//                           <div className="flex flex-wrap gap-1">
//                             <Link
//                               to={`/sales-report/${sale._id}/edit-due`}
//                               className="text-xs text-white px-2 py-1 rounded bg-green-600 hover:bg-green-700"
//                             >
//                               Add Payment
//                             </Link>
//                             <Link
//                               to="/invoice"
//                               state={sale}
//                               className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 cursor-pointer"
//                             >
//                               Print
//                             </Link>
//                           </div>
//                         </td>
//                       </>
//                     )}
//                   </tr>
//                 ));
//               })
//             ) : (
//               <tr>
//                 <td
//                   colSpan={11}
//                   className="text-center text-gray-500 py-10 text-lg select-none border"
//                 >
//                   No Dues Available.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>

//         {/* Pagination */}
//         {pages > 1 && (
//           <div className="flex justify-center items-center mt-4 gap-2 text-sm">
//             <button
//               onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//               disabled={currentPage === 1}
//               className={`${
//                 currentPage === 1
//                   ? "opacity-50 cursor-not-allowed"
//                   : "cursor-pointer hover:bg-black hover:text-white"
//               } px-2 py-1 border rounded`}
//             >
//               Prev
//             </button>
//             <span>
//               Page {currentPage} of {pages}
//             </span>
//             <button
//               onClick={() => setCurrentPage((p) => Math.min(p + 1, pages))}
//               disabled={currentPage === pages}
//               className={`${
//                 currentPage === pages
//                   ? "opacity-50 cursor-not-allowed"
//                   : "cursor-pointer hover:bg-black hover:text-white"
//               } px-2 py-1 border rounded`}
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// import React, { useEffect, useState, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchSalesDueList } from "../features/sales/salesSlice";
// import { useNavigate } from "react-router-dom";
// import { useReactToPrint } from "react-to-print";
// import { FaPrint, FaArrowLeft } from "react-icons/fa";

// const SalesDueList = () => {
//   const { user } = useSelector((state) => state.auth);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { salesOfDues, page, pages, loading } = useSelector((state) => state.sales);

//   const [customerName, setCustomerName] = useState("");
//   const [currentPage, setCurrentPage] = useState(page || 1);
//   const [sortOrder, setSortOrder] = useState(-1);

//   // Print Reference
//   const printRef = useRef(null);

//   const reactToPrintFn = useReactToPrint({
//     contentRef: printRef,
//     documentTitle: `Sales-Due-List-${new Date().toISOString().slice(0, 10)}`,
//   });

//   useEffect(() => {
//     if (!user) navigate("/login");
//     if (user && user.role !== "admin") navigate("/");
//   }, [user, navigate]);

//   useEffect(() => {
//     if (user && user.role === "admin") {
//       dispatch(
//         fetchSalesDueList({
//           customerName,
//           page: currentPage,
//           order: sortOrder,
//         }),
//       );
//     }
//   }, [dispatch, user, currentPage, sortOrder, customerName]);

//   if (user && user.role !== "admin") return null;

//   return (
//     <div className="p-3 sm:p-4 md:p-6 bg-white min-h-screen">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Sales Due List</h1>
//         <div className="flex items-center gap-3">
//           <button
//             onClick={reactToPrintFn}
//             className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
//           >
//             <FaPrint /> Print Due List
//           </button>
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-800 hover:text-white transition duration-200 cursor-pointer"
//           >
//             <FaArrowLeft /> Back
//           </button>
//         </div>
//       </div>

//       <div className="flex flex-col sm:flex-row gap-3 mb-4">
//         <input
//           type="text"
//           placeholder="Search by Customer Name..."
//           value={customerName}
//           onChange={(e) => setCustomerName(e.target.value)}
//           className="border border-gray-300 rounded px-4 py-2.5 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />

//         <select
//           value={sortOrder}
//           onChange={(e) => setSortOrder(Number(e.target.value))}
//           className="border border-gray-300 bg-white rounded px-4 py-2.5 text-sm"
//         >
//           <option value="-1">Highest Due First</option>
//           <option value="1">Lowest Due First</option>
//         </select>
//       </div>

//       {/* Printable Content */}
//       <div ref={printRef}>
//         <div className="overflow-x-auto">
//           <table className="min-w-full border-collapse text-sm">
//             <thead className="bg-gray-800 text-white">
//               <tr>
//                 <th className="px-6 py-4 text-left">Customer Name</th>
//                 <th className="px-6 py-4 text-left">Mobile Number</th>
//                 <th className="px-6 py-4 text-right">Total Due Balance</th>
//                 <th className="px-6 py-4 text-center">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {salesOfDues && salesOfDues.length > 0 ? (
//                 salesOfDues.map((customer, index) => (
//                   <tr
//                     key={index}
//                     className="hover:bg-gray-50 cursor-pointer"
//                     onClick={() =>
//                       navigate("/customer-statement", {
//                         state: {
//                           customerName: customer.customerName,
//                           customerPhone: customer.customerPhone,
//                         },
//                       })
//                     }
//                   >
//                     <td className="px-6 py-4 font-medium">{customer.customerName}</td>
//                     <td className="px-6 py-4">{customer.customerPhone || "N/A"}</td>
//                     <td className="px-6 py-4 text-right font-bold text-red-600">
//                       ৳ {Number(customer.totalDue || 0).toLocaleString("en-BD")}
//                     </td>
//                     <td className="px-6 py-4 text-center">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           navigate("/customer-statement", {
//                             state: {
//                               customerName: customer.customerName,
//                               customerPhone: customer.customerPhone,
//                             },
//                           });
//                         }}
//                         className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1.5 rounded font-medium"
//                       >
//                         View Statement
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={4} className="text-center py-12 text-gray-500">
//                     No due records found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {pages > 1 && (
//         <div className="flex justify-center items-center mt-6 gap-3">
//           <button
//             onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//             disabled={currentPage === 1}
//             className="px-4 py-2 border rounded disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span className="font-medium">
//             Page {currentPage} of {pages}
//           </span>
//           <button
//             onClick={() => setCurrentPage((p) => Math.min(p + 1, pages))}
//             disabled={currentPage === pages}
//             className="px-4 py-2 border rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SalesDueList;

import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalesDueList } from "../features/sales/salesSlice";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { FaPrint, FaArrowLeft } from "react-icons/fa";

const SalesDueList = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // পেজিনেশনের page এবং pages ভেরিয়েবলগুলো স্টেট থেকে বাদ দেওয়া হয়েছে
  const {
    salesOfDues,
    customerPage: page,
    customerPages: pages,
  } = useSelector((state) => state.sales);

  const [customerName, setCustomerName] = useState("");
  const [sortOrder, setSortOrder] = useState(-1);
  const [currentPage, setCurrentPage] = useState(page);

  // Print Reference
  const printRef = useRef(null);

  const reactToPrintFn = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Sales-Due-List-${new Date().toISOString().slice(0, 10)}`,
  });

  useEffect(() => {
    if (!user) navigate("/login");
    if (user && user.role !== "admin") navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.role === "admin") {
      dispatch(
        fetchSalesDueList({
          customerName,
          order: sortOrder,
          page: currentPage,
        }),
      );
    }
  }, [dispatch, user, sortOrder, customerName, currentPage]);

  // console.log(salesOfDues);

  const grandTotalDue =
    salesOfDues && salesOfDues.length > 0
      ? salesOfDues.reduce(
          (sum, customer) => sum + Number(customer.due || 0),
          0,
        )
      : 0;

  if (user && user.role !== "admin") return null;

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Sales Due List
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={reactToPrintFn}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <FaPrint /> Print Due List
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-800 hover:text-white transition duration-200 cursor-pointer"
          >
            <FaArrowLeft /> Back
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by Customer Name..."
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2.5 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="border border-gray-300 bg-white rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="-1">Highest Due First</option>
            <option value="1">Lowest Due First</option>
          </select>
        </div>

        {/* সর্ট অর্ডার ফিল্ডের পাশে অল-রেকর্ডস গ্র্যান্ড টোটাল */}
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-2.5 flex items-center justify-between sm:justify-start gap-4 shadow-sm w-full sm:w-auto self-stretch sm:self-center">
          <span className="text-xs sm:text-sm font-semibold text-red-700 uppercase tracking-wider">
            Total Customers Due:
          </span>
          <span className="text-base sm:text-lg font-black text-red-600 animate-pulse">
            ৳ {grandTotalDue.toLocaleString("en-BD")}
          </span>
        </div>
      </div>

      {/* Printable Content */}
      <div ref={printRef}>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Customer Name</th>
                <th className="px-6 py-4 text-left">Mobile Number</th>
                <th className="px-6 py-4 text-right">Total Due Balance</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {salesOfDues && salesOfDues.length > 0 ? (
                salesOfDues.map((customer, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      navigate("/customer-statement", {
                        state: {
                          customerName: customer.name,
                          customerPhone: customer.phone,
                        },
                      })
                    }
                  >
                    <td className="px-6 py-4 font-medium">{customer.name}</td>
                    <td className="px-6 py-4">{customer.phone || "N/A"}</td>
                    <td className="px-6 py-4 text-right font-bold text-red-600">
                      ৳ {Number(customer.due || 0).toLocaleString("en-BD")}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-wrap gap-1 justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentDue = customer.due;
                            const customerId = customer._id;
                            const customerName = customer.name;

                            navigate("/sales/due-payment", {
                              state: {
                                customerName,
                              },
                            });

                            // currentDue <= 0
                            //   ? navigate("")
                            //   : navigate("/sales/due-payment", {
                            //       state: {
                            //         customerName
                            //       },
                            //     });
                          }}
                          // className={`text-xs text-white px-2 py-1 rounded  ${customer.due <= 0 ? "cursor-not-allowed bg-red-500" : "cursor-pointer bg-red-600 hover:bg-red-700"}`}
                          // disabled={customer.due <= 0}

                          className={`text-xs text-white px-2 py-1 rounded cursor-pointer bg-red-600 hover:bg-red-700`}
                        >
                          Due Payment
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/customer-statement", {
                              state: {
                                customerName: customer.name,
                                customerPhone: customer.phone,
                              },
                            });
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded font-medium"
                        >
                          View Statement
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-500">
                    No due records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pages ? (
        <div className="flex justify-center items-center mt-4 gap-2 text-sm">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className={`${page === 1 ? "" : "cursor-pointer hover:bg-black hover:text-white"} px-2 py-1 border rounded  disabled:opacity-50`}
          >
            Prev
          </button>
          <span>
            Page {page} of {pages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, pages))}
            disabled={page === pages}
            className={`${page === pages ? "" : "cursor-pointer hover:bg-black hover:text-white"}  px-2 py-1 border rounded  disabled:opacity-50`}
          >
            Next
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default SalesDueList;
