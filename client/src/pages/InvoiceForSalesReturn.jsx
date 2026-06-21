import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import Decimal from "decimal.js";

const InvoiceForSalesReturn = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const contentRef = useRef(null);
  console.log("Sales Return Invoice Data:", location.state);

  const data = location.state || {};

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (user && !data) navigate("/sales-return");
  }, [user, data, navigate]);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `Sales-Return-Invoice-${data?.refMemo || "Unknown"}`,
  });

  if (!user || !data) return null;

  const isProductReturn = data?.returnType === "product";
  const isCashReturn = data?.returnType === "cash";

  const transactionTypeLabel = isProductReturn
    ? "Product Exchange"
    : isCashReturn
      ? "Cash Refund"
      : "Sales Return";

  // Safe data extraction
  const returnAmount = new Decimal(data?.amountToBePaid || 0);
  const adjustedAmount = new Decimal(data?.paidAmount || 0);
  const currentDue = new Decimal(data?.currentDue || 0);

  const returnedProducts = data?.salesReturnId?.products || [];
  const exchangeProducts = data?.exchangeProducts || [];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto mb-4 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back
        </button>
        <button
          onClick={reactToPrintFn}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
        >
          🖨 Print Invoice
        </button>
      </div>

      <div ref={contentRef} className="max-w-4xl mx-auto bg-white shadow-lg p-8">
        {/* Header */}
        <div className="border-b pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Sales Return Invoice</h1>
              <p className="text-gray-500 mt-1">Elite Battery & Parts</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">
                Memo No: <span className="font-bold">{data?.refMemo}</span>
              </p>
              <p className="text-sm">
                Date: {data?.date ? new Date(data?.date).toLocaleDateString("en-GB") : "N/A"}
              </p>
              <p className="text-sm font-bold text-blue-600 mt-1">{transactionTypeLabel}</p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-xs uppercase text-gray-500 mb-1">Customer</p>
            <p className="font-semibold text-xl">{data?.customerName}</p>
            <p className="text-sm text-gray-600">{data?.address || "N/A"}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase text-gray-500 mb-1">Contact</p>
            <p className="text-sm text-gray-600">{data?.customerPhone}</p>
            <p className="text-sm text-gray-600">{data?.customerEmail}</p>
          </div>
        </div>

        {/* Returned Products Table */}
        {returnedProducts.length > 0 && (
          <table className="w-full border-collapse mb-8">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-3 text-left">SL</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Product Name</th>
                <th className="border border-gray-300 px-4 py-3 text-center">Return Qty</th>
                <th className="border border-gray-300 px-4 py-3 text-center">Qty (KG)</th>
                <th className="border border-gray-300 px-4 py-3 text-right">Return Price</th>
                <th className="border border-gray-300 px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {returnedProducts.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="border border-gray-300 px-4 py-3">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-3">{item?.productName}</td>
                  <td className="border border-gray-300 px-4 py-3 text-center">{item?.returnQuantity}</td>
                  <td className="border border-gray-300 px-4 py-3 text-center">{item?.returnQtyInKg}</td>
                  <td className="border border-gray-300 px-4 py-3 text-right">
                    ৳ {new Decimal(item?.returnPrice || 0).toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-medium">
                    ৳ {new Decimal(item?.lineTotal || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Exchange Products Table - Only for Product Return */}
        {isProductReturn && exchangeProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Exchange Products</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left">SL</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Product</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Qty</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Qty (KG)</th>
                  <th className="border border-gray-300 px-4 py-3 text-right">Unit Price</th>
                  <th className="border border-gray-300 px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {exchangeProducts.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="border border-gray-300 px-4 py-3">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-3">{item?.productName}</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">{item?.quantity}</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">{item?.qtyInKg}</td>
                    <td className="border border-gray-300 px-4 py-3 text-right">
                      ৳ {new Decimal(item?.unitPrice || 0).toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-medium">
                      ৳ {new Decimal(item?.subTotal || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Cash Refund Card - Only for Cash Return */}
        {isCashReturn && (
          <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Cash Refund Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Refund Amount</span>
                <span className="font-bold text-blue-700">
                  ৳ {new Decimal(data?.cashRefundAmount || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t border-blue-200 pt-3">
                <span className="font-medium text-gray-600">Payment Method</span>
                <span className="font-bold">{data?.paymentMethod || "N/A"}</span>
              </div>
              {data?.note && (
                <div className="border-t border-blue-200 pt-3">
                  <span className="font-medium text-gray-600">Note</span>
                  <p className="text-sm text-gray-700 mt-1">{data?.note}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="flex justify-end">
          <div className="w-full max-w-xs bg-gray-50 border border-gray-200 rounded-lg p-5">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Return Amount</span>
                <span className="font-bold">৳ {returnAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between border-t border-gray-300 pt-3">
                <span className="font-medium">Adjusted Amount</span>
                <span className="font-bold text-green-600">৳ {adjustedAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between border-t border-gray-300 pt-3 text-xl font-bold">
                <span>Current Due</span>
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
            <p className="font-medium">Customer Signature</p>
            <div className="w-52 h-px bg-gray-400 mt-8"></div>
          </div>
          <div className="text-right">
            <p className="font-medium">Authorized Signature</p>
            <div className="w-52 h-px bg-gray-400 mt-8"></div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 mt-10">
          Powered by NexOrigin Software
        </div>
      </div>
    </div>
  );
};

export default InvoiceForSalesReturn;