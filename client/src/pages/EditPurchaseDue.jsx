// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { FaArrowLeft } from "react-icons/fa";
// import {
//   addPayment,
//   fetchPurchaseById,
//   setPurchaseSearchedByIdToNull,
// } from "../features/purchase/purchaseSlice";
// import Decimal from "decimal.js";

// const EditPurchaseDue = () => {
//   const { user } = useSelector((state) => state.auth);
//   const { purchaseSearchedById, loading } = useSelector(
//     (state) => state.purchase,
//   );
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   // const [due, setDue] = useState(0);
//   const [cashInput, setCashInput] = useState("");
//   const [bankPaymentAmount, setBankPaymentAmount] = useState("");
//   const [aid, setAid] = useState(null);
//   const [date, setDate] = useState("");
//   const [dateRestriction, setDateRestriction] = useState("");
//   const { id } = useParams();

//   const totalPaidLive = new Decimal(Number(cashInput || 0)).plus(
//     new Decimal(Number(bankPaymentAmount || 0)),
//   );

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (Number(totalPaidLive) === 0)
//       return alert("Please enter a valid payment amount");
//     setAid("Run");
//     // let amount;
//     let amount = Number(totalPaidLive.toFixed(4));
//     // if (new Decimal(due).greaterThan(new Decimal(purchaseSearchedById.due))) {
//     //   amount = Number(new Decimal(purchaseSearchedById.due).toFixed(4));
//     // } else {
//     //   amount = Number(new Decimal(due).toFixed(4));
//     // }

//     try {
//       await dispatch(
//         addPayment({
//           id,
//           info: {
//             date,
//             amount,
//             cash: Number(cashInput || 0),
//             bankPaymentAmount: Number(bankPaymentAmount),
//             unchangedAmount: Number(totalPaidLive.toFixed(4)),
//           },
//         }),
//       ).unwrap();
//       navigate("/purchase");
//     } catch {
//       console.log("Payment Failed!");
//     } finally {
//       setAid(null);
//     }
//   };

//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//     }
//   }, [user, navigate]);

//   useEffect(() => {
//     if (user) {
//       dispatch(fetchPurchaseById(id));
//     }
//   }, [dispatch, user]);

//   useEffect(() => {
//     if (purchaseSearchedById) {
//       // setDue(purchaseSearchedById.due);
//       const restrictionDate = new Date(purchaseSearchedById.createdAt)
//         .toISOString()
//         .split("T")[0];
//       setDateRestriction(restrictionDate);
//     }
//   }, [purchaseSearchedById]);

//   //* Due 0 redirection
//   useEffect(() => {
//     if (purchaseSearchedById?.due === 0) {
//       navigate("/purchase");
//     }
//     // if (purchaseSearchedById?.purchaseType === "advance") {
//     //         dispatch(setPurchaseSearchedByIdToNull()); //? Ekhane next time page visit e first value auto normal theke remove kore nicchi zate next e glitch na hoi
//     //       navigate("/purchase");
//     //     }
//   }, [purchaseSearchedById]);

//   if (!user) return null;
//   return (
//     <>
//       <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg p-3 sm:p-4 md:p-6 gap-4 md:gap-8">
//         {/* Left: Stock Form */}
//         <form onSubmit={handleSubmit} className="flex-1">
//           <h2 className="text-lg sm:text-xl font-semibold mb-4">Add Payment</h2>

//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1">Date</label>
//             <input
//               type="date"
//               value={date}
//               min={dateRestriction}
//               onChange={(e) => setDate(e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           {/* <div className="mb-4">
//             <label className="block text-sm font-medium mb-1">Pay</label>
//             <input
//               type="number"
//               value={due}
//               onChange={(e) => setDue(e.target.value)}
//               // min={0}
//               placeholder="Add Payment"
//               step="any"
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div> */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1">Cash</label>
//             <input
//               type="number"
//               value={cashInput}
//               min={0}
//               onChange={(e) => setCashInput(e.target.value)}
//               step="any"
//               className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1">
//               Bank Payment Amount
//             </label>
//             <input
//               type="number"
//               value={bankPaymentAmount}
//               min={0}
//               onChange={(e) => setBankPaymentAmount(e.target.value)}
//               step="any"
//               className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading && aid}
//             className={`text-white px-4 py-2 rounded text-sm ${
//               loading && aid
//                 ? "cursor-not-allowed bg-green-400"
//                 : "bg-green-500 hover:bg-green-600 cursor-pointer"
//             }`}
//           >
//             {loading && aid ? "Paying..." : "Pay"}
//           </button>
//         </form>

//         {/* Right: Item Information */}
//         <div className="flex-1 md:border-l md:border-gray-200 md:pl-6 mt-6 md:mt-0">
//           <h2 className="text-lg sm:text-xl font-semibold mb-4">
//             Purchase Information
//           </h2>
//           <div className="space-y-1 text-sm">
//             <div className="flex">
//               <span className="w-28 font-medium">Sale ID</span>
//               <span>: {purchaseSearchedById?._id}</span>
//             </div>
//             <div className="flex">
//               <span className="w-28 font-medium">Memo</span>
//               <span>: {purchaseSearchedById?.memo}</span>
//             </div>
//             <div className="flex">
//               <span className="w-28 font-medium">Supplier Name</span>
//               <span>: {purchaseSearchedById?.supplierName}</span>
//             </div>
//             <div className="flex">
//               <span className="w-28 font-medium">Products</span>
//               <ul>
//                 {purchaseSearchedById?.products?.map((p, i) => (
//                   <li key={i}>: {p.productName}</li>
//                 ))}
//               </ul>
//             </div>
//             <div className="flex">
//               <span className="w-28 font-medium">Total</span>
//               <span>
//                 :{" "}
//                 <span className="font-bold">
//                   {purchaseSearchedById?.totalAmount}
//                 </span>
//               </span>
//             </div>
//             <div className="flex">
//               <span className="w-28 font-medium">Paid</span>
//               <span>: {purchaseSearchedById?.paid}</span>
//             </div>
//             <div className="flex">
//               <span className="w-28 font-medium text-red-700 text-lg">Due</span>
//               <span className="text-lg">
//                 :{" "}
//                 <span
//                   className={`w-28 ${
//                     purchaseSearchedById?.due > 0
//                       ? "text-red-500 font-bold"
//                       : "font-medium"
//                   }`}
//                 >
//                   {purchaseSearchedById?.due}
//                 </span>
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Back Button */}
//       <div className="flex justify-end mt-4">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center text-sm sm:text-base font-medium text-green-600 hover:text-blue-800 cursor-pointer"
//         >
//           <FaArrowLeft className="mr-1 sm:mr-2" /> Go Back
//         </button>
//       </div>
//     </>
//   );
// };

// export default EditPurchaseDue;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useLocation } from "react-router-dom";
// import { FaArrowLeft } from "react-icons/fa";
// import { addPayment } from "../features/purchase/purchaseSlice";
// import Decimal from "decimal.js";

// const EditPurchaseDue = () => {
//   const { user } = useSelector((state) => state.auth);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();

//   const [cashInput, setCashInput] = useState("");
//   const [bankPaymentAmount, setBankPaymentAmount] = useState("");
//   const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
//   const [loading, setLoading] = useState(false);

//   const data = location.state || {};
//   const isSupplierLevel = data.isSupplierLevel === true;

//   const supplierName = data.supplierName;
//   const totalDue = isSupplierLevel ? data.totalDue : (data.due || 0);
//   const purchaseId = isSupplierLevel ? null : data._id;

//   const totalPaidLive = new Decimal(Number(cashInput || 0)).plus(
//     new Decimal(Number(bankPaymentAmount || 0))
//   );

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (Number(totalPaidLive) <= 0) {
//       return alert("Please enter a valid payment amount!");
//     }

//     setLoading(true);

//     try {
//       const payload = {
//         amount: Number(totalPaidLive.toFixed(4)),
//         date,
//         cash: Number(cashInput || 0),
//         bankPaymentAmount: Number(bankPaymentAmount || 0),
//         unchangedAmount: Number(totalPaidLive.toFixed(4)),
//       };

//       if (isSupplierLevel) {
//         payload.supplierId = data.supplierId;
//         payload.isSupplierLevel = true;
//       } else {
//         payload.id = purchaseId;
//       }

//       await dispatch(addPayment(payload)).unwrap();

//       alert("Due Payment Successful!");
//       navigate("/purchase");
//     } catch (error) {
//       console.error("Payment Error:", error);
//       alert("Payment Failed! Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!user) navigate("/login");
//     if (!data.supplierName) navigate("/purchase");
//   }, [user, data, navigate]);

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
//       <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-2xl font-bold">
//             {isSupplierLevel ? "Supplier Due Payment" : "Due Payment"}
//           </h1>
//           <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-green-600 hover:text-green-800">
//             <FaArrowLeft /> Back
//           </button>
//         </div>

//         <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
//           <p className="font-semibold text-lg">{supplierName}</p>
//           <p className="text-red-600 font-bold text-xl mt-2">
//             Total Due: ৳ {Number(totalDue).toLocaleString()}
//           </p>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1">Payment Date</label>
//             <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-2" required />
//           </div>

//           <div className="mb-6">
//             <label className="block text-sm font-medium mb-1">Payment Amount</label>
//             <input
//               type="number"
//               value={totalPaidLive}
//               onChange={(e) => {
//                 const val = e.target.value;
//                 setCashInput(val);
//                 setBankPaymentAmount("0");
//               }}
//               className="w-full border border-gray-300 rounded-md px-4 py-3 text-xl font-semibold"
//               placeholder="Enter amount"
//               min="0"
//               step="any"
//               required
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//             <div>
//               <label className="block text-sm mb-1">Cash</label>
//               <input type="number" value={cashInput} onChange={(e) => setCashInput(e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-2" />
//             </div>
//             <div>
//               <label className="block text-sm mb-1">Bank</label>
//               <input type="number" value={bankPaymentAmount} onChange={(e) => setBankPaymentAmount(e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-2" />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 rounded-lg text-lg font-semibold"
//           >
//             {loading ? "Processing..." : "Confirm Due Payment"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditPurchaseDue;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { addPayment } from "../features/purchase/purchaseSlice";
import Decimal from "decimal.js";

const EditPurchaseDue = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [cashInput, setCashInput] = useState("");
  const [bankPaymentAmount, setBankPaymentAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState("");

  const data = location.state || {};
  const isSupplierLevel = data.isSupplierLevel === true;

  const supplierName = data.supplierName;
  const totalDue = isSupplierLevel ? data.totalDue : (data.due || 0);
  const purchaseId = isSupplierLevel ? null : data._id;

  const totalPaidLive = new Decimal(Number(cashInput || 0)).plus(
    new Decimal(Number(bankPaymentAmount || 0))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(totalPaidLive) <= 0) {
      return alert("Please enter a valid payment amount!");
    }

    setLoading(true);

    try {
      const payload = {
        amount: Number(totalPaidLive.toFixed(4)),
        date,
        cash: Number(cashInput || 0),
        remarks,
        bankPaymentAmount: Number(bankPaymentAmount || 0),
        unchangedAmount: Number(totalPaidLive.toFixed(4)),
      };

      if (isSupplierLevel) {
        payload.supplierId = data.supplierId;
        payload.isSupplierLevel = true;
      } else {
        payload.id = purchaseId;
      }

      await dispatch(addPayment(payload)).unwrap();

      alert("Due Payment Successful! 🎉");
      
      // Force refresh statement page
      navigate("/purchase");
      // অথবা সরাসরি statement এ যেতে চাইলে:
      // navigate("/purchaser-statement", { state: data });
      
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment Failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) navigate("/login");
    if (!data.supplierName) navigate("/purchase");
  }, [user, data, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {isSupplierLevel ? "Supplier Due Payment" : "Due Payment"}
          </h1>
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-green-600 hover:text-green-800"
          >
            <FaArrowLeft /> Back
          </button>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <p className="font-semibold text-lg">{supplierName}</p>
          <p className="text-red-600 font-bold text-xl mt-2">
            Total Due: ৳ {Number(totalDue).toLocaleString()}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Payment Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              className="w-full border border-gray-300 rounded-md px-4 py-2" 
              required 
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Payment Amount</label>
            <input
              type="number"
              value={totalPaidLive}
              onChange={(e) => {
                const val = e.target.value;
                setCashInput(val);
                setBankPaymentAmount("0");
              }}
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-xl font-semibold"
              placeholder="Enter amount"
              min="0"
              step="any"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm mb-1">Cash</label>
              <input 
                type="number" 
                value={cashInput} 
                onChange={(e) => setCashInput(e.target.value)} 
                className="w-full border border-gray-300 rounded-md px-4 py-2" 
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Bank</label>
              <input 
                type="number" 
                value={bankPaymentAmount} 
                onChange={(e) => setBankPaymentAmount(e.target.value)} 
                className="w-full border border-gray-300 rounded-md px-4 py-2" 
              />
            </div>
          </div>
          <div className="w-full mb-6">
            <label className="block text-sm mb-1">Remarks</label>
              <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm"
              rows={2}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 rounded-lg text-lg font-semibold"
          >
            {loading ? "Processing..." : "Confirm Due Payment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPurchaseDue;