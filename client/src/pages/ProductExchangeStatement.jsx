import React, { useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import { FaArrowLeft, FaPrint, FaUserAlt, FaFileInvoice } from "react-icons/fa";

const ProductExchangeStatement = () => {
  const { state } = useLocation();
  const { exchanges } = useSelector((state) => state.exchange);
  const navigate = useNavigate();
  const contentRef = useRef();

  // Logic to determine what data to show
  const displayData = useMemo(() => {
    if (!state) return [];
    
    // Case 1: Specific Memo Stat (from button)
    if (state.singleMemo) {
      return [state.singleMemo];
    }
    
    // Case 2: Customer-wise Statement (from row click)
    if (state.customerId) {
      return exchanges.filter(ex => ex.customerId === state.customerId);
    }
    
    return [];
  }, [state, exchanges]);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Exchange_Statement_${displayData[0]?.customerName || "Report"}`,
  });

  if (displayData.length === 0) {
    return <div className="p-10 text-center font-bold">No Data Found!</div>;
  }

  const isCustomerStat = !!state.customerId;
  const firstExchange = displayData[0];
  
  // Calculate Grand Total for All Memos
  const grandTotal = displayData.reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black font-bold"
        >
          <FaArrowLeft /> Back
        </button>
        <button 
          onClick={handlePrint}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:bg-blue-700"
        >
          <FaPrint /> Print {isCustomerStat ? "Full Statement" : "Memo Stat."}
        </button>
      </div>

      <div 
        ref={contentRef} 
        className="max-w-4xl mx-auto bg-white shadow-2xl rounded-sm p-8 border-t-8 border-gray-800"
      >
        <div className="flex justify-between items-start border-b pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tighter uppercase">
               {isCustomerStat ? "Customer Exchange Statement" : "Product Exchange"}
            </h1>
            <p className="text-sm text-gray-500 mt-1 uppercase font-bold">Official Document</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-10">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-[10px] font-black text-blue-600 uppercase mb-2 flex items-center gap-2">
              <FaUserAlt /> Customer Details
            </h3>
            <p className="font-bold text-gray-800">{firstExchange.customerName}</p>
            <p className="text-sm text-gray-600">{firstExchange.address}</p>
            <p className="text-sm text-gray-600">Phone: {firstExchange.customerPhone}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md text-right">
            <h3 className="text-[10px] font-black text-blue-600 uppercase mb-2 flex items-center justify-end gap-2">
               Statement Info <FaFileInvoice />
            </h3>
            <p className="text-sm font-bold text-gray-800">
              {isCustomerStat ? "Type: Full Ledger" : `Memo: ${firstExchange.memo}`}
            </p>
            <p className="text-sm text-gray-500">
              Generated: {new Date().toLocaleDateString("en-GB").replaceAll("/", "-")}
            </p>
          </div>
        </div>

        <table className="w-full mb-10 border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white text-[11px] uppercase tracking-widest">
              {isCustomerStat && <th className="py-3 px-2 text-left">Date/Memo</th>}
              <th className="py-3 px-4 text-left">Product Description</th>
              <th className="py-3 px-4 text-center">Qty</th>
              <th className="py-3 px-4 text-center">Weight</th>
              <th className="py-3 px-4 text-right">Price</th>
              <th className="py-3 px-4 text-right font-bold italic">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 border-b">
            {displayData.map((exchange) => (
              <React.Fragment key={exchange._id}>
                {exchange.products.map((item, index) => (
                  <tr key={index} className="text-sm">
                    {index === 0 && isCustomerStat && (
                      <td rowSpan={exchange.products.length} className="py-4 px-2 border-r bg-gray-50 text-[10px] font-bold">
                        {new Date(exchange.createdAt).toLocaleDateString("en-GB")}<br/>
                        <span className="text-blue-600">{exchange.memo}</span>
                      </td>
                    )}
                    <td className="py-4 px-4 font-bold text-gray-800">{item.productName}</td>
                    <td className="py-4 px-4 text-center">{item.quantity}</td>
                    <td className="py-4 px-4 text-center">{item.qtyInKg} kg</td>
                    <td className="py-4 px-4 text-right">৳{item.unitPrice.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right font-black">৳{item.subTotal.toLocaleString()}</td>
                  </tr>
                ))}
                {isCustomerStat && (
                   <tr className="bg-blue-50/30 text-[11px] font-bold">
                      <td colSpan={5} className="py-1 px-4 text-right text-gray-500 italic">Memo {exchange.memo} Total:</td>
                      <td className="py-1 px-4 text-right border-t">৳{exchange.totalAmount.toLocaleString()}</td>
                   </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-72 space-y-3">
            <div className="flex justify-between border-t-4 border-gray-800 pt-3">
              <span className="text-lg font-black uppercase text-gray-800">Grand Total</span>
              <span className="text-xl font-black text-blue-700 font-mono">
                ৳ {grandTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t pt-6 flex justify-between items-center italic text-[10px] text-gray-400">
           <p>This is a computer generated document.</p>
           <p>Printed on: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductExchangeStatement;