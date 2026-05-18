import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { FaArrowLeft, FaPrint, FaFilter } from "react-icons/fa";
import { fetchSalesReturnsForCustomerName } from "../features/SalesReturn/salesReturnSlice";
import Decimal from "decimal.js";

const SalesReturnStatement = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    transactions,
    totalAmount,
    totalPaid,
    totalDue,
    totalReturnQuantity,
    totalReturnQuantityInKg,
    totalExchangeQuantity,
    remainingQuantity,
  } = useSelector((state) => state.salesReturn);

  // console.log(transactions);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  // console.log(state);

  const [payModal, setPayModal] = useState(null);
  const [filterToggler, setFilterToggler] = useState(true);
  const [date, setDate] = useState("");
  const [expandedTransactionIdx, setExpandedTransactionIdx] = useState(null);

  // Printing logic
  const documentTitle = `sales-return-statement-${state?.customerName || "report"}`;
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef, documentTitle });

  useEffect(() => {
    if (user && state && state.customerName) {
      dispatch(
        fetchSalesReturnsForCustomerName({
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
        <div
          ref={contentRef}
          className="max-w-6xl mx-auto space-y-4 sm:space-y-6 print:p-10"
        >
          <button
            onClick={() => navigate("/sales-return")}
            className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-800 font-bold text-sm transition-all group print:hidden"
          >
            <FaArrowLeft className="group-hover:-translate-x-1" />
            Back to the List
          </button>
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b pb-4">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-800 uppercase tracking-tight">
              Sales Return Statement
            </h1>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto print:hidden">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="flex-1 lg:flex-none border border-gray-300 rounded-md px-3 py-2 text-sm outline-none"
              />
              <button
                onClick={() => setFilterToggler(!filterToggler)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 cursor-pointer"
              >
                Filter
              </button>
              <button
                onClick={reactToPrintFn}
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 cursor-pointer"
              >
                Print
              </button>
            </div>
          </div>

          {/* Customer Info Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border-b sm:border-b-0 pb-2 sm:pb-0">
                <p className="text-[10px] text-gray-400 font-bold uppercase">
                  Customer Name
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {state.customerName}
                </p>
              </div>
              <div className="border-b sm:border-b-0 pb-2 sm:pb-0 text-left sm:text-right lg:text-left">
                <p className="text-[10px] text-gray-400 font-bold uppercase">
                  Contact
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {state.customerPhone}
                </p>
              </div>
              <div className="border-b sm:border-b-0 pb-2 sm:pb-0">
                <p className="text-[10px] text-gray-400 font-bold uppercase">
                  Email
                </p>
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {state.customerEmail}
                </p>
              </div>
              <div className="text-left sm:text-right lg:text-left">
                <p className="text-[10px] text-gray-400 font-bold uppercase">
                  Total Due
                </p>
                <p className="text-sm font-bold text-red-600 font-mono">
                  ৳{" "}
                  {Number(totalDue).toLocaleString("en-BD", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Responsive Table/Card Section */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {/* Desktop View: Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-2 py-4 text-center font-bold w-8"></th>
                    <th className="px-4 py-4 text-left font-bold">Date</th>
                    <th className="px-4 py-4 text-left font-bold">Memo/Ref</th>
                    <th className="px-4 py-4 text-left font-bold">Type</th>
                    <th className="px-4 py-4 text-left font-bold print:hidden">
                      Description
                    </th>
                    <th className="px-4 py-4 text-right font-bold">Return</th>
                    <th className="px-4 py-4 text-right font-bold">
                      Paid/Exch
                    </th>
                    <th className="px-4 py-4 text-center font-bold">Status</th>
                    <th className="px-4 py-4 text-center font-bold print:hidden">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions && transactions.length > 0 ? (
                    transactions.map((transaction, idx) => {
                      const isPayment = transaction.refMemo?.startsWith("REF-");

                      // Data structure for the single invoice page
                      const invoiceData = {
                        ...transaction,
                        memo: transaction.refMemo,
                        createdAt: transaction.date,
                        totalAmount: transaction.amountToBePaid,
                        paid: transaction.paidAmount,
                        due: transaction.currentDue,
                        customerName: state.customerName,
                        customerPhone: state.customerPhone,
                        customerEmail: state.customerEmail,
                      };

                      return (
                        <React.Fragment key={idx}>
                          <tr
                            className={`${isPayment ? "bg-blue-50/30" : "hover:bg-gray-50/50"} transition-colors`}
                          >
                            <td className="px-2 py-4 text-center">
                              {!isPayment && (
                                <button
                                  onClick={() =>
                                    setExpandedTransactionIdx(
                                      expandedTransactionIdx === idx
                                        ? null
                                        : idx,
                                    )
                                  }
                                  className="text-lg font-bold text-blue-600 hover:text-blue-800"
                                >
                                  {expandedTransactionIdx === idx ? "−" : "+"}
                                </button>
                              )}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-gray-500 font-medium text-xs">
                              {new Date(transaction.date)
                                .toLocaleDateString("en-GB")
                                .replaceAll("/", "-")}
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-4 py-4 font-bold text-blue-700">
                                {transaction.refMemo}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${isPayment ? "bg-blue-50 text-blue-700 border-blue-100" : transaction.returnType === "product" ? "bg-green-50 text-green-700 border-green-100" : "bg-orange-50 text-orange-700 border-orange-100"}`}
                              >
                                {isPayment ? "Payment" : transaction.returnType}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-gray-700 font-medium print:hidden">
                              <span>
                                {isPayment
                                  ? `Payment against Memo-${transaction.salesReturnId.memo}`
                                  : transaction.salesReturnId?.products
                                      ?.map((p) => p.productName)
                                      .join(", ") || "Sales Items"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right font-black">
                              ৳{" "}
                              {transaction.amountToBePaid.toLocaleString(
                                "en-BD",
                                {
                                  minimumFractionDigits: 2,
                                },
                              )}
                            </td>
                            <td className="px-6 py-4 text-right font-black text-green-600">
                              ৳{" "}
                              {transaction.paidAmount.toLocaleString("en-BD", {
                                minimumFractionDigits: 2,
                              })}
                            </td>
                            <td className="px-6 py-4 text-right font-black text-red-500 font-mono">
                              ৳{" "}
                              {transaction.currentDue?.toLocaleString("en-BD", {
                                minimumFractionDigits: 2,
                              })}
                            </td>
                            <td className="px-4 py-4 text-center print:hidden ">
                              <div className="flex justify-center gap-2">
                                <button className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer">
                                  Print
                                </button>
                                {!isPayment &&
                                  transaction.salesReturnId?.due > 0 && (
                                    <button
                                      onClick={() =>
                                        setPayModal(
                                          transaction.salesReturnId._id,
                                        )
                                      }
                                      className="text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
                                    >
                                      Pay
                                    </button>
                                  )}

                                {payModal && (
                                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4">
                                    <div className="w-full max-w-sm bg-white rounded-xl shadow-xl p-7">
                                      <h3 className="text-base font-semibold text-gray-700 mb-5 text-center">
                                        Select Payment Method
                                      </h3>

                                      <div className="flex flex-col gap-3">
                                        <Link
                                          to={`/sales-return/${payModal}/exchange-due`}
                                          className="w-full bg-green-600 text-white text-sm font-semibold py-2.5 rounded-lg text-center hover:bg-green-700 transition"
                                        >
                                          Exchange Pay
                                        </Link>

                                        <Link
                                          to={`/sales-return/${payModal}/edit-due`}
                                          className="w-full bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-lg text-center hover:bg-blue-700 transition"
                                        >
                                          Cash Pay
                                        </Link>

                                        <button
                                          onClick={() => setPayModal(null)}
                                          className="text-sm text-gray-500 mt-2 hover:text-gray-600 cursor-pointer"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>

                          {/* Expanded Row - Products Details */}
                          {expandedTransactionIdx === idx && !isPayment && (
                            <tr className="bg-blue-50">
                              <td colSpan={9} className="border px-4 py-4">
                                <div className="space-y-4">
                                  {/* RETURNED PRODUCTS */}
                                  <div>
                                    <h4 className="font-semibold text-red-700 mb-2 text-sm">
                                      📦 Returned Products:
                                    </h4>
                                    <div className="overflow-x-auto bg-white rounded border border-red-200">
                                      <table className="min-w-full text-xs">
                                        <thead className="bg-red-100">
                                          <tr>
                                            <th className="border px-2 py-1 text-left">
                                              Product Name
                                            </th>
                                            <th className="border px-2 py-1 text-center">
                                              Return Qty
                                            </th>
                                            <th className="border px-2 py-1 text-center">
                                              Qty (KG)
                                            </th>
                                            <th className="border px-2 py-1 text-center">
                                              Return Price
                                            </th>
                                            <th className="border px-2 py-1 text-center">
                                              Amount
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {transaction.salesReturnId?.products
                                            .length > 0 ? (
                                            transaction.salesReturnId.products.map(
                                              (product, pidx) => (
                                                <tr
                                                  key={pidx}
                                                  className="border-t hover:bg-red-50"
                                                >
                                                  <td className="border px-2 py-1">
                                                    {product.productName}
                                                  </td>
                                                  <td className="border px-2 py-1 text-center">
                                                    {product.returnQuantity}
                                                  </td>
                                                  <td className="border px-2 py-1 text-center">
                                                    {product.returnQtyInKg}
                                                  </td>
                                                  <td className="border px-2 py-1 text-center">
                                                    ৳ {product.returnPrice}
                                                  </td>
                                                  <td className="border px-2 py-1 text-center font-semibold text-red-600">
                                                    ৳{" "}
                                                    {new Decimal(
                                                      Number(product.lineTotal),
                                                    ).toFixed(2)}
                                                  </td>
                                                </tr>
                                              ),
                                            )
                                          ) : (
                                            <tr>
                                              <td
                                                colSpan={5}
                                                className="border px-2 py-2 text-center text-gray-500"
                                              >
                                                No products
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>

                                  {/* EXCHANGE PRODUCTS (if product exchange) */}
                                  {transaction.returnType === "product" && (
                                    <div>
                                      <h4 className="font-semibold text-green-700 mb-2 text-sm">
                                        🎁 Exchange Products:
                                      </h4>
                                      <div className="overflow-x-auto bg-white rounded border border-green-200">
                                        <table className="min-w-full text-xs">
                                          <thead className="bg-green-100">
                                            <tr>
                                              <th className="border px-2 py-1 text-left">
                                                Product Name
                                              </th>
                                              <th className="border px-2 py-1 text-center">
                                                Qty
                                              </th>
                                              <th className="border px-2 py-1 text-center">
                                                Qty (KG)
                                              </th>
                                              <th className="border px-2 py-1 text-center">
                                                Unit Price
                                              </th>
                                              <th className="border px-2 py-1 text-center">
                                                Amount
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {transaction.exchangeProducts
                                              .length > 0 ? (
                                              transaction.exchangeProducts.map(
                                                (product, pidx) => (
                                                  <tr
                                                    key={pidx}
                                                    className="border-t hover:bg-green-50"
                                                  >
                                                    <td className="border px-2 py-1">
                                                      {product.productName}
                                                    </td>
                                                    <td className="border px-2 py-1 text-center">
                                                      {product.quantity}
                                                    </td>
                                                    <td className="border px-2 py-1 text-center">
                                                      {product.qtyInKg}
                                                    </td>
                                                    <td className="border px-2 py-1 text-center">
                                                      ৳ {product.unitPrice}
                                                    </td>
                                                    <td className="border px-2 py-1 text-center font-semibold text-green-600">
                                                      ৳{" "}
                                                      {new Decimal(
                                                        Number(
                                                          product.subTotal,
                                                        ),
                                                      ).toFixed(2)}
                                                    </td>
                                                  </tr>
                                                ),
                                              )
                                            ) : (
                                              <tr>
                                                <td
                                                  colSpan={5}
                                                  className="border px-2 py-2 text-center text-gray-500"
                                                >
                                                  No products
                                                </td>
                                              </tr>
                                            )}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )}

                                  {/* CASH REFUND */}
                                  {transaction.returnType === "cash" && (
                                    <div className="bg-blue-100 border border-blue-300 rounded p-3">
                                      <h4 className="font-semibold text-blue-700 mb-2 text-sm">
                                        💰 Cash Refund:
                                      </h4>
                                      <p className="text-sm text-blue-700">
                                        <strong>Amount:</strong> ৳{" "}
                                        {transaction.cashRefundAmount}
                                        <br />
                                        <strong>Method:</strong>{" "}
                                        {transaction.paymentMethod}
                                        <br />
                                        <strong>Note:</strong>{" "}
                                        {transaction.note || "N/A"}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
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

            {/* Mobile View: Cards */}
            {/* <div className="md:hidden divide-y divide-gray-100">
            {returnHistory.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 ${item.type === "payment" ? "bg-blue-50/40" : ""}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-gray-500 font-bold">
                    {new Date(item.date).toLocaleDateString("en-GB")}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${item.type === "product" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
                  >
                    {item.type}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-blue-700">{item.memo}</h4>
                  <span className="text-xs font-medium text-gray-400 italic">
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 my-1">{item.products}</p>
                <div className="flex justify-between mt-3 pt-3 border-t border-dashed border-gray-200">
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">
                      Return
                    </p>
                    <p className="text-sm font-bold text-red-500">
                      ৳{item.returnValue.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">
                      Paid/Exch
                    </p>
                    <p className="text-sm font-bold text-green-600">
                      ৳{(item.exchangeValue + item.cashRefund).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 print:hidden">
                  <button className="flex-1 bg-gray-100 py-2 rounded font-bold text-xs text-blue-600">
                    Print
                  </button>
                  <button className="flex-1 bg-gray-100 py-2 rounded font-bold text-xs text-indigo-600">
                    Payment
                  </button>
                </div>
              </div>
            ))}
          </div> */}
          </div>

          {/* Summary Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
                <p className="text-[10px] text-gray-500 uppercase font-bold">
                  Total Return
                </p>
                <p className="text-xl font-black text-red-500">
                  ৳{Number(totalAmount).toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
                <p className="text-[10px] text-gray-500 uppercase font-bold">
                  Total Adjusted
                </p>
                <p className="text-xl font-black text-green-600">
                  ৳{Number(totalPaid).toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm flex flex-col justify-center">
                <p className="text-[10px] text-gray-500 uppercase font-bold">
                  Pending
                </p>
                <p className="text-xl font-black text-orange-600">
                  ৳{Number(totalDue).toLocaleString()}
                </p>
              </div>
            </div>

            {/* <div className="bg-gray-800 text-white p-5 rounded-2xl shadow-lg border-t-4 border-yellow-500">
              <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-3 ">
                <h3 className="text-xs font-bold uppercase tracking-widest">
                  Final Status
                </h3>
                <span className="bg-yellow-500 text-gray-900 text-[9px] px-2 py-0.5 rounded font-black">
                  2026
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-gray-400 tracking-tight">
                    Net Returnable:
                  </span>
                  <span className="font-mono">
                    ৳{Number(totalAmount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-medium text-green-400">
                  <span className="text-gray-400 tracking-tight">
                    Total Settled:
                  </span>
                  <span className="font-mono">
                    - ৳{Number(totalPaid).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-700 pt-3 mt-3">
                  <span className="font-black uppercase text-[10px] self-center">
                    {totalDue >= 0 ? "Payable" : "Credit"}
                  </span>
                  <span className="text-2xl font-black text-yellow-400 font-mono tracking-tighter">
                    ৳{Number(totalDue).toLocaleString()}
                  </span>
                </div>
              </div>
            </div> */}

            <div className="bg-gray-800 text-white p-5 rounded-2xl shadow-lg border-t-4 border-yellow-500">
              <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-3 ">
                <h3 className="text-xs font-bold uppercase tracking-widest">
                  Final Status
                </h3>
                <span className="bg-yellow-500 text-gray-900 text-[9px] px-2 py-0.5 rounded font-black">
                  2026
                </span>
              </div>

              <div className="space-y-2">
                {/* Amount Summary */}
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-gray-400 tracking-tight">
                    Net Returnable:
                  </span>
                  <span className="font-mono">
                    ৳{Number(totalAmount).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-xs font-medium text-green-400">
                  <span className="text-gray-400 tracking-tight">
                    Total Settled:
                  </span>
                  <span className="font-mono">
                    - ৳{Number(totalPaid).toLocaleString()}
                  </span>
                </div>

                {/* Quantity Summary */}
                <div className="border-t border-gray-700 pt-3 mt-3 space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-gray-400 tracking-tight">
                      Returned Qty:
                    </span>
                    <span className="font-mono text-red-400">
                      {Number(totalReturnQuantity).toLocaleString("en-BD")}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-gray-400 tracking-tight">
                      Exchanged Qty:
                    </span>
                    <span className="font-mono text-green-400">
                      {Number(totalExchangeQuantity).toLocaleString("en-BD")}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-gray-400 tracking-tight">
                      Pending Qty:
                    </span>
                    <span className="font-mono text-yellow-400">
                      {Number(
                        totalReturnQuantity - totalExchangeQuantity,
                      ).toLocaleString("en-BD")}
                    </span>
                  </div>
                </div>

                {/* Final Due */}
                <div className="flex justify-between border-t border-gray-700 pt-3 mt-3">
                  <span className="font-black uppercase text-[10px] self-center">
                    {totalDue >= 0 ? "Payable" : "Credit"}
                  </span>

                  <span className="text-2xl font-black text-yellow-400 font-mono tracking-tighter">
                    ৳{Number(totalDue).toLocaleString()}
                  </span>
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
            No Sales Return Selected
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            Please select one sales return from the list to view their
            transaction history.
          </p>
          <button
            onClick={() => navigate("/sales-return")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg cursor-pointer"
          >
            Go to Sales Return List
          </button>
        </div>
      )}
    </div>
  );
};

export default SalesReturnStatement;
