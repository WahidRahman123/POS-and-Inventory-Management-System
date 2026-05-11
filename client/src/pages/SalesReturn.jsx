// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   searchProductsforPOS,
//   setProductsBySearchToEmpty,
// } from "../features/product/productSlice";
// import Decimal from "decimal.js";
// import {
//   addSalesReturn,
//   fetchSaleByInvoice,
//   fetchSalesReturns,
//   setSaleSearchedByInvoiceToEmpty,
// } from "../features/SalesReturn/salesReturnSlice";

// const SalesReturn = () => {
//   const { user } = useSelector((state) => state.auth);
//   const {
//     salesReturns,
//     saleSearchedByInvoice,
//     toggle,
//     invoiceLoading,
//     page,
//     pages,
//   } = useSelector((state) => state.salesReturn);
//   const [returnType, setReturnType] = useState("product");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // console.log(salesReturns)

//   //* For Date
//   const [dateMode, setDateMode] = useState("single");
//   const [dateSearch, setDateSearch] = useState("");
//   const [rangeDateSearch, setRangeDateSearch] = useState({
//     dateSearchStart: "",
//     dateSearchEnd: "",
//   });

//   const [currentPage, setCurrentPage] = useState(page);
//   const [sortOrder, setSortOrder] = useState(-1);
//   const [nameSearch, setNameSearch] = useState("");
//   const [filterToggler, setFilterToggler] = useState(false);
//   const [expandedRow, setExpandedRow] = useState(null);

//   const [data, setData] = useState({
//     invoiceNo: "",
//     date: "",
//   });
//   const [cashDetails, setCashDetails] = useState({
//     cashRefundAmount: "",
//     paymentMethod: "Cash",
//     note: "",
//   });
//   const [originalSaleProducts, setOriginalSaleProducts] = useState([]);


//   const handleSaleLoad = async () => {
//     if (!data.invoiceNo) alert("Enter an invoice number!");
//     try {
//       dispatch(fetchSaleByInvoice({ invoiceNo: data.invoiceNo }));
//     } catch (error) {}
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!saleSearchedByInvoice) return;

//     try {
//       const now = new Date();
//       const newOriginalProducts = originalSaleProducts.map((p, i) => ({
//         productId: p.productId,
//         productName: p.productName,
//         saleQuantity: Number(p.quantity),
//         salePrice: Number(p.sellPrice),
//         subTotal: Number(p.subTotal),
//         returnQuantity: Number(p.returnQuantity),
//         returnQtyInKg: Number(p.returnQtyInKg),
//         returnPrice: Number(p.returnPrice),
//         lineTotal: Number(p.lineTotal),
//       }));

//       let newExchangeProducts = [];
//       if (returnType === "product") {
//         newExchangeProducts = selectedProducts.map((p, i) => {
//           return {
//             productId: p._id,
//             productName: p.name,
//             quantity: Number(p.qty),
//             unitPrice: Number(p.newSellPrice),
//             subTotal: Number(
//               new Decimal(Number(p.newSellPrice)).mul(
//                 new Decimal(Number(p.qty)),
//               ),
//             ),
//           };
//         });
//       }

//       //* Due and Paid Calculation
//       let due = 0;
//       let paid = 0;
//       if (returnType === "product") {
//         paid = totalExchangeValue.greaterThan(totalReturnValue)
//           ? Number(totalReturnValue.toFixed(4))
//           : Number(totalExchangeValue.toFixed(4));

//         due = adjustmentAmount.lessThan(new Decimal(0))
//           ? 0
//           : Number(adjustmentAmount.toFixed(4));
//       }

//       if (returnType === "cash") {
//         paid = new Decimal(Number(cashDetails.cashRefundAmount)).greaterThan(
//           totalReturnValue,
//         )
//           ? Number(totalReturnValue.toFixed(4))
//           : Number(cashDetails.cashRefundAmount);

//         const temp = totalReturnValue.minus(
//           new Decimal(Number(cashDetails.cashRefundAmount)),
//         );

//         due = temp.lessThan(new Decimal(0)) ? 0 : Number(temp.toFixed(4));
//       }

//       const salesReturnData = {
//         memo: saleSearchedByInvoice.invoiceNo.toString(),
//         customerId: saleSearchedByInvoice.customerId,
//         customerName: saleSearchedByInvoice.customerName,
//         address: saleSearchedByInvoice.address,
//         customerEmail: saleSearchedByInvoice.customerEmail,
//         customerPhone: saleSearchedByInvoice.customerPhone,
//         userId: user._id,
//         salesId: saleSearchedByInvoice._id,
//         returnType,

//         products: newOriginalProducts,

//         exchangeProducts: newExchangeProducts,

//         totalReturnValue: Number(totalReturnValue.toFixed(4)),
//         due,
//         paid,

//         totalExchangeValue:
//           returnType === "product" ? Number(totalExchangeValue.toFixed(4)) : 0,
//         adjustmentAmount:
//           returnType === "product" ? Number(adjustmentAmount.toFixed(4)) : 0,

//         cashRefundAmount:
//           returnType === "cash" ? Number(cashDetails.cashRefundAmount) : 0,
//         paymentMethod: returnType === "cash" ? cashDetails.paymentMethod : "",
//         note: returnType === "cash" ? cashDetails.note : "",

//         createdAt: data.date,
//         issuedAt: now,
//       };

//       await dispatch(addSalesReturn(salesReturnData)).unwrap();
//       setData({
//         invoiceNo: "",
//         date: "",
//       });
//       setCashDetails({
//         cashRefundAmount: "",
//         paymentMethod: "Cash",
//         note: "",
//       });
//       setSelectedProducts([]);
//       dispatch(setSaleSearchedByInvoiceToEmpty());
//     } catch (error) {}
//   };

//   //* For Product Search - start
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const { productsBySearchforPOS } = useSelector((state) => state.product);
//   const [searchValue, setSearchValue] = useState("");
//   const handleSearchOnChange = (e) => {
//     setSearchValue(e.target.value);

//     if (e.target.value) {
//       dispatch(searchProductsforPOS(e.target.value));
//     } else {
//       dispatch(setProductsBySearchToEmpty());
//     }
//   };
//   const handleSearchOnClick = (pid) => {
//     let productToAdd = productsBySearchforPOS.find(
//       (product) => product._id === pid,
//     );

//     if (productToAdd) {
//       const foundProduct = selectedProducts.find(
//         (product) => product._id === productToAdd._id,
//       );

//       if (!foundProduct) {
//         productToAdd = {
//           ...productToAdd,
//           qty: 1,
//           newSellPrice: productToAdd.sellPrice,
//         }; //! iMPORTANT LINE

//         setSelectedProducts([...selectedProducts, productToAdd]);
//       }
//     }

//     dispatch(setProductsBySearchToEmpty());
//     setSearchValue("");
//   };
//   const handleDeleteProduct = (pid) => {
//     setSelectedProducts((prev) => prev.filter((p, i) => p._id !== pid));
//   };
//   const totalExchangeValue =
//     selectedProducts.length > 0
//       ? selectedProducts.reduce(
//           (acc, product) =>
//             acc.plus(
//               new Decimal(Number(product.qty)).mul(
//                 new Decimal(Number(product.newSellPrice)),
//               ),
//             ),
//           new Decimal(0),
//         )
//       : new Decimal(0);

//   useEffect(() => {
//     dispatch(setProductsBySearchToEmpty());
//     dispatch(setSaleSearchedByInvoiceToEmpty());
//   }, []);
//   //* For Product Search - end

//   const totalSaleValue =
//     originalSaleProducts.length > 0
//       ? originalSaleProducts.reduce(
//           (acc, product) =>
//             acc.plus(
//               new Decimal(Number(product.quantity)).mul(
//                 new Decimal(Number(product.sellPrice)),
//               ),
//             ),
//           new Decimal(0),
//         )
//       : new Decimal(0);

//   const totalReturnValue =
//     originalSaleProducts.length > 0
//       ? originalSaleProducts.reduce(
//           (acc, product) => acc.plus(new Decimal(Number(product.lineTotal))),
//           new Decimal(0),
//         )
//       : new Decimal(0);

//   const adjustmentAmount = totalReturnValue.minus(totalExchangeValue);

//   useEffect(() => {
//     if (saleSearchedByInvoice?.products?.length > 0) {
//       const productsToAdd = saleSearchedByInvoice.products.map((sale) => ({
//         ...sale,
//         returnPrice: sale.sellPrice,
//         returnQuantity: "",
//         returnQtyInKg: "",
//         lineTotal: "",
//       }));

//       setOriginalSaleProducts(productsToAdd);
//     }
//   }, [saleSearchedByInvoice]);

//   //* Fetching sales returns
//   useEffect(() => {
//     if (user) {
//       if (dateMode === "single") {
//         dispatch(
//           fetchSalesReturns({
//             dateMode,
//             dateSearch,
//             nameSearch,
//             page: currentPage,
//             order: sortOrder,
//           }),
//         );
//       } else {
//         dispatch(
//           fetchSalesReturns({
//             dateMode,
//             dateSearchStart: rangeDateSearch.dateSearchStart,
//             dateSearchEnd: rangeDateSearch.dateSearchEnd,
//             nameSearch,
//             page: currentPage,
//             order: sortOrder,
//           }),
//         );
//       }
//     }
//   }, [dispatch, user, toggle, filterToggler, sortOrder, currentPage]);

//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-slate-50 p-3 sm:p-4 md:p-6 font-sans">
//       {/* Title */}
//       <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
//         Sales Return Entry
//       </h1>

//       <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
//         {saleSearchedByInvoice ? null : (
//           <div className="mb-4 flex items-start gap-2 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md text-sm">
//             <span className="font-semibold">নির্দেশনা:</span>
//             <span>
//               সেলস রিটার্ন তৈরি করার জন্য ইনভয়েস নম্বর লিখে{" "}
//               <strong>লোড</strong> বাটনে চাপ দিন।
//             </span>
//           </div>
//         )}
//         <form onSubmit={handleSubmit}>
//           {/* Date and Memo Row */}
//           <div
//             className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${saleSearchedByInvoice ? "mb-4" : ""}`}
//           >
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 value={data.invoiceNo}
//                 onChange={(e) =>
//                   setData((prev) => ({ ...prev, invoiceNo: e.target.value }))
//                 }
//                 placeholder="Enter Invoice Number"
//                 className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={handleSaleLoad}
//                 disabled={invoiceLoading}
//                 className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed"
//               >
//                 {invoiceLoading ? "Loading..." : "Load"}
//               </button>
//             </div>
//             {saleSearchedByInvoice ? (
//               <div>
//                 <input
//                   type="date"
//                   value={data.date}
//                   onChange={(e) =>
//                     setData((prev) => ({ ...data, date: e.target.value }))
//                   }
//                   className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
//                   required
//                 />
//               </div>
//             ) : (
//               ""
//             )}
//           </div>
//           {saleSearchedByInvoice ? (
//             <>
//               {/* Customer Info Section */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 mb-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Customer Name
//                   </label>
//                   <div className="flex">
//                     <input
//                       type="search"
//                       value={saleSearchedByInvoice.customerName}
//                       disabled
//                       placeholder="Customer Name"
//                       className="block w-full px-3 py-1.5 border border-gray-300 bg-gray-200 text-gray-700 rounded-sm text-sm"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Address
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Address"
//                     value={saleSearchedByInvoice.address}
//                     disabled
//                     className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm bg-gray-200 text-gray-700 select-none"
//                   />
//                 </div>
//               </div>

//               {/* Original Sale Products - Auto Loaded */}
//               <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
//                 <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
//                   <span>Original Sale Products (Memo: #{saleSearchedByInvoice.invoiceNo})</span>
//                   <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
//                     Auto Loaded
//                   </span>
//                 </h3>

//                 {/* Original Products */}
//                 {originalSaleProducts.length > 0
//                   ? originalSaleProducts.map((product, index) => (
//                       <div
//                         key={index}
//                         className="grid grid-cols-1 md:grid-cols-8 gap-3 mb-3 items-end bg-white p-3 rounded border border-blue-100"
//                       >
//                         <div className="md:col-span-2">
//                           <label className="block text-xs text-gray-600 mb-1">
//                             Product Name
//                           </label>
//                           <input
//                             type="text"
//                             value={product.productName}
//                             disabled
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-xs text-gray-600 mb-1">
//                             Sale Qty
//                           </label>
//                           <input
//                             type="number"
//                             value={product.availableReturnQty}
//                             disabled
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-xs text-gray-600 mb-1">
//                             Sale Price
//                           </label>
//                           <input
//                             type="number"
//                             value={product.sellPrice}
//                             disabled
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-xs mb-1 text-red-600">
//                             Return Price
//                           </label>
//                           <input
//                             type="number"
//                             placeholder="Return Price"
//                             // min={product.sellPrice}
//                             min={0}
//                             value={product.returnPrice}
//                             onChange={(e) => {
//                               setOriginalSaleProducts((prev) =>
//                                 prev.map((p, i) =>
//                                   i === index
//                                     ? {
//                                         ...p,
//                                         returnPrice: e.target.value,
//                                         lineTotal: Number(
//                                           new Decimal(
//                                             Number(p.returnQuantity),
//                                           ).mul(
//                                             new Decimal(Number(e.target.value)),
//                                           ),
//                                         ),
//                                       }
//                                     : p,
//                                 ),
//                               );
//                             }}
//                             step="any"
//                             className="w-full px-3 py-2 border border-red-400 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
//                             required
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-xs mb-1 text-red-600">
//                             Return Qty
//                           </label>
//                           <input
//                             type="number"
//                             placeholder="Qty"
//                             min={1}
//                             max={product.availableReturnQty}
//                             value={product.returnQuantity}
//                             onChange={(e) => {
//                               setOriginalSaleProducts((prev) =>
//                                 prev.map((p, i) =>
//                                   i === index
//                                     ? {
//                                         ...p,
//                                         returnQuantity: e.target.value,
//                                         lineTotal: Number(
//                                           new Decimal(
//                                             Number(p.returnPrice),
//                                           ).mul(
//                                             new Decimal(Number(e.target.value)),
//                                           ),
//                                         ),
//                                       }
//                                     : p,
//                                 ),
//                               );
//                             }}
//                             step="any"
//                             className="w-full px-3 py-2 border border-red-400 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
//                             required
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-xs text-gray-600 mb-1">
//                             Qty (kg)
//                           </label>
//                           <input
//                             type="number"
//                             placeholder="kg"
//                             min={0}
//                             value={product.returnQtyInKg}
//                             onChange={(e) => {
//                               setOriginalSaleProducts((prev) =>
//                                 prev.map((p, i) =>
//                                   i === index
//                                     ? {
//                                         ...p,
//                                         returnQtyInKg: e.target.value,
//                                       }
//                                     : p,
//                                 ),
//                               );
//                             }}
//                             step="any"
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                             required
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-xs text-gray-600 mb-1">
//                             Line Total
//                           </label>
//                           <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-red-50 text-red-700 font-semibold text-sm">
//                             ৳{" "}
//                             {new Decimal(Number(product.lineTotal)).toFixed(2)}
//                           </div>
//                         </div>
//                         {originalSaleProducts.length > 1 ? (
//                           <button
//                             type="button"
//                             onClick={() => {
//                               setOriginalSaleProducts((prev) =>
//                                 prev.filter((p, i) => p.productId !== product.productId),
//                               );
//                             }}
//                             className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm h-fit mt-5 cursor-pointer"
//                           >
//                             ×
//                           </button>
//                         ) : (
//                           ""
//                         )}
//                       </div>
//                     ))
//                   : ""}

//                 {/* Original Sale Summary */}
//                 <div className="border-t border-blue-200 pt-3 mt-3">
//                   <div className="flex justify-end gap-6 text-sm">
//                     <span className="text-blue-800">
//                       Total Sale: <strong>৳ {totalSaleValue.toFixed(2)}</strong>
//                     </span>
//                     <span className="text-red-600 font-semibold text-lg">
//                       Total Return Value:{" "}
//                       <strong>৳ {totalReturnValue.toFixed(2)}</strong>
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Return Type Selection */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 {/* LEFT - Refund by Product */}
//                 <div
//                   onClick={() => setReturnType("product")}
//                   className={`p-4 rounded-lg border-2 cursor-pointer ${
//                     returnType === "product"
//                       ? "border-green-500 bg-green-50"
//                       : "border-gray-200 bg-gray-50"
//                   }`}
//                 >
//                   <label className="flex items-center gap-2 cursor-pointer">
//                     <input
//                       type="radio"
//                       name="returnType"
//                       value="product"
//                       checked={returnType === "product"}
//                       onChange={() => setReturnType("product")}
//                       className="w-4 h-4 text-green-600"
//                     />
//                     <span className="font-medium text-gray-700">
//                       Refund by Product (Exchange)
//                     </span>
//                   </label>
//                   <p className="text-xs text-gray-500 mt-1 ml-6">
//                     Give new products to customer
//                   </p>
//                 </div>

//                 {/* RIGHT - Refund by Cash */}
//                 <div
//                   onClick={() => setReturnType("cash")}
//                   className={`p-4 rounded-lg border-2 cursor-pointer ${
//                     returnType === "cash"
//                       ? "border-blue-500 bg-blue-50"
//                       : "border-gray-200 bg-gray-50"
//                   }`}
//                 >
//                   <label className="flex items-center gap-2 cursor-pointer">
//                     <input
//                       type="radio"
//                       name="returnType"
//                       value="cash"
//                       checked={returnType === "cash"}
//                       onChange={() => setReturnType("cash")}
//                       className="w-4 h-4 text-blue-600"
//                     />
//                     <span className="font-medium text-gray-700">
//                       Refund by Cash (Money Back)
//                     </span>
//                   </label>
//                   <p className="text-xs text-gray-500 mt-1 ml-6">
//                     Give cash to customer
//                   </p>
//                 </div>
//               </div>

//               {/* CONDITIONAL SECTIONS */}

//               {/* 1. REFUND BY PRODUCT - Multiple Products */}
//               {returnType === "product" && (
//                 <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
//                   <div className="flex justify-between items-center mb-3">
//                     <h3 className="text-sm font-semibold text-green-800">
//                       New Exchange Products
//                     </h3>
//                   </div>

//                   <div className="grid grid-cols-2 gap-x-6 mb-4">
//                     <div>
//                       <label className="block text-sm text-gray-600 font-medium mb-1">
//                         Search Product
//                       </label>
//                       <input
//                         type="search"
//                         value={searchValue}
//                         onChange={handleSearchOnChange}
//                         placeholder="Search Products..."
//                         className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm"
//                       />
//                       <div
//                         className={`${
//                           productsBySearchforPOS.length > 0
//                             ? "shadow-md px-4 py-2 rounded max-h-50 overflow-y-scroll"
//                             : ""
//                         }`}
//                       >
//                         {productsBySearchforPOS.length > 0
//                           ? productsBySearchforPOS.map((product, index) => (
//                               <div
//                                 onClick={() => handleSearchOnClick(product._id)}
//                                 key={index}
//                                 className="px-2 py-1 border-b border-gray-300 cursor-pointer hover:bg-gray-100 text-gray-800"
//                               >
//                                 {product.name}
//                               </div>
//                             ))
//                           : ""}
//                       </div>
//                     </div>
//                   </div>

//                   {selectedProducts.length > 0 ? (
//                     selectedProducts.map((product, index) => (
//                       <div
//                         key={index}
//                         className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-3 items-end"
//                       >
//                         <div className="md:col-span-2">
//                           <label className="block text-xs text-gray-600 mb-1">
//                             Product Name
//                           </label>
//                           <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800">
//                             {product.name}
//                           </div>
//                         </div>
//                         <div>
//                           <label className="block text-xs text-gray-600 mb-1">
//                             Available (Quantity)
//                           </label>
//                           <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 text-sm">
//                             {product.quantity}
//                           </div>
//                         </div>
//                         <div>
//                           <label className="block text-xs text-gray-600 mb-1">
//                             Quantity
//                           </label>
//                           <input
//                             type="number"
//                             min={1}
//                             max={product.quantity}
//                             value={product.qty}
//                             onChange={(e) => {
//                               const newQty = e.target.value;
//                               setSelectedProducts((prev) =>
//                                 prev.map((p, i) =>
//                                   i === index ? { ...p, qty: newQty } : p,
//                                 ),
//                               );
//                             }}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
//                             required={returnType === "product"}
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-xs text-gray-600 mb-1">
//                             Unit Price
//                           </label>
//                           <input
//                             type="number"
//                             placeholder="Price"
//                             min={product.costPrice}
//                             value={product.newSellPrice}
//                             onChange={(e) => {
//                               const newSP = e.target.value;
//                               setSelectedProducts((prev) =>
//                                 prev.map((p, i) =>
//                                   i === index
//                                     ? { ...p, newSellPrice: newSP }
//                                     : p,
//                                 ),
//                               );
//                             }}
//                             step="any"
//                             className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
//                             required={returnType === "product"}
//                           />
//                         </div>
//                         <div className="flex gap-2">
//                           <div className="flex-1">
//                             <label className="block text-xs text-gray-600 mb-1">
//                               Total
//                             </label>
//                             <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-green-100 text-green-700 font-semibold text-sm">
//                               ৳{" "}
//                               {new Decimal(Number(product.newSellPrice))
//                                 .mul(new Decimal(Number(product.qty)))
//                                 .toString()}
//                             </div>
//                           </div>
//                           <button
//                             type="button"
//                             onClick={() => handleDeleteProduct(product._id)}
//                             className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm h-fit mt-5 cursor-pointer"
//                           >
//                             ×
//                           </button>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-3 items-end">
//                       <div className="md:col-span-2">
//                         <label className="block text-xs text-gray-600 mb-1">
//                           Product Name
//                         </label>
//                         <input
//                           type="text"
//                           placeholder="Product Name"
//                           disabled
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-xs text-gray-600 mb-1">
//                           Available Quantity
//                         </label>
//                         <input
//                           type="number"
//                           placeholder="Available"
//                           disabled
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-xs text-gray-600 mb-1">
//                           Quantity
//                         </label>
//                         <input
//                           type="number"
//                           placeholder="Qty"
//                           disabled
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-xs text-gray-600 mb-1">
//                           Unit Price
//                         </label>
//                         <input
//                           type="number"
//                           placeholder="Price"
//                           disabled
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
//                         />
//                       </div>
//                       <div className="flex gap-2">
//                         <div className="flex-1">
//                           <label className="block text-xs text-gray-600 mb-1">
//                             Total
//                           </label>
//                           <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-green-100 text-green-700 font-semibold text-sm">
//                             ৳ 0
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* Exchange Summary */}
//                   <div className="border-t border-green-200 pt-3 mt-3">
//                     <div className="flex justify-end">
//                       <span className="text-green-800 font-semibold text-lg">
//                         Total Exchange Value: ৳ {totalExchangeValue.toFixed(2)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* 2. REFUND BY CASH - Simple Amount Input */}
//               {returnType === "cash" && (
//                 <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
//                   <h3 className="text-sm font-semibold text-blue-800 mb-3">
//                     Cash Refund Details
//                   </h3>

//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1">
//                         Cash Refund Amount
//                       </label>
//                       <input
//                         type="number"
//                         placeholder="Enter refund amount"
//                         value={cashDetails.cashRefundAmount}
//                         onChange={(e) =>
//                           setCashDetails((prev) => ({
//                             ...prev,
//                             cashRefundAmount: e.target.value,
//                           }))
//                         }
//                         className="w-full px-4 py-2 border border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
//                         required={returnType === "cash"}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1">
//                         Payment Method
//                       </label>
//                       <select
//                         value={cashDetails.paymentMethod}
//                         onChange={(e) =>
//                           setCashDetails((prev) => ({
//                             ...prev,
//                             paymentMethod: e.target.value,
//                           }))
//                         }
//                         required={returnType === "cash"}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                       >
//                         <option value="Cash">Cash</option>
//                         <option value="Bank Transfer">Bank Transfer</option>
//                         <option value="Mobile Banking">Mobile Banking</option>
//                         <option value="Check">Check</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1">
//                         Reference/Note
//                       </label>
//                       <input
//                         type="text"
//                         placeholder="Optional note"
//                         value={cashDetails.note}
//                         onChange={(e) =>
//                           setCashDetails((prev) => ({
//                             ...prev,
//                             note: e.target.value,
//                           }))
//                         }
//                         className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Final Summary */}
//               <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-200">
//                 <h3 className="text-sm font-semibold text-yellow-800 mb-3">
//                   Summary
//                 </h3>

//                 {returnType === "product" ? (
//                   /* Product Exchange Summary */
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="text-center p-3 bg-white rounded border border-red-200">
//                       <div className="text-xs text-gray-600 mb-1">
//                         Return Value
//                       </div>
//                       <div className="text-xl font-bold text-red-600">
//                         ৳ {totalReturnValue.toFixed(2)}
//                       </div>
//                     </div>
//                     <div className="text-center p-3 bg-white rounded border border-green-200">
//                       <div className="text-xs text-gray-600 mb-1">
//                         Exchange Value
//                       </div>
//                       <div className="text-xl font-bold text-green-600">
//                         ৳ {totalExchangeValue.toFixed(2)}
//                       </div>
//                     </div>
//                     <div className="text-center p-3 bg-white rounded border border-blue-200">
//                       <div className="text-xs text-gray-600 mb-1">
//                         {returnType === "product"
//                           ? "Adjustment"
//                           : "Cash to Pay"}
//                       </div>
//                       <div className="text-xl font-bold text-blue-600">
//                         ৳ {adjustmentAmount.toFixed(2)}
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   /* Cash Refund Summary */
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="text-center p-3 bg-white rounded border border-red-200">
//                       <div className="text-xs text-gray-600 mb-1">
//                         Total Return Value
//                       </div>
//                       <div className="text-xl font-bold text-red-600">
//                         ৳ {totalReturnValue.toFixed(2)}
//                       </div>
//                     </div>
//                     <div className="text-center p-3 bg-white rounded border border-blue-200">
//                       <div className="text-xs text-gray-600 mb-1">
//                         Cash Refund Amount
//                       </div>
//                       <div className="text-xl font-bold text-blue-600">
//                         ৳{" "}
//                         {Number(cashDetails.cashRefundAmount).toLocaleString(
//                           "en-BD",
//                           { minimumFractionDigits: 2 },
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Action Buttons */}
//               <div className="flex flex-wrap gap-3">
//                 <button
//                   type="submit"
//                   className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-500 transition-colors cursor-pointer"
//                 >
//                   Add Return
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => {
//                     setData({
//                       invoiceNo: "",
//                       date: "",
//                     });
//                     setCashDetails({
//                       cashRefundAmount: "",
//                       paymentMethod: "Cash",
//                       note: "",
//                     });
//                     setSelectedProducts([]);
//                     dispatch(setSaleSearchedByInvoiceToEmpty());
//                   }}
//                   className="px-6 py-2 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 disabled:cursor-not-allowed disabled:bg-gray-400 transition-colors cursor-pointer"
//                 >
//                   Reset
//                 </button>
//               </div>
//             </>
//           ) : (
//             ""
//           )}
//         </form>
//       </div>

//       {/* Sales Return Report Table */}
//       <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
//           <h2 className="text-lg sm:text-xl font-semibold">
//             Sales Return Report
//           </h2>
//         </div>

//         <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-3">
//           <div>
//             <select
//               value={sortOrder}
//               onChange={(e) => setSortOrder(e.target.value)}
//               className="border border-gray-300 bg-white rounded-md px-3 py-2 text-sm shadow-sm hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
//             >
//               <option value="1">Oldest First</option>
//               <option value="-1">Newest First</option>
//             </select>
//           </div>

//           <div className="flex flex-col gap-2 w-full lg:w-auto">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:ml-auto w-full">
//               <label className="text-xs sm:text-sm text-gray-600">
//                 Search by Customer Name:
//               </label>
//               <input
//                 type="text"
//                 value={nameSearch}
//                 onChange={(e) => setNameSearch(e.target.value)}
//                 placeholder="Customer Name"
//                 className="w-full sm:w-40 border border-gray-300 rounded-md px-3 py-1.5 text-sm"
//               />
//             </div>

//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:ml-auto w-full">

//               <div className="flex gap-4 items-center">
//                 <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
//                   <input
//                     type="radio"
//                     name="dateMode"
//                     value="single"
//                     checked={dateMode === "single"}
//                     onChange={(e) => setDateMode(e.target.value)}
//                     className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//                   />
//                   Single Date
//                 </label>
//                 <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
//                   <input
//                     type="radio"
//                     name="dateMode"
//                     value="range"
//                     checked={dateMode === "range"}
//                     onChange={(e) => setDateMode(e.target.value)}
//                     className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//                   />
//                   Date Range
//                 </label>
//               </div>
//             </div>

//             {dateMode === "single" && (
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:ml-auto w-full">
//                 <label className="text-xs sm:text-sm text-gray-600">
//                   Search by Date:
//                 </label>
//                 <input
//                   type="date"
//                   value={dateSearch}
//                   onChange={(e) => {
//                     setDateSearch(e.target.value);
//                   }}
//                   className="w-full sm:w-40 border border-gray-300 rounded-md px-3 py-1.5 text-sm"
//                 />
//               </div>
//             )}

//             {dateMode === "range" && (
//               <>
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:ml-auto w-full">
//                   <label className="text-xs sm:text-sm text-gray-600">
//                     Start Date:
//                   </label>
//                   <input
//                     type="date"
//                     max={
//                       rangeDateSearch.dateSearchEnd
//                         ? rangeDateSearch.dateSearchEnd
//                         : ""
//                     }
//                     value={rangeDateSearch.dateSearchStart}
//                     onChange={(e) => {
//                       setRangeDateSearch((prev) => ({
//                         ...prev,
//                         dateSearchStart: e.target.value,
//                       }));
//                     }}
//                     className="w-full sm:w-40 border border-gray-300 rounded-md px-3 py-1.5 text-sm"
//                   />
//                 </div>
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:ml-auto w-full">
//                   <label className="text-xs sm:text-sm text-gray-600">
//                     End Date:
//                   </label>
//                   <input
//                     type="date"
//                     min={
//                       rangeDateSearch.dateSearchStart
//                         ? rangeDateSearch.dateSearchStart
//                         : ""
//                     }
//                     value={rangeDateSearch.dateSearchEnd}
//                     onChange={(e) => {
//                       setRangeDateSearch((prev) => ({
//                         ...prev,
//                         dateSearchEnd: e.target.value,
//                       }));
//                     }}
//                     className="w-full sm:w-40 border border-gray-300 rounded-md px-3 py-1.5 text-sm"
//                   />
//                 </div>
//               </>
//             )}

//             <div className="flex gap-2 justify-start sm:justify-end  w-full">
//               <button
//                 onClick={() => {
//                   // setFilterBtnName("filter");
//                   setFilterToggler(!filterToggler);
//                 }}
//                 className="flex-1 sm:flex-none bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
//                 type="button"
//               >
//                 Filter
//               </button>
//               <button
//                 onClick={() => {
//                   setNameSearch("");
//                   setDateSearch("");
//                   setRangeDateSearch({
//                     dateSearchStart: "",
//                     dateSearchEnd: "",
//                   });
//                   // setFilterBtnName("clear");
//                   setFilterToggler(!filterToggler);
//                 }}
//                 className="flex-1 sm:flex-none bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
//                 type="button"
//               >
//                 Clear
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-xs sm:text-sm border-collapse">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left w-8">

//                 </th>
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
//                   Type
//                 </th>
//                 <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
//                   Return
//                 </th>
//                 <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
//                   Refund
//                 </th>
//                 <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {salesReturns.length > 0 ? (
//                 salesReturns.map((salesReturn, index) => (
//                   <React.Fragment key={index}>
//                     <tr
//                       onClick={(e) => {
//                         if (e.target.tagName === "BUTTON" || e.target.closest("button")) return;
//                         navigate("/sales-return-statement", { state: salesReturn });
//                       }}
//                       className="hover:bg-gray-50 cursor-pointer"
//                     >
//                       <td className="border px-2 py-1 sm:px-4 sm:py-2 text-center">
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setExpandedRow(expandedRow === index ? null : index);
//                           }}
//                           className="text-lg font-bold text-blue-600 hover:text-blue-800"
//                         >
//                           {expandedRow === index ? "−" : "+"}
//                         </button>
//                       </td>
//                       <td className="border px-2 py-1 sm:px-4 sm:py-2">
//                         {new Date(salesReturn.createdAt)
//                           .toLocaleDateString("en-GB")
//                           .replaceAll("/", "-")}
//                       </td>
//                       <td className="border px-2 py-1 sm:px-4 sm:py-2 text-center">
//                         {salesReturn.memo}
//                       </td>
//                       <td className="border px-2 py-1 sm:px-4 sm:py-2">
//                         {salesReturn.customerName}
//                       </td>
//                       <td className="border px-2 py-1 sm:px-4 sm:py-2">
//                         {salesReturn.returnType === "product" && (
//                           <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
//                             Product
//                           </span>
//                         )}
//                         {salesReturn.returnType === "cash" && (
//                           <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
//                             Cash
//                           </span>
//                         )}
//                       </td>
//                       <td className="border px-2 py-1 sm:px-4 sm:py-2 text-red-600">
//                         ৳ {salesReturn.totalReturnValue}
//                       </td>
//                       <td className="border px-2 py-1 sm:px-4 sm:py-2 text-green-600">
//                         ৳ {salesReturn.paid}
//                       </td>
//                       <td className="border px-2 py-1 sm:px-4 sm:py-2">
//                         <div className="flex gap-1">
//                           <Link
//                             to={
//                               salesReturn.due > 0
//                                 ? `/sales-return/${salesReturn._id}/exchange-due`
//                                 : `#`
//                             }
//                             className={` text-xs  text-white px-2 py-1 rounded  ${salesReturn.due > 0 ? "cursor-pointer bg-green-600 hover:bg-green-700" : "bg-green-500 cursor-not-allowed"}`}
//                           >
//                             Exchange
//                           </Link>

//                           <Link
//                             to={
//                               salesReturn.due > 0
//                                 ? `/sales-return/${salesReturn._id}/edit-due`
//                                 : `#`
//                             }
//                             className={` text-xs  text-white px-2 py-1 rounded  ${salesReturn.due > 0 ? "cursor-pointer bg-blue-600 hover:bg-blue-700" : "bg-blue-500 cursor-not-allowed"}`}
//                           >
//                             Cash Refund
//                           </Link>

//                           <Link
//                             to="/invoice-sales-return"
//                             className="cursor-pointer text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700"
//                           >
//                             Print
//                           </Link>
//                         </div>
//                       </td>
//                     </tr>

//                     {/* Expanded Row - Products Details */}
//                     {expandedRow === index && (
//                       <tr className="bg-blue-50">
//                         <td colSpan={8} className="border px-4 py-4">
//                           <div className="space-y-4">
//                             {/* RETURNED PRODUCTS */}
//                             <div>
//                               <h4 className="font-semibold text-red-700 mb-2 text-sm">
//                                 📦 Returned Products (From Customer):
//                               </h4>
//                               <div className="overflow-x-auto bg-white rounded border border-red-200">
//                                 <table className="min-w-full text-xs">
//                                   <thead className="bg-red-100">
//                                     <tr>
//                                       <th className="border px-2 py-1 text-left">
//                                         Product Name
//                                       </th>
//                                       <th className="border px-2 py-1 text-center">
//                                         Return Qty
//                                       </th>
//                                       <th className="border px-2 py-1 text-center">
//                                         Qty (KG)
//                                       </th>
//                                       <th className="border px-2 py-1 text-center">
//                                         Return Price
//                                       </th>
//                                       <th className="border px-2 py-1 text-center">
//                                         Amount
//                                       </th>
//                                     </tr>
//                                   </thead>
//                                   <tbody>
//                                     {salesReturn.products.length > 0 ? (
//                                       salesReturn.products.map(
//                                         (product, idx) => (
//                                           <tr
//                                             key={idx}
//                                             className="border-t hover:bg-red-50"
//                                           >
//                                             <td className="border px-2 py-1">
//                                               {product.productName}
//                                             </td>
//                                             <td className="border px-2 py-1 text-center">
//                                               {product.returnQuantity}
//                                             </td>
//                                             <td className="border px-2 py-1 text-center">
//                                               {product.returnQtyInKg}
//                                             </td>
//                                             <td className="border px-2 py-1 text-center">
//                                               ৳ {product.returnPrice}
//                                             </td>
//                                             <td className="border px-2 py-1 text-center font-semibold text-red-600">
//                                               ৳{" "}
//                                               {new Decimal(
//                                                 Number(product.lineTotal),
//                                               ).toFixed(2)}
//                                             </td>
//                                           </tr>
//                                         ),
//                                       )
//                                     ) : (
//                                       <tr>
//                                         <td colSpan={5} className="border px-2 py-2 text-center text-gray-500">
//                                           No products
//                                         </td>
//                                       </tr>
//                                     )}
//                                   </tbody>
//                                 </table>
//                               </div>
//                             </div>

//                             {/* EXCHANGE PRODUCTS (if product exchange) */}
//                             {salesReturn.returnType === "product" && (
//                               <div>
//                                 <h4 className="font-semibold text-green-700 mb-2 text-sm">
//                                   🎁 Exchange Products (To Customer):
//                                 </h4>
//                                 <div className="overflow-x-auto bg-white rounded border border-green-200">
//                                   <table className="min-w-full text-xs">
//                                     <thead className="bg-green-100">
//                                       <tr>
//                                         <th className="border px-2 py-1 text-left">
//                                           Product Name
//                                         </th>
//                                         <th className="border px-2 py-1 text-center">
//                                           Qty
//                                         </th>
//                                         <th className="border px-2 py-1 text-center">
//                                           Qty (KG)
//                                         </th>
//                                         <th className="border px-2 py-1 text-center">
//                                           Unit Price
//                                         </th>
//                                         <th className="border px-2 py-1 text-center">
//                                           Amount
//                                         </th>
//                                       </tr>
//                                     </thead>
//                                     <tbody>
//                                       {salesReturn.exchangeProducts.length >
//                                       0 ? (
//                                         salesReturn.exchangeProducts.map(
//                                           (product, idx) => (
//                                             <tr
//                                               key={idx}
//                                               className="border-t hover:bg-green-50"
//                                             >
//                                               <td className="border px-2 py-1">
//                                                 {product.productName}
//                                               </td>
//                                               <td className="border px-2 py-1 text-center">
//                                                 {product.quantity}
//                                               </td>
//                                               <td className="border px-2 py-1 text-center">
//                                                 {product.qtyInKg}
//                                               </td>
//                                               <td className="border px-2 py-1 text-center">
//                                                 ৳ {product.unitPrice}
//                                               </td>
//                                               <td className="border px-2 py-1 text-center font-semibold text-green-600">
//                                                 ৳{" "}
//                                                 {new Decimal(
//                                                   Number(product.subTotal),
//                                                 ).toFixed(2)}
//                                               </td>
//                                             </tr>
//                                           ),
//                                         )
//                                       ) : (
//                                         <tr>
//                                           <td colSpan={5} className="border px-2 py-2 text-center text-gray-500">
//                                             No products
//                                           </td>
//                                         </tr>
//                                       )}
//                                     </tbody>
//                                   </table>
//                                 </div>
//                               </div>
//                             )}

//                             {/* CASH REFUND (if cash return) */}
//                             {salesReturn.returnType === "cash" && (
//                               <div className="bg-blue-100 border border-blue-300 rounded p-3">
//                                 <h4 className="font-semibold text-blue-700 mb-2 text-sm">
//                                   💰 Cash Refund Details:
//                                 </h4>
//                                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
//                                   <div>
//                                     <p className="text-gray-600">
//                                       Refund Amount
//                                     </p>
//                                     <p className="font-semibold text-blue-700">
//                                       ৳ {salesReturn.cashRefundAmount}
//                                     </p>
//                                   </div>
//                                   <div>
//                                     <p className="text-gray-600">
//                                       Payment Method
//                                     </p>
//                                     <p className="font-semibold text-blue-700">
//                                       {salesReturn.paymentMethod}
//                                     </p>
//                                   </div>
//                                   <div colSpan={2}>
//                                     <p className="text-gray-600">Notes</p>
//                                     <p className="font-semibold text-blue-700">
//                                       {salesReturn.note || "N/A"}
//                                     </p>
//                                   </div>
//                                 </div>
//                               </div>
//                             )}

//                             {/* SUMMARY */}
//                             <div className="bg-yellow-50 border border-yellow-300 rounded p-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
//                               <div>
//                                 <p className="text-gray-600">Total Return</p>
//                                 <p className="font-semibold text-red-700">
//                                   ৳ {salesReturn.totalReturnValue}
//                                 </p>
//                               </div>
//                               {salesReturn.returnType === "product" && (
//                                 <>
//                                   <div>
//                                     <p className="text-gray-600">
//                                       Exchange Value
//                                     </p>
//                                     <p className="font-semibold text-green-700">
//                                       ৳ {salesReturn.totalExchangeValue}
//                                     </p>
//                                   </div>
//                                   <div>
//                                     <p className="text-gray-600">Adjustment</p>
//                                     <p className="font-semibold text-blue-700">
//                                       ৳ {salesReturn.adjustmentAmount}
//                                     </p>
//                                   </div>
//                                 </>
//                               )}
//                               <div>
//                                 <p className="text-gray-600">Due</p>
//                                 <p
//                                   className={`font-semibold ${
//                                     salesReturn.due > 0
//                                       ? "text-orange-600"
//                                       : "text-green-600"
//                                   }`}
//                                 >
//                                   ৳ {salesReturn.due}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={8}
//                     className="text-center text-gray-500 py-6 select-none border"
//                   >
//                     No Sales Return Available.
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
//               } px-2 py-1 border rounded  disabled:opacity-50`}
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
//               }  px-2 py-1 border rounded  disabled:opacity-50`}
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

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   searchProductsforPOS,
//   setProductsBySearchToEmpty,
// } from "../features/product/productSlice";
// import Decimal from "decimal.js";
// import {
//   addSalesReturn,
//   fetchSaleByInvoice,
//   fetchSalesReturns,
//   setSaleSearchedByInvoiceToEmpty,
// } from "../features/SalesReturn/salesReturnSlice";

// const SalesReturn = () => {
//   const { user } = useSelector((state) => state.auth);
//   const {
//     salesReturns,
//     saleSearchedByInvoice,
//     toggle,
//     invoiceLoading,
//     page,
//     pages,
//   } = useSelector((state) => state.salesReturn);

//   const [returnType, setReturnType] = useState("product");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Date Filter
//   const [dateMode, setDateMode] = useState("single");
//   const [dateSearch, setDateSearch] = useState("");
//   const [rangeDateSearch, setRangeDateSearch] = useState({
//     dateSearchStart: "",
//     dateSearchEnd: "",
//   });

//   const [currentPage, setCurrentPage] = useState(page);
//   const [sortOrder, setSortOrder] = useState(-1);
//   const [nameSearch, setNameSearch] = useState("");
//   const [filterToggler, setFilterToggler] = useState(false);
//   const [expandedRow, setExpandedRow] = useState(null);

//   const [data, setData] = useState({
//     invoiceNo: "",
//     date: "",
//   });
//   const [cashDetails, setCashDetails] = useState({
//     cashRefundAmount: "",
//     paymentMethod: "Cash",
//     note: "",
//   });
//   const [originalSaleProducts, setOriginalSaleProducts] = useState([]);

//   // Product Search
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const { productsBySearchforPOS } = useSelector((state) => state.product);
//   const [searchValue, setSearchValue] = useState("");

//   const handleSaleLoad = async () => {
//     if (!data.invoiceNo) {
//       alert("Enter an invoice number!");
//       return;
//     }
//     dispatch(fetchSaleByInvoice({ invoiceNo: data.invoiceNo }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!saleSearchedByInvoice) return;

//     try {
//       const now = new Date();
//       const newOriginalProducts = originalSaleProducts.map((p) => ({
//         productId: p.productId,
//         productName: p.productName,
//         saleQuantity: Number(p.quantity),
//         salePrice: Number(p.sellPrice),
//         subTotal: Number(p.subTotal),
//         returnQuantity: Number(p.returnQuantity),
//         returnQtyInKg: Number(p.returnQtyInKg),
//         returnPrice: Number(p.returnPrice),
//         lineTotal: Number(p.lineTotal),
//       }));

//       let newExchangeProducts = [];
//       if (returnType === "product") {
//         newExchangeProducts = selectedProducts.map((p) => ({
//           productId: p._id,
//           productName: p.name,
//           quantity: Number(p.qty),
//           unitPrice: Number(p.newSellPrice),
//           subTotal: Number(new Decimal(Number(p.newSellPrice)).mul(new Decimal(Number(p.qty)))),
//         }));
//       }

//       let due = 0;
//       let paid = 0;
//       if (returnType === "product") {
//         paid = totalExchangeValue.greaterThan(totalReturnValue)
//           ? Number(totalReturnValue.toFixed(4))
//           : Number(totalExchangeValue.toFixed(4));
//         due = adjustmentAmount.lessThan(new Decimal(0))
//           ? 0
//           : Number(adjustmentAmount.toFixed(4));
//       } else {
//         paid = new Decimal(Number(cashDetails.cashRefundAmount)).greaterThan(totalReturnValue)
//           ? Number(totalReturnValue.toFixed(4))
//           : Number(cashDetails.cashRefundAmount);
//         const temp = totalReturnValue.minus(new Decimal(Number(cashDetails.cashRefundAmount)));
//         due = temp.lessThan(new Decimal(0)) ? 0 : Number(temp.toFixed(4));
//       }

//       const salesReturnData = {
//         memo: saleSearchedByInvoice.invoiceNo.toString(),
//         customerId: saleSearchedByInvoice.customerId,
//         customerName: saleSearchedByInvoice.customerName,
//         address: saleSearchedByInvoice.address,
//         customerEmail: saleSearchedByInvoice.customerEmail,
//         customerPhone: saleSearchedByInvoice.customerPhone,
//         userId: user._id,
//         salesId: saleSearchedByInvoice._id,
//         returnType,
//         products: newOriginalProducts,
//         exchangeProducts: newExchangeProducts,
//         totalReturnValue: Number(totalReturnValue.toFixed(4)),
//         due,
//         paid,
//         totalExchangeValue: returnType === "product" ? Number(totalExchangeValue.toFixed(4)) : 0,
//         adjustmentAmount: returnType === "product" ? Number(adjustmentAmount.toFixed(4)) : 0,
//         cashRefundAmount: returnType === "cash" ? Number(cashDetails.cashRefundAmount) : 0,
//         paymentMethod: returnType === "cash" ? cashDetails.paymentMethod : "",
//         note: returnType === "cash" ? cashDetails.note : "",
//         createdAt: data.date,
//         issuedAt: now,
//       };

//       await dispatch(addSalesReturn(salesReturnData)).unwrap();

//       setData({ invoiceNo: "", date: "" });
//       setCashDetails({ cashRefundAmount: "", paymentMethod: "Cash", note: "" });
//       setSelectedProducts([]);
//       dispatch(setSaleSearchedByInvoiceToEmpty());
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleSearchOnChange = (e) => {
//     setSearchValue(e.target.value);
//     if (e.target.value) {
//       dispatch(searchProductsforPOS(e.target.value));
//     } else {
//       dispatch(setProductsBySearchToEmpty());
//     }
//   };

//   const handleSearchOnClick = (pid) => {
//     let productToAdd = productsBySearchforPOS.find((product) => product._id === pid);
//     if (productToAdd) {
//       const foundProduct = selectedProducts.find((product) => product._id === productToAdd._id);
//       if (!foundProduct) {
//         productToAdd = {
//           ...productToAdd,
//           qty: 1,
//           newSellPrice: productToAdd.sellPrice,
//         };
//         setSelectedProducts([...selectedProducts, productToAdd]);
//       }
//     }
//     dispatch(setProductsBySearchToEmpty());
//     setSearchValue("");
//   };

//   const handleDeleteProduct = (pid) => {
//     setSelectedProducts((prev) => prev.filter((p) => p._id !== pid));
//   };

//   const totalExchangeValue = selectedProducts.length > 0
//     ? selectedProducts.reduce((acc, product) => acc.plus(new Decimal(Number(product.qty)).mul(new Decimal(Number(product.newSellPrice)))), new Decimal(0))
//     : new Decimal(0);

//   const totalSaleValue = originalSaleProducts.length > 0
//     ? originalSaleProducts.reduce((acc, product) => acc.plus(new Decimal(Number(product.quantity)).mul(new Decimal(Number(product.sellPrice)))), new Decimal(0))
//     : new Decimal(0);

//   const totalReturnValue = originalSaleProducts.length > 0
//     ? originalSaleProducts.reduce((acc, product) => acc.plus(new Decimal(Number(product.lineTotal))), new Decimal(0))
//     : new Decimal(0);

//   const adjustmentAmount = totalReturnValue.minus(totalExchangeValue);

//   useEffect(() => {
//     if (saleSearchedByInvoice?.products?.length > 0) {
//       const productsToAdd = saleSearchedByInvoice.products.map((sale) => ({
//         ...sale,
//         returnPrice: sale.sellPrice,
//         returnQuantity: "",
//         returnQtyInKg: "",
//         lineTotal: "",
//       }));
//       setOriginalSaleProducts(productsToAdd);
//     }
//   }, [saleSearchedByInvoice]);

//   useEffect(() => {
//     if (user) {
//       if (dateMode === "single") {
//         dispatch(fetchSalesReturns({ dateMode, dateSearch, nameSearch, page: currentPage, order: sortOrder }));
//       } else {
//         dispatch(fetchSalesReturns({
//           dateMode,
//           dateSearchStart: rangeDateSearch.dateSearchStart,
//           dateSearchEnd: rangeDateSearch.dateSearchEnd,
//           nameSearch,
//           page: currentPage,
//           order: sortOrder,
//         }));
//       }
//     }
//   }, [dispatch, user, toggle, filterToggler, sortOrder, currentPage, dateMode, dateSearch, rangeDateSearch, nameSearch]);

//   useEffect(() => {
//     dispatch(setProductsBySearchToEmpty());
//     dispatch(setSaleSearchedByInvoiceToEmpty());
//   }, [dispatch]);

//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-slate-50 p-3 sm:p-4 md:p-6 font-sans">
//       <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Sales Return Entry</h1>

//       <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
//         {saleSearchedByInvoice ? null : (
//           <div className="mb-4 flex items-start gap-2 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md text-sm">
//             <span className="font-semibold">নির্দেশনা:</span>
//             <span>সেলস রিটার্ন তৈরি করার জন্য ইনভয়েস নম্বর লিখে <strong>লোড</strong> বাটনে চাপ দিন।</span>
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${saleSearchedByInvoice ? "mb-4" : ""}`}>
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 value={data.invoiceNo}
//                 onChange={(e) => setData((prev) => ({ ...prev, invoiceNo: e.target.value }))}
//                 placeholder="Enter Invoice Number"
//                 className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={handleSaleLoad}
//                 disabled={invoiceLoading}
//                 className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed"
//               >
//                 {invoiceLoading ? "Loading..." : "Load"}
//               </button>
//             </div>
//             {saleSearchedByInvoice && (
//               <div>
//                 <input
//                   type="date"
//                   value={data.date}
//                   onChange={(e) => setData((prev) => ({ ...prev, date: e.target.value }))}
//                   className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
//                   required
//                 />
//               </div>
//             )}
//           </div>

//           {saleSearchedByInvoice && (
//             <>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 mb-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Customer Name</label>
//                   <input type="text" value={saleSearchedByInvoice.customerName} disabled className="block w-full px-3 py-1.5 border border-gray-300 bg-gray-200 text-gray-700 rounded-sm text-sm" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Address</label>
//                   <input type="text" value={saleSearchedByInvoice.address} disabled className="block w-full px-3 py-1.5 border border-gray-300 bg-gray-200 text-gray-700 rounded-sm text-sm" />
//                 </div>
//               </div>

//               {/* Original Sale Products */}
//               <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
//                 <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
//                   Original Sale Products (Memo: #{saleSearchedByInvoice.invoiceNo})
//                   <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">Auto Loaded</span>
//                 </h3>

//                 {originalSaleProducts.map((product, index) => (
//                   <div key={index} className="grid grid-cols-1 md:grid-cols-8 gap-3 mb-3 items-end bg-white p-3 rounded border border-blue-100">
//                     <div className="md:col-span-2">
//                       <label className="block text-xs text-gray-600 mb-1">Product Name</label>
//                       <input type="text" value={product.productName} disabled className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm" />
//                     </div>
//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1">Sale Qty</label>
//                       <input type="number" value={product.availableReturnQty} disabled className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm" />
//                     </div>
//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1">Sale Price</label>
//                       <input type="number" value={product.sellPrice} disabled className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm" />
//                     </div>
//                     <div>
//                       <label className="block text-xs mb-1 text-red-600">Return Price</label>
//                       <input type="number" value={product.returnPrice} onChange={(e) => {
//                         setOriginalSaleProducts((prev) => prev.map((p, i) => i === index ? { ...p, returnPrice: e.target.value, lineTotal: Number(new Decimal(Number(p.returnQuantity)).mul(Number(e.target.value))) } : p));
//                       }} step="any" className="w-full px-3 py-2 border border-red-400 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" required />
//                     </div>
//                     <div>
//                       <label className="block text-xs mb-1 text-red-600">Return Qty</label>
//                       <input type="number" min={1} max={product.availableReturnQty} value={product.returnQuantity} onChange={(e) => {
//                         setOriginalSaleProducts((prev) => prev.map((p, i) => i === index ? { ...p, returnQuantity: e.target.value, lineTotal: Number(new Decimal(Number(p.returnPrice)).mul(Number(e.target.value))) } : p));
//                       }} step="any" className="w-full px-3 py-2 border border-red-400 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" required />
//                     </div>
//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1">Qty (kg)</label>
//                       <input type="number" value={product.returnQtyInKg} onChange={(e) => setOriginalSaleProducts((prev) => prev.map((p, i) => i === index ? { ...p, returnQtyInKg: e.target.value } : p))} step="any" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
//                     </div>
//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1">Line Total</label>
//                       <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-red-50 text-red-700 font-semibold text-sm">
//                         ৳ {new Decimal(Number(product.lineTotal)).toFixed(2)}
//                       </div>
//                     </div>
//                     {originalSaleProducts.length > 1 && (
//                       <button type="button" onClick={() => setOriginalSaleProducts((prev) => prev.filter((_, i) => i !== index))} className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm h-fit mt-5 cursor-pointer">×</button>
//                     )}
//                   </div>
//                 ))}

//                 <div className="border-t border-blue-200 pt-3 mt-3 flex justify-end gap-6 text-sm">
//                   <span className="text-blue-800">Total Sale: <strong>৳ {totalSaleValue.toFixed(2)}</strong></span>
//                   <span className="text-red-600 font-semibold text-lg">Total Return Value: <strong>৳ {totalReturnValue.toFixed(2)}</strong></span>
//                 </div>
//               </div>

//               {/* Return Type */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div onClick={() => setReturnType("product")} className={`p-4 rounded-lg border-2 cursor-pointer ${returnType === "product" ? "border-green-500 bg-green-50" : "border-gray-200 bg-gray-50"}`}>
//                   <label className="flex items-center gap-2 cursor-pointer">
//                     <input type="radio" checked={returnType === "product"} onChange={() => setReturnType("product")} className="w-4 h-4 text-green-600" />
//                     <span className="font-medium text-gray-700">Refund by Product (Exchange)</span>
//                   </label>
//                 </div>
//                 <div onClick={() => setReturnType("cash")} className={`p-4 rounded-lg border-2 cursor-pointer ${returnType === "cash" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50"}`}>
//                   <label className="flex items-center gap-2 cursor-pointer">
//                     <input type="radio" checked={returnType === "cash"} onChange={() => setReturnType("cash")} className="w-4 h-4 text-blue-600" />
//                     <span className="font-medium text-gray-700">Refund by Cash (Money Back)</span>
//                   </label>
//                 </div>
//               </div>

//               {/* Exchange Products */}
//               {returnType === "product" && (
//                 <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
//                   <h3 className="text-sm font-semibold text-green-800 mb-3">New Exchange Products</h3>
//                   <div className="grid grid-cols-2 gap-x-6 mb-4">
//                     <div>
//                       <label className="block text-sm text-gray-600 font-medium mb-1">Search Product</label>
//                       <input type="search" value={searchValue} onChange={handleSearchOnChange} placeholder="Search Products..." className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm" />
//                       <div className={`${productsBySearchforPOS.length > 0 ? "shadow-md px-4 py-2 rounded max-h-60 overflow-y-scroll" : ""}`}>
//                         {productsBySearchforPOS.map((product) => (
//                           <div key={product._id} onClick={() => handleSearchOnClick(product._id)} className="px-2 py-1 border-b border-gray-300 cursor-pointer hover:bg-gray-100">
//                             {product.name}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>

//                   {selectedProducts.map((product, index) => (
//                     <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-3 items-end">
//                       <div className="md:col-span-2">
//                         <label className="block text-xs text-gray-600 mb-1">Product Name</label>
//                         <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800">{product.name}</div>
//                       </div>
//                       <div>
//                         <label className="block text-xs text-gray-600 mb-1">Available</label>
//                         <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">{product.quantity}</div>
//                       </div>
//                       <div>
//                         <label className="block text-xs text-gray-600 mb-1">Quantity</label>
//                         <input type="number" min={1} max={product.quantity} value={product.qty} onChange={(e) => setSelectedProducts(prev => prev.map((p, i) => i === index ? { ...p, qty: e.target.value } : p))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" required />
//                       </div>
//                       <div>
//                         <label className="block text-xs text-gray-600 mb-1">Unit Price</label>
//                         <input type="number" value={product.newSellPrice} onChange={(e) => setSelectedProducts(prev => prev.map((p, i) => i === index ? { ...p, newSellPrice: e.target.value } : p))} step="any" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" required />
//                       </div>
//                       <div className="flex gap-2">
//                         <div className="flex-1">
//                           <label className="block text-xs text-gray-600 mb-1">Total</label>
//                           <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-green-100 text-green-700 font-semibold text-sm">
//                             ৳ {new Decimal(Number(product.newSellPrice)).mul(Number(product.qty)).toFixed(2)}
//                           </div>
//                         </div>
//                         <button type="button" onClick={() => handleDeleteProduct(product._id)} className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm h-fit mt-5 cursor-pointer">×</button>
//                       </div>
//                     </div>
//                   ))}

//                   <div className="border-t border-green-200 pt-3 mt-3 text-right">
//                     <span className="text-green-800 font-semibold text-lg">Total Exchange Value: ৳ {totalExchangeValue.toFixed(2)}</span>
//                   </div>
//                 </div>
//               )}

//               {/* Cash Section */}
//               {returnType === "cash" && (
//                 <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
//                   <h3 className="text-sm font-semibold text-blue-800 mb-3">Cash Refund Details</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1">Cash Refund Amount</label>
//                       <input type="number" value={cashDetails.cashRefundAmount} onChange={(e) => setCashDetails(prev => ({ ...prev, cashRefundAmount: e.target.value }))} className="w-full px-4 py-2 border border-blue-400 rounded-md text-sm font-semibold" required />
//                     </div>
//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1">Payment Method</label>
//                       <select value={cashDetails.paymentMethod} onChange={(e) => setCashDetails(prev => ({ ...prev, paymentMethod: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm">
//                         <option value="Cash">Cash</option>
//                         <option value="Bank Transfer">Bank Transfer</option>
//                         <option value="Mobile Banking">Mobile Banking</option>
//                         <option value="Check">Check</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1">Reference/Note</label>
//                       <input type="text" value={cashDetails.note} onChange={(e) => setCashDetails(prev => ({ ...prev, note: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm" />
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Summary */}
//               <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-200">
//                 <h3 className="text-sm font-semibold text-yellow-800 mb-3">Summary</h3>
//                 {returnType === "product" ? (
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="text-center p-3 bg-white rounded border border-red-200">
//                       <div className="text-xs text-gray-600 mb-1">Return Value</div>
//                       <div className="text-xl font-bold text-red-600">৳ {totalReturnValue.toFixed(2)}</div>
//                     </div>
//                     <div className="text-center p-3 bg-white rounded border border-green-200">
//                       <div className="text-xs text-gray-600 mb-1">Exchange Value</div>
//                       <div className="text-xl font-bold text-green-600">৳ {totalExchangeValue.toFixed(2)}</div>
//                     </div>
//                     <div className="text-center p-3 bg-white rounded border border-blue-200">
//                       <div className="text-xs text-gray-600 mb-1">Adjustment</div>
//                       <div className="text-xl font-bold text-blue-600">৳ {adjustmentAmount.toFixed(2)}</div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="text-center p-3 bg-white rounded border border-red-200">
//                       <div className="text-xs text-gray-600 mb-1">Total Return Value</div>
//                       <div className="text-xl font-bold text-red-600">৳ {totalReturnValue.toFixed(2)}</div>
//                     </div>
//                     <div className="text-center p-3 bg-white rounded border border-blue-200">
//                       <div className="text-xs text-gray-600 mb-1">Cash Refund Amount</div>
//                       <div className="text-xl font-bold text-blue-600">৳ {Number(cashDetails.cashRefundAmount || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="flex flex-wrap gap-3">
//                 <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">Add Return</button>
//                 <button type="button" onClick={() => {
//                   setData({ invoiceNo: "", date: "" });
//                   setCashDetails({ cashRefundAmount: "", paymentMethod: "Cash", note: "" });
//                   setSelectedProducts([]);
//                   dispatch(setSaleSearchedByInvoiceToEmpty());
//                 }} className="px-6 py-2 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600">Reset</button>
//               </div>
//             </>
//           )}
//         </form>
//       </div>

//       {/* ==================== SALES RETURN REPORT TABLE ==================== */}
//       <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
//         <h2 className="text-lg sm:text-xl font-semibold mb-4">Sales Return Report</h2>

//         {/* Filter Section */}
//         <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-5">
//           <select
//             value={sortOrder}
//             onChange={(e) => setSortOrder(e.target.value)}
//             className="border border-gray-300 bg-white rounded-md px-4 py-2 text-sm"
//           >
//             <option value="1">Oldest First</option>
//             <option value="-1">Newest First</option>
//           </select>

//           <div className="flex flex-wrap gap-4 items-end">
//             <div>
//               <label className="block text-xs text-gray-600 mb-1">Customer Name</label>
//               <input
//                 type="text"
//                 value={nameSearch}
//                 onChange={(e) => setNameSearch(e.target.value)}
//                 placeholder="Customer Name"
//                 className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64"
//               />
//             </div>

//             <div className="flex items-center gap-4">
//               <label className="flex items-center gap-2 text-sm cursor-pointer">
//                 <input
//                   type="radio"
//                   name="dateMode"
//                   value="single"
//                   checked={dateMode === "single"}
//                   onChange={(e) => setDateMode(e.target.value)}
//                 />
//                 Single Date
//               </label>
//               <label className="flex items-center gap-2 text-sm cursor-pointer">
//                 <input
//                   type="radio"
//                   name="dateMode"
//                   value="range"
//                   checked={dateMode === "range"}
//                   onChange={(e) => setDateMode(e.target.value)}
//                 />
//                 Date Range
//               </label>
//             </div>

//             {dateMode === "single" && (
//               <div>
//                 <label className="block text-xs text-gray-600 mb-1">Date</label>
//                 <input
//                   type="date"
//                   value={dateSearch}
//                   onChange={(e) => setDateSearch(e.target.value)}
//                   className="border border-gray-300 rounded-md px-3 py-2 text-sm"
//                 />
//               </div>
//             )}

//             {dateMode === "range" && (
//               <div className="flex gap-3">
//                 <div>
//                   <label className="block text-xs text-gray-600 mb-1">Start Date</label>
//                   <input
//                     type="date"
//                     value={rangeDateSearch.dateSearchStart}
//                     onChange={(e) => setRangeDateSearch((prev) => ({ ...prev, dateSearchStart: e.target.value }))}
//                     className="border border-gray-300 rounded-md px-3 py-2 text-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs text-gray-600 mb-1">End Date</label>
//                   <input
//                     type="date"
//                     value={rangeDateSearch.dateSearchEnd}
//                     onChange={(e) => setRangeDateSearch((prev) => ({ ...prev, dateSearchEnd: e.target.value }))}
//                     className="border border-gray-300 rounded-md px-3 py-2 text-sm"
//                   />
//                 </div>
//               </div>
//             )}

//             <div className="flex gap-2">
//               <button
//                 onClick={() => setFilterToggler(!filterToggler)}
//                 className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded text-sm"
//                 type="button"
//               >
//                 Filter
//               </button>
//               <button
//                 onClick={() => {
//                   setNameSearch("");
//                   setDateSearch("");
//                   setRangeDateSearch({ dateSearchStart: "", dateSearchEnd: "" });
//                   setFilterToggler(!filterToggler);
//                 }}
//                 className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded text-sm"
//                 type="button"
//               >
//                 Clear
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm border-collapse">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="border px-4 py-3 text-left">Date</th>
//                 <th className="border px-4 py-3 text-left">Memo</th>
//                 <th className="border px-4 py-3 text-left">Customer</th>
//                 <th className="border px-4 py-3 text-center">Product Details</th>
//                 <th className="border px-4 py-3 text-left">Type</th>
//                 <th className="border px-4 py-3 text-left">Return</th>
//                 <th className="border px-4 py-3 text-left">Refund</th>
//                 <th className="border px-4 py-3 text-center">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {salesReturns.length > 0 ? (
//                 salesReturns.map((salesReturn, index) => (
//                   <React.Fragment key={index}>
//                     <tr className="hover:bg-gray-50">
//                       <td className="border px-4 py-3">
//                         {new Date(salesReturn.createdAt).toLocaleDateString("en-GB").replaceAll("/", "-")}
//                       </td>
//                       <td className="border px-4 py-3 font-medium">{salesReturn.memo}</td>
//                       <td
//                         className="border px-4 py-3 cursor-pointer hover:text-blue-600 hover:underline"
//                         onClick={() => navigate("/sales-return-statement", { state: salesReturn })}
//                       >
//                         {salesReturn.customerName}
//                       </td>
//                       <td className="border px-4 py-3 text-center">
//                         <button
//                           onClick={() => setExpandedRow(expandedRow === index ? null : index)}
//                           className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
//                         >
//                           {expandedRow === index ? "−" : "+"}
//                         </button>
//                       </td>
//                       <td className="border px-4 py-3">
//                         {salesReturn.returnType === "product" ? (
//                           <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-xs">Product</span>
//                         ) : (
//                           <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs">Cash</span>
//                         )}
//                       </td>
//                       <td className="border px-4 py-3 text-red-600 font-semibold">৳ {salesReturn.totalReturnValue}</td>
//                       <td className="border px-4 py-3 text-green-600 font-semibold">৳ {salesReturn.paid}</td>
//                       <td className="border px-4 py-3 text-center">
//                         <div className="flex gap-2 justify-center flex-wrap">
//                           <Link
//                             to={salesReturn.due > 0 ? `/sales-return/${salesReturn._id}/exchange-due` : "#"}
//                             className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded"
//                           >
//                             Exchange
//                           </Link>
//                           <Link
//                             to={salesReturn.due > 0 ? `/sales-return/${salesReturn._id}/edit-due` : "#"}
//                             className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded"
//                           >
//                             Cash
//                           </Link>
//                           <button
//                             onClick={() => navigate("/invoice-sales-return", { state: salesReturn })}
//                             className="text-xs bg-gray-700 hover:bg-gray-800 text-white px-3 py-1.5 rounded"
//                           >
//                             Print
//                           </button>
//                         </div>
//                       </td>
//                     </tr>

//                     {/* Expanded Row - Product Details */}
//                     {expandedRow === index && (
//                       <tr className="bg-blue-50">
//                         <td colSpan={8} className="border p-5">
//                           <div className="space-y-6">
//                             {/* Returned Products */}
//                             <div>
//                               <h4 className="font-semibold text-red-700 mb-2 text-sm">📦 Returned Products (From Customer):</h4>
//                               <div className="overflow-x-auto bg-white rounded border border-red-200">
//                                 <table className="min-w-full text-xs">
//                                   <thead className="bg-red-100">
//                                     <tr>
//                                       <th className="border px-2 py-1 text-left">Product Name</th>
//                                       <th className="border px-2 py-1 text-center">Return Qty</th>
//                                       <th className="border px-2 py-1 text-center">Qty (KG)</th>
//                                       <th className="border px-2 py-1 text-center">Return Price</th>
//                                       <th className="border px-2 py-1 text-center">Amount</th>
//                                     </tr>
//                                   </thead>
//                                   <tbody>
//                                     {salesReturn.products.map((product, idx) => (
//                                       <tr key={idx} className="border-t hover:bg-red-50">
//                                         <td className="border px-2 py-1">{product.productName}</td>
//                                         <td className="border px-2 py-1 text-center">{product.returnQuantity}</td>
//                                         <td className="border px-2 py-1 text-center">{product.returnQtyInKg}</td>
//                                         <td className="border px-2 py-1 text-center">৳ {product.returnPrice}</td>
//                                         <td className="border px-2 py-1 text-center font-semibold text-red-600">
//                                           ৳ {new Decimal(Number(product.lineTotal)).toFixed(2)}
//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </tbody>
//                                 </table>
//                               </div>
//                             </div>

//                             {/* Exchange Products */}
//                             {salesReturn.returnType === "product" && (
//                               <div>
//                                 <h4 className="font-semibold text-green-700 mb-2 text-sm">🎁 Exchange Products (To Customer):</h4>
//                                 <div className="overflow-x-auto bg-white rounded border border-green-200">
//                                   <table className="min-w-full text-xs">
//                                     <thead className="bg-green-100">
//                                       <tr>
//                                         <th className="border px-2 py-1 text-left">Product Name</th>
//                                         <th className="border px-2 py-1 text-center">Qty</th>
//                                         <th className="border px-2 py-1 text-center">Qty (KG)</th>
//                                         <th className="border px-2 py-1 text-center">Unit Price</th>
//                                         <th className="border px-2 py-1 text-center">Amount</th>
//                                       </tr>
//                                     </thead>
//                                     <tbody>
//                                       {salesReturn.exchangeProducts.map((product, idx) => (
//                                         <tr key={idx} className="border-t hover:bg-green-50">
//                                           <td className="border px-2 py-1">{product.productName}</td>
//                                           <td className="border px-2 py-1 text-center">{product.quantity}</td>
//                                           <td className="border px-2 py-1 text-center">{product.qtyInKg}</td>
//                                           <td className="border px-2 py-1 text-center">৳ {product.unitPrice}</td>
//                                           <td className="border px-2 py-1 text-center font-semibold text-green-600">
//                                             ৳ {new Decimal(Number(product.subTotal)).toFixed(2)}
//                                           </td>
//                                         </tr>
//                                       ))}
//                                     </tbody>
//                                   </table>
//                                 </div>
//                               </div>
//                             )}

//                             {/* Cash Refund Details */}
//                             {salesReturn.returnType === "cash" && (
//                               <div className="bg-blue-100 border border-blue-300 rounded p-4">
//                                 <h4 className="font-semibold text-blue-700 mb-2 text-sm">💰 Cash Refund Details:</h4>
//                                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
//                                   <div>
//                                     <p className="text-gray-600">Refund Amount</p>
//                                     <p className="font-semibold text-blue-700">৳ {salesReturn.cashRefundAmount}</p>
//                                   </div>
//                                   <div>
//                                     <p className="text-gray-600">Payment Method</p>
//                                     <p className="font-semibold text-blue-700">{salesReturn.paymentMethod}</p>
//                                   </div>
//                                   <div>
//                                     <p className="text-gray-600">Note</p>
//                                     <p className="font-semibold text-blue-700">{salesReturn.note || "N/A"}</p>
//                                   </div>
//                                 </div>
//                               </div>
//                             )}

//                             {/* Summary */}
//                             <div className="bg-yellow-50 border border-yellow-300 rounded p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
//                               <div>
//                                 <p className="text-gray-600">Total Return</p>
//                                 <p className="font-semibold text-red-700">৳ {salesReturn.totalReturnValue}</p>
//                               </div>
//                               {salesReturn.returnType === "product" && (
//                                 <>
//                                   <div>
//                                     <p className="text-gray-600">Exchange Value</p>
//                                     <p className="font-semibold text-green-700">৳ {salesReturn.totalExchangeValue}</p>
//                                   </div>
//                                   <div>
//                                     <p className="text-gray-600">Adjustment</p>
//                                     <p className="font-semibold text-blue-700">৳ {salesReturn.adjustmentAmount}</p>
//                                   </div>
//                                 </>
//                               )}
//                               <div>
//                                 <p className="text-gray-600">Due</p>
//                                 <p className={`font-semibold ${salesReturn.due > 0 ? "text-orange-600" : "text-green-600"}`}>
//                                   ৳ {salesReturn.due}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={8} className="text-center py-12 text-gray-500 border">
//                     No Sales Return Available.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {pages && (
//           <div className="flex justify-center items-center mt-6 gap-4 text-sm">
//             <button
//               onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//               disabled={page === 1}
//               className="px-5 py-2 border rounded disabled:opacity-50"
//             >
//               Prev
//             </button>
//             <span>Page {page} of {pages}</span>
//             <button
//               onClick={() => setCurrentPage((p) => Math.min(p + 1, pages))}
//               disabled={page === pages}
//               className="px-5 py-2 border rounded disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SalesReturn;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  searchProductsforPOS,
  setProductsBySearchToEmpty,
} from "../features/product/productSlice";
import Decimal from "decimal.js";
import {
  addSalesReturn,
  fetchSaleByInvoice,
  fetchSalesReturns,
  setSaleSearchedByInvoiceToEmpty,
} from "../features/SalesReturn/salesReturnSlice";

const SalesReturn = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    salesReturns,
    saleSearchedByInvoice,
    toggle,
    invoiceLoading,
    page,
    pages,
  } = useSelector((state) => state.salesReturn);

  const [returnType, setReturnType] = useState("product");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Date Filter
  const [dateMode, setDateMode] = useState("single");
  const [dateSearch, setDateSearch] = useState("");
  const [rangeDateSearch, setRangeDateSearch] = useState({
    dateSearchStart: "",
    dateSearchEnd: "",
  });

  const [currentPage, setCurrentPage] = useState(page);
  const [sortOrder, setSortOrder] = useState(-1);
  const [nameSearch, setNameSearch] = useState("");
  const [filterToggler, setFilterToggler] = useState(false);

  const [data, setData] = useState({ invoiceNo: "", date: "" });
  const [cashDetails, setCashDetails] = useState({
    cashRefundAmount: "",
    paymentMethod: "Cash",
    note: "",
  });
  const [originalSaleProducts, setOriginalSaleProducts] = useState([]);

  // Product Search
  const [selectedProducts, setSelectedProducts] = useState([]);
  const { productsBySearchforPOS } = useSelector((state) => state.product);
  const [searchValue, setSearchValue] = useState("");

  const handleSaleLoad = async () => {
    if (!data.invoiceNo) {
      alert("Enter an invoice number!");
      return;
    }
    dispatch(fetchSaleByInvoice({ invoiceNo: data.invoiceNo }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!saleSearchedByInvoice) return;

    try {
      const now = new Date();
      const newOriginalProducts = originalSaleProducts.map((p) => ({
        productId: p.productId,
        productName: p.productName,
        saleQuantity: Number(p.quantity),
        salePrice: Number(p.sellPrice),
        subTotal: Number(p.subTotal),
        returnQuantity: Number(p.returnQuantity),
        returnQtyInKg: Number(p.returnQtyInKg),
        returnPrice: Number(p.returnPrice),
        lineTotal: Number(p.lineTotal),
      }));

      let newExchangeProducts = [];
      if (returnType === "product") {
        newExchangeProducts = selectedProducts.map((p) => ({
          productId: p._id,
          productName: p.name,
          quantity: Number(p.qty),
          unitPrice: Number(p.newSellPrice),
          subTotal: Number(new Decimal(Number(p.newSellPrice)).mul(new Decimal(Number(p.qty)))),
        }));
      }

      let due = 0;
      let paid = 0;
      if (returnType === "product") {
        paid = totalExchangeValue.greaterThan(totalReturnValue)
          ? Number(totalReturnValue.toFixed(4))
          : Number(totalExchangeValue.toFixed(4));
        due = adjustmentAmount.lessThan(new Decimal(0))
          ? 0
          : Number(adjustmentAmount.toFixed(4));
      } else {
        paid = new Decimal(Number(cashDetails.cashRefundAmount)).greaterThan(totalReturnValue)
          ? Number(totalReturnValue.toFixed(4))
          : Number(cashDetails.cashRefundAmount);
        const temp = totalReturnValue.minus(new Decimal(Number(cashDetails.cashRefundAmount)));
        due = temp.lessThan(new Decimal(0)) ? 0 : Number(temp.toFixed(4));
      }

      const salesReturnData = {
        memo: saleSearchedByInvoice.invoiceNo.toString(),
        customerId: saleSearchedByInvoice.customerId,
        customerName: saleSearchedByInvoice.customerName,
        address: saleSearchedByInvoice.address,
        customerEmail: saleSearchedByInvoice.customerEmail,
        customerPhone: saleSearchedByInvoice.customerPhone,
        userId: user._id,
        salesId: saleSearchedByInvoice._id,
        returnType,
        products: newOriginalProducts,
        exchangeProducts: newExchangeProducts,
        totalReturnValue: Number(totalReturnValue.toFixed(4)),
        due,
        paid,
        totalExchangeValue: returnType === "product" ? Number(totalExchangeValue.toFixed(4)) : 0,
        adjustmentAmount: returnType === "product" ? Number(adjustmentAmount.toFixed(4)) : 0,
        cashRefundAmount: returnType === "cash" ? Number(cashDetails.cashRefundAmount) : 0,
        paymentMethod: returnType === "cash" ? cashDetails.paymentMethod : "",
        note: returnType === "cash" ? cashDetails.note : "",
        createdAt: data.date,
        issuedAt: now,
      };

      await dispatch(addSalesReturn(salesReturnData)).unwrap();

      setData({ invoiceNo: "", date: "" });
      setCashDetails({ cashRefundAmount: "", paymentMethod: "Cash", note: "" });
      setSelectedProducts([]);
      dispatch(setSaleSearchedByInvoiceToEmpty());
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchOnChange = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value) {
      dispatch(searchProductsforPOS(e.target.value));
    } else {
      dispatch(setProductsBySearchToEmpty());
    }
  };

  const handleSearchOnClick = (pid) => {
    let productToAdd = productsBySearchforPOS.find((product) => product._id === pid);
    if (productToAdd) {
      const foundProduct = selectedProducts.find((product) => product._id === productToAdd._id);
      if (!foundProduct) {
        productToAdd = {
          ...productToAdd,
          qty: 1,
          newSellPrice: productToAdd.sellPrice,
        };
        setSelectedProducts([...selectedProducts, productToAdd]);
      }
    }
    dispatch(setProductsBySearchToEmpty());
    setSearchValue("");
  };

  const handleDeleteProduct = (pid) => {
    setSelectedProducts((prev) => prev.filter((p) => p._id !== pid));
  };

  const totalExchangeValue = selectedProducts.reduce(
    (acc, product) => acc.plus(new Decimal(Number(product.qty)).mul(new Decimal(Number(product.newSellPrice)))),
    new Decimal(0)
  );

  const totalSaleValue = originalSaleProducts.reduce(
    (acc, product) => acc.plus(new Decimal(Number(product.quantity)).mul(new Decimal(Number(product.sellPrice)))),
    new Decimal(0)
  );

  const totalReturnValue = originalSaleProducts.reduce(
    (acc, product) => acc.plus(new Decimal(Number(product.lineTotal))),
    new Decimal(0)
  );

  const adjustmentAmount = totalReturnValue.minus(totalExchangeValue);

  useEffect(() => {
    if (saleSearchedByInvoice?.products?.length > 0) {
      const productsToAdd = saleSearchedByInvoice.products.map((sale) => ({
        ...sale,
        returnPrice: sale.sellPrice,
        returnQuantity: "",
        returnQtyInKg: "",
        lineTotal: "",
      }));
      setOriginalSaleProducts(productsToAdd);
    }
  }, [saleSearchedByInvoice]);

  useEffect(() => {
    if (user) {
      if (dateMode === "single") {
        dispatch(fetchSalesReturns({ dateMode, dateSearch, nameSearch, page: currentPage, order: sortOrder }));
      } else {
        dispatch(fetchSalesReturns({
          dateMode,
          dateSearchStart: rangeDateSearch.dateSearchStart,
          dateSearchEnd: rangeDateSearch.dateSearchEnd,
          nameSearch,
          page: currentPage,
          order: sortOrder,
        }));
      }
    }
  }, [dispatch, user, toggle, filterToggler, sortOrder, currentPage, dateMode, dateSearch, rangeDateSearch, nameSearch]);

  useEffect(() => {
    dispatch(setProductsBySearchToEmpty());
    dispatch(setSaleSearchedByInvoiceToEmpty());
  }, [dispatch]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-4 md:p-6 font-sans">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Sales Return Entry</h1>

      {/* Form Section */}
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
        {saleSearchedByInvoice ? null : (
          <div className="mb-4 flex items-start gap-2 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md text-sm">
            <span className="font-semibold">নির্দেশনা:</span>
            <span>সেলস রিটার্ন তৈরি করার জন্য ইনভয়েস নম্বর লিখে <strong>লোড</strong> বাটনে চাপ দিন।</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${saleSearchedByInvoice ? "mb-4" : ""}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={data.invoiceNo}
                onChange={(e) => setData((prev) => ({ ...prev, invoiceNo: e.target.value }))}
                placeholder="Enter Invoice Number"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1"
                required
              />
              <button
                type="button"
                onClick={handleSaleLoad}
                disabled={invoiceLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {invoiceLoading ? "Loading..." : "Load"}
              </button>
            </div>
            {saleSearchedByInvoice && (
              <div>
                <input
                  type="date"
                  value={data.date}
                  onChange={(e) => setData((prev) => ({ ...prev, date: e.target.value }))}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                  required
                />
              </div>
            )}
          </div>

          {saleSearchedByInvoice && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Customer Name</label>
                  <input type="text" value={saleSearchedByInvoice.customerName} disabled className="block w-full px-3 py-1.5 border border-gray-300 bg-gray-200 text-gray-700 rounded-sm text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input type="text" value={saleSearchedByInvoice.address} disabled className="block w-full px-3 py-1.5 border border-gray-300 bg-gray-200 text-gray-700 rounded-sm text-sm" />
                </div>
              </div>

              {/* Original Sale Products */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  Original Sale Products (Memo: #{saleSearchedByInvoice.invoiceNo})
                  <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">Auto Loaded</span>
                </h3>

                {originalSaleProducts.map((product, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-8 gap-3 mb-3 items-end bg-white p-3 rounded border border-blue-100">
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">Product Name</label>
                      <input type="text" value={product.productName} disabled className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Sale Qty</label>
                      <input type="number" value={product.availableReturnQty} disabled className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Sale Price</label>
                      <input type="number" value={product.sellPrice} disabled className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1 text-red-600">Return Price</label>
                      <input type="number" value={product.returnPrice} onChange={(e) => {
                        setOriginalSaleProducts((prev) => prev.map((p, i) => i === index ? { ...p, returnPrice: e.target.value, lineTotal: Number(new Decimal(Number(p.returnQuantity)).mul(Number(e.target.value))) } : p));
                      }} step="any" className="w-full px-3 py-2 border border-red-400 rounded-md text-sm" required />
                    </div>
                    <div>
                      <label className="block text-xs mb-1 text-red-600">Return Qty</label>
                      <input type="number" min={1} max={product.availableReturnQty} value={product.returnQuantity} onChange={(e) => {
                        setOriginalSaleProducts((prev) => prev.map((p, i) => i === index ? { ...p, returnQuantity: e.target.value, lineTotal: Number(new Decimal(Number(p.returnPrice)).mul(Number(e.target.value))) } : p));
                      }} step="any" className="w-full px-3 py-2 border border-red-400 rounded-md text-sm" required />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Qty (kg)</label>
                      <input type="number" value={product.returnQtyInKg} onChange={(e) => setOriginalSaleProducts((prev) => prev.map((p, i) => i === index ? { ...p, returnQtyInKg: e.target.value } : p))} step="any" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Line Total</label>
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-red-50 text-red-700 font-semibold text-sm">
                        ৳ {new Decimal(Number(product.lineTotal)).toFixed(2)}
                      </div>
                    </div>
                    {originalSaleProducts.length > 1 && (
                      <button type="button" onClick={() => setOriginalSaleProducts((prev) => prev.filter((_, i) => i !== index))} className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm h-fit mt-5 cursor-pointer">×</button>
                    )}
                  </div>
                ))}

                <div className="border-t border-blue-200 pt-3 mt-3 flex justify-end gap-6 text-sm">
                  <span className="text-blue-800">Total Sale: <strong>৳ {totalSaleValue.toFixed(2)}</strong></span>
                  <span className="text-red-600 font-semibold text-lg">Total Return Value: <strong>৳ {totalReturnValue.toFixed(2)}</strong></span>
                </div>
              </div>

              {/* Return Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div onClick={() => setReturnType("product")} className={`p-4 rounded-lg border-2 cursor-pointer ${returnType === "product" ? "border-green-500 bg-green-50" : "border-gray-200 bg-gray-50"}`}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={returnType === "product"} onChange={() => setReturnType("product")} className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-gray-700">Refund by Product (Exchange)</span>
                  </label>
                </div>
                <div onClick={() => setReturnType("cash")} className={`p-4 rounded-lg border-2 cursor-pointer ${returnType === "cash" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50"}`}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={returnType === "cash"} onChange={() => setReturnType("cash")} className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-700">Refund by Cash (Money Back)</span>
                  </label>
                </div>
              </div>

              {/* Exchange Products */}
              {returnType === "product" && (
                <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
                  <h3 className="text-sm font-semibold text-green-800 mb-3">New Exchange Products</h3>
                  <div className="grid grid-cols-2 gap-x-6 mb-4">
                    <div>
                      <label className="block text-sm text-gray-600 font-medium mb-1">Search Product</label>
                      <input type="search" value={searchValue} onChange={handleSearchOnChange} placeholder="Search Products..." className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm" />
                      <div className={`${productsBySearchforPOS.length > 0 ? "shadow-md px-4 py-2 rounded max-h-60 overflow-y-scroll" : ""}`}>
                        {productsBySearchforPOS.map((product) => (
                          <div key={product._id} onClick={() => handleSearchOnClick(product._id)} className="px-2 py-1 border-b border-gray-300 cursor-pointer hover:bg-gray-100">
                            {product.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {selectedProducts.map((product, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-3 items-end">
                      <div className="md:col-span-2">
                        <label className="block text-xs text-gray-600 mb-1">Product Name</label>
                        <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">{product.name}</div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Available</label>
                        <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">{product.quantity}</div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Quantity</label>
                        <input type="number" min={1} max={product.quantity} value={product.qty} onChange={(e) => setSelectedProducts(prev => prev.map((p, i) => i === index ? { ...p, qty: e.target.value } : p))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" required />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Unit Price</label>
                        <input type="number" value={product.newSellPrice} onChange={(e) => setSelectedProducts(prev => prev.map((p, i) => i === index ? { ...p, newSellPrice: e.target.value } : p))} step="any" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" required />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-600 mb-1">Total</label>
                          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-green-100 text-green-700 font-semibold text-sm">
                            ৳ {new Decimal(Number(product.newSellPrice)).mul(Number(product.qty)).toFixed(2)}
                          </div>
                        </div>
                        <button type="button" onClick={() => handleDeleteProduct(product._id)} className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm h-fit mt-5 cursor-pointer">×</button>
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-green-200 pt-3 mt-3 text-right">
                    <span className="text-green-800 font-semibold text-lg">Total Exchange Value: ৳ {totalExchangeValue.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Cash Refund */}
              {returnType === "cash" && (
                <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                  <h3 className="text-sm font-semibold text-blue-800 mb-3">Cash Refund Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Cash Refund Amount</label>
                      <input type="number" value={cashDetails.cashRefundAmount} onChange={(e) => setCashDetails(prev => ({ ...prev, cashRefundAmount: e.target.value }))} className="w-full px-4 py-2 border border-blue-400 rounded-md text-sm font-semibold" required />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Payment Method</label>
                      <select value={cashDetails.paymentMethod} onChange={(e) => setCashDetails(prev => ({ ...prev, paymentMethod: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm">
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Mobile Banking">Mobile Banking</option>
                        <option value="Check">Check</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Reference/Note</label>
                      <input type="text" value={cashDetails.note} onChange={(e) => setCashDetails(prev => ({ ...prev, note: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm" />
                    </div>
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-200">
                <h3 className="text-sm font-semibold text-yellow-800 mb-3">Summary</h3>
                {returnType === "product" ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-white rounded border border-red-200">
                      <div className="text-xs text-gray-600 mb-1">Return Value</div>
                      <div className="text-xl font-bold text-red-600">৳ {totalReturnValue.toFixed(2)}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded border border-green-200">
                      <div className="text-xs text-gray-600 mb-1">Exchange Value</div>
                      <div className="text-xl font-bold text-green-600">৳ {totalExchangeValue.toFixed(2)}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded border border-blue-200">
                      <div className="text-xs text-gray-600 mb-1">Adjustment</div>
                      <div className="text-xl font-bold text-blue-600">৳ {adjustmentAmount.toFixed(2)}</div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white rounded border border-red-200">
                      <div className="text-xs text-gray-600 mb-1">Total Return Value</div>
                      <div className="text-xl font-bold text-red-600">৳ {totalReturnValue.toFixed(2)}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded border border-blue-200">
                      <div className="text-xs text-gray-600 mb-1">Cash Refund Amount</div>
                      <div className="text-xl font-bold text-blue-600">৳ {Number(cashDetails.cashRefundAmount || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">Add Return</button>
                <button type="button" onClick={() => {
                  setData({ invoiceNo: "", date: "" });
                  setCashDetails({ cashRefundAmount: "", paymentMethod: "Cash", note: "" });
                  setSelectedProducts([]);
                  dispatch(setSaleSearchedByInvoiceToEmpty());
                }} className="px-6 py-2 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600">Reset</button>
              </div>
            </>
          )}
        </form>
      </div>

      {/* ==================== SALES RETURN REPORT TABLE ==================== */}
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Sales Return Report</h2>

        {/* Filter Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-5">
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="border border-gray-300 bg-white rounded-md px-4 py-2 text-sm">
            <option value="1">Oldest First</option>
            <option value="-1">Newest First</option>
          </select>

          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Customer Name</label>
              <input type="text" value={nameSearch} onChange={(e) => setNameSearch(e.target.value)} placeholder="Customer Name" className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64" />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="dateMode" checked={dateMode === "single"} onChange={() => setDateMode("single")} /> Single
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="dateMode" checked={dateMode === "range"} onChange={() => setDateMode("range")} /> Range
              </label>
            </div>

            {dateMode === "single" && <input type="date" value={dateSearch} onChange={(e) => setDateSearch(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm" />}
            {dateMode === "range" && (
              <div className="flex gap-3">
                <input type="date" value={rangeDateSearch.dateSearchStart} onChange={(e) => setRangeDateSearch(p => ({...p, dateSearchStart: e.target.value}))} className="border border-gray-300 rounded-md px-3 py-2 text-sm" />
                <input type="date" value={rangeDateSearch.dateSearchEnd} onChange={(e) => setRangeDateSearch(p => ({...p, dateSearchEnd: e.target.value}))} className="border border-gray-300 rounded-md px-3 py-2 text-sm" />
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={() => setFilterToggler(!filterToggler)} className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600">Filter</button>
              <button onClick={() => { setNameSearch(""); setDateSearch(""); setRangeDateSearch({ dateSearchStart: "", dateSearchEnd: "" }); setFilterToggler(!filterToggler); }} className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600">Clear</button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-3 text-left">Date</th>
                <th className="border px-4 py-3 text-left">Memo</th>
                <th className="border px-4 py-3 text-left">Customer</th>
                <th className="border px-4 py-3 text-left">Product Name</th>
                <th className="border px-4 py-3 text-center">Return Qty</th>
                <th className="border px-4 py-3 text-center">Qty (KG)</th>
                <th className="border px-4 py-3 text-center">Return Price</th>
                <th className="border px-4 py-3 text-center">Line Total</th>
                <th className="border px-4 py-3 text-left">Type</th>
                <th className="border px-4 py-3 text-center">Total Return</th>
                <th className="border px-4 py-3 text-center">Paid</th>
                <th className="border px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {salesReturns.length > 0 ? (
                salesReturns.map((sr) => {
                  const products = sr.products || [];
                  const rowspan = products.length || 1;

                  return products.length > 0 ? (
                    products.map((product, idx) => (
                      <tr key={`${sr._id}-${idx}`} className="hover:bg-gray-50">
                        {idx === 0 && (
                          <>
                            <td rowSpan={rowspan} className="border px-4 py-3">{new Date(sr.createdAt).toLocaleDateString("en-GB").replaceAll("/", "-")}</td>
                            <td rowSpan={rowspan} className="border px-4 py-3 font-medium">{sr.memo}</td>
                            <td rowSpan={rowspan} className="border px-4 py-3 cursor-pointer hover:text-blue-600 hover:underline" onClick={() => navigate("/sales-return-statement", { state: sr })}>{sr.customerName}</td>
                          </>
                        )}

                        <td className="border px-4 py-3">{product.productName}</td>
                        <td className="border px-4 py-3 text-center">{product.returnQuantity}</td>
                        <td className="border px-4 py-3 text-center">{product.returnQtyInKg}</td>
                        <td className="border px-4 py-3 text-center">৳ {product.returnPrice}</td>
                        <td className="border px-4 py-3 text-center font-medium">৳ {new Decimal(Number(product.lineTotal)).toFixed(2)}</td>

                        {idx === 0 && (
                          <>
                            <td rowSpan={rowspan} className="border px-4 py-3">
                              {sr.returnType === "product" ? "Product" : "Cash"}
                            </td>
                            <td rowSpan={rowspan} className="border px-4 py-3 text-red-600 font-semibold text-center">৳ {sr.totalReturnValue}</td>
                            <td rowSpan={rowspan} className="border px-4 py-3 text-green-600 font-semibold text-center">৳ {sr.paid}</td>
                            <td rowSpan={rowspan} className="border px-4 py-3 text-center">
                              <div className="flex gap-2 justify-center">
                                <Link to={sr.due > 0 ? `/sales-return/${sr._id}/exchange-due` : "#"} className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">Exchange</Link>
                                <Link to={sr.due > 0 ? `/sales-return/${sr._id}/edit-due` : "#"} className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">Cash</Link>
                                <button onClick={() => navigate("/invoice-sales-return", { state: sr })} className="text-xs bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded">Print</button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr key={sr._id}>
                      <td className="border px-4 py-3">{new Date(sr.createdAt).toLocaleDateString("en-GB").replaceAll("/", "-")}</td>
                      <td className="border px-4 py-3 font-medium">{sr.memo}</td>
                      <td className="border px-4 py-3 cursor-pointer hover:text-blue-600 hover:underline" onClick={() => navigate("/sales-return-statement", { state: sr })}>{sr.customerName}</td>
                      <td className="border px-4 py-3 text-gray-500" colSpan={5}>No Products</td>
                      <td className="border px-4 py-3">{sr.returnType}</td>
                      <td className="border px-4 py-3 text-red-600 font-semibold text-center">৳ {sr.totalReturnValue}</td>
                      <td className="border px-4 py-3 text-green-600 font-semibold text-center">৳ {sr.paid}</td>
                      <td className="border px-4 py-3 text-center">
                        <button onClick={() => navigate("/invoice-sales-return", { state: sr })} className="text-xs bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded">Print</button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={12} className="text-center py-12 text-gray-500 border">No Sales Return Available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pages && (
          <div className="flex justify-center items-center mt-6 gap-4 text-sm">
            <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={page === 1} className="px-5 py-2 border rounded disabled:opacity-50">Prev</button>
            <span>Page {page} of {pages}</span>
            <button onClick={() => setCurrentPage((p) => Math.min(p + 1, pages))} disabled={page === pages} className="px-5 py-2 border rounded disabled:opacity-50">Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesReturn;