import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaPrint, 
  FaFilter, 
  FaMoneyBillWave, 
  FaRegFileAlt 
} from "react-icons/fa";

const CompanyStatement = () => {
  const navigate = useNavigate();
  const contentRef = useRef(null);

  // স্ট্যাটিক ডাটা (ডিজাইন দেখার জন্য)
  const companyInfo = {
    name: "Elite Battery Ltd.",
    phone: "017XXXXXXXX",
    email: "info@elite.com",
    totalClaim: 585000,
    totalReceived: 350000,
    totalDue: 235000
  };

  const dummyTransactions = [
    {
      date: "2026-03-25",
      ref: "#MEMO-771",
      desc: "Old Scrap Battery (100AH)",
      qty: "50 Pcs",
      claim: 200000,
      received: 0,
      balance: 200000,
      isPayment: false
    },
    {
      date: "2026-03-26",
      ref: "PAY-990",
      desc: "CASH RECEIVED FROM COMPANY",
      qty: "--",
      claim: 0,
      received: 150000,
      balance: 50000,
      isPayment: true
    },
    {
      date: "2026-03-28",
      ref: "#MEMO-882",
      desc: "UPS Battery (Scrap)",
      qty: "30 Pcs",
      claim: 185000,
      received: 0,
      balance: 235000,
      isPayment: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-2 sm:p-4 md:p-6 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-4">
        
        {/* --- Top Action Bar (Print Hidden) --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-800 font-bold text-sm transition-all group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1" /> 
            Back to Return List
          </button>
          
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <input
              type="date"
              className="border rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 bg-white outline-none"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer transition-colors">
              <FaFilter size={12} /> Filter
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer transition-colors">
              <FaPrint size={12} /> Print Statement
            </button>
          </div>
        </div>

        {/* --- Printable Content Area --- */}
        <div ref={contentRef} className="space-y-6 print:p-5">
          
          {/* Header */}
          <div className="border-b pb-4 flex justify-between items-end">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-800 uppercase tracking-tight">
                Company Ledger Statement
              </h1>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                Statement Date: {new Date().toLocaleDateString('en-GB')}
              </p>
            </div>
            <div className="text-right hidden sm:block">
               <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Verified Ledger</span>
            </div>
          </div>

          {/* Company Info Card (Purchaser look) */}
          <div className="bg-white border-l-4 border-red-600 rounded-xl p-4 sm:p-6 shadow-sm ring-1 ring-black/5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Company Name</p>
                <p className="text-sm font-black text-gray-800 uppercase">{companyInfo.name}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Contact Person</p>
                <p className="text-sm font-bold text-gray-600">Managing Director</p>
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Account Status</p>
                <p className="text-xs font-black text-green-600 uppercase">Active Portfolio</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Current Receivable</p>
                <p className="text-lg font-black text-blue-600 font-mono tracking-tighter">
                  ৳ {companyInfo.totalDue.toLocaleString("en-BD")}
                </p>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-800 text-white uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="px-6 py-4 text-left">Date</th>
                    <th className="px-6 py-4 text-left">Ref / Memo</th>
                    <th className="px-6 py-4 text-left">Description</th>
                    <th className="px-6 py-4 text-right">Claim Amt</th>
                    <th className="px-6 py-4 text-right">Recv Amt</th>
                    <th className="px-6 py-4 text-right">Balance</th>
                    <th className="px-6 py-4 text-center print:hidden">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dummyTransactions.map((item, idx) => (
                    <tr key={idx} className={`${item.isPayment ? "bg-green-50/60" : "hover:bg-gray-50/50"} transition-colors`}>
                      <td className="px-6 py-4 text-[11px] font-bold text-gray-500 font-mono">
                        {item.date}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black px-2 py-1 rounded ${item.isPayment ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>
                          {item.ref}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-xs ${item.isPayment ? "font-black text-green-700 italic flex items-center gap-1" : "font-bold text-gray-700"}`}>
                          {item.isPayment && <FaMoneyBillWave />}
                          {item.desc}
                        </div>
                        {item.qty !== "--" && <div className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">Qty: {item.qty}</div>}
                      </td>
                      <td className="px-6 py-4 text-right font-black">
                        {item.claim > 0 ? `৳ ${item.claim.toLocaleString()}` : "--"}
                      </td>
                      <td className="px-6 py-4 text-right font-black text-green-600">
                        {item.received > 0 ? `৳ ${item.received.toLocaleString()}` : "--"}
                      </td>
                      <td className="px-6 py-4 text-right font-black text-blue-700 font-mono">
                        ৳ {item.balance.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center print:hidden">
                        <div className="flex items-center justify-center gap-3">
                          {!item.isPayment && (
                            <button className="text-green-600 font-black text-[10px] uppercase hover:underline flex items-center gap-1">
                               Received
                            </button>
                          )}
                          <button title="View Details" className="text-gray-400 hover:text-blue-600">
                            <FaRegFileAlt size={14}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Footer */}
          <div className="flex justify-end pt-4">
            <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl w-full max-w-sm border-t-4 border-blue-500">
              <h4 className="text-[10px] font-black uppercase text-gray-500 mb-4 text-center border-b border-gray-800 pb-2 tracking-[2px]">Account Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-bold uppercase text-[10px]">Total Sent Claim:</span>
                  <span className="font-mono font-black">৳ {companyInfo.totalClaim.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-green-400">
                  <span className="text-gray-400 font-bold uppercase text-[10px]">Total Cash Received:</span>
                  <span className="font-mono font-black">- ৳ {companyInfo.totalReceived.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-gray-800 pt-4 items-center">
                  <span className="font-black uppercase text-[10px] text-blue-500 tracking-tighter">Net Receivable</span>
                  <span className="text-2xl font-black text-blue-400 font-mono tracking-tighter">
                    ৳ {companyInfo.totalDue.toLocaleString()}
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

export default CompanyStatement;