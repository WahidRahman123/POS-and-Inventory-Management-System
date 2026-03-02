// import React, { useState, useRef } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { Link, useNavigate } from "react-router-dom";

// const SalesReturn = () => {
//   const navigate = useNavigate();
//   const customerNameRef = useRef(null);
  
//   // States
//   const [name, setName] = useState("");
//   const [disable, setDisable] = useState(false);
//   const [data, setData] = useState(null);
//   const [date, setDate] = useState("");
//   const [nameSearch, setNameSearch] = useState("");
//   const [sortOrder, setSortOrder] = useState("-1");
//   const [filterToggler, setFilterToggler] = useState(false);
//   const [page, setCurrentPage] = useState(1);
//   const [pages, setPages] = useState(1);
  
//   const [customer, setCustomer] = useState({
//     customerId: "",
//     customerName: "",
//     address: "",
//     customerEmail: "",
//     customerPhone: "",
//   });

//   // Dummy data for sales returns
//   const [returns, setReturns] = useState([
//     {
//       _id: "1",
//       createdAt: "2026-02-15",
//       memo: "SR-1290",
//       customerName: "XYZ Traders",
//       productNames: "LED Bulb 12W",
//       quantity: 10,
//       qtyInKg: 0,
//       totalAmount: 15000,
//       paid: 15000,
//       due: 0,
//     },
//     {
//       _id: "2",
//       createdAt: "2026-01-20",
//       memo: "SR-1291",
//       customerName: "ABC Electronics",
//       productNames: "Battery 12V",
//       quantity: 5,
//       qtyInKg: 25,
//       totalAmount: 25000,
//       paid: 10000,
//       due: 15000,
//     },
//   ]);

//   // Validation Schema
//   const returnSchema = Yup.object().shape({
//     createdAt: Yup.date().required("Date is required"),
//     memo: Yup.string().required("Memo is required"),
//     productNames: Yup.string().required("Product names are required"),
//     quantity: Yup.number().required("Quantity is required").min(1),
//     qtyInKg: Yup.number().required("Qty in kg is required").min(0),
//     totalAmount: Yup.number().required("Total amount is required").min(0),
//     paid: Yup.number().required("Paid amount is required").min(0),
//   });

//   // Handlers
//   const handleCustomerNameOnChange = (e) => {
//     const value = e.target.value;
//     setName(value);
//     // Simulate search
//     if (value.length > 0) {
//       setData([
//         { name: "XYZ Traders", address: "Dhaka" },
//         { name: "ABC Electronics", address: "Chittagong" },
//       ]);
//     } else {
//       setData(null);
//     }
//   };

//   const handleCustomerOnClick = (d) => {
//     setCustomer({
//       customerId: d.name,
//       customerName: d.name,
//       address: d.address,
//       customerEmail: "",
//       customerPhone: "",
//     });
//     setName(d.name);
//     setDisable(true);
//     setData(null);
//   };

//   const handleSubmit = (values, setSubmitting, resetForm) => {
//     const due = parseFloat(values.totalAmount) - parseFloat(values.paid);
//     const newReturn = {
//       _id: Date.now().toString(),
//       createdAt: values.createdAt,
//       memo: values.memo,
//       customerName: customer.customerName || name,
//       productNames: values.productNames,
//       quantity: values.quantity,
//       qtyInKg: values.qtyInKg,
//       totalAmount: parseFloat(values.totalAmount),
//       paid: parseFloat(values.paid),
//       due: due,
//     };
    
//     setReturns([newReturn, ...returns]);
//     resetForm();
//     setSubmitting(false);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-3 sm:p-4 md:p-6 font-sans">
//       {/* Title */}
//       <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
//         Sales Return Entry
//       </h1>
      
//       <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 mb-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Customer Name
//             </label>
//             <div className="flex">
//               <input
//                 type="search"
//                 value={name}
//                 onChange={handleCustomerNameOnChange}
//                 ref={customerNameRef}
//                 placeholder="Customer Name"
//                 className="block w-[85%] px-3 py-1.5 border border-gray-300 rounded-sm text-sm disabled:bg-gray-300"
//                 disabled={disable}
//               />
//               <button
//                 disabled={!disable}
//                 className="bg-red-500 hover:bg-red-600 cursor-pointer ml-2 px-2 py-1 font-bold text-white rounded disabled:bg-red-300 disabled:cursor-not-allowed"
//                 onClick={() => {
//                   setDisable(false);
//                   setName("");
//                   setCustomer({
//                     customerId: "",
//                     customerName: "",
//                     address: "",
//                     customerEmail: "",
//                     customerPhone: "",
//                   });
//                   setData(null);
//                 }}
//               >
//                 Change
//               </button>
//             </div>

//             <div
//               className={`w-[85%] max-h-50 ${
//                 data ? "shadow-md overflow-y-scroll" : ""
//               }`}
//             >
//               {data ? (
//                 <table className="w-full">
//                   <tbody>
//                     {data.map((d, i) => (
//                       <tr
//                         key={i}
//                         className="p-2 cursor-pointer border-b border-gray-300 hover:bg-gray-100 text-gray-800"
//                         onClick={() => handleCustomerOnClick(d)}
//                       >
//                         <td className="p-2">{d.name}</td>
//                         <td className="text-center">{d.address}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               ) : (
//                 ""
//               )}
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Address</label>
//             <input
//               type="text"
//               value={customer.address}
//               placeholder="Address"
//               disabled
//               className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm bg-gray-200 text-gray-700 select-none"
//               required
//             />
//           </div>
//         </div>

//         {/* Sales Return Add Form */}
//         <Formik
//           initialValues={{
//             createdAt: "",
//             memo: "",
//             productNames: "",
//             quantity: "",
//             qtyInKg: "",
//             totalAmount: "",
//             paid: "",
//             due: "",
//           }}
//           validationSchema={returnSchema}
//           onSubmit={(value, { setSubmitting, resetForm }) =>
//             handleSubmit(value, setSubmitting, resetForm)
//           }
//         >
//           {({ isSubmitting, dirty, isValid }) => (
//             <Form>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//                 <div className="flex flex-col">
//                   <Field
//                     type="date"
//                     placeholder="Date"
//                     name="createdAt"
//                     className="border border-gray-300 rounded-md px-3 py-2 text-sm"
//                   />
//                   <ErrorMessage
//                     name="createdAt"
//                     component="div"
//                     className="text-xs text-red-600"
//                   />
//                 </div>

//                 <div>
//                   <Field
//                     type="text"
//                     placeholder="Memo"
//                     name="memo"
//                     className="border border-gray-300 rounded-md px-3 py-2 text-sm"
//                   />
//                   <ErrorMessage
//                     name="memo"
//                     component="div"
//                     className="text-xs text-red-600"
//                   />
//                 </div>

//                 <div>
//                   <Field
//                     type="text"
//                     name="productNames"
//                     placeholder="Products Name (comma separated)"
//                     className="border border-gray-300 rounded-md px-3 py-2 text-sm"
//                   />
//                   <ErrorMessage
//                     name="productNames"
//                     component="div"
//                     className="text-xs text-red-600"
//                   />
//                 </div>
//                 <div>
//                   <Field
//                     type="number"
//                     placeholder="Quantity"
//                     name="quantity"
//                     className="border border-gray-300 rounded-md px-3 py-2 text-sm"
//                   />
//                   <ErrorMessage
//                     name="quantity"
//                     component="div"
//                     className="text-xs text-red-600"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//                 <div>
//                   <Field
//                     name="qtyInKg"
//                     type="number"
//                     placeholder="Qty in kg"
//                     step="any"
//                     className="border border-gray-300 rounded-md px-3 py-2 text-sm"
//                   />
//                   <ErrorMessage
//                     name="qtyInKg"
//                     component="div"
//                     className="text-xs text-red-600"
//                   />
//                 </div>

//                 <div>
//                   <Field
//                     name="totalAmount"
//                     type="number"
//                     placeholder="Total Amount"
//                     step="any"
//                     className="border border-gray-300 rounded-md px-3 py-2 text-sm"
//                   />
//                   <ErrorMessage
//                     name="totalAmount"
//                     component="div"
//                     className="text-xs text-red-600"
//                   />
//                 </div>

//                 <div>
//                   <Field
//                     name="paid"
//                     type="number"
//                     placeholder="Paid"
//                     step="any"
//                     className="border border-gray-300 rounded-md px-3 py-2 text-sm"
//                   />
//                   <ErrorMessage
//                     name="paid"
//                     component="div"
//                     className="text-xs text-red-600"
//                   />
//                 </div>
//               </div>

//               <button
//                 disabled={isSubmitting || !dirty || !isValid}
//                 type="submit"
//                 className="w-full sm:w-auto bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? "Adding..." : "Add Return"}
//               </button>
//             </Form>
//           )}
//         </Formik>
//       </div>

//       {/* Sales Return Report Table */}
//       <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
//           <div className="flex flex-col gap-2">
//             <h2 className="text-lg sm:text-xl font-semibold">
//               Sales Return Report
//             </h2>
//             <select
//               value={sortOrder}
//               onChange={(e) => setSortOrder(e.target.value)}
//               className="border border-gray-300 rounded-md px-3 py-2 text-sm"
//             >
//               <option value="1">Oldest First</option>
//               <option value="-1">Newest First</option>
//             </select>
//           </div>

//           <div className="flex flex-col gap-2">
//             <div className="flex items-center gap-2 ml-auto">
//               <label className="text-xs sm:text-sm text-gray-600">
//                 Search by Customer Name:
//               </label>
//               <input
//                 type="search"
//                 value={nameSearch}
//                 onChange={(e) => setNameSearch(e.target.value)}
//                 className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-36 sm:w-40"
//               />
//             </div>

//             <div className="flex items-center gap-2 ml-auto">
//               <label className="text-xs sm:text-sm text-gray-600">
//                 Search by Date:
//               </label>
//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-36 sm:w-40"
//               />
//             </div>

//             <div className="text-right">
//               <button
//                 className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 cursor-pointer"
//                 onClick={() => setFilterToggler(!filterToggler)}
//               >
//                 Filter
//               </button>
//               <button
//                 className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 cursor-pointer ml-2"
//                 onClick={() => {
//                   if (date !== "" || nameSearch !== "") {
//                     date !== "" && setDate("");
//                     nameSearch !== "" && setNameSearch("");
//                     setFilterToggler(!filterToggler);
//                   }
//                 }}
//               >
//                 Clear
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="min-w-full text-xs sm:text-sm border-collapse">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
//                   Date
//                 </th>
//                 <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
//                   Memo
//                 </th>
//                 <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
//                   Customer
//                 </th>
//                 <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
//                   Products
//                 </th>
//                 <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
//                   Qty
//                 </th>
//                 <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
//                   Qty (kg)
//                 </th>
//                 <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
//                   Total
//                 </th>
//                 <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
//                   Paid
//                 </th>
//                 <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
//                   Due
//                 </th>
//                 <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {returns.length > 0 ? (
//                 returns.map((returnItem, index) => (
//                   <tr
//                     key={index}
//                     className="hover:bg-gray-50 cursor-pointer"
//                     onClick={(e) => {
//                       if (e.target.tagName !== "TD") return;
//                       navigate("/sales-return-statement", {
//                         state: returnItem,
//                       });
//                     }}
//                   >
//                     <td className="border px-2 py-1 sm:px-4 sm:py-2">
//                       {new Date(returnItem.createdAt)
//                         .toLocaleDateString("en-GB", {
//                           timeZone: "Asia/Dhaka",
//                         })
//                         .replaceAll("/", "-")}
//                     </td>
//                     <td className="border px-2 py-1 sm:px-4 sm:py-2">
//                       {returnItem.memo}
//                     </td>
//                     <td className="border px-2 py-1 sm:px-4 sm:py-2">
//                       {returnItem.customerName}
//                     </td>
//                     <td className="border px-2 py-1 sm:px-4 sm:py-2 max-w-40">
//                       {returnItem.productNames}
//                     </td>
//                     <td className="border px-2 py-1 sm:px-4 sm:py-2">
//                       {returnItem.quantity}
//                     </td>
//                     <td className="border px-2 py-1 sm:px-4 sm:py-2">
//                       {returnItem.qtyInKg}
//                     </td>
//                     <td className="border px-2 py-1 sm:px-4 sm:py-2">
//                       {returnItem.totalAmount}
//                     </td>
//                     <td className="border px-2 py-1 sm:px-4 sm:py-2">
//                       {returnItem.paid}
//                     </td>
//                     <td
//                       className={`border px-2 py-1 sm:px-4 sm:py-2 ${
//                         returnItem.due > 0 ? "text-red-500 font-bold" : ""
//                       }`}
//                     >
//                       {returnItem.due}
//                     </td>
//                     <td className="border px-2 py-1 sm:px-4 sm:py-2">
//                       <div className="flex flex-wrap gap-1">
//                         <Link
//                           onClick={(e) => e.stopPropagation()}
//                           to={
//                             returnItem.due
//                               ? `/sales-return-report/${returnItem._id}/edit-due`
//                               : "#"
//                           }
//                           className={`text-xs text-white px-2 py-1 rounded ${
//                             returnItem.due
//                               ? "bg-green-600 hover:bg-green-700"
//                               : "cursor-no-drop bg-green-500"
//                           }`}
//                         >
//                           Add Payment
//                         </Link>
//                         <Link
//                           onClick={(e) => e.stopPropagation()}
//                           to="/invoice-sales-return"
//                           state={returnItem}
//                           className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 cursor-pointer"
//                         >
//                           Print
//                         </Link>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={10}
//                     className="text-center text-gray-500 py-10 text-lg select-none"
//                   >
//                     No Return Available.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {pages ? (
//           <div className="flex justify-center items-center mt-4 gap-2 text-sm">
//             <button
//               onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//               disabled={page === 1}
//               className={`${
//                 page === 1
//                   ? ""
//                   : "cursor-pointer hover:bg-black hover:text-white"
//               } px-2 py-1 border rounded disabled:opacity-50`}
//             >
//               Prev
//             </button>
//             <span>
//               Page {page} of {pages}
//             </span>
//             <button
//               onClick={() => setCurrentPage((p) => Math.min(p + 1, pages))}
//               disabled={page === pages}
//               className={`${
//                 page === pages
//                   ? ""
//                   : "cursor-pointer hover:bg-black hover:text-white"
//               } px-2 py-1 border rounded disabled:opacity-50`}
//             >
//               Next
//             </button>
//           </div>
//         ) : (
//           ""
//         )}
//       </div>
//     </div>
//   );
// };

// export default SalesReturn;

// import React from "react";
// import { Formik, Form, Field } from "formik";
// import { Link } from "react-router-dom";

// const SalesReturn = () => {
//   // Initial values for Formik
//   const initialValues = {
//     createdAt: "",
//     memo: "",
//     returnType: "money", // default value
//   };

//   const handleSubmit = (values) => {
//     console.log(values);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-3 sm:p-4 md:p-6 font-sans">
//       {/* Title */}
//       <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
//         Sales Return Entry
//       </h1>

//       <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
//         {/* Customer Info Section */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 mb-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Customer Name
//             </label>
//             <div className="flex">
//               <input
//                 type="search"
//                 placeholder="Customer Name"
//                 className="block w-[85%] px-3 py-1.5 border border-gray-300 rounded-sm text-sm"
//               />
//               <button
//                 type="button"
//                 className="bg-red-500 hover:bg-red-600 cursor-pointer ml-2 px-2 py-1 font-bold text-white rounded"
//               >
//                 Change
//               </button>
//             </div>

//             {/* Customer Dropdown - Static */}
//             <div className="w-[85%] max-h-50 shadow-md overflow-y-scroll">
//               <table className="w-full">
//                 <tbody>
//                   <tr className="p-2 cursor-pointer border-b border-gray-300 hover:bg-gray-100 text-gray-800">
//                     <td className="p-2">XYZ Traders</td>
//                     <td className="text-center">Dhaka</td>
//                   </tr>
//                   <tr className="p-2 cursor-pointer border-b border-gray-300 hover:bg-gray-100 text-gray-800">
//                     <td className="p-2">ABC Electronics</td>
//                     <td className="text-center">Chittagong</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Address</label>
//             <input
//               type="text"
//               placeholder="Address"
//               disabled
//               className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm bg-gray-200 text-gray-700 select-none"
//             />
//           </div>
//         </div>

//         {/* Date and Memo Row - OUTSIDE Formik */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//           <div>
//             <input
//               type="date"
//               name="createdAt"
//               className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
//             />
//           </div>
//           <div className="flex gap-2">
//             <input
//               type="text"
//               name="memo"
//               placeholder="Enter Memo Number"
//               className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1"
//             />
//             <button
//               type="button"
//               className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
//             >
//               Load
//             </button>
//           </div>
//         </div>

//         {/* Formik Form */}
//         <Formik initialValues={initialValues} onSubmit={handleSubmit}>
//           {({ values }) => (
//             <Form>
//               {/* Original Sale Products - Auto Loaded from Memo */}
//               <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
//                 <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
//                   <span>Original Sale Products (Memo: #12345)</span>
//                   <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
//                     Auto Loaded
//                   </span>
//                 </h3>

//                 {/* Original Product 1 */}
//                 <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-3 items-end bg-white p-3 rounded border border-blue-100">
//                   <div className="md:col-span-2">
//                     <label className="block text-xs text-gray-600 mb-1">
//                       Product Name
//                     </label>
//                     <input
//                       type="text"
//                       value="LED Bulb 12W"
//                       disabled
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs text-gray-600 mb-1">
//                       Sale Qty
//                     </label>
//                     <input
//                       type="number"
//                       value="10"
//                       disabled
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs text-gray-600 mb-1">
//                       Qty (kg)
//                     </label>
//                     <input
//                       type="number"
//                       value="5"
//                       disabled
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs text-gray-600 mb-1">
//                       Unit Price
//                     </label>
//                     <input
//                       type="number"
//                       value="1500"
//                       disabled
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs text-gray-600 mb-1">
//                       Return Qty
//                     </label>
//                     <input
//                       type="number"
//                       placeholder="Return Qty"
//                       className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
//                     />
//                   </div>
//                 </div>

//                 {/* Original Product 2 */}
//                 <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-3 items-end bg-white p-3 rounded border border-blue-100">
//                   <div className="md:col-span-2">
//                     <input
//                       type="text"
//                       value="Battery 12V"
//                       disabled
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
//                     />
//                   </div>
//                   <div>
//                     <input
//                       type="number"
//                       value="5"
//                       disabled
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
//                     />
//                   </div>
//                   <div>
//                     <input
//                       type="number"
//                       value="25"
//                       disabled
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
//                     />
//                   </div>
//                   <div>
//                     <input
//                       type="number"
//                       value="2000"
//                       disabled
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
//                     />
//                   </div>
//                   <div>
//                     <input
//                       type="number"
//                       placeholder="Return Qty"
//                       className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
//                     />
//                   </div>
//                 </div>

//                 {/* Original Sale Summary */}
//                 <div className="border-t border-blue-200 pt-3 mt-3">
//                   <div className="flex justify-end gap-6 text-sm">
//                     <span className="text-blue-800">
//                       Total Sale Qty: <strong>15</strong>
//                     </span>
//                     <span className="text-blue-800">
//                       Total Sale Amount: <strong>৳ 25,000</strong>
//                     </span>
//                     <span className="text-red-600 font-semibold">
//                       Return Amount: <strong>৳ 0</strong>
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Return Type Selection */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                   <label className="flex items-center gap-2 cursor-pointer">
//                     <Field
//                       type="radio"
//                       name="returnType"
//                       value="money"
//                       className="w-4 h-4 text-blue-600"
//                     />
//                     <span className="font-medium text-gray-700">
//                       Refund by Money (Cash Back)
//                     </span>
//                   </label>
//                   <p className="text-xs text-gray-500 mt-1 ml-6">
//                     Customer will receive cash refund
//                   </p>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                   <label className="flex items-center gap-2 cursor-pointer">
//                     <Field
//                       type="radio"
//                       name="returnType"
//                       value="product"
//                       className="w-4 h-4 text-blue-600"
//                     />
//                     <span className="font-medium text-gray-700">
//                       Refund by Product (Exchange)
//                     </span>
//                   </label>
//                   <p className="text-xs text-gray-500 mt-1 ml-6">
//                     Customer will get new product instead
//                   </p>
//                 </div>
//               </div>

//               {/* New Product Exchange Section - Show when Refund by Product selected */}
//               {values.returnType === "product" && (
//                 <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
//                   <div className="flex justify-between items-center mb-3">
//                     <h3 className="text-sm font-semibold text-green-800">
//                       New Product (Exchange)
//                     </h3>
//                     <button
//                       type="button"
//                       className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm font-medium"
//                     >
//                       + Add Product
//                     </button>
//                   </div>

//                   {/* Exchange Product Row 1 */}
//                   <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3 items-end">
//                     <div className="md:col-span-2">
//                       <label className="block text-xs text-gray-600 mb-1">
//                         Product Name
//                       </label>
//                       <input
//                         type="text"
//                         placeholder="New Product Name"
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1">
//                         Quantity
//                       </label>
//                       <input
//                         type="number"
//                         placeholder="Qty"
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1">
//                         Qty (kg)
//                       </label>
//                       <input
//                         type="number"
//                         placeholder="Qty in kg"
//                         step="any"
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
//                       />
//                     </div>
//                     <div className="flex gap-2">
//                       <div className="flex-1">
//                         <label className="block text-xs text-gray-600 mb-1">
//                           Unit Price
//                         </label>
//                         <input
//                           type="number"
//                           placeholder="Unit Price"
//                           step="any"
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
//                         />
//                       </div>
//                       <button
//                         type="button"
//                         className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
//                       >
//                         ×
//                       </button>
//                     </div>
//                   </div>

//                   {/* Exchange Product Summary */}
//                   <div className="border-t border-green-200 pt-3 mt-3">
//                     <div className="flex justify-end gap-6 text-sm">
//                       <span className="text-gray-600">
//                         Total Qty: <strong>0</strong>
//                       </span>
//                       <span className="text-gray-600">
//                         Total Qty (kg): <strong>0</strong>
//                       </span>
//                       <span className="text-green-800 font-semibold">
//                         Exchange Value: ৳ 0
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Final Calculation Section */}
//               <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-200">
//                 <h3 className="text-sm font-semibold text-yellow-800 mb-3">
//                   Final Calculation
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                   <div>
//                     <label className="block text-xs text-gray-600 mb-1">
//                       Total Return Value
//                     </label>
//                     <input
//                       type="number"
//                       value="0"
//                       disabled
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-red-100 text-red-700 font-semibold text-sm"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs text-gray-600 mb-1">
//                       Exchange Value
//                     </label>
//                     <input
//                       type="number"
//                       value="0"
//                       disabled
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-green-100 text-green-700 font-semibold text-sm"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs text-gray-600 mb-1">
//                       Pay to Customer
//                     </label>
//                     <input
//                       type="number"
//                       value="0"
//                       disabled
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-blue-100 text-blue-700 font-semibold text-sm"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs text-gray-600 mb-1">
//                       Receive from Customer
//                     </label>
//                     <input
//                       type="number"
//                       value="0"
//                       disabled
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-orange-100 text-orange-700 font-semibold text-sm"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex flex-wrap gap-3">
//                 <button
//                   type="submit"
//                   className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
//                 >
//                   Add Return
//                 </button>
//                 <button
//                   type="button"
//                   className="px-6 py-2 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 transition-colors"
//                 >
//                   Update
//                 </button>
//                 <button
//                   type="button"
//                   className="px-6 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 transition-colors"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </Form>
//           )}
//         </Formik>
//       </div>

//       {/* Sales Return Report Table */}
//       <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
//           <div className="flex flex-col gap-2">
//             <h2 className="text-lg sm:text-xl font-semibold">
//               Sales Return Report
//             </h2>
//             <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
//               <option value="1">Oldest First</option>
//               <option value="-1">Newest First</option>
//             </select>
//           </div>

//           <div className="flex flex-col gap-2">
//             <div className="flex items-center gap-2 ml-auto">
//               <label className="text-xs sm:text-sm text-gray-600">
//                 Search by Customer Name:
//               </label>
//               <input
//                 type="search"
//                 className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-36 sm:w-40"
//               />
//             </div>

//             <div className="flex items-center gap-2 ml-auto">
//               <label className="text-xs sm:text-sm text-gray-600">
//                 Search by Date:
//               </label>
//               <input
//                 type="date"
//                 className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-36 sm:w-40"
//               />
//             </div>

//             <div className="text-right">
//               <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 cursor-pointer">
//                 Filter
//               </button>
//               <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 cursor-pointer ml-2">
//                 Clear
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="min-w-full text-xs sm:text-sm border-collapse">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
//                   Date
//                 </th>
//                 <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
//                   Memo
//                 </th>
//                 <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
//                   Customer
//                 </th>
//                 <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
//                   Return Type
//                 </th>
//                 <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
//                   Return Value
//                 </th>
//                 <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
//                   Exchange Value
//                 </th>
//                 <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
//                   Net Pay
//                 </th>
//                 <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr className="hover:bg-gray-50 cursor-pointer">
//                 <td className="border px-2 py-1 sm:px-4 sm:py-2">
//                   15-02-2026
//                 </td>
//                 <td className="border px-2 py-1 sm:px-4 sm:py-2">
//                   #12345
//                 </td>
//                 <td className="border px-2 py-1 sm:px-4 sm:py-2">
//                   XYZ Traders
//                 </td>
//                 <td className="border px-2 py-1 sm:px-4 sm:py-2">
//                   <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
//                     Product Exchange
//                   </span>
//                 </td>
//                 <td className="border px-2 py-1 sm:px-4 sm:py-2 text-red-600">
//                   ৳ 5,000
//                 </td>
//                 <td className="border px-2 py-1 sm:px-4 sm:py-2 text-green-600">
//                   ৳ 5,000
//                 </td>
//                 <td className="border px-2 py-1 sm:px-4 sm:py-2">৳ 0</td>
//                 <td className="border px-2 py-1 sm:px-4 sm:py-2">
//                   <div className="flex flex-wrap gap-1">
//                     <button className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
//                       Edit
//                     </button>
//                     <Link
//                       to="/invoice-sales-return"
//                       className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 cursor-pointer"
//                     >
//                       Print
//                     </Link>
//                   </div>
//                 </td>
//               </tr>
//               <tr className="hover:bg-gray-50 cursor-pointer">
//                 <td className="border px-2 py-1 sm:px-4 sm:py-2">
//                   20-01-2026
//                 </td>
//                 <td className="border px-2 py-1 sm:px-4 sm:py-2">
//                   #12346
//                 </td>
//                 <td className="border px-2 py-1 sm:px-4 sm:py-2">
//                   ABC Electronics
//                 </td>
//                 <td className="border px-2 py-1 sm:px-4 sm:py-2">
//                   <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
//                     Cash Refund
//                   </span>
//                 </td>
//                 <td className="border px-2 py-1 sm:px-4 sm:py-2 text-red-600">
//                   ৳ 15,000
//                 </td>
//                 <td className="border px-2 py-1 sm:px-4 sm:py-2 text-green-600">
//                   ৳ 0
//                 </td>
//                 <td className="border px-2 py-1 sm:px-4 sm:py-2 text-red-600 font-bold">
//                   -৳ 15,000
//                 </td>
//                 <td className="border px-2 py-1 sm:px-4 sm:py-2">
//                   <div className="flex flex-wrap gap-1">
//                     <button className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
//                       Edit
//                     </button>
//                     <Link
//                       to="/invoice-sales-return"
//                       className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 cursor-pointer"
//                     >
//                       Print
//                     </Link>
//                   </div>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-center items-center mt-4 gap-2 text-sm">
//           <button className="cursor-pointer hover:bg-black hover:text-white px-2 py-1 border rounded">
//             Prev
//           </button>
//           <span>Page 1 of 1</span>
//           <button className="cursor-pointer hover:bg-black hover:text-white px-2 py-1 border rounded">
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SalesReturn;

import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { Link } from "react-router-dom";

const SalesReturn = () => {
  // State for calculations
  const [returnAmount, setReturnAmount] = useState(0);
  const [exchangeAmount, setExchangeAmount] = useState(0);
  const [isEditing, setIsEditing] = useState(false); // For Update button logic

  // Calculate net pay
  const netPay = returnAmount - exchangeAmount;
  const payToCustomer = netPay > 0 ? netPay : 0;
  const receiveFromCustomer = netPay < 0 ? Math.abs(netPay) : 0;

  const initialValues = {
    createdAt: "",
    memo: "",
    returnType: "money",
  };

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-4 md:p-6 font-sans">
      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Sales Return Entry
      </h1>

      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
        {/* Customer Info Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Customer Name
            </label>
            <div className="flex">
              <input
                type="search"
                placeholder="Customer Name"
                className="block w-[85%] px-3 py-1.5 border border-gray-300 rounded-sm text-sm"
              />
              <button
                type="button"
                className="bg-red-500 hover:bg-red-600 cursor-pointer ml-2 px-2 py-1 font-bold text-white rounded"
              >
                Change
              </button>
            </div>

            {/* Customer Dropdown */}
            <div className="w-[85%] max-h-50 shadow-md overflow-y-scroll">
              <table className="w-full">
                <tbody>
                  <tr className="p-2 cursor-pointer border-b border-gray-300 hover:bg-gray-100 text-gray-800">
                    <td className="p-2">XYZ Traders</td>
                    <td className="text-center">Dhaka</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              placeholder="Address"
              disabled
              className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm bg-gray-200 text-gray-700 select-none"
            />
          </div>
        </div>

        {/* Date and Memo Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <input
              type="date"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Memo Number"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1"
            />
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Load
            </button>
          </div>
        </div>

        <Formik initialValues={initialValues}>
          {({ values }) => (
            <Form>
              {/* Original Sale Products - Auto Loaded */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <span>Original Sale Products (Memo: #12345)</span>
                  <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                    Auto Loaded
                  </span>
                </h3>

                {/* Product 1 */}
                <div className="grid grid-cols-1 md:grid-cols-7 gap-3 mb-3 items-end bg-white p-3 rounded border border-blue-100">
                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value="LED Bulb 12W"
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Sale Qty
                    </label>
                    <input
                      type="number"
                      value="10"
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Unit Price
                    </label>
                    <input
                      type="number"
                      value="1500"
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Return Qty
                    </label>
                    <input
                      type="number"
                      placeholder="Qty"
                      className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Qty (kg)
                    </label>
                    <input
                      type="number"
                      placeholder="kg"
                      className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Line Total
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-red-50 text-red-700 font-semibold text-sm">
                      ৳ 0
                    </div>
                  </div>
                </div>

                {/* Original Sale Summary */}
                <div className="border-t border-blue-200 pt-3 mt-3">
                  <div className="flex justify-end gap-6 text-sm">
                    <span className="text-blue-800">
                      Total Sale: <strong>৳ 25,000</strong>
                    </span>
                    <span className="text-red-600 font-semibold text-lg">
                      Return Amount: <strong>৳ {returnAmount}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Return Type Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className={`p-4 rounded-lg border-2 cursor-pointer ${
                  values.returnType === "money" 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 bg-gray-50"
                }`}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Field
                      type="radio"
                      name="returnType"
                      value="money"
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="font-medium text-gray-700">
                      Refund by Money (Cash Back)
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-6">
                    Customer will receive cash: ৳ {payToCustomer}
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg border-2 cursor-pointer ${
                  values.returnType === "product" 
                    ? "border-green-500 bg-green-50" 
                    : "border-gray-200 bg-gray-50"
                }`}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Field
                      type="radio"
                      name="returnType"
                      value="product"
                      className="w-4 h-4 text-green-600"
                    />
                    <span className="font-medium text-gray-700">
                      Refund by Product (Exchange)
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-6">
                    Exchange with new products
                  </p>
                </div>
              </div>

              {/* Exchange Section - Only show when product selected */}
              {values.returnType === "product" && (
                <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-green-800">
                      New Exchange Products
                    </h3>
                    <button
                      type="button"
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm font-medium"
                    >
                      + Add Product
                    </button>
                  </div>

                  {/* Exchange Product Row */}
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-3 items-end">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        placeholder="Product Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Qty"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Qty (kg)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Unit Price"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-green-100 text-green-700 font-semibold text-sm">
                          ৳ 0
                        </div>
                      </div>
                      <button
                        type="button"
                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-green-200 pt-3 mt-3">
                    <div className="flex justify-end">
                      <span className="text-green-800 font-semibold text-lg">
                        Exchange Value: ৳ {exchangeAmount}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Final Calculation */}
              <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-200">
                <h3 className="text-sm font-semibold text-yellow-800 mb-3">
                  Final Calculation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-white rounded border border-red-200">
                    <div className="text-xs text-gray-600 mb-1">Return Value</div>
                    <div className="text-xl font-bold text-red-600">৳ {returnAmount}</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded border border-green-200">
                    <div className="text-xs text-gray-600 mb-1">Exchange Value</div>
                    <div className="text-xl font-bold text-green-600">৳ {exchangeAmount}</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded border border-blue-200">
                    <div className="text-xs text-gray-600 mb-1">Pay to Customer</div>
                    <div className="text-xl font-bold text-blue-600">৳ {payToCustomer}</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded border border-orange-200">
                    <div className="text-xs text-gray-600 mb-1">Receive from Customer</div>
                    <div className="text-xl font-bold text-orange-600">৳ {receiveFromCustomer}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Conditional */}
              <div className="flex flex-wrap gap-3">
                {!isEditing ? (
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add Return
                  </button>
                ) : (
                  <button
                    type="button"
                    className="px-6 py-2 bg-yellow-500 text-white font-medium rounded-md hover:bg-yellow-600 transition-colors"
                  >
                    Update Return
                  </button>
                )}
                
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 transition-colors"
                >
                  Reset
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Sales Return Report Table */}
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h2 className="text-lg sm:text-xl font-semibold">
            Sales Return Report
          </h2>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 ml-auto">
              <label className="text-xs sm:text-sm text-gray-600">
                Search by Customer:
              </label>
              <input
                type="search"
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-36 sm:w-40"
              />
            </div>
            <div className="text-right">
              <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 cursor-pointer">
                Filter
              </button>
              <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 cursor-pointer ml-2">
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs sm:text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Date</th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Memo</th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Customer</th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Type</th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Return</th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Exchange</th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Net</th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50 cursor-pointer">
                <td className="border px-2 py-1 sm:px-4 sm:py-2">15-02-2026</td>
                <td className="border px-2 py-1 sm:px-4 sm:py-2">#12345</td>
                <td className="border px-2 py-1 sm:px-4 sm:py-2">XYZ Traders</td>
                <td className="border px-2 py-1 sm:px-4 sm:py-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    Exchange
                  </span>
                </td>
                <td className="border px-2 py-1 sm:px-4 sm:py-2 text-red-600">৳ 5,000</td>
                <td className="border px-2 py-1 sm:px-4 sm:py-2 text-green-600">৳ 5,000</td>
                <td className="border px-2 py-1 sm:px-4 sm:py-2">৳ 0</td>
                <td className="border px-2 py-1 sm:px-4 sm:py-2">
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <Link
                      to="/invoice-sales-return"
                      className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                    >
                      Print
                    </Link>
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

export default SalesReturn;