// import React, { useRef, useMemo } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useReactToPrint } from "react-to-print";
// import { useSelector } from "react-redux";
// import { FaArrowLeft, FaPrint, FaUserAlt, FaFileInvoice } from "react-icons/fa";

// const ProductExchangeStatement = () => {
//   const { state } = useLocation();
//   const { exchanges } = useSelector((state) => state.exchange);
//   const navigate = useNavigate();
//   const contentRef = useRef();

//   // Logic to determine what data to show
//   const displayData = useMemo(() => {
//     if (!state) return [];
    
//     // Case 1: Specific Memo Stat (from button)
//     if (state.singleMemo) {
//       return [state.singleMemo];
//     }
    
//     // Case 2: Customer-wise Statement (from row click)
//     if (state.customerId) {
//       return exchanges.filter(ex => ex.customerId === state.customerId);
//     }
    
//     return [];
//   }, [state, exchanges]);

//   const handlePrint = useReactToPrint({
//     contentRef,
//     documentTitle: `Exchange_Statement_${displayData[0]?.customerName || "Report"}`,
//   });

//   if (displayData.length === 0) {
//     return <div className="p-10 text-center font-bold">No Data Found!</div>;
//   }

//   const isCustomerStat = !!state.customerId;
//   const firstExchange = displayData[0];
  
//   // Calculate Grand Total for All Memos
//   const grandTotal = displayData.reduce((acc, curr) => acc + curr.totalAmount, 0);

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 md:p-8">
//       <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
//         <button 
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-gray-600 hover:text-black font-bold"
//         >
//           <FaArrowLeft /> Back
//         </button>
//         <button 
//           onClick={handlePrint}
//           className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:bg-blue-700"
//         >
//           <FaPrint /> Print {isCustomerStat ? "Full Statement" : "Memo Stat."}
//         </button>
//       </div>

//       <div 
//         ref={contentRef} 
//         className="max-w-4xl mx-auto bg-white shadow-2xl rounded-sm p-8 border-t-8 border-gray-800"
//       >
//         <div className="flex justify-between items-start border-b pb-6 mb-6">
//           <div>
//             <h1 className="text-3xl font-black text-gray-800 tracking-tighter uppercase">
//                {isCustomerStat ? "Customer Exchange Statement" : "Product Exchange"}
//             </h1>
//             <p className="text-sm text-gray-500 mt-1 uppercase font-bold">Official Document</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-8 mb-10">
//           <div className="bg-gray-50 p-4 rounded-md">
//             <h3 className="text-[10px] font-black text-blue-600 uppercase mb-2 flex items-center gap-2">
//               <FaUserAlt /> Customer Details
//             </h3>
//             <p className="font-bold text-gray-800">{firstExchange.customerName}</p>
//             <p className="text-sm text-gray-600">{firstExchange.address}</p>
//             <p className="text-sm text-gray-600">Phone: {firstExchange.customerPhone}</p>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-md text-right">
//             <h3 className="text-[10px] font-black text-blue-600 uppercase mb-2 flex items-center justify-end gap-2">
//                Statement Info <FaFileInvoice />
//             </h3>
//             <p className="text-sm font-bold text-gray-800">
//               {isCustomerStat ? "Type: Full Ledger" : `Memo: ${firstExchange.memo}`}
//             </p>
//             <p className="text-sm text-gray-500">
//               Generated: {new Date().toLocaleDateString("en-GB").replaceAll("/", "-")}
//             </p>
//           </div>
//         </div>

//         <table className="w-full mb-10 border-collapse">
//           <thead>
//             <tr className="bg-gray-800 text-white text-[11px] uppercase tracking-widest">
//               {isCustomerStat && <th className="py-3 px-2 text-left">Date/Memo</th>}
//               <th className="py-3 px-4 text-left">Product Description</th>
//               <th className="py-3 px-4 text-center">Qty</th>
//               <th className="py-3 px-4 text-center">Weight</th>
//               <th className="py-3 px-4 text-right">Price</th>
//               <th className="py-3 px-4 text-right font-bold italic">Total</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200 border-b">
//             {displayData.map((exchange) => (
//               <React.Fragment key={exchange._id}>
//                 {exchange.products.map((item, index) => (
//                   <tr key={index} className="text-sm">
//                     {index === 0 && isCustomerStat && (
//                       <td rowSpan={exchange.products.length} className="py-4 px-2 border-r bg-gray-50 text-[10px] font-bold">
//                         {new Date(exchange.createdAt).toLocaleDateString("en-GB")}<br/>
//                         <span className="text-blue-600">{exchange.memo}</span>
//                       </td>
//                     )}
//                     <td className="py-4 px-4 font-bold text-gray-800">{item.productName}</td>
//                     <td className="py-4 px-4 text-center">{item.quantity}</td>
//                     <td className="py-4 px-4 text-center">{item.qtyInKg} kg</td>
//                     <td className="py-4 px-4 text-right">৳{item.unitPrice.toLocaleString()}</td>
//                     <td className="py-4 px-4 text-right font-black">৳{item.subTotal.toLocaleString()}</td>
//                   </tr>
//                 ))}
//                 {isCustomerStat && (
//                    <tr className="bg-blue-50/30 text-[11px] font-bold">
//                       <td colSpan={5} className="py-1 px-4 text-right text-gray-500 italic">Memo {exchange.memo} Total:</td>
//                       <td className="py-1 px-4 text-right border-t">৳{exchange.totalAmount.toLocaleString()}</td>
//                    </tr>
//                 )}
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>

//         <div className="flex justify-end">
//           <div className="w-72 space-y-3">
//             <div className="flex justify-between border-t-4 border-gray-800 pt-3">
//               <span className="text-lg font-black uppercase text-gray-800">Grand Total</span>
//               <span className="text-xl font-black text-blue-700 font-mono">
//                 ৳ {grandTotal.toLocaleString()}
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="mt-20 border-t pt-6 flex justify-between items-center italic text-[10px] text-gray-400">
//            <p>This is a computer generated document.</p>
//            <p>Printed on: {new Date().toLocaleString()}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductExchangeStatement;

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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center p-10 bg-white shadow-xl rounded-xl">
          <p className="text-xl font-bold text-red-500 mb-4">No Data Found!</p>
          <button onClick={() => navigate(-1)} className="text-blue-600 flex items-center gap-2 mx-auto">
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  const isCustomerStat = !!state.customerId;
  const firstExchange = displayData[0];
  
  // Calculate Grand Total
  const grandTotal = displayData.reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* Action Buttons (Hidden during print) */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black font-bold transition-colors"
        >
          <FaArrowLeft /> Back
        </button>
        <button 
          onClick={handlePrint}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:bg-blue-700 transition-all active:scale-95"
        >
          <FaPrint /> Print {isCustomerStat ? "Full Statement" : "Memo Stat."}
        </button>
      </div>

      {/* Main Document Content */}
      <div 
        ref={contentRef} 
        className="max-w-4xl mx-auto bg-white shadow-2xl print:shadow-none rounded-sm p-10 border-t-[10px] border-red-700"
      >
        {/* --- Integrated Shop Header Section --- */}
        <div className="flex justify-between items-start border-b-2 border-red-600 pb-4 mb-8">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-red-700 tracking-tight">Ellite Battery</h1>
            <p className="text-sm font-bold text-gray-800 tracking-wide uppercase">
              Proprietor: Md. Foyez Uddin
            </p>
            <p className="text-xs text-gray-700 font-semibold italic">
              Auto Battery and Parts Wholesale and Retail Dealer
            </p>
            <p className="text-xs text-gray-600 max-w-[350px] leading-relaxed">
              Address: College Road, Rangpur.
            </p>
          </div>

          <div className="text-right space-y-1">
            <p className="font-black text-gray-900 text-sm mb-2 border-b border-gray-200 inline-block pb-1">
              Contact Support:
            </p>
            <div className="text-xs text-gray-700 font-bold space-y-0.5">
              <p>017********</p>
              <p>018********</p>
              <p className="text-red-600">Shop: 019********</p>
            </div>
          </div>
        </div>

        {/* Document Title Branding */}
        <div className="text-center mb-8">
           <span className="bg-gray-800 text-white px-6 py-1 text-xs font-black uppercase tracking-[0.2em]">
             {isCustomerStat ? "Customer Exchange Ledger" : "Product Exchange Invoice"}
           </span>
        </div>

        {/* Customer & Statement Details */}
        <div className="grid grid-cols-2 gap-10 mb-8">
          <div className="bg-gray-50/80 p-5 rounded-lg border-l-4 border-blue-500">
            <h3 className="text-[10px] font-black text-blue-600 uppercase mb-3 flex items-center gap-2">
              <FaUserAlt size={10} /> Bill To
            </h3>
            <p className="font-black text-gray-900 text-lg leading-tight mb-1">{firstExchange.customerName}</p>
            <p className="text-xs text-gray-600 font-medium mb-1">{firstExchange.address}</p>
            <p className="text-xs font-black text-gray-800">Mob: {firstExchange.customerPhone}</p>
          </div>
          
          <div className="bg-gray-50/80 p-5 rounded-lg border-r-4 border-gray-400 text-right">
            <h3 className="text-[10px] font-black text-gray-500 uppercase mb-3 flex items-center justify-end gap-2">
              Stat Information <FaFileInvoice size={10} />
            </h3>
            <p className="text-sm font-black text-gray-800 mb-1">
              {isCustomerStat ? "Report Type: Full History" : `Memo No: #${firstExchange.memo}`}
            </p>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
              Date: {new Date().toLocaleDateString("en-GB").replaceAll("/", "-")}
            </p>
          </div>
        </div>

        {/* Data Table */}
        <table className="w-full mb-8 border-collapse overflow-hidden rounded-t-lg">
          <thead>
            <tr className="bg-gray-900 text-white text-[10px] uppercase tracking-widest">
              {isCustomerStat && <th className="py-4 px-3 text-left">Date / Memo</th>}
              <th className="py-4 px-4 text-left">Product Description</th>
              <th className="py-4 px-4 text-center">Qty</th>
              <th className="py-4 px-4 text-center">Weight</th>
              <th className="py-4 px-4 text-right font-medium">Unit Price</th>
              <th className="py-4 px-4 text-right font-bold italic">Sub Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 border-b border-gray-300">
            {displayData.map((exchange) => (
              <React.Fragment key={exchange._id}>
                {exchange.products.map((item, index) => (
                  <tr key={index} className="text-[13px] hover:bg-gray-50 transition-colors">
                    {index === 0 && isCustomerStat && (
                      <td rowSpan={exchange.products.length} className="py-4 px-3 border-r bg-gray-100/50 text-[10px] font-black text-center">
                        {new Date(exchange.createdAt).toLocaleDateString("en-GB")}<br/>
                        <span className="text-red-600">#{exchange.memo}</span>
                      </td>
                    )}
                    <td className="py-4 px-4 font-bold text-gray-800">{item.productName}</td>
                    <td className="py-4 px-4 text-center font-semibold text-gray-600">{item.quantity} pcs</td>
                    <td className="py-4 px-4 text-center text-gray-600">{item.qtyInKg} kg</td>
                    <td className="py-4 px-4 text-right text-gray-600">৳{item.unitPrice.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right font-black text-gray-900">৳{item.subTotal.toLocaleString()}</td>
                  </tr>
                ))}
                {isCustomerStat && (
                   <tr className="bg-red-50/40 text-[11px] font-black">
                      <td colSpan={5} className="py-2 px-4 text-right text-gray-500 italic">Total for Memo {exchange.memo}:</td>
                      <td className="py-2 px-4 text-right border-t border-gray-300">৳{exchange.totalAmount.toLocaleString()}</td>
                   </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* Summary Section */}
        <div className="flex justify-end mt-10">
          <div className="w-full max-w-[320px]">
            <div className="bg-red-700 text-white p-4 rounded-lg flex justify-between items-center shadow-lg border-b-4 border-red-900">
              <span className="text-sm font-black uppercase tracking-widest">Grand Total</span>
              <span className="text-2xl font-black font-mono">
                ৳ {grandTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-24 flex justify-between items-end px-2">
            <div className="text-center">
                <div className="w-40 border-t border-gray-400 mb-1"></div>
                <p className="text-[10px] font-bold text-gray-600 uppercase">Customer Signature</p>
            </div>
            <div className="text-right italic text-[9px] text-gray-400 space-y-1">
               <p>Certified computer generated statement.</p>
               <p>Printed on: {new Date().toLocaleString()}</p>
            </div>
            <div className="text-center">
                <div className="w-40 border-t border-red-700 mb-1"></div>
                <p className="text-[10px] font-black text-red-700 uppercase">Authorized Signature</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductExchangeStatement;