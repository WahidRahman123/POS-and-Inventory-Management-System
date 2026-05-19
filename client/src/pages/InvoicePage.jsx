// import React, { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useReactToPrint } from "react-to-print";
// import { useRef } from "react";
// import { useSelector } from "react-redux";
// import Decimal from "decimal.js";

// const InvoicePage = () => {
//   const { user } = useSelector((state) => state.auth);
//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//     }
//   }, []);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const title = `invoice-${new Date()
//     .toISOString()
//     .split(".")[0]
//     .replaceAll(":", "_")}`;
//   // console.log(title)

//   const contentRef = useRef(null);
//   const reactToPrintFn = useReactToPrint({ contentRef, documentTitle: title });

//   useEffect(() => {
//     if (user && !location.state) {
//       navigate("/point-of-sale");
//     }
//   }, []);


//   //? Glimpse Stopper
//   if (!user) return;
//   if (!location.state) return;

//   return (
//     <>
//       <div className="m-5">
//         <div className="flex gap-5">
//           <button
//             className="mt-5 bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 transition-all duration-300 cursor-pointer"
//             onClick={reactToPrintFn}
//           >
//             Print
//           </button>
//           <button
//             className="mt-5 bg-green-500 text-white font-bold py-2 px-6 rounded shadow border-2 border-green-500 hover:bg-transparent hover:text-green-500 transition-all duration-300 cursor-pointer"
//             onClick={() => navigate(-1)}
//           >
//             Back
//           </button>
//         </div>
//         <div className="m-5">
//           <div ref={contentRef} className="max-w-3xl mx-auto bg-white p-6 mt-5">
//             <div className="flex justify-between items-start border-b-2 border-red-600 pb-3">
//               {/* LEFT : centre-aligned text block */}
//               <div className="text-center sm:text-left space-y-1">
//                 <h1 className="text-2xl font-extrabold text-red-700">
//                   Ellite Bettary 
//                 </h1>
//                 {/* <p className="text-sm font-bold text-gray-800">
//                   প্রোঃ মোঃ সবুজ
//                 </p> */}
//                 <p className="text-xs text-gray-800 font-medium">
//                   Auto Rickshaw & Van Parts Wholesaler & Retailer
//                 </p>
//                 <p className="text-xs text-gray-700 leading-tight">

//                     Address:Shapla Chattar, College Road, Rangpur  


//                 </p>
//               </div>
//               {/* RIGHT : mobile numbers + invoice number (image-মতো) */}
//               <div className="text-right space-y-1 text-xs text-gray-700">
//                 <p>Mobile: 01773080202 | 01830685667</p>
//                 <p>Shop: 01979080202</p>
//                 {/* Invoice Number sits exactly under mobile numbers, above the border */}

//                 <p className="mt-6 font-semibold text-gray-800">
//                   Invoice No:{" "}
//                   <span className="text-red-700">
//                     {location.state?.invoiceNo || "--------"}
//                   </span>
//                 </p>
//               </div>
//             </div>
//             {/* <div className="flex justify-between items-start border-b border-red-500 pb-2">
//               <div>
//                 <h1 className="text-xl font-bold text-red-600">সবুজ অটো </h1>
//                 <p className="text-sm text-gray-600">
//                   ঠিকানা: জি. এল. রায় রোড( লায়ন্স স্কুলের বিপরীতে), ঝন্টুর মোড়, রংপুর|
//                 </p>
//                 <p className="text-sm text-gray-600">মোবাইল: 01773080202</p>
//                 <p className="text-sm text-gray-600">মোবাইল: 01830685667</p>
//                 <p className="text-sm text-gray-600">
//                   দোকান: 01979080202
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   Email: info@biznishike.com
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   WebSite: biznishike.com, facebook.com/biznishike
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p className="text-sm font-semibold">অটো রিকশা ও ভ্যানের পার্টস পাইকারি ও খুচরা বিক্রেতা</p>
//               </div>
//             </div> */}

//             <div className="flex justify-between mt-4 border-b border-gray-300 pb-2">
//               <p>
//                 <span className="font-semibold">Customer:</span>{" "}
//                 {location.state ? location.state.customerName : ""}
//               </p>
//               <p>
//                 <span className="font-semibold">Address: </span>
//                 {location.state?.address ?? ""}
//               </p>
//               <div className="text-right">
//                 {/* <p>
//                   <span className="font-semibold">Sr.#</span> 4
//                 </p> */}
//                 <p>
//                   <span className="font-semibold">Date:</span>{" "}
//                   {new Date().toLocaleDateString("en-GB", {
//                     timeZone: "Asia/Dhaka",
//                     day: "2-digit",
//                     month: "short",
//                     year: "numeric",
//                   })}{" "}
//                   {new Date().toLocaleTimeString("en-US", {
//                     timeZone: "Asia/Dhaka",
//                   })}
//                 </p>
//               </div>
//             </div>

//             <table className="w-full border-collapse mt-4 text-sm">
//               <thead>
//                 <tr className="bg-red-600 text-white">
//                   <th className="border border-gray-300 px-2 py-1">SL.</th>
//                   <th className="border border-gray-300 px-2 py-1">
//                     Product Description
//                   </th>
//                   <th className="border border-gray-300 px-2 py-1">Quantity</th>

//                   <th className="border border-gray-300 px-2 py-1">Price</th>
//                   <th className="border border-gray-300 px-2 py-1">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {location.state ? (
//                   location.state.products.map((sale, index) => (
//                     <tr key={index}>
//                       <td className="border border-gray-300 px-2 py-1 text-center">
//                         {index + 1}
//                       </td>
//                       <td className="border border-gray-300 px-2 py-1">
//                         {sale.productName}
//                       </td>
//                       <td className="border border-gray-300 px-2 py-1 text-center">
//                         {sale.quantity}
//                       </td>
//                       <td className="border border-gray-300 px-2 py-1 text-right">
//                         {new Decimal(sale.sellPrice).toFixed(2)}
//                       </td>
//                       <td className="border border-gray-300 px-2 py-1 text-right">
//                         {new Decimal(sale.subTotal).toFixed(2)}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr></tr>
//                 )}
//               </tbody>
//             </table>

//             <div className="mt-4 text-sm">
//               <p className="font-semibold text-red-600">
//                 Total {location.state ? location.state.products.length : ""}{" "}
//                 <span className="float-right">
//                   {location.state
//                     ? new Decimal(location.state.totalWithoutDiscount).toFixed(
//                         2
//                       )
//                     : ""}
//                 </span>
//               </p>
//               <p>
//                 Discount{" "}
//                 <span className="float-right">
//                   {location.state
//                     ? location.state.discount
//                       ? new Decimal(location.state.discount).toFixed(2)
//                       : 0
//                     : ""}
//                 </span>
//               </p>
//               <p>
//                 Payable Amount{" "}
//                 <span className="float-right">
//                   {location.state
//                     ? new Decimal(location.state.total).toFixed(2)
//                     : ""}
//                 </span>
//               </p>
//               <br />
//               <p>
//                 Cash{" "}
//                 <span className="float-right">
//                   {location.state
//                     ? location.state.cash
//                       ? new Decimal(location.state.cash).toFixed(2)
//                       : 0
//                     : ""}
//                 </span>
//               </p>
//               <p>
//                 Exchange{" "}
//                 <span className="float-right">
//                   {location.state
//                     ? location.state.exchange
//                       ? new Decimal(location.state.exchange).toFixed(2)
//                       : 0
//                     : ""}
//                 </span>
//               </p>
//               <p>
//                 Total Paid{" "}
//                 <span className="float-right">
//                   {location.state
//                     ? location.state.paid
//                       ? new Decimal(location.state.paid).toFixed(2)
//                       : 0
//                     : ""}
//                 </span>
//               </p>
//               <p>
//                 Due Amount{" "}
//                 <span className="float-right">
//                   {location.state
//                     ? new Decimal(location.state.due).lessThan(new Decimal(0))
//                       ? `${new Decimal(location.state.due)
//                           .abs()
//                           .toFixed(2)} (Refund)`
//                       : location.state.due
//                       ? new Decimal(location.state.due).toFixed(2)
//                       : 0
//                     : ""}
//                 </span>
//               </p>
//             </div>

//             <div className="mt-6">
//               <p className="text-red-600 font-semibold">Remarks:</p>
//               <div className="h-12 border border-gray-300 rounded">
//                 {location.state.remarks}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default InvoicePage;


// import React, { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useReactToPrint } from "react-to-print";
// import { useRef } from "react";
// import { useSelector } from "react-redux";
// import Decimal from "decimal.js";

// const InvoicePage = () => {
//   const { user } = useSelector((state) => state.auth);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//     }
//     if (user && !location.state) {
//       navigate("/point-of-sale");
//     }
//   }, [user, location.state, navigate]);

//   const title = `invoice-${new Date()
//     .toISOString()
//     .split(".")[0]
//     .replaceAll(":", "_")}`;

//   const contentRef = useRef(null);
//   const reactToPrintFn = useReactToPrint({ contentRef, documentTitle: title });

//   if (!user || !location.state) return null;

//   const {
//     customerName,
//     address,
//     invoiceNo,
//     products,
//     totalWithoutDiscount,
//     discount,
//     loan,
//     total,
//     cash,
//     exchange,
//     paid,
//     due,
//     remarks,
//   } = location.state;

//   return (
//     <>
//       <div className="m-5">
//         <div className="flex gap-5">
//           <button
//             className="mt-5 bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 transition-all duration-300 cursor-pointer"
//             onClick={reactToPrintFn}
//           >
//             Print
//           </button>
//           <button
//             className="mt-5 bg-green-500 text-white font-bold py-2 px-6 rounded shadow border-2 border-green-500 hover:bg-transparent hover:text-green-500 transition-all duration-300 cursor-pointer"
//             onClick={() => navigate(-1)}
//           >
//             Back
//           </button>
//         </div>

//         <div className="m-5">
//           <div ref={contentRef} className="max-w-3xl mx-auto bg-white p-6 mt-5">
//             {/* Header Section */}
//             <div className="flex justify-between items-start border-b-2 border-red-600 pb-3">
//               <div className="text-center sm:text-left space-y-1">
//                 <h1 className="text-2xl font-extrabold text-red-700">
//                   Ellite Battery
//                 </h1>
//                 <p className="text-xs text-gray-800 font-medium">
//                   Auto Rickshaw & Van Parts Wholesaler & Retailer
//                 </p>
//                 <p className="text-xs text-gray-700 leading-tight">
//                   Address: Shapla Chattar, College Road, Rangpur
//                 </p>
//               </div>
//               <div className="text-right space-y-1 text-xs text-gray-700">
//                 <p>Mobile: 01773080202 | 01830685667</p>
//                 <p>Shop: 01979080202</p>
//                 <p className="mt-6 font-semibold text-gray-800">
//                   Invoice No:{" "}
//                   <span className="text-red-700">{invoiceNo || "--------"}</span>
//                 </p>
//               </div>
//             </div>

//             {/* Customer Info Section */}
//             <div className="flex justify-between mt-4 border-b border-gray-300 pb-2 text-sm">
//               <p>
//                 <span className="font-semibold">Customer:</span> {customerName}
//               </p>
//               <p>
//                 <span className="font-semibold">Address:</span> {address}
//               </p>
//               <div className="text-right">
//                 <p>
//                   <span className="font-semibold">Date:</span>{" "}
//                   {new Date().toLocaleDateString("en-GB", {
//                     day: "2-digit",
//                     month: "short",
//                     year: "numeric",
//                   })}{" "}
//                   {new Date().toLocaleTimeString("en-US")}
//                 </p>
//               </div>
//             </div>

//             {/* Products Table */}
//             <table className="w-full border-collapse mt-4 text-sm">
//               <thead>
//                 <tr className="bg-red-600 text-white">
//                   <th className="border border-gray-300 px-2 py-1">SL.</th>
//                   <th className="border border-gray-300 px-2 py-1">Product Description</th>
//                   <th className="border border-gray-300 px-2 py-1">Quantity</th>
//                   <th className="border border-gray-300 px-2 py-1">Price</th>
//                   <th className="border border-gray-300 px-2 py-1">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {products.map((sale, index) => (
//                   <tr key={index}>
//                     <td className="border border-gray-300 px-2 py-1 text-center">{index + 1}</td>
//                     <td className="border border-gray-300 px-2 py-1">{sale.productName}</td>
//                     <td className="border border-gray-300 px-2 py-1 text-center">{sale.quantity}</td>
//                     <td className="border border-gray-300 px-2 py-1 text-right">
//                       {new Decimal(sale.sellPrice).toFixed(2)}
//                     </td>
//                     <td className="border border-gray-300 px-2 py-1 text-right">
//                       {new Decimal(sale.subTotal).toFixed(2)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* Summary Section */}
//             <div className="mt-4 text-sm space-y-1">
//               <p className="font-semibold text-red-600">
//                 Total Item(s): {products.length}
//                 <span className="float-right">
//                   {new Decimal(totalWithoutDiscount).toFixed(2)}
//                 </span>
//               </p>

//               <p>
//                 Discount
//                 <span className="float-right">
//                   {discount ? new Decimal(discount).toFixed(2) : "0.00"}
//                 </span>
//               </p>

//               {/* নতুন লোন ফিল্ড যোগ করা হয়েছে */}
//               <p className="text-red-600 font-medium">
//                 Loan Amount (+)
//                 <span className="float-right">
//                   {loan ? new Decimal(loan).toFixed(2) : "0.00"}
//                 </span>
//               </p>

//               <p className="font-bold border-t border-gray-200 pt-1">
//                 Payable Amount
//                 <span className="float-right">
//                   {new Decimal(total).toFixed(2)}
//                 </span>
//               </p>

//               <div className="pt-2 border-t border-dotted border-gray-300">
//                 <p>
//                   Cash
//                   <span className="float-right">
//                     {cash ? new Decimal(cash).toFixed(2) : "0.00"}
//                   </span>
//                 </p>
//                 <p>
//                   Exchange
//                   <span className="float-right">
//                     {exchange ? new Decimal(exchange).toFixed(2) : "0.00"}
//                   </span>
//                 </p>
//                 <p className="font-bold">
//                   Total Paid
//                   <span className="float-right">
//                     {paid ? new Decimal(paid).toFixed(2) : "0.00"}
//                   </span>
//                 </p>
//                 <p className="font-bold text-red-700">
//                   Due Amount
//                   <span className="float-right">
//                     {new Decimal(due).lessThan(0)
//                       ? `${new Decimal(due).abs().toFixed(2)} (Refund)`
//                       : new Decimal(due).toFixed(2)}
//                   </span>
//                 </p>
//               </div>
//             </div>

//             {/* Remarks Section */}
//             <div className="mt-6">
//               <p className="text-red-600 font-semibold text-xs">Remarks:</p>
//               <div className="min-h-[40px] border border-gray-300 rounded p-2 text-xs italic text-gray-600">
//                 {remarks || "No remarks"}
//               </div>
//             </div>

//             {/* Footer Note */}
//             <div className="mt-8 text-center text-[10px] text-gray-500 border-t pt-2">
//               Thank you for your business!
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default InvoicePage;

import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { useSelector } from "react-redux";
import Decimal from "decimal.js";

const InvoicePage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (user && !location.state) {
      navigate("/point-of-sale");
    }
  }, [user, location.state, navigate]);

  const title = `invoice-${new Date()
    .toISOString()
    .split(".")[0]
    .replaceAll(":", "_")}`;

  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef, documentTitle: title });

  if (!user || !location.state) return null;

  const {
    customerName,
    address,
    invoiceNo,
    products,
    totalWithoutDiscount,
    discount,
    loan,
    total,
    cash,
    exchange,
    exchangeDetails, // মেমোর ডাটা
    paid,
    due,
    remarks,
    createdAt
  } = location.state;

  return (
    <>
      <div className="m-5">
        <div className="flex gap-5">
          <button
            className="mt-5 bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 transition-all duration-300 cursor-pointer"
            onClick={reactToPrintFn}
          >
            Print
          </button>
          <button
            className="mt-5 bg-green-500 text-white font-bold py-2 px-6 rounded shadow border-2 border-green-500 hover:bg-transparent hover:text-green-500 transition-all duration-300 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>

        <div className="m-5">
          <div ref={contentRef} className="max-w-3xl mx-auto bg-white p-6 mt-5">
            {/* Header Section */}
            <div className="flex justify-between items-start border-b-2 border-red-600 pb-3">
              <div className="text-center sm:text-left space-y-1">
                <h1 className="text-2xl font-extrabold text-red-700">
                  Ellite Battery
                </h1>
                <p className="text-xs text-gray-800 font-medium">
                  Auto Rickshaw & Van Parts Wholesaler & Retailer
                </p>
                <p className="text-xs text-gray-700 leading-tight">
                  Address: Shapla Chattar, College Road, Rangpur
                </p>
              </div>
              <div className="text-right space-y-1 text-xs text-gray-700">
                <p>Mobile: 01773080202 | 01830685667</p>
                <p>Shop: 01979080202</p>
                <p className="mt-6 font-semibold text-gray-800">
                  Invoice No:{" "}
                  <span className="text-red-700">{invoiceNo || "--------"}</span>
                </p>
              </div>
            </div>

            {/* Customer Info Section */}
            <div className="flex justify-between mt-4 border-b border-gray-300 pb-2 text-sm">
              <p><span className="font-semibold">Customer:</span> {customerName}</p>
              <p><span className="font-semibold">Address:</span> {address}</p>
              <div className="text-right">
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  {/* {new Date(createdAt).toLocaleTimeString("en-US")} */}
                </p>
              </div>
            </div>

            {/* Main Products Table */}
            <table className="w-full border-collapse mt-4 text-sm">
              <thead>
                <tr className="bg-red-600 text-white">
                  <th className="border border-gray-300 px-2 py-1">SL.</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Product Description</th>
                  <th className="border border-gray-300 px-2 py-1 text-center">Quantity</th>
                  <th className="border border-gray-300 px-2 py-1 text-right">Price</th>
                  <th className="border border-gray-300 px-2 py-1 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {products.map((sale, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-2 py-1 text-center">{index + 1}</td>
                    <td className="border border-gray-300 px-2 py-1">{sale.productName}</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">{sale.quantity}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right">
                      {new Decimal(sale.sellPrice).toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right">
                      {new Decimal(sale.subTotal).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* --- EXCHANGE DETAILS SECTION (NEW) --- */}
            {/* --- EXCHANGE DETAILS SECTION --- */}
            {exchangeDetails && (
              <div className="mt-6 border-2 border-gray-200 rounded">
                <div className="bg-gray-100 px-2 py-1 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-xs font-bold text-gray-700">
                    Exchange Item Details (Against Memo: {exchangeDetails.memo})
                  </h3>
                  {/* এখানে মেমোর অবশিষ্ট ব্যালেন্স দেখানো হচ্ছে */}
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-gray-300 font-bold text-blue-700">
                    Remaining: ৳{new Decimal(exchangeDetails.remainingBalance || 0).toFixed(2)}
                  </span>
                </div>
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border px-2 py-1 text-left">Product Name</th>
                      <th className="border px-2 py-1 text-center">Qty/Kg</th>
                      <th className="border px-2 py-1 text-right">Rate</th>
                      <th className="border px-2 py-1 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exchangeDetails.products?.map((p, i) => (
                      <tr key={i}>
                        <td className="border px-2 py-1">{p.productName}</td>
                        <td className="border px-2 py-1 text-center">
                          {p.quantity} {p.qtyInKg > 0 ? `(${p.qtyInKg} kg)` : ""}
                        </td>
                        <td className="border px-2 py-1 text-right">{p.unitPrice.toFixed(2)}</td>
                        <td className="border px-2 py-1 text-right">{p.subTotal.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* নিচে আলাদা করে হাইলাইট করার জন্য */}
                <div className="bg-gray-50 text-right p-1 text-[10px] font-semibold text-orange-700 border-t">
                  Amount Adjusted in this Invoice: ৳{new Decimal(exchange).toFixed(2)}
                </div>
              </div>
            )}

            {/* Summary Section */}
            <div className="mt-4 text-sm space-y-1">
              <p className="font-semibold text-red-600">
                Total Item(s): {products.length}
                <span className="float-right">
                  {new Decimal(totalWithoutDiscount).toFixed(2)}
                </span>
              </p>

              <p>Discount<span className="float-right">{discount ? new Decimal(discount).toFixed(2) : "0.00"}</span></p>

              <p className="text-red-600 font-medium">
                Loan Amount (+)<span className="float-right">{loan ? new Decimal(loan).toFixed(2) : "0.00"}</span>
              </p>

              <p className="font-bold border-t border-gray-200 pt-1">
                Payable Amount<span className="float-right">{new Decimal(total).toFixed(2)}</span>
              </p>

              <div className="pt-2 border-t border-dotted border-gray-300">
                <p>Cash<span className="float-right">{cash ? new Decimal(cash).toFixed(2) : "0.00"}</span></p>
                <p>Exchange<span className="float-right">{exchange ? new Decimal(exchange).toFixed(2) : "0.00"}</span></p>
                <p className="font-bold">Total Paid<span className="float-right">{paid ? new Decimal(paid).toFixed(2) : "0.00"}</span></p>
                <p className="font-bold text-red-700">
                  Due Amount
                  <span className="float-right">
                    {new Decimal(due).lessThan(0)
                      ? `${new Decimal(due).abs().toFixed(2)} (Refund)`
                      : new Decimal(due).toFixed(2)}
                  </span>
                </p>
              </div>
            </div>

            {/* Remarks Section */}
            <div className="mt-6">
              <p className="text-red-600 font-semibold text-xs">Remarks:</p>
              <div className="min-h-[40px] border border-gray-300 rounded p-2 text-xs italic text-gray-600">
                {remarks || "No remarks"}
              </div>
            </div>

            <div className="mt-8 text-center text-[10px] text-gray-500 border-t pt-2">
              Thank you for your business!
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoicePage;