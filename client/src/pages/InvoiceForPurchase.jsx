// // import React, { useEffect } from "react";
// // import { useLocation, useNavigate } from "react-router-dom";
// // import { useReactToPrint } from "react-to-print";
// // import { useRef } from "react";
// // import { useSelector } from "react-redux";
// // import Decimal from 'decimal.js';

// // const InvoiceForPurchase = () => {
// //   const { user } = useSelector((state) => state.auth);
// //   useEffect(() => {
// //     if (!user) {
// //       navigate("/login");
// //     }
// //   }, []);

// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const title = `invoice-${new Date()
// //     .toISOString()
// //     .split(".")[0]
// //     .replaceAll(":", "_")}`;
// //   // console.log(title)

// //   const contentRef = useRef(null);
// //   const reactToPrintFn = useReactToPrint({ contentRef, documentTitle: title });

// //   useEffect(() => {
// //     if (user && !location.state) {
// //       navigate("/point-of-sale");
// //     }
// //   }, []);

// //   //? Glimpse Stopper
// //   if (!user) return;
// //   if (!location.state) return;

// //   return (
// //     <>
// //       <div className="m-5">
// //         <div className="flex gap-5">
// //           <button
// //             className="mt-5 bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 transition-all duration-300 cursor-pointer"
// //             onClick={reactToPrintFn}
// //           >
// //             Print
// //           </button>
// //           <button
// //             className="mt-5 bg-green-500 text-white font-bold py-2 px-6 rounded shadow border-2 border-green-500 hover:bg-transparent hover:text-green-500 transition-all duration-300 cursor-pointer"
// //             onClick={() => navigate(-1)}
// //           >
// //             Back
// //           </button>
// //         </div>

// //         <div
// //           ref={contentRef}
// //           className="max-w-3xl mx-auto bg-white p-6 mt-5"
// //         >
// //           {/* ---- PURCHASE PRINT HEADER ---- */}
// //           <div className="max-w-4xl mx-auto">
// //             {/* Company Info */}
// //             <div className="flex justify-between items-start border-b-2 border-red-600 pb-3">
// //               <div className="space-y-1">
// //                 <h1 className="text-2xl font-extrabold text-red-700">
// //                   সবুজ অটো
// //                 </h1>
// //                 <p className="text-sm font-bold text-gray-800">
// //                   প্রোঃ মোঃ সবুজ
// //                 </p>
// //                 <p className="text-xs text-gray-800 font-medium">
// //                   অটো রিকশা ও ভ্যানের পার্টস পাইকারি ও খুচরা বিক্রেতা
// //                 </p>
// //                 <p className="text-xs text-gray-700 leading-tight">
// //                   ঠিকানা: জি. এল. রায় রো (লায়ন্স স্কুলের বিপরীতে), ঝন্টুর
// //                   মোড়, রংপুর।
// //                 </p>
// //               </div>

// //               <div className="text-right space-y-1 text-xs text-gray-700">
// //                 <p>মোবাইল: 01773080202 | 01830685667</p>
// //                 <p>দোকান: 01979080202</p>
// //               </div>
// //             </div>

// //             {/* Purchase Info (only required fields) */}
// //             <div className="flex justify-between mt-4 border-b border-gray-300 pb-2">
// //               <div>
// //                 <p>
// //                   <span className="font-semibold">Date:</span>{" "}
// //                   {new Date(location.state.createdAt).toLocaleDateString(
// //                     "en-GB",
// //                     {
// //                       timeZone: "Asia/Dhaka",
// //                       day: "2-digit",
// //                       month: "short",
// //                       year: "numeric",
// //                     }
// //                   )}
// //                 </p>
// //                 <p>
// //                   <span className="font-semibold">Memo:</span>{" "}
// //                   {location.state.memo}
// //                 </p>
// //                 <p>
// //                   <span className="font-semibold">Supplier:</span>{" "}
// //                   {location.state.supplierName}
// //                 </p>
// //               </div>
// //               <div className="text-right">
// //                 <p>
// //                   <span className="font-semibold">Products:</span>{" "}
// //                   {location.state.productNames}
// //                 </p>
// //                 <p>
// //                   <span className="font-semibold">Quantity:</span>{" "}
// //                   {location.state.quantity}
// //                 </p>
// //               </div>
// //             </div>

// //             {/* Purchase Table (only required columns) */}
// //             <table className="w-full border-collapse mt-4 text-sm">
// //               <thead className="bg-gray-200">
// //                 <tr>
// //                   <th className="border px-2 py-1 text-left">Products</th>
// //                   <th className="border px-2 py-1 text-center">QTY</th>

// //                   <th className="border px-2 py-1 text-right">Amount</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 <tr className="hover:bg-gray-50">
// //                   <td className="border px-2 py-1">
// //                     {location.state.productNames}
// //                   </td>
// //                   <td className="border px-2 py-1 text-center">
// //                     {location.state.quantity}
// //                   </td>

// //                   <td className="border px-2 py-1 text-right">
// //                     ৳ {new Decimal(location.state.totalAmount).toFixed(2)}
// //                   </td>
// //                 </tr>
// //               </tbody>
// //             </table>

// //             {/* Summary (only Total, Paid, Due) */}
// //             <div className="mt-4 text-sm">
// //               <p className="font-semibold text-gray-800">
// //                 Total:{" "}
// //                 <span className="float-right">
// //                   ৳ {new Decimal(location.state.totalAmount).toFixed(2)}
// //                 </span>
// //               </p>
// //               <p className="font-semibold text-gray-800">
// //                 Paid:{" "}
// //                 <span className="float-right">
// //                   ৳ {location.state.paid ? new Decimal(location.state.paid).toFixed(2) : 0}
// //                 </span>
// //               </p>
// //               <p
// //                 className={`font-semibold float-right ${
// //                   new Decimal(location.state.due).greaterThan(new Decimal(0)) ? "text-red-600" : "text-green-600"
// //                 }`}
// //               >
// //                 Due: <span>৳ {location.state.due ? new Decimal(location.state.due).toFixed(2) : 0}</span>
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default InvoiceForPurchase;

// // import React, { useEffect, useRef } from "react";
// // import { useLocation, useNavigate } from "react-router-dom";
// // import { useReactToPrint } from "react-to-print";
// // import { useSelector } from "react-redux";
// // import Decimal from 'decimal.js';

// // const InvoiceForPurchase = () => {
// //   const { user } = useSelector((state) => state.auth);
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const contentRef = useRef(null);

// //   // Redirect if not logged in
// //   useEffect(() => {
// //     if (!user) {
// //       navigate("/login");
// //     }
// //   }, [user, navigate]);

// //   // Redirect if no data is passed
// //   useEffect(() => {
// //     if (user && !location.state) {
// //       navigate("/purchase"); // বা আপনার মেইন পারচেজ পেজের পাথ
// //     }
// //   }, [user, location.state, navigate]);

// //   const purchaseData = location.state;

// //   const title = `purchase-invoice-${purchaseData?.memo || "unknown"}`;
// //   const reactToPrintFn = useReactToPrint({ 
// //     contentRef, 
// //     documentTitle: title 
// //   });

// //   if (!user || !purchaseData) return null;

// //   return (
// //     <div className="min-h-screen bg-gray-100 p-2 sm:p-5">
// //       {/* Control Buttons */}
// //       <div className="max-w-3xl mx-auto flex gap-4 no-print mb-5">
// //         <button
// //           className="bg-blue-600 text-white font-bold py-2 px-8 rounded shadow hover:bg-blue-700 transition-all cursor-pointer"
// //           onClick={reactToPrintFn}
// //         >
// //           Print Invoice
// //         </button>
// //         <button
// //           className="bg-gray-600 text-white font-bold py-2 px-8 rounded shadow hover:bg-gray-700 transition-all cursor-pointer"
// //           onClick={() => navigate(-1)}
// //         >
// //           Back
// //         </button>
// //       </div>

// //       {/* Invoice Content */}
// //       <div
// //         ref={contentRef}
// //         className="max-w-3xl mx-auto bg-white p-8 shadow-lg print:shadow-none border print:border-0 border-gray-200"
// //         style={{ minHeight: "297mm" }} // A4 height adjustment
// //       >
// //         {/* Header Section */}
// //         <div className="flex justify-between items-start border-b-2 border-red-600 pb-4">
// //           <div className="space-y-1">
// //             <h1 className="text-3xl font-extrabold text-red-700">Ellite Battery</h1>
// //             <p className="text-sm font-bold text-gray-800">Proprietor Md. Foyez Uddin</p>
// //             <p className="text-xs text-gray-700 font-medium">
// //               Auto Battery and Parts Wholesale and Retail Dealer
// //             </p>
// //             <p className="text-xs text-gray-600 max-w-[300px]">
// //               Address: College Road, Rangpur.
// //             </p>
// //           </div>

// //           <div className="text-right space-y-1 text-xs text-gray-700">
// //             <p className="font-bold text-gray-900 text-sm mb-1">Contact:</p>
// //             <p>017********</p>
// //             <p>018********</p>
// //             <p>Shop: 019********</p>
// //           </div>
// //         </div>

// //         <div className="text-center my-4">
// //           <span className="bg-gray-800 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest">
// //             Purchase Invoice
// //           </span>
// //         </div>

// //         {/* Invoice Info Row */}
// //         <div className="grid grid-cols-2 gap-4 text-sm mb-6 border-b border-gray-100 pb-4">
// //           <div>
// //             <p><span className="font-bold text-gray-600">Supplier:</span> {purchaseData.supplierName}</p>
// //             <p><span className="font-bold text-gray-600">Address:</span> {purchaseData.address || "N/A"}</p>
// //             <p><span className="font-bold text-gray-600">Phone:</span> {purchaseData.supplierPhone || "N/A"}</p>
// //           </div>
// //           <div className="text-right">
// //             <p><span className="font-bold text-gray-600">Memo No:</span> {purchaseData.memo}</p>
// //             <p>
// //               <span className="font-bold text-gray-600">Date:</span>{" "}
// //               {new Date(purchaseData.createdAt).toLocaleDateString("en-GB", {
// //                 day: "2-digit",
// //                 month: "short",
// //                 year: "numeric",
// //               })}
// //             </p>
// //           </div>
// //         </div>

// //         {/* Products Table */}
// //         <table className="w-full border-collapse text-sm mb-6">
// //           <thead>
// //             <tr className="bg-gray-100">
// //               <th className="border border-gray-300 px-3 py-2 text-left w-12">SL</th>
// //               <th className="border border-gray-300 px-3 py-2 text-left">Product Description</th>
// //               <th className="border border-gray-300 px-3 py-2 text-center w-20">QTY</th>
// //               <th className="border border-gray-300 px-3 py-2 text-right w-24">Price</th>
// //               <th className="border border-gray-300 px-3 py-2 text-right w-28">Total</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {purchaseData.products && purchaseData.products.length > 0 ? (
// //               purchaseData.products.map((item, index) => (
// //                 <tr key={index} className="border-b">
// //                   <td className="border border-gray-300 px-3 py-2 text-center">{index + 1}</td>
// //                   <td className="border border-gray-300 px-3 py-2">{item.productName}</td>
// //                   <td className="border border-gray-300 px-3 py-2 text-center">{item.quantity}</td>
// //                   <td className="border border-gray-300 px-3 py-2 text-right">
// //                     {new Decimal(item.unitPrice || 0).toFixed(2)}
// //                   </td>
// //                   <td className="border border-gray-300 px-3 py-2 text-right">
// //                     {new Decimal(item.quantity || 0).mul(new Decimal(item.unitPrice || 0)).toFixed(2)}
// //                   </td>
// //                 </tr>
// //               ))
// //             ) : (
// //               <tr>
// //                 <td colSpan="5" className="border px-3 py-2 text-center">No products found</td>
// //               </tr>
// //             )}
// //           </tbody>
// //         </table>

// //         {/* Calculation Summary */}
// //         <div className="flex justify-end">
// //           <div className="w-64 space-y-2">
// //             <div className="flex justify-between border-b pb-1">
// //               <span className="font-semibold text-gray-600">Sub Total:</span>
// //               <span className="font-bold">৳ {new Decimal(purchaseData.totalAmount || 0).toFixed(2)}</span>
// //             </div>
// //             <div className="flex justify-between border-b pb-1 text-green-700">
// //               <span className="font-semibold">Paid Amount:</span>
// //               <span className="font-bold">৳ {new Decimal(purchaseData.paid || 0).toFixed(2)}</span>
// //             </div>
// //             <div className={`flex justify-between border-b-2 pb-1 ${new Decimal(purchaseData.due || 0).gt(0) ? "text-red-600" : "text-gray-800"}`}>
// //               <span className="font-extrabold text-lg">Due Balance:</span>
// //               <span className="font-extrabold text-lg">৳ {new Decimal(purchaseData.due || 0).toFixed(2)}</span>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Footer Signature */}
// //         <div className="mt-20 flex justify-between items-end">
// //           <div className="text-center">
// //             <div className="border-t border-gray-400 w-32 mb-1"></div>
// //             <p className="text-xs font-bold text-gray-600">Supplier Signature</p>
// //           </div>
// //           {/* <div className="text-center text-[10px] text-gray-400">
// //             Powered by Gemini AI
// //           </div> */}
// //           <div className="text-center">
// //             <div className="border-t border-gray-400 w-32 mb-1"></div>
// //             <p className="text-xs font-bold text-gray-600">Authorized Signature</p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default InvoiceForPurchase;

// // import React, { useEffect, useRef } from "react";
// // import { useLocation, useNavigate } from "react-router-dom";
// // import { useReactToPrint } from "react-to-print";
// // import { useSelector } from "react-redux";
// // import Decimal from 'decimal.js';

// // const InvoiceForPurchase = () => {
// //   const { user } = useSelector((state) => state.auth);
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const contentRef = useRef(null);

// //   const purchaseData = location.state;

// //   // Redirect if not logged in or no data
// //   useEffect(() => {
// //     if (!user) navigate("/login");
// //   }, [user, navigate]);

// //   useEffect(() => {
// //     if (user && !purchaseData) navigate("/purchase");
// //   }, [user, purchaseData, navigate]);

// //   const reactToPrintFn = useReactToPrint({
// //     contentRef,
// //     documentTitle: `Purchase-Invoice-${purchaseData?.memo || "Unknown"}`,
// //   });

// //   if (!user || !purchaseData) return null;

// //   const totalAmount = new Decimal(purchaseData.totalAmount || 0);
// //   const paid = new Decimal(purchaseData.paid || 0);
// //   const due = new Decimal(purchaseData.due || 0);
// //   const advanceUsed = new Decimal(purchaseData.advanceUsed || 0);

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-4">
// //       {/* Control Buttons */}
// //       <div className="max-w-4xl mx-auto mb-4 flex justify-between items-center">
// //         <button
// //           onClick={() => navigate(-1)}
// //           className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
// //         >
// //           ← Back
// //         </button>
// //         <button
// //           onClick={reactToPrintFn}
// //           className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
// //         >
// //           🖨 Print Invoice
// //         </button>
// //       </div>

// //       {/* Invoice Content */}
// //       <div ref={contentRef} className="max-w-4xl mx-auto bg-white shadow-lg p-8">
// //         {/* Header */}
// //         <div className="border-b pb-6 mb-6">
// //           <div className="flex justify-between items-start">
// //             <div>
// //               <h1 className="text-3xl font-bold text-gray-800">Purchase Invoice</h1>
// //               <p className="text-gray-500 mt-1">Elite Battery & Parts</p>
// //             </div>
// //             <div className="text-right">
// //               <p className="text-sm font-medium">Memo No: <span className="font-bold">{purchaseData.memo}</span></p>
// //               <p className="text-sm">
// //                 Date: {new Date(purchaseData.createdAt).toLocaleDateString("en-GB", {
// //                   day: "2-digit", month: "short", year: "numeric"
// //                 })}
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Supplier Info */}
// //         <div className="grid grid-cols-2 gap-6 mb-8">
// //           <div>
// //             <p className="text-xs uppercase text-gray-500 mb-1">Supplier</p>
// //             <p className="font-semibold text-lg">{purchaseData.supplierName}</p>
// //             <p className="text-sm text-gray-600">{purchaseData.address}</p>
// //             <p className="text-sm text-gray-600">{purchaseData.supplierPhone}</p>
// //           </div>
// //           <div className="text-right">
// //             <p className="text-xs uppercase text-gray-500 mb-1">Purchase Type</p>
// //             <p className="font-medium text-lg">
// //               {purchaseData.purchaseType === "advance" ? "Advance Payment" : "Normal Purchase"}
// //             </p>
// //           </div>
// //         </div>

// //         {/* Products Table */}
// //         <table className="w-full border-collapse mb-8">
// //           <thead>
// //             <tr className="bg-gray-100">
// //               <th className="border border-gray-300 px-4 py-3 text-left">SL</th>
// //               <th className="border border-gray-300 px-4 py-3 text-left">Product Description</th>
// //               <th className="border border-gray-300 px-4 py-3 text-center">Qty</th>
// //               <th className="border border-gray-300 px-4 py-3 text-right">Unit Price</th>
// //               <th className="border border-gray-300 px-4 py-3 text-right">Total</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {purchaseData.products && purchaseData.products.length > 0 ? (
// //               purchaseData.products.map((item, index) => {
// //                 const subTotal = new Decimal(item.quantity || 0).mul(new Decimal(item.unitPrice || 0));
// //                 return (
// //                   <tr key={index} className="border-b border-gray-200">
// //                     <td className="border border-gray-300 px-4 py-3">{index + 1}</td>
// //                     <td className="border border-gray-300 px-4 py-3">{item.productName}</td>
// //                     <td className="border border-gray-300 px-4 py-3 text-center">{item.quantity}</td>
// //                     <td className="border border-gray-300 px-4 py-3 text-right">৳ {new Decimal(item.unitPrice || 0).toFixed(2)}</td>
// //                     <td className="border border-gray-300 px-4 py-3 text-right font-medium">৳ {subTotal.toFixed(2)}</td>
// //                   </tr>
// //                 );
// //               })
// //             ) : (
// //               <tr>
// //                 <td colSpan={5} className="text-center py-8 text-gray-500">No products</td>
// //               </tr>
// //             )}
// //           </tbody>
// //         </table>

// //         {/* Summary */}
// //         <div className="flex justify-end">
// //           <div className="w-full max-w-xs bg-gray-50 border border-gray-200 rounded-lg p-5">
// //             <div className="space-y-3">
// //               <div className="flex justify-between">
// //                 <span className="font-medium">Total Amount</span>
// //                 <span className="font-bold">৳ {totalAmount.toFixed(2)}</span>
// //               </div>

// //               {advanceUsed.greaterThan(0) && (
// //                 <div className="flex justify-between text-green-600">
// //                   <span>Advance Used</span>
// //                   <span>- ৳ {advanceUsed.toFixed(2)}</span>
// //                 </div>
// //               )}

// //               <div className="flex justify-between border-t border-gray-300 pt-3">
// //                 <span className="font-medium">Paid Amount</span>
// //                 <span className="font-bold text-green-600">৳ {paid.toFixed(2)}</span>
// //               </div>

// //               <div className="flex justify-between border-t border-gray-300 pt-3 text-lg">
// //                 <span className="font-bold">Due Balance</span>
// //                 <span className="font-bold text-red-600">৳ {due.toFixed(2)}</span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Footer */}
// //         <div className="mt-16 flex justify-between text-sm">
// //           <div>
// //             <p className="font-medium">Supplier Signature</p>
// //             <div className="w-52 h-px bg-gray-400 mt-8"></div>
// //           </div>
// //           <div className="text-right">
// //             <p className="font-medium">Authorized Signature</p>
// //             <div className="w-52 h-px bg-gray-400 mt-8"></div>
// //           </div>
// //         </div>

// //         <div className="text-center text-xs text-gray-400 mt-10">
// //           Powered by Your POS System
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default InvoiceForPurchase;

// import React, { useEffect, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useReactToPrint } from "react-to-print";
// import { useSelector } from "react-redux";
// import Decimal from 'decimal.js';

// const InvoiceForPurchase = () => {
//   const { user } = useSelector((state) => state.auth);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const contentRef = useRef(null);

//   const purchaseData = location.state;

//   useEffect(() => {
//     if (!user) navigate("/login");
//   }, [user, navigate]);

//   useEffect(() => {
//     if (user && !purchaseData) navigate("/purchase");
//   }, [user, purchaseData, navigate]);

//   const reactToPrintFn = useReactToPrint({
//     contentRef,
//     documentTitle: `Purchase-Invoice-${purchaseData?.memo || "Unknown"}`,
//   });

//   if (!user || !purchaseData) return null;

//   const totalAmount = new Decimal(purchaseData.totalAmount || 0);
//   const paid = new Decimal(purchaseData.paid || 0);
//   const currentDue = new Decimal(purchaseData.due || 0);

//   const isAdvance = purchaseData.purchaseType === "advance";

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <div className="max-w-4xl mx-auto mb-4 flex justify-between items-center">
//         <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
//           ← Back
//         </button>
//         <button onClick={reactToPrintFn} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium">
//           🖨 Print Invoice
//         </button>
//       </div>

//       <div ref={contentRef} className="max-w-4xl mx-auto bg-white shadow-lg p-8">
//         <div className="border-b pb-6 mb-6">
//           <div className="flex justify-between items-start">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800">Purchase Invoice</h1>
//               <p className="text-gray-500 mt-1">Elite Battery & Parts</p>
//             </div>
//             <div className="text-right">
//               <p className="text-sm font-medium">Memo No: <span className="font-bold">{purchaseData.memo}</span></p>
//               <p className="text-sm">Date: {new Date(purchaseData.createdAt).toLocaleDateString("en-GB")}</p>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-8 mb-8">
//           <div>
//             <p className="text-xs uppercase text-gray-500 mb-1">Supplier</p>
//             <p className="font-semibold text-xl">{purchaseData.supplierName}</p>
//             <p className="text-sm text-gray-600">{purchaseData.address}</p>
//             <p className="text-sm text-gray-600">{purchaseData.supplierPhone}</p>
//           </div>
//           <div className="text-right">
//             <p className="text-xs uppercase text-gray-500 mb-1">Type</p>
//             <p className="font-bold text-xl text-blue-600">
//               {isAdvance ? "Advance Payment" : "Normal Purchase"}
//             </p>
//           </div>
//         </div>

//         <table className="w-full border-collapse mb-8">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border border-gray-300 px-4 py-3 text-left">SL</th>
//               <th className="border border-gray-300 px-4 py-3 text-left">Product Description</th>
//               <th className="border border-gray-300 px-4 py-3 text-center">Qty</th>
//               <th className="border border-gray-300 px-4 py-3 text-right">Unit Price</th>
//               <th className="border border-gray-300 px-4 py-3 text-right">Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {purchaseData.products && purchaseData.products.length > 0 ? (
//               purchaseData.products.map((item, index) => (
//                 <tr key={index} className="border-b border-gray-200">
//                   <td className="border border-gray-300 px-4 py-3">{index + 1}</td>
//                   <td className="border border-gray-300 px-4 py-3">{item.productName}</td>
//                   <td className="border border-gray-300 px-4 py-3 text-center">{item.quantity}</td>
//                   <td className="border border-gray-300 px-4 py-3 text-right">৳ {new Decimal(item.unitPrice || 0).toFixed(2)}</td>
//                   <td className="border border-gray-300 px-4 py-3 text-right font-medium">৳ {new Decimal(item.quantity || 0).mul(new Decimal(item.unitPrice || 0)).toFixed(2)}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr><td colSpan={5} className="text-center py-8 text-gray-500">No products</td></tr>
//             )}
//           </tbody>
//         </table>

//         {/* Current Due Summary */}
//         <div className="flex justify-end">
//           <div className="w-full max-w-xs bg-gray-50 border border-gray-200 rounded-lg p-5">
//             <div className="space-y-3">
//               <div className="flex justify-between">
//                 <span className="font-medium">Total Amount</span>
//                 <span className="font-bold">৳ {totalAmount.toFixed(2)}</span>
//               </div>

//               <div className="flex justify-between border-t border-gray-300 pt-3">
//                 <span className="font-medium">Paid Amount</span>
//                 <span className="font-bold text-green-600">৳ {paid.toFixed(2)}</span>
//               </div>

//               <div className="flex justify-between border-t border-gray-300 pt-3 text-xl font-bold">
//                 <span>Current Due</span>
//                 <span className={currentDue.greaterThanOrEqualTo(0) ? "text-green-600" : "text-red-600"}>
//                   {currentDue.greaterThanOrEqualTo(0) ? "+" : ""}৳ {currentDue.toFixed(2)}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mt-16 flex justify-between text-sm">
//           <div>
//             <p className="font-medium">Supplier Signature</p>
//             <div className="w-52 h-px bg-gray-400 mt-8"></div>
//           </div>
//           <div className="text-right">
//             <p className="font-medium">Authorized Signature</p>
//             <div className="w-52 h-px bg-gray-400 mt-8"></div>
//           </div>
//         </div>

//         <div className="text-center text-xs text-gray-400 mt-10">
//           Powered by Your POS System
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvoiceForPurchase;

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
  console.log

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