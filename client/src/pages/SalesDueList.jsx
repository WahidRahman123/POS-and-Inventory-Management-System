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

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalesDueList } from "../features/sales/salesSlice";
import { Link, useNavigate } from "react-router-dom";

const SalesDueList = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { salesOfDues, page, pages } = useSelector((state) => state.sales);

  const [customerName, setCustomerName] = useState("");
  // Pagination
  const [currentPage, setCurrentPage] = useState(page);
  const [sortOrder, setSortOrder] = useState(-1);

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
      dispatch(
        fetchSalesDueList({
          customerName,
          page: currentPage,
          order: sortOrder,
        }),
      );
    }
  }, [dispatch, user, currentPage, sortOrder, customerName]);

  if (user && user.role !== "admin") return null;

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-white min-h-screen">
      {/* Title */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl sm:text-2xl font-bold">Sales Due List</h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-800 hover:text-white transition duration-200 cursor-pointer"
        >
          ← Back
        </button>
      </div>
      <hr className="mb-4" />

      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-3">
        <div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 bg-white rounded-md px-3 py-2 text-sm shadow-sm hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="1">Oldest First</option>
            <option value="-1">Newest First</option>
          </select>
        </div>
        <div>
          <input
          type="search"
          placeholder="Customer Name Search"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full sm:w-auto"
        />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs sm:text-sm border-collapse">
          <thead className="bg-gray-300">
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
                Customer Name
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
            {salesOfDues.length > 0 ? (
              salesOfDues.map((sale, saleIndex) => {
                // Handle cases where products might be empty (e.g. POS sales)
                const productsToDisplay =
                  sale.products.length > 0 ? sale.products : [{}];
                const rowspan = productsToDisplay.length;
                const isEven = saleIndex % 2 === 0;

                return productsToDisplay.map((product, pIndex) => (
                  <tr
                    onClick={(e) => {
                      if (e.target.tagName !== "TD") return;

                      navigate("/customer-statement", {
                        state: sale,
                      });
                    }}
                    key={`${saleIndex}-${pIndex}`}
                    className={isEven ? "bg-white cursor-pointer" : "bg-gray-50 cursor-pointer"}
                  >
                    {pIndex === 0 && (
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

                    <td className="border px-2 py-1 sm:px-4 sm:py-2">
                      {product.productName || "N/A"}
                    </td>
                    <td className="border px-2 py-1 sm:px-4 sm:py-2">
                      {product.sellPrice || 0}
                    </td>
                    <td className="border px-2 py-1 sm:px-4 sm:py-2">
                      {product.quantity || 0}
                    </td>

                    {pIndex === 0 && (
                      <>
                        <td
                          rowSpan={rowspan}
                          className="border px-2 py-1 sm:px-4 sm:py-2"
                        >
                          {sale.discount || 0}
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
                        <td
                          rowSpan={rowspan}
                          className="border px-2 py-1 sm:px-4 sm:py-2"
                        >
                          <div className="flex flex-wrap gap-1">
                            <Link
                              to={`/sales-report/${sale._id}/edit-due`}
                              className="text-xs text-white px-2 py-1 rounded bg-green-600 hover:bg-green-700"
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
                  colSpan={11}
                  className="text-center text-gray-500 py-10 text-lg select-none border"
                >
                  No Dues Available.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center items-center mt-4 gap-2 text-sm">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:bg-black hover:text-white"
              } px-2 py-1 border rounded`}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {pages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, pages))}
              disabled={currentPage === pages}
              className={`${
                currentPage === pages
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:bg-black hover:text-white"
              } px-2 py-1 border rounded`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesDueList;
