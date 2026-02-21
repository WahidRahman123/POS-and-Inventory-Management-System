// PurchaserStatement.jsx
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchPurchasesForSupplierName } from "../features/statements/sStatementSlice";
import { useReactToPrint } from "react-to-print";
import { FaArrowLeft } from "react-icons/fa";

const PurchaserStatement = () => {
  const { user } = useSelector((state) => state.auth);
  const { purchases, totalAmount, totalPaid, totalDue, page, pages } =
    useSelector((state) => state.sstatement);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  // console.log(purchases);

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
        }),
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
    <>
      <div className={`${state ? '': 'min-h-screen'} bg-slate-50 p-3 sm:p-4 md:p-6 font-sans`}>
        {state ? (
          <div
            ref={contentRef}
            className="max-w-6xl print:m-7 space-y-6"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                Purchaser Statement
              </h1>

              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm print:hidden"
                />
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors print:hidden"
                  onClick={() => setFilterToggler(!filterToggler)}
                >
                  Filter
                </button>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors print:hidden"
                  onClick={reactToPrintFn}
                >
                  Print
                </button>
              </div>
            </div>

            {/* Supplier Info Card */}
            <div className="bg-white border border-gray-300 rounded-lg p-4 sm:p-6 mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Supplier Name</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {state.supplierName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Contact</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {state.supplierPhone ? state.supplierPhone : "----"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {state.supplierEmail ? state.supplierEmail : "----"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Due</p>
                  <p className="text-sm font-bold text-red-600">
                    ৳{" "}
                    {totalDue
                      ? totalDue.toLocaleString("en-BD", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Statement Table */}
            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border-b border-gray-300 px-3 py-3 text-left font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="border-b border-gray-300 px-3 py-3 text-left font-semibold text-gray-700 max-w-[100px]">
                        Memo
                      </th>
                      <th className="border-b border-gray-300 px-3 py-3 text-left font-semibold text-gray-700 max-w-[90px]">
                        Products
                      </th>
                      <th className="border-b border-gray-300 px-3 py-3 text-left font-semibold text-gray-700">
                        Qty
                      </th>
                      <th className="border-b border-gray-300 px-3 py-3 text-left font-semibold text-gray-700">
                        Total
                      </th>
                      <th className="border-b border-gray-300 px-3 py-3 text-left font-semibold text-gray-700">
                        Paid
                      </th>
                      <th className="border-b border-gray-300 px-3 py-3 text-left font-semibold text-gray-700">
                        Due
                      </th>
                      <th className="border-b border-gray-300 px-3 py-3 text-left font-semibold text-gray-700 print:hidden">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases && purchases.length > 0 ? (
                      purchases.map((purchase, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border-b border-gray-300 px-3 py-3">
                            {new Date(purchase.createdAt)
                              .toLocaleDateString("en-GB", {
                                timeZone: "Asia/Dhaka",
                              })
                              .replaceAll("/", "-")}
                          </td>
                          <td className="border-b border-gray-300 px-3 py-3 max-w-[100px]">
                            {purchase.memo}
                          </td>
                          <td className="border-b border-gray-300 px-3 py-3 max-w-[90px]">
                            {purchase.productNames}
                          </td>
                          <td className="border-b border-gray-300 px-3 py-3">
                            3
                          </td>
                          <td className="border-b border-gray-300 px-3 py-3">
                            ৳{" "}
                            {purchase.totalAmount
                              ? purchase.totalAmount.toLocaleString("en-BD", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                              : 0}
                          </td>
                          <td className="border-b border-gray-300 px-3 py-3">
                            ৳{" "}
                            {purchase.paid
                              ? purchase.paid.toLocaleString("en-BD", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                              : 0}
                          </td>
                          <td className="border-b border-gray-300 px-3 py-3 text-red-600 font-semibold">
                            ৳{" "}
                            {purchase.due
                              ? purchase.due.toLocaleString("en-BD", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                              : 0}
                          </td>
                          <td className="border-b border-gray-300 px-3 py-3 print:hidden">
                            <div className="flex gap-2">
                              {purchase.due ? (
                                <Link
                                  to={`/purchase-report/${purchase._id}/edit-due`}
                                  className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded font-medium"
                                >
                                  Add Payment
                                </Link>
                              ) : (
                                <button className="text-xs bg-green-400 text-white px-3 py-1.5 rounded cursor-not-allowed">
                                  Add Payment
                                </button>
                              )}

                              <Link
                                onClick={(e) => e.stopPropagation()}
                                to="/invoice-purchase"
                                state={purchase}
                                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded font-medium"
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
            </div>

            {/* Summary Card */}
            <div className="flex justify-end">
              <div className="bg-white border border-gray-300 rounded-lg p-4 w-full sm:w-80">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total</span>
                    <span className="text-sm font-medium">
                      ৳{" "}
                      {totalAmount
                        ? totalAmount.toLocaleString("en-BD", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Paid</span>
                    <span className="text-sm font-medium">
                      ৳{" "}
                      {totalPaid
                        ? totalPaid.toLocaleString("en-BD", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : 0}
                    </span>
                  </div>
                  <div className="border-t border-gray-300 pt-3 flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-800">
                      Total Due
                    </span>
                    <span className="text-sm font-bold text-red-600">
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

      {/* Back Button */}
            <div className="flex justify-end mr-6">
              <Link
                to="/purchase"
                className="flex items-center text-sm sm:text-base font-medium text-green-600 hover:text-blue-800 cursor-pointer"
              >
                <FaArrowLeft className="mr-1 sm:mr-2" /> Go Back
              </Link>
            </div>
    </>
  );
};

export default PurchaserStatement;
