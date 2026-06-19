// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchExpenses,
//   addMultipleExpenses,
//   getTotalExpense,
// } from "../features/expense/expenseSlice";
// import { FaArrowLeft, FaPlus, FaTrash, FaPrint } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const ExpenseManagement = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { expenses, totalExpense, loading } = useSelector((state) => state.expense);

//   const [selectedDate, setSelectedDate] = useState("");
//   const [expenseItems, setExpenseItems] = useState([
//     { description: "", amount: "" }
//   ]);
//   const [dateSearch, setDateSearch] = useState("");

//   // Fetch Data
//   useEffect(() => {
//     dispatch(fetchExpenses({ page: 1, dateSearch }));
//     dispatch(getTotalExpense());
//   }, [dispatch, dateSearch]);

//   // Add new row
//   const addRow = () => {
//     setExpenseItems([...expenseItems, { description: "", amount: "" }]);
//   };

//   // Remove row
//   const removeRow = (index) => {
//     if (expenseItems.length === 1) return;
//     setExpenseItems(expenseItems.filter((_, i) => i !== index));
//   };

//   // Handle input change
//   const handleChange = (index, field, value) => {
//     const updated = [...expenseItems];
//     updated[index][field] = value;
//     setExpenseItems(updated);
//   };

//   // Calculate Subtotal
//   const subtotal = expenseItems.reduce((sum, item) => {
//     return sum + (parseFloat(item.amount) || 0);
//   }, 0);

//   // Save All Expenses
//   const handleSaveAll = () => {
//     if (!selectedDate) {
//       alert("Please select a date!");
//       return;
//     }

//     const validItems = expenseItems.filter(item => item.description.trim() && item.amount > 0);

//     if (validItems.length === 0) {
//       alert("Please add at least one valid expense");
//       return;
//     }

//     const payload = {
//       date: selectedDate,
//       expenses: validItems
//     };

//     dispatch(addMultipleExpenses(payload));

//     // Reset form
//     setExpenseItems([{ description: "", amount: "" }]);
//     setSelectedDate("");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-700 via-maroon-800 to-red-700 p-4 sm:p-6">
//       <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-6 space-y-6">

//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-gray-800">Expense Management</h1>
//           <button 
//             onClick={() => navigate(-1)} 
//             className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-800 hover:text-white rounded-lg transition"
//           >
//             <FaArrowLeft /> Back
//           </button>
//         </div>

//         {/* ==================== Add Multiple Expenses Form ==================== */}
//         <div className="bg-gray-50 p-5 rounded-xl border">
//           <h2 className="text-lg font-semibold mb-4">Add Expenses for a Date</h2>

//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1">Select Date</label>
//             <input
//               type="date"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-64"
//             />
//           </div>

//           <div className="space-y-3">
//             {expenseItems.map((item, index) => (
//               <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
//                 <div className="sm:col-span-7">
//                   <input
//                     type="text"
//                     placeholder="Expense Description"
//                     value={item.description}
//                     onChange={(e) => handleChange(index, "description", e.target.value)}
//                     className="border border-gray-300 rounded-md px-3 py-2 w-full"
//                   />
//                 </div>
//                 <div className="sm:col-span-3">
//                   <input
//                     type="number"
//                     placeholder="Amount (৳)"
//                     value={item.amount}
//                     onChange={(e) => handleChange(index, "amount", e.target.value)}
//                     className="border border-gray-300 rounded-md px-3 py-2 w-full"
//                     min="0"
//                     step="0.01"
//                   />
//                 </div>
//                 <div className="sm:col-span-2 flex justify-center">
//                   <button
//                     onClick={() => removeRow(index)}
//                     className="text-red-600 hover:text-red-800 p-2"
//                   >
//                     <FaTrash />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-between items-center mt-4">
//             <button
//               onClick={addRow}
//               className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
//             >
//               <FaPlus /> Add Another Item
//             </button>

//             <div className="text-lg font-semibold">
//               Subtotal: <span className="text-red-600">৳ {subtotal.toFixed(2)}</span>
//             </div>
//           </div>

//           <button
//             onClick={handleSaveAll}
//             disabled={loading || !selectedDate}
//             className="mt-5 w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium text-lg"
//           >
//             {loading ? "Saving..." : "Save All Expenses"}
//           </button>
//         </div>

//         {/* ==================== Expense List Table ==================== */}
//         <div>
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold">Expense List</h2>
//             <input
//               type="date"
//               value={dateSearch}
//               onChange={(e) => setDateSearch(e.target.value)}
//               className="border border-gray-300 rounded-md px-3 py-2 text-sm"
//             />
//           </div>

//           <div className="overflow-x-auto border border-gray-200 rounded-lg">
//             <table className="min-w-full text-sm">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="border px-4 py-3 text-left">Date</th>
//                   <th className="border px-4 py-3 text-left">Description</th>
//                   <th className="border px-4 py-3 text-right">Amount (৳)</th>
//                   <th className="border px-4 py-3 text-center">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {expenses.length > 0 ? (
//                   expenses.map((exp) => (
//                     <tr key={exp._id} className="hover:bg-gray-50 border-b">
//                       <td className="border px-4 py-3">
//                         {new Date(exp.date).toLocaleDateString("en-GB")}
//                       </td>
//                       <td className="border px-4 py-3">{exp.description}</td>
//                       <td className="border px-4 py-3 text-right font-semibold text-red-600">
//                         {exp.amount}
//                       </td>
//                       <td className="border px-4 py-3 text-center">
//                         <button className="text-blue-600 hover:text-blue-800 p-2">
//                           <FaPrint />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={4} className="text-center py-12 text-gray-500">
//                       No expenses found for this date
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* ==================== Total Summary ==================== */}
//         <div className="flex justify-end">
//           <div className="w-72 bg-gray-50 border rounded-lg p-5 text-sm shadow">
//             <div className="flex justify-between font-bold text-lg">
//               <span>Total Expense (All Time)</span>
//               <span className="text-red-600">৳ {totalExpense}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExpenseManagement;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExpenses,
  addMultipleExpenses,
  getTotalExpense,
} from "../features/expense/expenseSlice";
import { FaArrowLeft, FaPlus, FaTrash, FaPrint } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import dayjs from "../utils/date.js";

const ExpenseManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { expenses, totalExpense, loading } = useSelector((state) => state.expense);

  const [selectedDate, setSelectedDate] = useState("");
  const [expenseItems, setExpenseItems] = useState([
    { description: "", amount: "" }
  ]);
  const [dateSearch, setDateSearch] = useState("");

  // Fetch Data
  useEffect(() => {
    dispatch(fetchExpenses({ page: 1, dateSearch }));
    dispatch(getTotalExpense());
  }, [dispatch, dateSearch]);

  // Add new row
  const addRow = () => {
    setExpenseItems([...expenseItems, { description: "", amount: "" }]);
  };

  // Remove row
  const removeRow = (index) => {
    if (expenseItems.length === 1) return;
    setExpenseItems(expenseItems.filter((_, i) => i !== index));
  };

  // Handle input change
  const handleChange = (index, field, value) => {
    const updated = [...expenseItems];
    updated[index][field] = value;
    setExpenseItems(updated);
  };

  // Calculate Subtotal
  const subtotal = expenseItems.reduce((sum, item) => {
    return sum + (parseFloat(item.amount) || 0);
  }, 0);

  // Save All Expenses
  const handleSaveAll = () => {
    if (!selectedDate) {
      alert("Please select a date!");
      return;
    }

    const validItems = expenseItems.filter(item => item.description.trim() && item.amount > 0);

    if (validItems.length === 0) {
      alert("Please add at least one valid expense");
      return;
    }

    const payload = {
      date: selectedDate,
      expenses: validItems
    };

    dispatch(addMultipleExpenses(payload));

    // Reset form
    setExpenseItems([{ description: "", amount: "" }]);
    setSelectedDate("");
  };

  // ==================== FRONTEND DATA GROUPING ENGINE ====================
  // ব্যাকএন্ডের ফ্ল্যাট ডেটাকে ডেট অনুযায়ী গ্রুপ করার জন্য এই ফাংশনটি কাজ করবে
  const getGroupedExpenses = () => {
    if (!expenses || expenses.length === 0) return [];

    const groups = {};

    expenses.forEach((item) => {
      // ডেট ফরম্যাট সেম রাখার জন্য standard স্ট্রিং তৈরি
      const dateKey = new Date(item.date).toDateString();

      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: item.date,
          totalAmount: 0,
          items: []
        };
      }

      // যদি অবজেক্টের ভেতরে অলরেডি কোনো nested expenses অ্যারে থাকে (Future-proof)
      if (item.expenses && Array.isArray(item.expenses)) {
        item.expenses.forEach(sub => {
          groups[dateKey].items.push({
            description: sub.description,
            amount: parseFloat(sub.amount) || 0
          });
          groups[dateKey].totalAmount += parseFloat(sub.amount) || 0;
        });
      } else {
        // ওল্ড/ফ্ল্যাট স্ট্রাকচার হলে (যা image_b51cdd.png এ দেখা যাচ্ছে)
        groups[dateKey].items.push({
          description: item.description,
          amount: parseFloat(item.amount) || 0
        });
        groups[dateKey].totalAmount += parseFloat(item.amount) || 0;
      }
    });

    return Object.values(groups);
  };

  const groupedExpenses = getGroupedExpenses();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-maroon-800 to-red-700 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-6 space-y-6">

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Expense Management</h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-800 hover:text-white rounded-lg transition"
          >
            <FaArrowLeft /> Back
          </button>
        </div>

        {/* ==================== Add Multiple Expenses Form ==================== */}
        <div className="bg-gray-50 p-5 rounded-xl border">
          <h2 className="text-lg font-semibold mb-4">Add Expenses for a Date</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-64"
            />
          </div>

          <div className="space-y-3">
            {expenseItems.map((item, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-7">
                  <input
                    type="text"
                    placeholder="Expense Description"
                    value={item.description}
                    onChange={(e) => handleChange(index, "description", e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  />
                </div>
                <div className="sm:col-span-3">
                  <input
                    type="number"
                    placeholder="Amount (৳)"
                    value={item.amount}
                    onChange={(e) => handleChange(index, "amount", e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="sm:col-span-2 flex justify-center">
                  <button
                    onClick={() => removeRow(index)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={addRow}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <FaPlus /> Add Another Item
            </button>

            <div className="text-lg font-semibold">
              Subtotal: <span className="text-red-600">৳ {subtotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleSaveAll}
            disabled={loading || !selectedDate}
            className="mt-5 w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium text-lg"
          >
            {loading ? "Saving..." : "Save All Expenses"}
          </button>
        </div>

        {/* ==================== Expense List Table (Rowspan UI Fix) ==================== */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold">Expense List</h2>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-gray-500 whitespace-nowrap">Filter by Date:</span>
              <input
                type="date"
                value={dateSearch}
                onChange={(e) => setDateSearch(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-full sm:w-auto"
              />
            </div>
          </div>

          <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-gray-100">
                <tr className="text-gray-700 uppercase text-xs tracking-wider border-b border-gray-300">
                  <th className="border border-gray-300 px-4 py-3 text-left w-36">Date</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Expense Description</th>
                  <th className="border border-gray-300 px-4 py-3 text-right w-36">Item Amount (৳)</th>
                  <th className="border border-gray-300 px-4 py-3 text-right w-40">Total Amount (৳)</th>
                  <th className="border border-gray-300 px-4 py-3 text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {groupedExpenses.length > 0 ? (
                  groupedExpenses.map((group, groupIdx) => {
                    const rowSpanCount = group.items.length;

                    return group.items.map((subItem, itemIdx) => (
                      <tr
                        key={`${group.date}-${itemIdx}`}
                        className={`${groupIdx % 2 === 0 ? "bg-white" : "bg-gray-50/60"} hover:bg-blue-50/40 transition-colors`}
                      >
                        {/* ১. শুধুমাত্র প্রথম সাব-আইটেমের জন্য ডেট সেলটি rowSpan হবে */}
                        {itemIdx === 0 && (
                          <td
                            rowSpan={rowSpanCount}
                            className="border border-gray-300 px-4 py-3 font-medium text-gray-900 align-middle whitespace-nowrap"
                          >
                            {
                              dayjs(group.date)
                                .tz("Asia/Dhaka")
                                .format("DD-MM-YYYY")
                            }
                          </td>
                        )}

                        {/* ২. প্রতিটা খরচের ডেসক্রিপশন এবং ইন্ডিভিজুয়াল অ্যামাউন্ট */}
                        <td className="border border-gray-300 px-4 py-2.5 text-gray-700">
                          {subItem.description}
                        </td>
                        <td className="border border-gray-300 px-4 py-2.5 text-right font-mono text-gray-600">
                          ৳ {subItem.amount.toFixed(2)}
                        </td>

                        {/* ৩. গ্র্যান্ড টোটাল কলাম ও অ্যাকশন বাটন rowSpan হয়ে মার্জ থাকবে */}
                        {itemIdx === 0 && (
                          <>
                            <td
                              rowSpan={rowSpanCount}
                              className="border border-gray-300 px-4 py-3 text-right font-bold text-red-600 font-mono text-base align-middle"
                            >
                              ৳ {group.totalAmount.toFixed(2)}
                            </td>
                            <td
                              rowSpan={rowSpanCount}
                              className="border border-gray-300 px-4 py-3 text-center align-middle"
                            >
                              <button className="text-blue-600 hover:text-blue-800 p-2 border border-gray-200 rounded hover:bg-blue-50 transition shadow-sm bg-white">
                                <FaPrint size={14} />
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ));
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-500 font-medium border border-gray-300">
                      No expenses found for this date
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ==================== Total Summary ==================== */}
        <div className="flex justify-end">
          <div className="w-72 bg-gray-50 border rounded-lg p-5 text-sm shadow">
            <div className="flex justify-between font-bold text-lg">
              <span>Total Expense (All Time)</span>
              <span className="text-red-600">৳ {Number(totalExpense || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseManagement;