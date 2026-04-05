import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTruck, FaBox, FaWeightHanging, FaMoneyBillWave, FaPlus, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const CompanyReturn = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Section 1: Financial Summary (Updated to reflect Cash flow) --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 shadow-sm border-b-4 border-blue-600 rounded-sm">
            <div className="flex items-center gap-3 mb-2 text-blue-600">
              <FaBox size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Total Sent Items</p>
            </div>
            <p className="text-2xl font-black text-gray-800">1,250 <span className="text-xs">Pcs</span></p>
          </div>

          <div className="bg-white p-5 shadow-sm border-b-4 border-orange-500 rounded-sm">
            <div className="flex items-center gap-3 mb-2 text-orange-500">
              <FaWeightHanging size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Total Weight</p>
            </div>
            <p className="text-2xl font-black text-gray-800">4,850 <span className="text-xs">Kg</span></p>
          </div>

          <div className="bg-gray-900 p-5 shadow-sm border-b-4 border-green-600 rounded-sm">
            <div className="flex items-center gap-3 mb-2 text-green-500">
              <FaMoneyBillWave size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Receivable</p>
            </div>
            <p className="text-2xl font-black text-white">৳ 8,40,000</p>
          </div>

          <div className="bg-white p-5 shadow-sm border-b-4 border-red-600 rounded-sm">
            <div className="flex items-center gap-3 mb-2 text-red-500">
              <FaTruck size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Pending From Co.</p>
            </div>
            <p className="text-2xl font-black text-gray-800">৳ 2,15,000</p>
          </div>
        </div>

        {/* --- Section 2: Horizontal Entry Form --- */}
        <div className="bg-white p-6 rounded-sm shadow-md mb-8 border-t-4 border-blue-600">
          <h2 className="text-xs font-black mb-4 flex items-center gap-2 text-gray-700 uppercase">
            <FaPlus className="text-blue-600" /> Dispatch New Return to Company
          </h2>
          <form className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-3 items-end">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Dispatch Date</label>
              <input type="date" className="w-full p-2 border border-gray-300 text-xs font-bold outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Select Company</label>
              <select className="w-full p-2 border border-gray-300 text-xs font-bold outline-none">
                <option>Elite Battery</option>
                <option>Rahimafrooz</option>
              </select>
            </div>
            <div className="space-y-1 lg:col-span-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Product Name</label>
              <input type="text" placeholder="12V 100AH" className="w-full p-2 border border-gray-300 text-xs outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Qty & Weight</label>
              <div className="flex gap-1">
                <input type="number" placeholder="Qty" className="w-1/2 p-2 border border-gray-300 text-xs font-bold outline-none" />
                <input type="number" placeholder="Kg" className="w-1/2 p-2 border border-gray-300 text-xs font-bold outline-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Price Per Unit</label>
              <input type="number" placeholder="৳" className="w-full p-2 border border-gray-300 text-xs font-bold outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Total Claim</label>
              <input type="number" readOnly className="w-full p-2 border border-gray-300 text-xs font-black bg-blue-50 text-blue-700 outline-none" />
            </div>
            <button className="bg-blue-700 hover:bg-black text-white font-black py-2.5 rounded-sm transition uppercase text-[10px] tracking-widest">
              Save & Send
            </button>
          </form>
        </div>

        {/* --- Section 3: History Table (Payment Focused) --- */}
        <div className="bg-white shadow-xl border-t-4 border-gray-800 overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <h2 className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Company Payment Tracking</h2>
            <input type="text" placeholder="Search Memo..." className="text-[10px] border px-3 py-1.5 outline-none w-48 font-bold" />
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100 text-[10px] uppercase font-black text-gray-500 border-b">
                <th className="p-4">Date</th>
                <th className="p-4">Company</th>
                <th className="p-4">Product Info</th>
                <th className="p-4 text-center">Dispatch Qty</th>
                <th className="p-4 text-right">Claim Amount (৳)</th>
                <th className="p-4 text-center">Payment Status</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {/* Row 1: Payment Pending Example */}
              <tr className="border-b hover:bg-blue-50 transition-colors cursor-pointer group" onClick={() => navigate('/company-statement/elite')}>
                <td className="p-4 font-bold text-gray-400 italic font-mono">28-03-2026</td>
                <td className="p-4 font-black text-blue-600 group-hover:underline uppercase tracking-tighter">Elite Battery Ltd.</td>
                <td className="p-4 font-semibold text-gray-600 uppercase">Scrap Battery 100AH</td>
                <td className="p-4 text-center font-black">50 Pcs | 400 Kg</td>
                <td className="p-4 text-right font-black text-gray-800 tracking-tighter text-sm">৳ 2,00,000</td>
                <td className="p-4 text-center">
                   <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full">
                      <FaExclamationCircle size={10} className="animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-tighter italic">৳ 1,20,000 Pending</span>
                   </div>
                </td>
              </tr>

              {/* Row 2: Paid Example */}
              <tr className="border-b hover:bg-blue-50 transition-colors cursor-pointer group" onClick={() => navigate('/company-statement/rahimafrooz')}>
                <td className="p-4 font-bold text-gray-400 italic font-mono">25-03-2026</td>
                <td className="p-4 font-black text-blue-600 group-hover:underline uppercase tracking-tighter">Rahimafrooz</td>
                <td className="p-4 font-semibold text-gray-600 uppercase">Old UPS Units</td>
                <td className="p-4 text-center font-black">20 Pcs | 120 Kg</td>
                <td className="p-4 text-right font-black text-gray-800 tracking-tighter text-sm">৳ 85,000</td>
                <td className="p-4 text-center">
                   <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-full">
                      <FaCheckCircle size={10} />
                      <span className="text-[9px] font-black uppercase tracking-tighter">Full Paid</span>
                   </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompanyReturn;