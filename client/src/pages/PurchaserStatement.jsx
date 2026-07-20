import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchPurchasesForSupplierName } from "../features/statements/sStatementSlice";
import { useReactToPrint } from "react-to-print";
import { FaArrowLeft, FaPrint } from "react-icons/fa";
import Decimal from 'decimal.js';
import dayjs from "../utils/date.js";

const PurchaserStatement = () => {
  const { user } = useSelector((state) => state.auth);
  const { transactions = [], totalAmount = 0, totalPaid = 0, totalDue = 0, supplierBalance = 0, totalCompanyReturnAmount = 0 } = useSelector((state) => state.sstatement);

  // console.log(transactions)

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [date, setDate] = useState("");
  const contentRef = useRef(null);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `Ledger-${state?.supplierName || 'report'}`
  });

  useEffect(() => {
    if (user && state?.supplierName) {
      dispatch(fetchPurchasesForSupplierName({
        supplierName: state.supplierName,
        dateSearch: date,
      }));
    }
  }, [dispatch, user, state?.supplierName, date]);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user || !state) return <div className="text-center mt-20 text-gray-500">No Supplier Selected</div>;

  const currentBalance = Number(supplierBalance);
  const shouldShowPayDue = currentBalance < 0;

  let runningBalance = new Decimal(0);

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center print:hidden">
          <button onClick={() => navigate("/purchase")} className="text-blue-600 hover:underline flex items-center gap-2">
            ← Back to Purchases
          </button>

          <div className="flex gap-3">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border px-3 py-2 rounded" />

            {shouldShowPayDue && (
              <button
                onClick={() => navigate("/purchase-report/due-payment", {
                  state: {
                    supplierId: state.supplierId,
                    supplierName: state.supplierName,
                    totalDue: Math.abs(currentBalance),
                    isSupplierLevel: true
                  }
                })}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium"
              >
                Pay Due ৳{Math.abs(currentBalance).toLocaleString()}
              </button>
            )}

            <button onClick={reactToPrintFn} className="bg-green-600 text-white px-6 py-2 rounded flex items-center gap-2">
              <FaPrint /> Print Ledger
            </button>
          </div>
        </div>

        <div ref={contentRef} className="bg-white p-8 shadow-xl rounded-xl">
          <h1 className="text-3xl font-bold text-center mb-8">Purchaser Ledger Statement</h1>

          {/* Supplier Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50 p-6 rounded-xl mb-8">
            <div>
              <p className="text-xs text-gray-500">SUPPLIER</p>
              <p className="font-bold text-xl">{state.supplierName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">PHONE</p>
              <p>{state.supplierPhone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">EMAIL</p>
              <p>{state.supplierEmail || "N/A"}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">CURRENT BALANCE</p>
              <p className={`text-3xl font-bold ${currentBalance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                ৳{currentBalance.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm mt-1 text-gray-600">
                {currentBalance < 0 ? "(সাপ্লায়ার আমার কাছে পায়)" : "(আমি সাপ্লায়ারের কাছে পাই)"}
              </p>
            </div>
          </div>

          {/* Transactions Table with Invoice Button */}
          <table className="w-full border-collapse">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Memo</th>
                <th className="px-6 py-4 text-left">Description</th>
                <th className="px-6 py-4 text-right">Debit</th>
                <th className="px-6 py-4 text-right">Credit</th>
                <th className="px-6 py-4 text-right">Balance</th>
                <th className="px-6 py-4 text-right">Remarks</th>
                <th className="px-6 py-4 text-center print:hidden">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {transactions.map((t) => {
                const isAdvance = t.purchaseType === "advance";
                const isDuePayment = t.refMemo?.startsWith("REF-DUE") || t.refMemo?.startsWith("DUE-PAY");

                const debit = (!isAdvance && !isDuePayment) ? Number(t.amountToBePaid || 0) : 0;
                const credit = (isAdvance || isDuePayment) ? Number(t.paidAmount || 0) : 0;

                if (debit > 0) runningBalance = runningBalance.minus(debit);
                else runningBalance = runningBalance.plus(credit);

                // Prepare invoice data
                const invoiceData = {
                  ...t,
                  memo: t.refMemo,
                  createdAt: t.date,
                  supplierName: state.supplierName,
                  supplierPhone: state.supplierPhone,
                  supplierEmail: state.supplierEmail,
                  address: t.address || state.address,
                };

                return (
                  <tr key={t._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{
                      dayjs(t.date)
                        .tz("Asia/Dhaka")
                        .format("DD-MM-YYYY")
                    }</td>
                    <td className="px-6 py-4 font-medium">{t.refMemo}</td>
                    <td className="px-6 py-4">
                      {/* {isAdvance ?  : 
                       isDuePayment ? "" : 
                        || "Purchase Items"} */}

                      {t.purchaseType === "normal" ? t.purchaseId?.products?.map(p => p.productName).join(", ") : ""}

                      {t.purchaseType === "advance" ? "Advance Payment" : ""}

                      {t.purchaseType === "due" ? "Due Payment" : ""}
                      {t.purchaseType === "exchangeAdjust" ? (<table className="w-full text-[10px] uppercase">
                        <thead>
                          <tr className="text-gray-400 border-b">
                            <th className="text-left pb-1">Product</th>
                            <th className="text-center pb-1">Qty</th>
                            <th className="text-center pb-1">Weight</th>
                            <th className="text-right pb-1">Unit</th>
                          </tr>
                        </thead>

                        <tbody>
                          {t.companyProductReturnId.products?.map((product, i) => (
                            <tr key={i} className="text-gray-700 font-bold">
                              <td className="py-1 pr-2">
                                {product.productName}
                              </td>

                              <td className="text-center">
                                {product.quantity}
                              </td>

                              <td className="text-center">
                                {product.qtyInKg} Kg
                              </td>

                              <td className="text-right">
                                ৳ {product.unitPrice}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>) : ""}


                    </td>
                    <td className="px-6 py-4 text-right text-red-600 font-medium">
                      {t.transactionType === "debit" ? `৳${t.amount.toLocaleString()}` : ""}
                    </td>
                    <td className="px-6 py-4 text-right text-green-600 font-medium">
                      {t.transactionType === "credit" ? `৳${t.amount.toLocaleString()}` : ""}
                    </td>
                    <td className="px-6 py-4 text-right font-bold">
                      ৳{t.currentBalance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600 italic">
                      {t.remarks || "-"}
                    </td>
                    <td className="px-6 py-4 text-center print:hidden">
                      <Link
                        to="/invoice-purchase"
                        state={invoiceData}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
                      >
                        Invoice
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Account Summary */}
          <div className="mt-10 flex justify-end">
            <div className="bg-gray-900 text-white p-8 rounded-2xl w-full max-w-md">
              <h3 className="uppercase text-sm mb-6 border-b border-gray-700 pb-3">Account Summary</h3>
              <div className="space-y-4 text-lg">
                <div className="flex justify-between"><span>Total Purchase:</span> <span>৳{Number(totalAmount).toLocaleString()}</span></div>
                <div className="flex justify-between text-green-400"><span>Total Given:</span> <span>৳{Number(totalPaid).toLocaleString()}</span></div>
                {/* <div className="flex justify-between text-green-400"><span>Total Exchange Amount:</span> <span>৳{Number(totalCompanyReturnAmount).toLocaleString()}</span></div> */}
                <div className="flex justify-between border-t border-gray-700 pt-4 text-2xl font-bold">
                  <span>Balance:</span>
                  <span className={currentBalance < 0 ? "text-red-400" : "text-green-400"}>
                    ৳{currentBalance.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaserStatement;