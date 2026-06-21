import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchPurchasesForSupplierName } from "../features/statements/sStatementSlice";
import { useReactToPrint } from "react-to-print";
import { FaArrowLeft, FaPrint, FaFilter } from "react-icons/fa";
import { fetchPurchaseReturnsForSupplierName } from "../features/PurchaseReturn/purchaseReturnSlice";
import { fetchSalesForCustomer } from "../features/sales/salesSlice";
import dayjs from "../utils/date.js";
import Decimal from "decimal.js";

const CustomerStatement = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    transactions,
    totalAmount,
    totalPaid,
    totalDue,
    page,
    currentBalance,
  } = useSelector((state) => state.sales);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  // console.log(transactions);

  const [filterToggler, setFilterToggler] = useState(true);
  const [date, setDate] = useState("");
  // console.log(state);

  const customerDetails = state ? {
    customerEmail: state.customerEmail,
    customerId: state.customerId,
    customerName: state.customerName,
    customerPhone: state.customerPhone
  } : null;

  // Printing
  const documentTitle = `customer-statement-${new Date()
    .toISOString()
    .split(".")[0]
    .replaceAll(":", "_")}`;
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef, documentTitle });

  useEffect(() => {
    if (user && state && state.customerName) {
      dispatch(
        fetchSalesForCustomer({
          customerName: state.customerName,
          dateSearch: date,
        }),
      );
    }
  }, [dispatch, user, filterToggler, state]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;
  return (
    <div className="min-h-screen bg-slate-50 p-2 sm:p-4 md:p-6 font-sans text-gray-800">
      {state ? (
        <div className="max-w-6xl mx-auto space-y-4">
          {/* Top Actions & Back Button (Hidden during print) */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-800 font-bold text-sm transition-all group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1" />
              Back to Sales List
            </button>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <button
                onClick={() => setFilterToggler(!filterToggler)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer transition-colors"
              >
                <FaFilter size={12} /> Filter
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const customerName = state.customerName;

                  navigate("/sales/due-payment", {
                    state: {
                      customerName,
                    },
                  });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer transition-colors"
              >
                Pay Due ৳{Math.abs(totalDue).toLocaleString()}
              </button>

              {/* <button
                onClick={() =>
                  navigate("/purchase-report/due-payment", {
                    state: {
                      supplierId: state.supplierId,
                      supplierName: state.supplierName,
                      totalDue: Math.abs(currentBalance),
                      isSupplierLevel: true,
                    },
                  })
                }
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium"
              >
                Pay Due ৳{Math.abs(currentBalance).toLocaleString()}
              </button> */}
              <button
                onClick={reactToPrintFn}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer transition-colors"
              >
                <FaPrint size={12} /> Print Ledger
              </button>
            </div>
          </div>

          {/* Printable Content Area */}
          <div ref={contentRef} className="space-y-6 print:p-5">
            {/* Header Title */}
            <div className="border-b pb-4">
              <h1 className="text-xl sm:text-2xl font-black text-gray-800 uppercase tracking-tight">
                Sales Ledger Statement
              </h1>
              <p className="text-xs text-gray-500 font-bold uppercase">
                Statement Date: {dayjs()
                  .tz("Asia/Dhaka")
                  .format("DD-MM-YYYY")}
              </p>
            </div>

            {/* Customer Info Card */}
            <div className="bg-white border-l-4 border-blue-600 rounded-xl p-4 sm:p-6 shadow-sm ring-1 ring-black/5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase">
                    Customer Name
                  </p>
                  <p className="text-sm font-bold">{state.customerName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase">
                    Contact
                  </p>
                  <p className="text-sm font-bold">
                    {state.customerPhone || "----"}
                  </p>
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] text-gray-400 font-black uppercase">
                    Email
                  </p>
                  <p className="text-sm font-bold truncate">
                    {state.customerEmail || "----"}
                  </p>
                </div>
                {/* <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    Current Balance
                  </p>
                  <p className="text-lg font-black text-red-600 font-mono">
                    ৳{" "}
                    {currentBalance?.toLocaleString("en-BD", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div> */}

                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    CURRENT BALANCE
                  </p>
                  <p
                    className={`text-xl font-bold ${currentBalance < 0 ? "text-red-600" : "text-green-600"}`}
                  >
                    ৳
                    {currentBalance?.toLocaleString("en-BD", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs mt-1 text-gray-600">
                    {currentBalance < 0
                      ? "(আমি কাস্টমারের কাছে পাই)"
                      : "(কাস্টমার আমার কাছে পায়)"}
                  </p>
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-800 text-white uppercase text-[10px] font-black tracking-widest">
                    <tr>
                      <th className="px-6 py-4 text-left">Date</th>
                      <th className="px-6 py-4 text-left">Ref / Memo</th>
                      <th className="px-6 py-4 text-left">Description</th>
                      <th className="px-6 py-4 text-left">Sale Total</th>
                      {/* <th className="px-6 py-4 text-right">Bill Amt</th> */}
                      <th className="px-6 py-4 text-right">Total Paid Amt</th>
                      {/* <th className="px-6 py-4 text-right">Paid Amt</th> */}
                      <th className="px-6 py-4 text-right">Current Balance</th>
                      <th className="px-6 py-4 text-center w-[160px]">
                        Remarks
                      </th>
                      <th className="px-6 py-4 text-center print:hidden">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transactions && transactions.length > 0 ? (
                      transactions.map((transaction, idx) => {
                        const isPayment =
                          transaction.refMemo?.startsWith("REF-");

                        return (
                          <tr
                            key={idx}
                            className={`${isPayment ? "bg-green-50/60" : "hover:bg-gray-50/50"} transition-colors`}
                          >
                            <td className="px-6 py-4 text-[11px] font-bold text-gray-500">
                              {
                                dayjs(transaction.date)
                                  .tz("Asia/Dhaka")
                                  .format("DD-MM-YYYY")
                              }
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
                                  : transaction.salesId?.products
                                    ?.map((p) => p.productName)
                                    .join(", ") || "Loan/Payment"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-left font-black">
                              {transaction.saleTotal
                                ? `৳ ${transaction.saleTotal.toLocaleString(
                                  "en-BD",
                                  { minimumFractionDigits: 2 },
                                )}`
                                : "--"}
                            </td>
                            {/* <td className="px-6 py-4 text-right font-black">
                              ৳{" "}
                              {transaction.amountToBePaid.toLocaleString(
                                "en-BD",
                                { minimumFractionDigits: 2 },
                              )}
                            </td> */}
                            <td className="px-6 py-4 text-right font-black text-green-600">
                              ৳{" "}
                              {transaction.advanceAmount || transaction.paidAmount
                                ? (
                                  new Decimal(transaction.advanceAmount).plus(
                                    new Decimal(transaction.paidAmount)
                                  ).toFixed(2)
                                )
                                : 0}
                            </td>
                            {/* <td className="px-6 py-4 text-right font-black text-green-600">
                              ৳{" "}
                              {transaction.paidAmount.toLocaleString("en-BD", {
                                minimumFractionDigits: 2,
                              })}
                            </td> */}

                            <td className="px-6 py-4 text-right font-black text-red-500 font-mono">
                              {transaction.currentBalance?.toLocaleString(
                                "en-BD",
                                {
                                  minimumFractionDigits: 2,
                                },
                              )}
                            </td>
                            <td className={`px-6 py-4 text-left font-black font-mono ${transaction.remarks ? " align-top" : "align-middle"}`}>
                              <div className={`w-[160px] break-all whitespace-normal ${transaction.remarks ? "text-gray-700" : "text-gray-400 italic text-center"}`}>
                                {transaction.remarks || "--"}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center print:hidden">
                              <div className="flex items-center justify-center gap-3">
                                <Link
                                  to="/invoice-for-customer"
                                  state={{ ...transaction, ...customerDetails }}
                                  className="text-blue-600 font-black text-[10px] uppercase hover:underline"
                                >
                                  Invoice
                                </Link>
                                {/* {!isPayment && transaction.salesId?.due > 0 && (
                                  <Link
                                    to={`/sales-report/${transaction.salesId._id}/edit-due`}
                                    className="text-green-600 font-black text-[10px] uppercase underline hover:text-green-800"
                                  >
                                    Pay
                                  </Link>
                                )} */}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={9}
                          className="text-center text-gray-400 py-12 italic"
                        >
                          No transactions found for this period.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Footer */}
            <div className="flex justify-end pt-4">
              <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl w-full max-w-sm border-t-4 border-blue-500">
                <h4 className="text-[10px] font-black uppercase text-gray-500 mb-4 text-center border-b border-gray-800 pb-2">
                  Account Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-bold">Total Bill:</span>
                    <span className="font-mono">
                      ৳{" "}
                      {totalAmount?.toLocaleString("en-BD", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-green-400">
                    <span className="text-gray-400 font-bold">Total Paid:</span>
                    <span className="font-mono">
                      - ৳{" "}
                      {totalPaid?.toLocaleString("en-BD", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-800 pt-4 items-center">
                    <span className="font-black uppercase text-[10px] text-blue-500">
                      Current Balance
                    </span>
                    <span className="text-2xl font-black text-blue-400 font-mono">
                      ৳{" "}
                      {currentBalance?.toLocaleString("en-BD", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-12 text-center mt-10">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaArrowLeft className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            No Purchaser Selected
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            Please select a supplier from the purchase list to view their
            transaction history.
          </p>
          <button
            onClick={() => navigate("/purchase")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg"
          >
            Go to Purchase List
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerStatement;
