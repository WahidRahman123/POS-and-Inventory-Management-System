// import React, { useState } from "react";
// import { useLocation, useNavigate, Link } from "react-router-dom";

// const SalesReturnStatement = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const returnData = location.state;

//   // Sample data if no state passed
//   const [returnItem] = useState(
//     returnData || {
//       customerName: "XYZ Traders",
//       customerPhone: "01712-345678",
//       customerEmail: "xyz@email.com",
//       totalDue: 15000,
//       createdAt: "2026-02-15",
//       memo: "SR-1290",
//       productNames: "LED Bulb 12W",
//       quantity: 10,
//       totalAmount: 15000,
//       paid: 0,
//       due: 15000,
//     }
//   );

//   // Sample sales return history
//   const [returnHistory] = useState([
//     {
//       _id: "1",
//       date: "15-02-2026",
//       memo: "SR-1290",
//       products: "LED Bulb 12W",
//       qty: 10,
//       total: 15000,
//       paid: 0,
//       due: 15000,
//     },
//     {
//       _id: "2",
//       date: "20-01-2026",
//       memo: "SR-1291",
//       products: "Battery 12V",
//       qty: 5,
//       total: 25000,
//       paid: 10000,
//       due: 15000,
//     },
//   ]);

//   const [date, setDate] = useState("");

//   // Calculate totals
//   const totalAmount = returnHistory.reduce((sum, item) => sum + item.total, 0);
//   const totalPaid = returnHistory.reduce((sum, item) => sum + item.paid, 0);
//   const totalDue = returnHistory.reduce((sum, item) => sum + item.due, 0);

//   const handleFilter = () => {
//     console.log("Filter by date:", date);
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleAddPayment = (id) => {
//     navigate(`/sales-return-report/${id}/edit-due`);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-3 sm:p-4 md:p-6 font-sans">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//         <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
//           Sales Return Statement
//         </h1>
        
//         <div className="flex items-center gap-2">
//           <input
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             placeholder="dd-----yyyy"
//             className="border border-gray-300 rounded-md px-3 py-2 text-sm"
//           />
//           <button
//             onClick={handleFilter}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
//           >
//             Filter
//           </button>
//           <button
//             onClick={handlePrint}
//             className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
//           >
//             Print
//           </button>
//         </div>
//       </div>

//       {/* Customer Info Card */}
//       <div className="bg-white border border-gray-300 rounded-lg p-4 sm:p-6 mb-6">
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//           <div>
//             <p className="text-xs text-gray-500 mb-1">Customer Name</p>
//             <p className="text-sm font-semibold text-gray-800">
//               {returnItem.customerName}
//             </p>
//           </div>
//           <div>
//             <p className="text-xs text-gray-500 mb-1">Contact</p>
//             <p className="text-sm font-semibold text-gray-800">
//               {returnItem.customerPhone || "----"}
//             </p>
//           </div>
//           <div>
//             <p className="text-xs text-gray-500 mb-1">Email</p>
//             <p className="text-sm font-semibold text-gray-800">
//               {returnItem.customerEmail || "----"}
//             </p>
//           </div>
//           <div>
//             <p className="text-xs text-gray-500 mb-1">Total Due</p>
//             <p className="text-sm font-bold text-red-600">
//               ৳ {totalDue.toLocaleString("en-IN", {
//                 minimumFractionDigits: 2,
//                 maximumFractionDigits: 2,
//               })}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Sales Return History Table */}
//       <div className="bg-white border border-gray-300 rounded-lg overflow-hidden mb-6">
//         <div className="overflow-x-auto">
//           <table className="w-full text-xs sm:text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="border-b border-gray-300 px-3 py-3 text-left font-semibold text-gray-700">
//                   Date
//                 </th>
//                 <th className="border-b border-gray-300 px-3 py-3 text-left font-semibold text-gray-700">
//                   Memo
//                 </th>
//                 <th className="border-b border-gray-300 px-3 py-3 text-left font-semibold text-gray-700">
//                   Products
//                 </th>
//                 <th className="border-b border-gray-300 px-3 py-3 text-left font-semibold text-gray-700">
//                   Qty
//                 </th>
//                 <th className="border-b border-gray-300 px-3 py-3 text-left font-semibold text-gray-700">
//                   Total
//                 </th>
//                 <th className="border-b border-gray-300 px-3 py-3 text-left font-semibold text-gray-700">
//                   Paid
//                 </th>
//                 <th className="border-b border-gray-300 px-3 py-3 text-left font-semibold text-gray-700">
//                   Due
//                 </th>
//                 <th className="border-b border-gray-300 px-3 py-3 text-left font-semibold text-gray-700">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {returnHistory.map((item, index) => (
//                 <tr key={index} className="hover:bg-gray-50">
//                   <td className="border-b border-gray-300 px-3 py-3">
//                     {item.date}
//                   </td>
//                   <td className="border-b border-gray-300 px-3 py-3">
//                     {item.memo}
//                   </td>
//                   <td className="border-b border-gray-300 px-3 py-3">
//                     {item.products}
//                   </td>
//                   <td className="border-b border-gray-300 px-3 py-3">
//                     {item.qty}
//                   </td>
//                   <td className="border-b border-gray-300 px-3 py-3">
//                     ৳{" "}
//                     {item.total.toLocaleString("en-IN", {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     })}
//                   </td>
//                   <td className="border-b border-gray-300 px-3 py-3">
//                     ৳{" "}
//                     {item.paid.toLocaleString("en-IN", {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     })}
//                   </td>
//                   <td
//                     className={`border-b border-gray-300 px-3 py-3 font-semibold ${
//                       item.due > 0 ? "text-red-600" : "text-gray-800"
//                     }`}
//                   >
//                     ৳{" "}
//                     {item.due.toLocaleString("en-IN", {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     })}
//                   </td>
//                   <td className="border-b border-gray-300 px-3 py-3">
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => handleAddPayment(item._id)}
//                         disabled={item.due === 0}
//                         className={`text-xs px-3 py-1.5 rounded text-white font-medium ${
//                           item.due > 0
//                             ? "bg-green-600 hover:bg-green-700 cursor-pointer"
//                             : "bg-green-400 cursor-not-allowed"
//                         }`}
//                       >
//                         Add Payment
//                       </button>
//                       <Link
//                         to="/invoice-sales-return"
//                         state={item}
//                         className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded font-medium"
//                       >
//                         Print
//                       </Link>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Summary Card */}
//       <div className="flex justify-end">
//         <div className="bg-white border border-gray-300 rounded-lg p-4 w-full sm:w-80">
//           <div className="space-y-3">
//             <div className="flex justify-between items-center">
//               <span className="text-sm text-gray-600">Total</span>
//               <span className="text-sm font-medium">
//                 ৳{" "}
//                 {totalAmount.toLocaleString("en-IN", {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                 })}
//               </span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-sm text-gray-600">Total Paid</span>
//               <span className="text-sm font-medium">
//                 ৳{" "}
//                 {totalPaid.toLocaleString("en-IN", {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                 })}
//               </span>
//             </div>
//             <div className="border-t border-gray-300 pt-3 flex justify-between items-center">
//               <span className="text-sm font-bold text-gray-800">Total Due</span>
//               <span className="text-sm font-bold text-red-600">
//                 ৳{" "}
//                 {totalDue.toLocaleString("en-IN", {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                 })}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SalesReturnStatement;

import React, { useState, useRef } from "react";

const SalesReturnStatement = () => {
  const [date, setDate] = useState("");
  const contentRef = useRef(null);

  const state = {
    customerName: "XYZ Traders",
    customerPhone: "01712-345678",
    customerEmail: "xyz@email.com",
  };

  const initialHistory = [
    { _id: "1", date: "2026-02-15", memo: "SR-1290", type: "product", products: "LED Bulb 12W", returnQty: 10, returnValue: 15000, exchangeValue: 15000, cashRefund: 0, status: "settled" },
    { _id: "2", date: "2026-01-20", memo: "SR-1291", type: "cash", products: "Battery 12V", returnQty: 5, returnValue: 25000, exchangeValue: 0, cashRefund: 25000, status: "refunded" },
    { _id: "3", date: "2026-01-10", memo: "SR-1292", type: "product", products: "LED Panel 24W", returnQty: 8, returnValue: 12000, exchangeValue: 8000, cashRefund: 0, status: "partial" },
    { _id: "4", date: "2026-01-12", memo: "PAY-501", type: "payment", products: "Cash Payment against SR-1292", returnQty: 0, returnValue: 0, exchangeValue: 0, cashRefund: 2000, status: "settled" },
  ];

  const returnHistory = [...initialHistory].sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalReturnValue = returnHistory.reduce((sum, item) => sum + item.returnValue, 0);
  const totalAdjusted = returnHistory.reduce((sum, item) => sum + item.exchangeValue + (item.cashRefund || 0), 0);
  const netBalance = totalReturnValue - totalAdjusted;

  const reactToPrintFn = () => window.print();

  return (
    <div className="min-h-screen bg-slate-50 p-2 sm:p-4 md:p-6 font-sans text-gray-800">
      <div ref={contentRef} className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b pb-4">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-800 uppercase tracking-tight">
            Customer Statement
          </h1>
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto print:hidden">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 lg:flex-none border border-gray-300 rounded-md px-3 py-2 text-sm outline-none"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Filter</button>
            <button onClick={reactToPrintFn} className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">Print</button>
          </div>
        </div>

        {/* Customer Info Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border-b sm:border-b-0 pb-2 sm:pb-0">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Customer Name</p>
              <p className="text-sm font-semibold text-gray-800">{state.customerName}</p>
            </div>
            <div className="border-b sm:border-b-0 pb-2 sm:pb-0 text-left sm:text-right lg:text-left">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Contact</p>
              <p className="text-sm font-semibold text-gray-800">{state.customerPhone}</p>
            </div>
            <div className="border-b sm:border-b-0 pb-2 sm:pb-0">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Email</p>
              <p className="text-sm font-semibold text-gray-800 truncate">{state.customerEmail}</p>
            </div>
            <div className="text-left sm:text-right lg:text-left">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Total Due</p>
              <p className="text-sm font-bold text-red-600 font-mono">
                ৳ {netBalance.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Responsive Table/Card Section */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {/* Desktop View: Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-4 text-left font-bold">Date</th>
                  <th className="px-4 py-4 text-left font-bold">Memo/Ref</th>
                  <th className="px-4 py-4 text-left font-bold">Type</th>
                  <th className="px-4 py-4 text-left font-bold">Description</th>
                  <th className="px-4 py-4 text-right font-bold">Return</th>
                  <th className="px-4 py-4 text-right font-bold">Paid/Exch</th>
                  <th className="px-4 py-4 text-center font-bold">Status</th>
                  <th className="px-4 py-4 text-center font-bold print:hidden">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {returnHistory.map((item, idx) => (
                  <tr key={idx} className={`${item.type === 'payment' ? "bg-blue-50/30" : "hover:bg-gray-50/50"} transition-colors`}>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-500 font-medium text-xs">{new Date(item.date).toLocaleDateString('en-GB')}</td>
                    <td className="px-4 py-4 font-bold text-blue-700">{item.memo}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${item.type === 'product' ? 'bg-green-50 text-green-700 border-green-100' : item.type === 'cash' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>{item.type}</span>
                    </td>
                    <td className="px-4 py-4 text-gray-700 font-medium">{item.products}</td>
                    <td className="px-4 py-4 text-right font-bold text-red-500">৳{item.returnValue.toLocaleString()}</td>
                    <td className="px-4 py-4 text-right font-bold text-green-600">৳{(item.exchangeValue + item.cashRefund).toLocaleString()}</td>
                    <td className="px-4 py-4 text-center italic text-gray-400 text-xs">{item.status}</td>
                    <td className="px-4 py-4 text-center print:hidden">
                       <div className="flex justify-center gap-2">
                         <button className="text-blue-600 hover:text-blue-800 font-bold">Print</button>
                         <button className="text-indigo-600 hover:text-indigo-800 font-bold">Pay</button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View: Cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {returnHistory.map((item, idx) => (
              <div key={idx} className={`p-4 ${item.type === 'payment' ? "bg-blue-50/40" : ""}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-gray-500 font-bold">{new Date(item.date).toLocaleDateString('en-GB')}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${item.type === 'product' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{item.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-blue-700">{item.memo}</h4>
                  <span className="text-xs font-medium text-gray-400 italic">{item.status}</span>
                </div>
                <p className="text-sm text-gray-600 my-1">{item.products}</p>
                <div className="flex justify-between mt-3 pt-3 border-t border-dashed border-gray-200">
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Return</p>
                    <p className="text-sm font-bold text-red-500">৳{item.returnValue.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Paid/Exch</p>
                    <p className="text-sm font-bold text-green-600">৳{(item.exchangeValue + item.cashRefund).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 print:hidden">
                   <button className="flex-1 bg-gray-100 py-2 rounded font-bold text-xs text-blue-600">Print</button>
                   <button className="flex-1 bg-gray-100 py-2 rounded font-bold text-xs text-indigo-600">Payment</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
              <p className="text-[10px] text-gray-500 uppercase font-bold">Total Return</p>
              <p className="text-xl font-black text-red-500">৳{totalReturnValue.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
              <p className="text-[10px] text-gray-500 uppercase font-bold">Total Adjusted</p>
              <p className="text-xl font-black text-green-600">৳{totalAdjusted.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm flex flex-col justify-center">
              <p className="text-[10px] text-gray-500 uppercase font-bold">Pending</p>
              <p className="text-xl font-black text-orange-600">৳{netBalance.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-gray-800 text-white p-5 rounded-2xl shadow-lg border-t-4 border-yellow-500">
            <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest">Final Status</h3>
              <span className="bg-yellow-500 text-gray-900 text-[9px] px-2 py-0.5 rounded font-black">2026</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-gray-400 tracking-tight">Net Returnable:</span>
                <span className="font-mono">৳{totalReturnValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-green-400">
                <span className="text-gray-400 tracking-tight">Total Settled:</span>
                <span className="font-mono">- ৳{totalAdjusted.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-gray-700 pt-3 mt-3">
                <span className="font-black uppercase text-[10px] self-center">{netBalance >= 0 ? "Payable" : "Credit"}</span>
                <span className="text-2xl font-black text-yellow-400 font-mono tracking-tighter">৳{Math.abs(netBalance).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReturnStatement;