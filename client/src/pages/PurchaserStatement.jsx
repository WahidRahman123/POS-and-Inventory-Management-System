// PurchaserStatement.jsx
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchPurchasesForSupplierName } from "../features/statements/sStatementSlice";
import { useReactToPrint } from "react-to-print";


const PurchaserStatement = () => {
  const { user } = useSelector((state) => state.auth);
  const { purchases, totalAmount, totalPaid, totalDue, page, pages } =
    useSelector((state) => state.sstatement);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  console.log(purchases);

  const [filterToggler, setFilterToggler] = useState(true);
  const [date, setDate] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(page);

  // Printing
  const documentTitle = `supplier-statement-${new Date()
    .toISOString()
    .split(".")[0]
    .replaceAll(":", "_")}`;
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef, documentTitle });  

  useEffect(() => {
    if (user && state && state.supplierName) {
      dispatch(
        fetchPurchasesForSupplierName({
          supplierName: state.supplierName,
          // page: currentPage,
          dateSearch: date,
        })
      );
    }
  }, [dispatch, user, filterToggler, currentPage]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-maroon-800 to-red-700 p-4 sm:p-6">
      {state ? (
        <div ref={contentRef} className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl ring-1 ring-black/5 p-6 space-y-6 min-h-screen">
          {/* ---------- Header ---------- */}

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Purchaser Statement
            </h1>
            <div className="flex gap-2">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm print:hidden"
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm cursor-pointer print:hidden"
                onClick={() => setFilterToggler(!filterToggler)}
              >
                Filter
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer text-sm print:hidden"
                onClick={reactToPrintFn}
              >
                Print
              </button>
            </div>
          </div>

          {/* ---------- Supplier Info Card ---------- */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 border rounded-lg p-4 bg-gray-50">
            <div>
              <span className="text-xs text-gray-500">Supplier Name</span>
              <div className="font-semibold">{state.supplierName}</div>
            </div>
            <div>
              <span className="text-xs text-gray-500">Contact</span>
              <div className="font-semibold">
                {state.supplierPhone ? state.supplierPhone : "----"}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-500">Email</span>
              <div className="font-semibold">
                {state.supplierEmail ? state.supplierEmail : "----"}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-500">Total Due</span>
              <div className="font-semibold text-red-600">
                ৳{" "}
                {totalDue
                  ? totalDue.toLocaleString("en-BD", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : 0}
              </div>
            </div>
          </div>

          {/* ---------- Statement Table (Single Product Column) ---------- */}
          <div
            className="overflow-x-auto border border-gray-200 rounded-lg"
            
          >
            <table className="min-w-full text-xs sm:text-sm border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                    Date
                  </th>
                  <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                    Memo
                  </th>
                  <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                    Products
                  </th>
                  <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                    Qty
                  </th>
                  <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                    Total
                  </th>
                  <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                    Paid
                  </th>
                  <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                    Due
                  </th>
                  <th className="border px-2 py-1 sm:px-4 sm:py-2 text-center print:hidden">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* ---- Example Row ---- */}
                {purchases && purchases.length > 0 ? (
                  purchases.map((purchase, index) => (
                    <tr className="hover:bg-gray-50" key={index}>
                      <td className="border px-2 py-1 sm:px-4 sm:py-2">
                        {new Date(purchase.createdAt)
                          .toLocaleDateString("en-GB", {
                            timeZone: "Asia/Dhaka",
                          })
                          .replaceAll("/", "-")}
                      </td>
                      <td className="border px-2 py-1 sm:px-4 sm:py-2">
                        {purchase.memo}
                      </td>
                      <td className="border px-2 py-1 sm:px-4 sm:py-2 max-w-xs truncate">
                        {purchase.productNames}
                      </td>
                      <td className="border px-2 py-1 sm:px-4 sm:py-2">3</td>
                      <td className="border px-2 py-1 sm:px-4 sm:py-2">
                        ৳{" "}
                        {purchase.totalAmount
                          ? purchase.totalAmount.toLocaleString("en-BD", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : 0}
                      </td>
                      <td className="border px-2 py-1 sm:px-4 sm:py-2">
                        ৳{" "}
                        {purchase.paid
                          ? purchase.paid.toLocaleString("en-BD", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : 0}
                      </td>
                      <td className="border px-2 py-1 sm:px-4 sm:py-2 text-red-600 font-semibold">
                        ৳{" "}
                        {purchase.due
                          ? purchase.due.toLocaleString("en-BD", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : 0}
                      </td>
                      <td className="border px-2 py-1 sm:px-4 sm:py-2 print:hidden">
                        <div className="flex flex-wrap gap-1">
                          {purchase.due ? (
                            <Link
                              to={`/purchase-report/${purchase._id}/edit-due`}
                              className="text-xs text-white px-2 py-1 rounded bg-green-600 hover:bg-green-700"
                            >
                              Add Payment
                            </Link>
                          ) : (
                            <button className="text-xs text-white px-2 py-1 rounded cursor-no-drop bg-green-500">
                              Add Payment
                            </button>
                          )}

                          <Link
                            onClick={(e) => e.stopPropagation()}
                            to="/invoice-purchase"
                            state={purchase}
                            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 cursor-pointer"
                          >
                            Print
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center text-gray-500 py-6 select-none"
                    >
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ---------- Summary Card ---------- */}
          <div className="flex justify-end">
            <div className="w-80 border rounded-lg p-4 bg-gray-50 text-sm space-y-2">
              <div className="flex justify-between">
                <span>Total </span>
                <span className="font-semibold">
                  ৳{" "}
                  {totalAmount
                    ? totalAmount.toLocaleString("en-BD", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Paid</span>
                <span className="font-semibold">
                  ৳{" "}
                  {totalPaid
                    ? totalPaid.toLocaleString("en-BD", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : 0}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold border-t pt-2">
                <span>Total Due</span>
                <span className="text-red-600">
                  ৳{" "}
                  {totalDue
                    ? totalDue.toLocaleString("en-BD", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl ring-1 ring-black/5 p-6 space-y-6 min-h-screen">
          {/* ---------- Header ---------- */}

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Purchaser Statement
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center py-16 text-center text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2H5v-2h4v-2l3 3-3 3zM15 7v2h4v2h-4v2l-3-3 3-3z"
              />
            </svg>
            <p className="text-lg font-medium select-none">
              No purchaser data available
            </p>
            <p className="text-sm text-gray-500 select-none">
              Please select a purchaser from the purchase list to view the
              statement.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaserStatement;
