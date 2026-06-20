import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import Decimal from 'decimal.js';

const InvoiceForPurchase = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const contentRef = useRef(null);
  console.log("Invoice Data:", location.state);

  const data = location.state || {};

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (user && !data) navigate("/purchase");
  }, [user, data, navigate]);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `Invoice-${data?.refMemo || data?.memo || "Unknown"}`,
  });

  if (!user || !data) return null;

  const isDuePayment = data.refMemo?.startsWith("REF-DUE") || data.refMemo?.startsWith("DUE-PAY");
  const isAdvance = data.purchaseType === "advance" || data.refMemo?.startsWith("PA-");

  // Safe data extraction
  const totalAmount = new Decimal(data.totalAmount || data.amountToBePaid || 0);
  const paidAmount = new Decimal(data.paid || data.paidAmount || 0);
  const currentDue = new Decimal(data.due || data.currentDue || 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto mb-4 flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
          ← Back
        </button>
        <button onClick={reactToPrintFn} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium">
          🖨 Print Invoice
        </button>
      </div>

      <div ref={contentRef} className="max-w-4xl mx-auto bg-white shadow-lg p-8">
        {/* Header */}
        <div className="border-b pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Purchase Invoice</h1>
              <p className="text-gray-500 mt-1">Elite Battery & Parts</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Memo No: <span className="font-bold">{data.refMemo || data.memo}</span></p>
              <p className="text-sm">Date: {new Date(data.date || data.createdAt).toLocaleDateString("en-GB")}</p>
            </div>
          </div>
        </div>

        {/* Supplier Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-xs uppercase text-gray-500 mb-1">Supplier</p>
            <p className="font-semibold text-xl">{data.supplierName}</p>
            <p className="text-sm text-gray-600">{data.address || "N/A"}</p>
            <p className="text-sm text-gray-600">{data.supplierPhone}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase text-gray-500 mb-1">Transaction Type</p>
            <p className="font-bold text-xl text-blue-600">
              {isDuePayment ? "Due Payment" : isAdvance ? "Advance Payment" : "Normal Purchase"}
            </p>
          </div>
        </div>

        {/* Products Table - Only for Normal Purchase */}
        {!isDuePayment && !isAdvance && data.products && data.products.length > 0 && (
          <table className="w-full border-collapse mb-8">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-3 text-left">SL</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Product Description</th>
                <th className="border border-gray-300 px-4 py-3 text-center">Qty</th>
                <th className="border border-gray-300 px-4 py-3 text-right">Unit Price</th>
                <th className="border border-gray-300 px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="border border-gray-300 px-4 py-3">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-3">{item.productName}</td>
                  <td className="border border-gray-300 px-4 py-3 text-center">{item.quantity}</td>
                  <td className="border border-gray-300 px-4 py-3 text-right">৳ {new Decimal(item.unitPrice || 0).toFixed(2)}</td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-medium">
                    ৳ {new Decimal(item.quantity || 0).mul(new Decimal(item.unitPrice || 0)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Summary */}
        <div className="flex justify-end">
          <div className="w-full max-w-xs bg-gray-50 border border-gray-200 rounded-lg p-5">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Total Amount</span>
                <span className="font-bold">৳ {totalAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between border-t border-gray-300 pt-3">
                <span className="font-medium">Paid Amount</span>
                <span className="font-bold text-green-600">৳ {paidAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between border-t border-gray-300 pt-3 text-xl font-bold">
                <span>Current Due / Balance</span>
                <span className={currentDue.greaterThanOrEqualTo(0) ? "text-green-600" : "text-red-600"}>
                  {currentDue.greaterThanOrEqualTo(0) ? "+" : ""}৳ {currentDue.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 flex justify-between text-sm">
          <div>
            <p className="font-medium">Supplier Signature</p>
            <div className="w-52 h-px bg-gray-400 mt-8"></div>
          </div>
          <div className="text-right">
            <p className="font-medium">Authorized Signature</p>
            <div className="w-52 h-px bg-gray-400 mt-8"></div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 mt-10">
          Powered by Your POS System
        </div>
      </div>
    </div>
  );
};

export default InvoiceForPurchase;