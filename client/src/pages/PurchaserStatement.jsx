// import React, { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { fetchPurchasesForSupplierName } from "../features/statements/sStatementSlice";
// import { useReactToPrint } from "react-to-print";
// import {
//   FaArrowLeft,
//   FaPrint,
//   FaFilter,
// } from "react-icons/fa";

// const PurchaserStatement = () => {
//   const { user } = useSelector((state) => state.auth);
//   const { transactions, totalAmount, totalPaid, totalDue } = useSelector((state) => state.sstatement);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { state } = useLocation();

//   const [filterToggler, setFilterToggler] = useState(true);
//   const [date, setDate] = useState("");

//   // Printing logic
//   const documentTitle = `supplier-statement-${state?.supplierName || 'report'}`;
//   const contentRef = useRef(null);
//   const reactToPrintFn = useReactToPrint({ contentRef, documentTitle });

//   useEffect(() => {
//     if (user && state && state.supplierName) {
//       dispatch(
//         fetchPurchasesForSupplierName({
//           supplierName: state.supplierName,
//           dateSearch: date,
//         }),
//       );
//     }
//   }, [dispatch, user, filterToggler, state]);

//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//     }
//   }, [user, navigate]);

//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-slate-50 p-2 sm:p-4 md:p-6 font-sans text-gray-800">
//       {state ? (
//         <div className="max-w-6xl mx-auto space-y-4">

//           {/* Top Actions & Back Button (Hidden during print) */}
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
//             <button
//               onClick={() => navigate("/purchase")}
//               className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-800 font-bold text-sm transition-all group"
//             >
//               <FaArrowLeft className="group-hover:-translate-x-1" /> 
//               Back to Purchase List
//             </button>

//             <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="border rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 bg-white"
//               />
//               <button
//                 onClick={() => setFilterToggler(!filterToggler)}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer transition-colors"
//               >
//                 <FaFilter size={12} /> Filter
//               </button>
//               <button
//                 onClick={reactToPrintFn}
//                 className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer transition-colors"
//               >
//                 <FaPrint size={12} /> Print Ledger
//               </button>
//             </div>
//           </div>

//           {/* Printable Content Area */}
//           <div ref={contentRef} className="space-y-6 print:p-5">
//             {/* Header Title */}
//             <div className="border-b pb-4">
//               <h1 className="text-xl sm:text-2xl font-black text-gray-800 uppercase tracking-tight">
//                 Purchaser Ledger Statement
//               </h1>
//               <p className="text-xs text-gray-500 font-bold uppercase">Statement Date: {new Date().toLocaleDateString('en-GB')}</p>
//             </div>

//             {/* Supplier Info Card */}
//             <div className="bg-white border-l-4 border-blue-600 rounded-xl p-4 sm:p-6 shadow-sm ring-1 ring-black/5">
//               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//                 <div>
//                   <p className="text-[10px] text-gray-400 font-black uppercase">Supplier Name</p>
//                   <p className="text-sm font-bold">{state.supplierName}</p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] text-gray-400 font-black uppercase">Contact</p>
//                   <p className="text-sm font-bold">{state.supplierPhone || "----"}</p>
//                 </div>
//                 <div className="hidden sm:block">
//                   <p className="text-[10px] text-gray-400 font-black uppercase">Email</p>
//                   <p className="text-sm font-bold truncate">{state.supplierEmail || "----"}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Net Due Balance</p>
//                   <p className="text-lg font-black text-red-600 font-mono">
//                     ৳ {totalDue?.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Transactions Table */}
//             <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead className="bg-gray-800 text-white uppercase text-[10px] font-black tracking-widest">
//                     <tr>
//                       <th className="px-6 py-4 text-left">Date</th>
//                       <th className="px-6 py-4 text-left">Ref / Memo</th>
//                       <th className="px-6 py-4 text-left">Description</th>
//                       <th className="px-6 py-4 text-right">Bill Amt</th>
//                       <th className="px-6 py-4 text-right">Paid Amt</th>
//                       <th className="px-6 py-4 text-right">Due Balance</th>
//                       <th className="px-6 py-4 text-center print:hidden">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100">
//                     {transactions && transactions.length > 0 ? (
//                       transactions.map((transaction, idx) => {
//                         const isPayment = transaction.refMemo?.startsWith("REF-");

//                         // Data structure for the single invoice page
//                         const invoiceData = {
//                             ...transaction.purchaseId, 
//                             memo: transaction.refMemo,
//                             createdAt: transaction.date,
//                             totalAmount: transaction.amountToBePaid,
//                             paid: transaction.paidAmount,
//                             due: transaction.currentDue,
//                             supplierName: state.supplierName,
//                             supplierPhone: state.supplierPhone,
//                             supplierEmail: state.supplierEmail
//                         };

//                         return (
//                           <tr key={idx} className={`${isPayment ? "bg-green-50/60" : "hover:bg-gray-50/50"} transition-colors`}>
//                             <td className="px-6 py-4 text-[11px] font-bold text-gray-500">
//                               {new Date(transaction.date).toLocaleDateString("en-GB").replaceAll("/", "-")}
//                             </td>
//                             <td className="px-6 py-4">
//                               <span className={`text-[11px] font-black px-2 py-1 rounded ${isPayment ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>
//                                 {transaction.refMemo}
//                               </span>
//                             </td>
//                             <td className="px-6 py-4">
//                               <span className={`text-xs ${isPayment ? "font-black text-green-700 italic" : "font-bold text-gray-700"}`}>
//                                 {isPayment ? "PAYMENT AGAINST DUE" : 
//                                   transaction.purchaseId?.products?.map((p) => p.productName).join(", ") || "Purchase Items"}
//                               </span>
//                             </td>
//                             <td className="px-6 py-4 text-right font-black">
//                               ৳ {transaction.amountToBePaid.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
//                             </td>
//                             <td className="px-6 py-4 text-right font-black text-green-600">
//                               ৳ {transaction.paidAmount.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
//                             </td>
//                             <td className="px-6 py-4 text-right font-black text-red-500 font-mono">
//                               ৳ {transaction.currentDue?.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
//                             </td>
//                             <td className="px-6 py-4 text-center print:hidden">
//                               <div className="flex items-center justify-center gap-3">
//                                 <Link
//                                   to="/invoice-purchase"
//                                   state={invoiceData}
//                                   className="text-blue-600 font-black text-[10px] uppercase hover:underline"
//                                 >
//                                   Invoice
//                                 </Link>
//                                 {!isPayment && transaction.purchaseId?.due > 0 && (
//                                   <Link
//                                     to={`/purchase-report/${transaction.purchaseId._id}/edit-due`}
//                                     className="text-green-600 font-black text-[10px] uppercase underline hover:text-green-800"
//                                   >
//                                     Pay
//                                   </Link>
//                                 )}
//                               </div>
//                             </td>
//                           </tr>
//                         );
//                       })
//                     ) : (
//                       <tr>
//                         <td colSpan={7} className="text-center text-gray-400 py-12 italic">No transactions found for this period.</td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Summary Footer */}
//             <div className="flex justify-end pt-4">
//               <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl w-full max-w-sm border-t-4 border-blue-500">
//                 <h4 className="text-[10px] font-black uppercase text-gray-500 mb-4 text-center border-b border-gray-800 pb-2">Account Summary</h4>
//                 <div className="space-y-3">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-400 font-bold">Total Bill:</span>
//                     <span className="font-mono">৳ {totalAmount?.toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span>
//                   </div>
//                   <div className="flex justify-between text-sm text-green-400">
//                     <span className="text-gray-400 font-bold">Total Paid:</span>
//                     <span className="font-mono">- ৳ {totalPaid?.toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span>
//                   </div>
//                   <div className="flex justify-between border-t border-gray-800 pt-4 items-center">
//                     <span className="font-black uppercase text-[10px] text-blue-500">Balance Due</span>
//                     <span className="text-2xl font-black text-blue-400 font-mono">
//                       ৳ {totalDue?.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         /* Empty State */
//         <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-12 text-center mt-10">
//           <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//             <FaArrowLeft className="text-gray-400" />
//           </div>
//           <h2 className="text-xl font-bold text-gray-800 mb-2">No Purchaser Selected</h2>
//           <p className="text-gray-500 mb-6 text-sm">Please select a supplier from the purchase list to view their transaction history.</p>
//           <button 
//             onClick={() => navigate("/purchase")}
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg"
//           >
//             Go to Purchase List
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PurchaserStatement;

// import React, { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { fetchPurchasesForSupplierName } from "../features/statements/sStatementSlice";
// import { useReactToPrint } from "react-to-print";
// import { FaArrowLeft, FaPrint, FaFilter } from "react-icons/fa";

// const PurchaserStatement = () => {
//   const { user } = useSelector((state) => state.auth);
//   const { transactions, totalAmount, totalPaid, totalDue } = useSelector((state) => state.sstatement);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { state } = useLocation();

//   const [filterToggler, setFilterToggler] = useState(true);
//   const [date, setDate] = useState("");

//   const documentTitle = `supplier-statement-${state?.supplierName || 'report'}`;
//   const contentRef = useRef(null);
//   const reactToPrintFn = useReactToPrint({ contentRef, documentTitle });

//   useEffect(() => {
//     if (user && state?.supplierName) {
//       dispatch(fetchPurchasesForSupplierName({
//         supplierName: state.supplierName,
//         dateSearch: date,
//       }));
//     }
//   }, [dispatch, user, filterToggler, state, date]);

//   useEffect(() => {
//     if (!user) navigate("/login");
//   }, [user, navigate]);

//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-slate-50 p-2 sm:p-4 md:p-6 font-sans text-gray-800">
//       {state ? (
//         <div className="max-w-6xl mx-auto space-y-4">

//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
//             <button onClick={() => navigate("/purchase")} className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-800 font-bold text-sm transition-all group">
//               <FaArrowLeft className="group-hover:-translate-x-1" /> Back to Purchase List
//             </button>

//             <div className="flex flex-wrap items-center gap-2">
//               <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
//               <button onClick={() => setFilterToggler(!filterToggler)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
//                 <FaFilter size={12} /> Filter
//               </button>
//               <button onClick={reactToPrintFn} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
//                 <FaPrint size={12} /> Print Ledger
//               </button>
//             </div>
//           </div>

//           <div ref={contentRef} className="space-y-6 print:p-5">
//             <div className="border-b pb-4">
//               <h1 className="text-2xl font-black text-gray-800">PURCHASER LEDGER STATEMENT</h1>
//               <p className="text-xs text-gray-500">Statement Date: {new Date().toLocaleDateString('en-GB')}</p>
//             </div>

//             {/* Supplier Info */}
//             <div className="bg-white border-l-4 border-blue-600 rounded-xl p-4 sm:p-6 shadow-sm">
//               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//                 <div>
//                   <p className="text-[10px] text-gray-400 font-black uppercase">Supplier Name</p>
//                   <p className="text-sm font-bold">{state.supplierName}</p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] text-gray-400 font-black uppercase">Contact</p>
//                   <p className="text-sm font-bold">{state.supplierPhone || "----"}</p>
//                 </div>
//                 <div className="hidden sm:block">
//                   <p className="text-[10px] text-gray-400 font-black uppercase">Email</p>
//                   <p className="text-sm font-bold truncate">{state.supplierEmail || "----"}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-[10px] text-gray-400 font-black uppercase">Net Due Balance</p>
//                   <p className="text-lg font-black text-red-600 font-mono">
//                     ৳ {totalDue?.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Transactions Table */}
//             <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead className="bg-gray-800 text-white uppercase text-[10px] font-black tracking-widest">
//                     <tr>
//                       <th className="px-6 py-4 text-left">Date</th>
//                       <th className="px-6 py-4 text-left">Ref / Memo</th>
//                       <th className="px-6 py-4 text-left">Description</th>
//                       <th className="px-6 py-4 text-right">Bill Amt</th>
//                       <th className="px-6 py-4 text-right">Paid Amt</th>
//                       <th className="px-6 py-4 text-right">Due Balance</th>
//                       <th className="px-6 py-4 text-center print:hidden">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100">
//                     {transactions?.length > 0 ? (
//                       transactions.map((transaction, idx) => {
//                         const isAdvancePayment = transaction.purchaseType === "advance";
//                         const isNormalPurchase = transaction.purchaseType === "normal";

//                         return (
//                           <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
//                             <td className="px-6 py-4 text-[11px] font-bold text-gray-500">
//                               {new Date(transaction.date).toLocaleDateString("en-GB").replaceAll("/", "-")}
//                             </td>
//                             <td className="px-6 py-4">
//                               <span className={`text-[11px] font-black px-2 py-1 rounded ${isAdvancePayment ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
//                                 {transaction.refMemo}
//                               </span>
//                             </td>
//                             <td className="px-6 py-4">
//                               <span className="text-xs font-medium">
//                                 {isAdvancePayment 
//                                   ? "Advance Payment" 
//                                   : transaction.purchaseId?.products?.map(p => p.productName).join(", ") || "Purchase Items"}
//                               </span>
//                             </td>
//                             <td className="px-6 py-4 text-right font-black">
//                               ৳ {transaction.amountToBePaid?.toLocaleString("en-BD", { minimumFractionDigits: 2 }) || "0.00"}
//                             </td>
//                             <td className="px-6 py-4 text-right font-black text-green-600">
//                               ৳ {transaction.paidAmount?.toLocaleString("en-BD", { minimumFractionDigits: 2 }) || "0.00"}
//                             </td>
//                             <td className="px-6 py-4 text-right font-black text-red-500 font-mono">
//                               ৳ {transaction.currentDue?.toLocaleString("en-BD", { minimumFractionDigits: 2 }) || "0.00"}
//                             </td>
//                             <td className="px-6 py-4 text-center print:hidden">
//                               <Link to="/invoice-purchase" state={transaction} className="text-blue-600 hover:underline text-xs font-bold">INVOICE</Link>
//                             </td>
//                           </tr>
//                         );
//                       })
//                     ) : (
//                       <tr>
//                         <td colSpan={7} className="text-center text-gray-400 py-12">No transactions found</td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Account Summary */}
//             <div className="flex justify-end pt-4">
//               <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
//                 <h4 className="text-[10px] font-black uppercase text-gray-400 mb-4 border-b border-gray-700 pb-2">ACCOUNT SUMMARY</h4>
//                 <div className="space-y-3">
//                   <div className="flex justify-between text-sm">
//                     <span>Total Bill:</span>
//                     <span>৳ {totalAmount?.toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span>
//                   </div>
//                   <div className="flex justify-between text-sm text-green-400">
//                     <span>Total Paid:</span>
//                     <span>- ৳ {totalPaid?.toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span>
//                   </div>
//                   <div className="flex justify-between border-t border-gray-700 pt-4 text-lg font-bold">
//                     <span>Balance Due</span>
//                     <span className="text-red-400">৳ {totalDue?.toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-12 text-center mt-10">
//           <h2 className="text-xl font-bold">No Supplier Selected</h2>
//           <button onClick={() => navigate("/purchase")} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg">
//             Go to Purchase List
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PurchaserStatement;

// import React, { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { fetchPurchasesForSupplierName } from "../features/statements/sStatementSlice";
// import { useReactToPrint } from "react-to-print";
// import { FaArrowLeft, FaPrint, FaFilter } from "react-icons/fa";

// const PurchaserStatement = () => {
//   const { user } = useSelector((state) => state.auth);
//   const { transactions, totalAmount, totalPaid, totalDue } = useSelector((state) => state.sstatement);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { state } = useLocation();

//   const [filterToggler, setFilterToggler] = useState(true);
//   const [date, setDate] = useState("");

//   const contentRef = useRef(null);
//   const reactToPrintFn = useReactToPrint({ 
//     contentRef, 
//     documentTitle: `supplier-statement-${state?.supplierName || 'report'}` 
//   });

//   useEffect(() => {
//     if (user && state?.supplierName) {
//       dispatch(fetchPurchasesForSupplierName({
//         supplierName: state.supplierName,
//         dateSearch: date,
//       }));
//     }
//   }, [dispatch, user, filterToggler, state, date]);

//   useEffect(() => {
//     if (!user) navigate("/login");
//   }, [user, navigate]);

//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-slate-50 p-2 sm:p-4 md:p-6 font-sans text-gray-800">
//       {state ? (
//         <div className="max-w-6xl mx-auto space-y-4">

//           {/* Top Bar */}
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
//             <button 
//               onClick={() => navigate("/purchase")} 
//               className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold"
//             >
//               ← Back to Purchase List
//             </button>

//             <div className="flex gap-3">
//               <input 
//                 type="date" 
//                 value={date} 
//                 onChange={(e) => setDate(e.target.value)} 
//                 className="border rounded px-3 py-2 text-sm" 
//               />

//               {/* Pay Due Button */}
//               {Number(totalDue) > 0 && (
//                 <button 
//                   onClick={() => navigate("/purchase-report/due-payment", { 
//                     state: { 
//                       supplierId: state.supplierId || state._id, 
//                       supplierName: state.supplierName,
//                       totalDue: totalDue,
//                       isSupplierLevel: true 
//                     } 
//                   })}
//                   className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded font-medium flex items-center gap-2"
//                 >
//                   Pay Due ৳ {Number(totalDue).toLocaleString()}
//                 </button>
//               )}

//               <button 
//                 onClick={() => setFilterToggler(!filterToggler)} 
//                 className="bg-blue-600 text-white px-4 py-2 rounded"
//               >
//                 Filter
//               </button>
//               <button 
//                 onClick={reactToPrintFn} 
//                 className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
//               >
//                 <FaPrint /> Print Ledger
//               </button>
//             </div>
//           </div>

//           <div ref={contentRef} className="space-y-6 print:p-5">

//             {/* Supplier Info */}
//             <div className="bg-white border-l-4 border-blue-600 rounded-xl p-5 shadow-sm">
//               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//                 <div>
//                   <p className="text-xs text-gray-500 font-bold">SUPPLIER NAME</p>
//                   <p className="font-semibold">{state.supplierName}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500 font-bold">CONTACT</p>
//                   <p>{state.supplierPhone || "----"}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500 font-bold">EMAIL</p>
//                   <p className="text-sm">{state.supplierEmail || "----"}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-xs text-gray-500 font-bold">NET DUE BALANCE</p>
//                   <p className="text-xl font-bold text-red-600">
//                     ৳ {Number(totalDue || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Transactions Table */}
//             <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
//               <table className="w-full text-sm">
//                 <thead className="bg-gray-800 text-white">
//                   <tr>
//                     <th className="px-6 py-4 text-left">Date</th>
//                     <th className="px-6 py-4 text-left">Ref / Memo</th>
//                     <th className="px-6 py-4 text-left">Description</th>
//                     <th className="px-6 py-4 text-right">Bill Amt</th>
//                     <th className="px-6 py-4 text-right">Paid Amt</th>
//                     <th className="px-6 py-4 text-right">Due Balance</th>
//                     <th className="px-6 py-4 text-center print:hidden">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y">
//                   {transactions?.map((transaction, idx) => {
//                     const purchase = transaction.purchaseId || transaction;
//                     return (
//                       <tr key={idx} className="hover:bg-gray-50">
//                         <td className="px-6 py-4">{new Date(transaction.date).toLocaleDateString("en-GB")}</td>
//                         <td className="px-6 py-4 font-medium">{transaction.refMemo}</td>
//                         <td className="px-6 py-4">
//                           {transaction.purchaseType === "advance" 
//                             ? "Advance Payment" 
//                             : purchase.products?.map(p => p.productName).join(", ") || "Purchase Items"}
//                         </td>
//                         <td className="px-6 py-4 text-right">৳ {Number(transaction.amountToBePaid || 0).toLocaleString()}</td>
//                         <td className="px-6 py-4 text-right text-green-600">৳ {Number(transaction.paidAmount || 0).toLocaleString()}</td>
//                         <td className="px-6 py-4 text-right text-red-600">৳ {Number(transaction.currentDue || 0).toLocaleString()}</td>
//                         <td className="px-6 py-4 text-center print:hidden">
//                           <Link 
//                             to="/invoice-purchase" 
//                             state={purchase}
//                             className="text-blue-600 hover:underline font-medium"
//                           >
//                             Invoice
//                           </Link>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>

//             {/* Account Summary */}
//             <div className="flex justify-end pt-4">
//               <div className="bg-gray-900 text-white p-6 rounded-2xl w-full max-w-sm">
//                 <h4 className="text-xs font-bold uppercase mb-4 border-b border-gray-700 pb-2">ACCOUNT SUMMARY</h4>
//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span>Total Bill:</span>
//                     <span>৳ {Number(totalAmount || 0).toLocaleString()}</span>
//                   </div>
//                   <div className="flex justify-between text-green-400">
//                     <span>Total Paid:</span>
//                     <span>- ৳ {Number(totalPaid || 0).toLocaleString()}</span>
//                   </div>
//                   <div className="flex justify-between border-t border-gray-700 pt-3 text-lg font-bold">
//                     <span>Balance Due</span>
//                     <span className="text-red-400">৳ {Number(totalDue || 0).toLocaleString()}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="text-center mt-20 text-gray-500">No Supplier Selected</div>
//       )}
//     </div>
//   );
// };

// export default PurchaserStatement;


import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchPurchasesForSupplierName } from "../features/statements/sStatementSlice";
import { useReactToPrint } from "react-to-print";
import { FaArrowLeft, FaPrint } from "react-icons/fa";
import Decimal from 'decimal.js';

const PurchaserStatement = () => {
  const { user } = useSelector((state) => state.auth);
  const { transactions = [], totalAmount = 0, totalPaid = 0, totalDue = 0, supplierBalance = 0, totalCompanyReturnAmount = 0 } = useSelector((state) => state.sstatement);

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
                    <td className="px-6 py-4">{new Date(t.date).toLocaleDateString('en-GB')}</td>
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
                    <td className="px-6 py-4 text-center print:hidden">
                      <Link
                        // to="/invoice-purchase"
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