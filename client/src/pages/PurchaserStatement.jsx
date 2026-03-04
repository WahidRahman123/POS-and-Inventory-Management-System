// PurchaserStatement.jsx
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchPurchasesForSupplierName } from "../features/statements/sStatementSlice";
import { useReactToPrint } from "react-to-print";
import {
  FaArrowLeft,
  FaPrint,
  FaFilter,
  FaMoneyBillWave,
  FaBoxOpen,
} from "react-icons/fa";

const PurchaserStatement = () => {
  const { user } = useSelector((state) => state.auth);
  const { transactions, totalAmount, totalPaid, totalDue, page, pages } =
    useSelector((state) => state.sstatement);
  
    // console.log(purchases);
    
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

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
      {/* <div className={`${state ? '': 'min-h-screen'} bg-slate-50 p-3 sm:p-4 md:p-6 font-sans`}>
        {state ? (
          <div
            ref={contentRef}
            className="max-w-6xl print:m-7 space-y-6"
          >
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
                            {purchase.products
                              .map((p) => p.productName)
                              .join(", ")}
                          </td>
                          <td className="border-b border-gray-300 px-3 py-3">
                            {purchase.products.reduce((sum, item) => sum + item.quantity, 0)}
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
      </div> */}

      {/* Back Button */}
      {/* <div className="flex justify-end mr-6">
        <Link
          to="/purchase"
          className="flex items-center text-sm sm:text-base font-medium text-green-600 hover:text-blue-800 cursor-pointer"
        >
          <FaArrowLeft className="mr-1 sm:mr-2" /> Go Back
        </Link>
      </div> */}

      <div className="min-h-screen bg-slate-50 p-2 sm:p-4 md:p-6 font-sans text-gray-800">
        {state ? (
          <div ref={contentRef} className="max-w-6xl mx-auto space-y-6 print:p-5">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b pb-4 print:hidden">
              <h1 className="text-xl sm:text-2xl font-black text-gray-800 uppercase tracking-tight">
                Purchaser Ledger
              </h1>
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setFilterToggler(!filterToggler)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md"
                >
                  <FaFilter size={12} /> Filter
                </button>
                <button
                  onClick={reactToPrintFn}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md"
                >
                  <FaPrint size={12} /> Print
                </button>
              </div>
            </div>

            <div className="bg-white border-l-4 border-blue-600 rounded-xl p-4 sm:p-6 shadow-sm ring-1 ring-black/5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase">
                    Supplier Name
                  </p>
                  <p className="text-sm font-bold">{state.supplierName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase">
                    Contact
                  </p>
                  <p className="text-sm font-bold">
                    {state.supplierPhone || "----"}
                  </p>
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] text-gray-400 font-black uppercase">
                    Email
                  </p>
                  <p className="text-sm font-bold truncate">
                    {state.supplierEmail || "----"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    Current Balance (Net Due)
                  </p>
                  <p className="text-lg font-black text-red-600 font-mono">
                    ৳{" "}
                    {totalDue?.toLocaleString("en-BD", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-800 text-white uppercase text-[10px] font-black tracking-widest">
                    <tr>
                      <th className="px-6 py-4 text-left">Date</th>
                      <th className="px-6 py-4 text-left">Ref / Memo</th>
                      <th className="px-6 py-4 text-left">Description</th>
                      <th className="px-6 py-4 text-right">Bill Amt</th>
                      <th className="px-6 py-4 text-right">Paid Amt</th>
                      <th className="px-6 py-4 text-right">Due Balance</th>
                      <th className="px-6 py-4 text-center print:hidden">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transactions && transactions.length > 0 ? (transactions?.map((transaction, idx) => {
                      const isPayment =
                        transaction.refMemo?.startsWith("REF-");

                      return (
                        <tr
                          key={idx}
                          className={`${isPayment ? "bg-green-50/60" : "hover:bg-gray-50/50"} transition-colors`}
                        >
                          <td className="px-6 py-4 text-[11px] font-bold text-gray-500">
                            {new Date(transaction.date)
                              .toLocaleDateString("en-GB")
                              .replaceAll("/", "-")}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`text-[11px] font-black px-2 py-1 rounded ${isPayment ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}
                            >
                              {transaction.refMemo}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`text-xs ${isPayment ? "font-black text-green-700 italic" : "font-bold text-gray-700"}`}
                            >
                              {isPayment
                                ? "PAYMENT AGAINST DUE"
                                : transaction.purchaseId.products
                                    ?.map((p) => p.productName)
                                    .join(", ")}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-black">
                            ৳
                            {transaction.amountToBePaid.toLocaleString(
                              "en-BD",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              },
                            )}
                          </td>
                          <td className="px-6 py-4 text-right font-black text-green-600">
                            ৳
                            {transaction.paidAmount.toLocaleString(
                              "en-BD",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              },
                            )}
                          </td>
                          <td className="px-6 py-4 text-right font-black text-red-500 font-mono">
                            ৳
                            {transaction.currentDue?.toLocaleString(
                              "en-BD",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              },
                            )}
                          </td>
                          <td className="px-6 py-4 text-center print:hidden">
                            <Link
                              to="/invoice-purchase"
                              state={transaction}
                              className="text-blue-600 font-black text-[10px] uppercase"
                            >
                              Invoice
                            </Link>
                            {!isPayment && transaction.purchaseId.due > 0 && (
                              <Link
                                to={`/purchase-report/${transaction.purchaseId._id}/edit-due`}
                                className="ml-3 text-green-600 font-black text-[10px] uppercase underline"
                              >
                                Pay
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    })) : (
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

            <div className="flex justify-end pt-6">
              <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl w-full max-w-sm border-t-4 border-blue-500">
                <h3 className="text-[10px] font-black uppercase text-gray-500 mb-4 border-b border-gray-800 pb-2 text-center">
                  Grand Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-bold">Total Bill:</span>
                    <span className="font-mono">
                      ৳
                      {totalAmount?.toLocaleString("en-BD", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-green-400">
                    <span className="text-gray-400 font-bold">Total Paid:</span>
                    <span className="font-mono">
                      - ৳
                      {totalPaid?.toLocaleString("en-BD", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-800 pt-4 items-center">
                    <span className="font-black uppercase text-[10px] text-blue-500">
                      Net Balance
                    </span>
                    <span className="text-2xl font-black text-blue-400 font-mono">
                      ৳
                      {totalDue?.toLocaleString("en-BD", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl ring-1 ring-black/5 p-6 space-y-6 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-xl sm:text-2xl font-black text-gray-800 uppercase tracking-tight">
                Purchaser Ledger
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
    </>
  );
};

export default PurchaserStatement;
