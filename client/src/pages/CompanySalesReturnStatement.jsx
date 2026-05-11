import React, { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaPrint,
  FaFilter,
  FaMoneyBillWave,
  FaRegFileAlt,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { useEffect } from "react";
import { fetchCompanySalesReturnTRForSupplierName } from "../features/CompanySalesReturn/companySalesReturnSlice";

const CompanySalesReturnStatement = () => {
  const { user } = useSelector((state) => state.auth);
  const { transactions, totalAmount, totalPaid, totalDue } = useSelector(
    (state) => state.companySalesReturn,
  );
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch();

  const [filterToggler, setFilterToggler] = useState(true);
  const [date, setDate] = useState("");

  // Printing logic
  const documentTitle = `supplier-statement-${state?.supplierName || "report"}`;
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef, documentTitle });

  useEffect(() => {
    if (user && state && state.supplierName) {
      dispatch(
        fetchCompanySalesReturnTRForSupplierName({
          supplierName: state.supplierName,
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
          {/* --- Top Action Bar (Print Hidden) --- */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-800 font-bold text-sm transition-all group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1" />
              Back to Return List
            </button>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 bg-white outline-none"
              />
              <button
                onClick={() => setFilterToggler(!filterToggler)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer transition-colors"
              >
                <FaFilter size={12} /> Filter
              </button>
              <button
                onClick={reactToPrintFn}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer transition-colors"
              >
                <FaPrint size={12} /> Print Statement
              </button>
            </div>
          </div>

          {/* --- Printable Content Area --- */}
          <div ref={contentRef} className="space-y-6 print:p-5">
            {/* Header */}
            <div className="border-b pb-4 flex justify-between items-end">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-800 uppercase tracking-tight">
                  Company Sales Return Ledger Statement
                </h1>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                  Statement Date: {new Date().toLocaleDateString("en-GB")}
                </p>
              </div>
              <div className="text-right hidden sm:block">
                <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                  Verified Ledger
                </span>
              </div>
            </div>

            {/* Company Info Card (Purchaser look) */}
            <div className="bg-white border-l-4 border-red-600 rounded-xl p-4 sm:p-6 shadow-sm ring-1 ring-black/5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    Company Name
                  </p>
                  <p className="text-sm font-black text-gray-800 uppercase">
                    {state.supplierName}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    Contact
                  </p>
                  <p className="text-sm font-bold text-gray-600">
                    {state.supplierPhone}
                  </p>
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    Email
                  </p>
                  <p className="text-sm font-black text-green-600">
                    {state.supplierEmail}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    Current Receivable
                  </p>
                  <p className="text-lg font-black text-blue-600 font-mono tracking-tighter">
                    {totalDue} Pcs
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
                      <th className="px-6 py-4 text-right">Claim Qty</th>
                      <th className="px-6 py-4 text-right">Recv Qty</th>
                      <th className="px-6 py-4 text-right">Balance</th>
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

                        // Data structure for the single invoice page
                        const invoiceData = {
                          ...transaction,
                          memo: transaction.refMemo,
                          createdAt: transaction.date,
                          totalAmount: transaction.amountToBePaid,
                          paid: transaction.paidAmount,
                          due: transaction.currentDue,
                          supplierName: state.supplierName,
                          supplierPhone: state.supplierPhone,
                          supplierEmail: state.supplierEmail,
                        };

                        return (
                          <tr
                            key={idx}
                            className={`${isPayment ? "bg-green-50/60" : "hover:bg-gray-50/50"} transition-colors`}
                          >
                            <td className="px-6 py-4 text-[11px] font-bold text-gray-500 font-mono">
                              {new Date(transaction.date)
                                .toLocaleDateString("en-GB")
                                .replaceAll("/", "-")}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`text-[10px] font-black px-2 py-1 rounded ${isPayment ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}
                              >
                                {transaction.refMemo}
                              </span>
                            </td>
                            {/* <td className="px-6 py-4">
                              <span
                                className={`text-xs ${isPayment ? "font-black text-green-700 italic" : "font-bold text-gray-700"}`}
                              >
                                {isPayment
                                  ? "PRODUCT RECEIVED FROM COMPANY"
                                  : transaction.companySalesReturnId
                                      ?.productName}
                              </span>
                              {!isPayment && (
                                <div className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">
                                  Qty:{" "}
                                  {transaction.companySalesReturnId.totalAmountQty}
                                </div>
                              )}
                            </td> */}

                            <td className="px-6 py-4">
                              {isPayment ? (
                                // <span className="text-xs font-black text-green-700 italic">
                                //   PRODUCT RECEIVED FROM COMPANY
                                // </span>
                                <div className="space-y-2">
                                  {transaction.payDetails?.map((product, i) => (
                                    <div key={i} className="leading-5">
                                      <div className="text-xs font-bold text-green-700">
                                        {product.productName}
                                      </div>

                                      <div className="text-[11px] text-green-600 font-medium">
                                        Receive: {product.quantity} Pcs
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {transaction.companySalesReturnId?.products?.map(
                                    (product, i) => (
                                      <div key={i} className="leading-5">
                                        <div className="text-xs font-bold text-gray-800">
                                          {product.productName}
                                        </div>

                                        <div className="text-[11px] text-gray-600 font-medium">
                                          Qty: {product.quantity} Pcs
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </div>
                              )}
                            </td>

                            <td className="px-6 py-4 text-right font-black">
                              {transaction.amountToBePaid}
                            </td>
                            <td className="px-6 py-4 text-right font-black text-green-600">
                              {transaction.paidAmount}
                            </td>
                            <td className="px-6 py-4 text-right font-black text-blue-700 font-mono">
                              {transaction.currentDue}
                            </td>
                            <td className="px-6 py-4 text-center print:hidden">
                              <div className="flex items-center justify-center gap-3">
                                {!isPayment &&
                                transaction.companySalesReturnId?.dueQty > 0 ? (
                                  <Link
                                    to={`/company-sales-return/${transaction.companySalesReturnId._id}/edit-due`}
                                    className="text-green-600 font-black text-[10px] uppercase underline hover:text-green-800"
                                  >
                                    Pay
                                  </Link>
                                ) : (
                                  !isPayment && (
                                    <button className="text-green-600 font-black text-[10px] uppercase hover:underline flex items-center gap-1">
                                      Received
                                    </button>
                                  )
                                )}
                                <button
                                  title="View Details"
                                  className="text-gray-400 hover:text-blue-600"
                                >
                                  <FaRegFileAlt size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
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
                <h4 className="text-[10px] font-black uppercase text-gray-500 mb-4 text-center border-b border-gray-800 pb-2 tracking-[2px]">
                  Account Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">
                      Total Sent Claim:
                    </span>
                    <span className="font-mono font-black">
                      {totalAmount} Pcs
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-green-400">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">
                      Total Quantity Received:
                    </span>
                    <span className="font-mono font-black">
                      - {totalPaid} Pcs
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-800 pt-4 items-center">
                    <span className="font-black uppercase text-[10px] text-blue-500 tracking-tighter">
                      Net Receivable
                    </span>
                    <span className="text-2xl font-black text-blue-400 font-mono tracking-tighter">
                      {totalDue} Pcs
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-12 text-center mt-10">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaArrowLeft className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            No Company Sales Return Selected
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            Please select a company sales return from the list to view their
            transaction history.
          </p>
          <button
            onClick={() => navigate("/company-sales-return")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg"
          >
            Go to the List
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanySalesReturnStatement;
