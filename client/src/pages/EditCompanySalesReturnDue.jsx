// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { FaArrowLeft } from "react-icons/fa";
// import {
//   addPayment,
//   fetchCompanySalesReturnById,
// } from "../features/CompanySalesReturn/companySalesReturnSlice";
// import Decimal from "decimal.js";

// const EditCompanySalesReturnDue = () => {
//   const { user } = useSelector((state) => state.auth);
//   const { companySalesReturnSearchedById, loading } = useSelector(
//     (state) => state.companySalesReturn,
//   );
//   // console.log(companySalesReturnSearchedById);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   // const [due, setDue] = useState(0);
//   const [aid, setAid] = useState(null);
//   const [date, setDate] = useState("");
//   const [dateRestriction, setDateRestriction] = useState("");
//   const { id } = useParams();

//   const [originalReceivableProducts, setOriginalReceivableProducts] =
//     useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setAid("Run");
//     let amount;
//     const due = Number(originalReceivableProducts.reduce((acc, p) => acc + p.quantity, 0));

//     if (
//       new Decimal(due).greaterThan(
//         new Decimal(companySalesReturnSearchedById.dueQty),
//       )
//     ) {
//       amount = Number(
//         new Decimal(companySalesReturnSearchedById.dueQty).toFixed(4),
//       );
//     } else {
//       amount = Number(new Decimal(due).toFixed(4));
//     }

//     const payDetails = originalReceivableProducts.map((p, i) => ({ productName: p.productName, quantity: p.quantity }));

//     try {
//       await dispatch(
//         addPayment({
//           id,
//           info: {
//             date,
//             amount,
//             payDetails,
//             unchangedAmount: Number(new Decimal(due).toFixed(4)),
//           },
//         }),
//       ).unwrap();
//       navigate(-1);
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
//       dispatch(fetchCompanySalesReturnById(id));
//     }
//   }, [dispatch, user]);

//   useEffect(() => {
//     if (companySalesReturnSearchedById) {
//       // setDue(companySalesReturnSearchedById.dueQty);
//       const restrictionDate = new Date(companySalesReturnSearchedById.createdAt)
//         .toISOString()
//         .split("T")[0];
//       setDateRestriction(restrictionDate);

//       if (companySalesReturnSearchedById.products?.length > 0) {
//         const productsToAdd = companySalesReturnSearchedById.products.map((product, index) => ({...product, quantity: product.availableQty, productId: index + 1}));

//         setOriginalReceivableProducts(productsToAdd);
//       } else {
//         navigate(-1);
//       }
//     }
//   }, [companySalesReturnSearchedById]);

//   //* Due 0 redirection
//   useEffect(() => {
//     if (companySalesReturnSearchedById?.dueQty === 0) {
//       navigate("/company-return");
//     }
//   }, [companySalesReturnSearchedById]);

//   if (!user) return null;
//   return (
//     <>
//       <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg p-3 sm:p-4 md:p-6 gap-4 md:gap-8">
//         {/* Left: Stock Form */}
//         <form onSubmit={handleSubmit} className="flex-1">
//           <h2 className="text-lg sm:text-xl font-semibold mb-4">
//             Receive Product
//           </h2>

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

//           <label className="block text-sm font-medium mb-1">
//             Product Amount
//           </label>
//           {originalReceivableProducts.length > 0
//             ? originalReceivableProducts.map((product, index) => (
//                 <div className="mb-4 flex gap-2" key={index}>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       Product Name:
//                     </label>
//                     <input
//                       type="text"
//                       value={product.productName}
//                       min={0}
//                       placeholder="Add Payment"
//                       step="any"
//                       className="w-full border border-gray-300 bg-gray-100 text-gray-800 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       disabled
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       Enter Quantity:
//                     </label>
//                     <input
//                       type="number"
//                       value={product.quantity}
//                       max={product.availableQty}
//                       onChange={(e) => {
//                         setOriginalReceivableProducts((prev) =>
//                           prev.map((p, i) =>
//                             i === index
//                               ? {
//                                   ...p,
//                                   quantity: Number(e.target.value),
//                                 }
//                               : p,
//                           ),
//                         );
//                       }}
//                       step="any"
//                       min={0}
//                       placeholder="Add Payment"
//                       className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   {originalReceivableProducts.length > 1 ? (
//                           <button
//                             type="button"
//                             onClick={() => {
//                               setOriginalReceivableProducts((prev) =>
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
//                 </div>
//               ))
//             : ""}

//           <button
//             type="submit"
//             disabled={loading && aid}
//             className={`text-white px-4 py-2 rounded text-sm ${
//               loading && aid
//                 ? "cursor-not-allowed bg-green-400"
//                 : "bg-green-500 hover:bg-green-600 cursor-pointer"
//             }`}
//           >
//             {loading && aid ? "Receiving..." : "Receive"}
//           </button>
//         </form>

//         {/* Right: Item Information */}
//         <div className="flex-1 md:border-l md:border-gray-200 md:pl-6 mt-6 md:mt-0">
//           <h2 className="text-lg sm:text-xl font-semibold mb-4">
//             Company Sales Return Information
//           </h2>
//           <div className="space-y-1 text-sm">
//             <div className="flex">
//               <span className="w-28 font-medium">Sale ID</span>
//               <span>: {companySalesReturnSearchedById?._id}</span>
//             </div>
//             <div className="flex">
//               <span className="w-28 font-medium">Memo</span>
//               <span>: {companySalesReturnSearchedById?.memo}</span>
//             </div>
//             <div className="flex">
//               <span className="w-28 font-medium">Supplier Name</span>
//               <span>: {companySalesReturnSearchedById?.supplierName}</span>
//             </div>
//             <div className="flex">
//               <span className="w-28 font-medium">Product Name</span>
//               <ul>{companySalesReturnSearchedById?.productName}</ul>
//             </div>
//             <div className="flex">
//               <span className="w-28 font-medium">Total Quantity</span>
//               <span>
//                 :{" "}
//                 <span className="font-bold">
//                   {companySalesReturnSearchedById?.totalAmountQty}
//                 </span>
//               </span>
//             </div>
//             <div className="flex">
//               <span className="w-28 font-medium">Paid Quantity</span>
//               <span>: {companySalesReturnSearchedById?.paidQty}</span>
//             </div>
//             <div className="flex">
//               <span className="w-28 font-medium">Due Quantity</span>
//               <span>
//                 :{" "}
//                 <span
//                   className={`w-28 ${
//                     companySalesReturnSearchedById?.dueQty > 0
//                       ? "text-red-500 font-bold"
//                       : "font-medium"
//                   }`}
//                 >
//                   {companySalesReturnSearchedById?.dueQty}
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

// export default EditCompanySalesReturnDue;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { FaArrowLeft } from "react-icons/fa";
// import {
//   addPayment,
//   fetchCompanySalesReturnById,
// } from "../features/CompanySalesReturn/companySalesReturnSlice";
// import { fetchAllProducts } from "../features/product/productSlice";
// import Decimal from "decimal.js";

// const EditCompanySalesReturnDue = () => {
//   const { user } = useSelector((state) => state.auth);
//   const { companySalesReturnSearchedById, loading } = useSelector(
//     (state) => state.companySalesReturn
//   );
//   const { products } = useSelector((state) => state.product);

//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { id } = useParams();

//   const [originalReceivableProducts, setOriginalReceivableProducts] = useState([]);
//   const [date, setDate] = useState("");
//   const [dateRestriction, setDateRestriction] = useState("");
//   const [searchTerms, setSearchTerms] = useState({});
//   const [activeSearchIndex, setActiveSearchIndex] = useState(null); // Track which row is searching
//   const [aid, setAid] = useState(null);

//   // Fetch Data
//   useEffect(() => {
//     if (id) dispatch(fetchCompanySalesReturnById(id));
//     dispatch(fetchAllProducts());
//   }, [dispatch, id]);

//   // Set Initial Data
//   useEffect(() => {
//     if (companySalesReturnSearchedById?.products?.length > 0) {
//       const restrictionDate = new Date(companySalesReturnSearchedById.createdAt)
//         .toISOString()
//         .split("T")[0];
//       setDateRestriction(restrictionDate);
//       setDate(restrictionDate);

//       const productsToAdd = companySalesReturnSearchedById.products.map((product, index) => ({
//         ...product,
//         quantity: product.availableQty || product.quantity || 0,
//         productId: index + 1,
//       }));

//       setOriginalReceivableProducts(productsToAdd);

//       // Initialize search terms
//       const initialSearch = {};
//       productsToAdd.forEach((p, i) => {
//         initialSearch[i] = p.productName || "";
//       });
//       setSearchTerms(initialSearch);
//     }
//   }, [companySalesReturnSearchedById]);

//   const handleSearchChange = (index, value) => {
//     setSearchTerms((prev) => ({ ...prev, [index]: value }));
//     setActiveSearchIndex(index);
//   };

//   const handleProductSelect = (product, index) => {
//     const updated = [...originalReceivableProducts];
//     updated[index] = {
//       ...updated[index],
//       productName: product.name,
//       unitPrice: product.costPrice || product.sellPrice || 0,
//     };
//     setOriginalReceivableProducts(updated);
//     setSearchTerms((prev) => ({ ...prev, [index]: product.name }));
//     setActiveSearchIndex(null);
//   };

//   const handleQuantityChange = (index, value) => {
//     const updated = [...originalReceivableProducts];
//     updated[index].quantity = Number(value);
//     setOriginalReceivableProducts(updated);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setAid("Run");

//     const due = Number(
//       originalReceivableProducts.reduce((acc, p) => acc + (p.quantity || 0), 0)
//     );

//     let amount = due;
//     if (new Decimal(due).greaterThan(companySalesReturnSearchedById?.dueQty || 0)) {
//       amount = Number(companySalesReturnSearchedById.dueQty);
//     }

//     const payDetails = originalReceivableProducts.map((p) => ({
//       productName: p.productName,
//       quantity: p.quantity,
//     }));

//     try {
//       await dispatch(
//         addPayment({
//           id,
//           info: {
//             date,
//             amount,
//             payDetails,
//             unchangedAmount: Number(new Decimal(due).toFixed(4)),
//           },
//         })
//       ).unwrap();
//       navigate(-1);
//     } catch (error) {
//       console.log("Payment Failed!", error);
//     } finally {
//       setAid(null);
//     }
//   };

//   useEffect(() => {
//     if (!user) navigate("/login");
//   }, [user, navigate]);

//   if (!user) return null;

//   return (
//     <>
//       <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg p-3 sm:p-4 md:p-6 gap-4 md:gap-8">
//         {/* Left: Receive Product */}
//         <form onSubmit={handleSubmit} className="flex-1">
//           <h2 className="text-lg sm:text-xl font-semibold mb-4">Receive Product</h2>

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

//           <label className="block text-sm font-medium mb-3">Product Amount</label>

//           {originalReceivableProducts.length > 0 ? (
//             originalReceivableProducts.map((product, index) => (
//               <div className="mb-6 border p-4 rounded-lg bg-gray-50 relative" key={index}>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   {/* Product Name Search */}
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Product Name:</label>
//                     <input
//                       type="text"
//                       value={searchTerms[index] || ""}
//                       onChange={(e) => handleSearchChange(index, e.target.value)}
//                       placeholder="Search product..."
//                       className="w-full border border-gray-300 rounded-md px-3 py-2"
//                     />
//                     {activeSearchIndex === index && (searchTerms[index] || "").length > 0 && (
//                       <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
//                         {products
//                           .filter((p) =>
//                             p.name?.toLowerCase().includes((searchTerms[index] || "").toLowerCase())
//                           )
//                           .map((p) => (
//                             <div
//                               key={p._id}
//                               onClick={() => handleProductSelect(p, index)}
//                               className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
//                             >
//                               {p.name}
//                             </div>
//                           ))}
//                       </div>
//                     )}
//                   </div>

//                   {/* Unit Price */}
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Unit Price</label>
//                     <input
//                       type="text"
//                       value={`৳ ${product.unitPrice || 0}`}
//                       readOnly
//                       className="w-full border border-gray-300 bg-gray-100 rounded-md px-3 py-2 font-semibold"
//                     />
//                   </div>

//                   {/* Quantity */}
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Enter Quantity:</label>
//                     <input
//                       type="number"
//                       value={product.quantity}
//                       onChange={(e) => handleQuantityChange(index, e.target.value)}
//                       min={0}
//                       className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">No products to receive.</p>
//           )}

//           <button
//             type="submit"
//             disabled={loading && aid}
//             className={`text-white px-8 py-3 rounded text-sm font-medium mt-4 ${
//               loading && aid ? "cursor-not-allowed bg-green-400" : "bg-green-600 hover:bg-green-700 cursor-pointer"
//             }`}
//           >
//             {loading && aid ? "Receiving..." : "Receive"}
//           </button>
//         </form>

//         {/* Right Side */}
//         <div className="flex-1 md:border-l md:border-gray-200 md:pl-6 mt-6 md:mt-0">
//           <h2 className="text-lg sm:text-xl font-semibold mb-4">Company Sales Return Information</h2>
//           <div className="space-y-2 text-sm">
//             <div className="flex">
//               <span className="w-32 font-medium">Sale ID</span>
//               <span>: {companySalesReturnSearchedById?._id}</span>
//             </div>
//             <div className="flex">
//               <span className="w-32 font-medium">Memo</span>
//               <span>: {companySalesReturnSearchedById?.memo}</span>
//             </div>
//             <div className="flex">
//               <span className="w-32 font-medium">Supplier Name</span>
//               <span>: {companySalesReturnSearchedById?.supplierName}</span>
//             </div>
//             <div className="flex">
//               <span className="w-32 font-medium">Total Quantity</span>
//               <span>: {companySalesReturnSearchedById?.totalAmountQty}</span>
//             </div>
//             <div className="flex">
//               <span className="w-32 font-medium">Paid Quantity</span>
//               <span>: {companySalesReturnSearchedById?.paidQty}</span>
//             </div>
//             <div className="flex">
//               <span className="w-32 font-medium">Due Quantity</span>
//               <span className="text-red-600 font-bold">
//                 : {companySalesReturnSearchedById?.dueQty}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-end mt-6">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center text-sm sm:text-base font-medium text-green-600 hover:text-blue-800 cursor-pointer"
//         >
//           <FaArrowLeft className="mr-2" /> Go Back
//         </button>
//       </div>
//     </>
//   );
// };

// export default EditCompanySalesReturnDue;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { FaArrowLeft, FaTimes, FaPlus } from "react-icons/fa";
// import {
//   addPayment,
//   fetchCompanySalesReturnById,
// } from "../features/CompanySalesReturn/companySalesReturnSlice";
// import { fetchAllProducts } from "../features/product/productSlice";
// import Decimal from "decimal.js";

// const EditCompanySalesReturnDue = () => {
//   const { user } = useSelector((state) => state.auth);
//   const { companySalesReturnSearchedById, loading } = useSelector(
//     (state) => state.companySalesReturn
//   );
//   const { products } = useSelector((state) => state.product);

//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { id } = useParams();

//   const [receivableProducts, setReceivableProducts] = useState([]);
//   const [date, setDate] = useState("");
//   const [dateRestriction, setDateRestriction] = useState("");
//   const [searchTerms, setSearchTerms] = useState({});
//   const [activeSearchIndex, setActiveSearchIndex] = useState(null);
//   const [aid, setAid] = useState(null);
//   const [errorMessage, setErrorMessage] = useState("");

//   // Fetch Data
//   useEffect(() => {
//     if (id) dispatch(fetchCompanySalesReturnById(id));
//     dispatch(fetchAllProducts());
//   }, [dispatch, id]);

//   // Initialize Data
//   useEffect(() => {
//     if (companySalesReturnSearchedById?.products?.length > 0) {
//       const restrictionDate = new Date(companySalesReturnSearchedById.createdAt)
//         .toISOString()
//         .split("T")[0];

//       setDateRestriction(restrictionDate);
//       setDate(restrictionDate);

//       const initialProducts = companySalesReturnSearchedById.products.map((p, index) => ({
//         ...p,
//         quantity: p.availableQty || p.dueQty || 0,
//         productId: index + 1,
//       }));

//       setReceivableProducts(initialProducts);

//       const initialSearch = {};
//       initialProducts.forEach((p, i) => {
//         initialSearch[i] = p.productName || "";
//       });
//       setSearchTerms(initialSearch);
//     }
//   }, [companySalesReturnSearchedById]);

//   const handleSearchChange = (index, value) => {
//     setSearchTerms((prev) => ({ ...prev, [index]: value }));
//     setActiveSearchIndex(index);
//   };

//   const handleProductSelect = (product, index) => {
//     const updated = [...receivableProducts];
//     updated[index] = {
//       ...updated[index],
//       productName: product.name,
//       unitPrice: product.costPrice || product.sellPrice || 0,
//     };
//     setReceivableProducts(updated);
//     setSearchTerms((prev) => ({ ...prev, [index]: product.name }));
//     setActiveSearchIndex(null);
//   };

//   const handleQuantityChange = (index, value) => {
//     const updated = [...receivableProducts];
//     updated[index].quantity = Number(value) || 0;
//     setReceivableProducts(updated);
//     setErrorMessage(""); // Clear error on change
//   };

//   const removeProduct = (index) => {
//     const updated = receivableProducts.filter((_, i) => i !== index);
//     setReceivableProducts(updated);

//     const newSearch = { ...searchTerms };
//     delete newSearch[index];
//     setSearchTerms(newSearch);
//     setErrorMessage("");
//   };

//   const addNewProductRow = () => {
//     const newRow = {
//       productName: "",
//       unitPrice: 0,
//       quantity: 0,
//       productId: Date.now(),
//     };
//     setReceivableProducts([...receivableProducts, newRow]);
//     setSearchTerms((prev) => ({ ...prev, [receivableProducts.length]: "" }));
//   };

//   const totalReceiveQty = receivableProducts.reduce((sum, p) => sum + (p.quantity || 0), 0);
//   const totalReceiveAmount = receivableProducts.reduce((sum, p) => {
//     return sum + (p.quantity || 0) * (p.unitPrice || 0);
//   }, 0);

//   const maxDueQty = companySalesReturnSearchedById?.dueQty || 0;
//   const maxDueAmount = companySalesReturnSearchedById?.dueAmount || 0; // Adjust field name if needed

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage("");

//     if (receivableProducts.length === 0) {
//       setErrorMessage("At least one product is required");
//       return;
//     }

//     if (totalReceiveQty > maxDueQty) {
//       setErrorMessage(`Total Receive Quantity cannot exceed Due Quantity (${maxDueQty})`);
//       return;
//     }

//     if (totalReceiveAmount > maxDueAmount) {
//       setErrorMessage(`Total Receive Amount cannot exceed Due Amount`);
//       return;
//     }

//     setAid("Run");

//     const payDetails = receivableProducts.map((p) => ({
//       productName: p.productName,
//       quantity: p.quantity,
//     }));

//     try {
//       await dispatch(
//         addPayment({
//           id,
//           info: {
//             date,
//             amount: totalReceiveQty,
//             payDetails,
//             unchangedAmount: totalReceiveQty,
//           },
//         })
//       ).unwrap();

//       alert("Products Received Successfully!");
//       navigate(-1);
//     } catch (error) {
//       console.error(error);
//       alert("Failed to receive products!");
//     } finally {
//       setAid(null);
//     }
//   };

//   useEffect(() => {
//     if (!user) navigate("/login");
//   }, [user, navigate]);

//   if (!user) return null;

//   return (
//     <>
//       <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg p-4 md:p-6 gap-6">
//         {/* Left Form */}
//         <form onSubmit={handleSubmit} className="flex-1">
//           <h2 className="text-xl font-semibold mb-4">Receive Product</h2>

//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1">Date</label>
//             <input
//               type="date"
//               value={date}
//               min={dateRestriction}
//               onChange={(e) => setDate(e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-4 py-2.5"
//               required
//             />
//           </div>

//           <div className="mb-3 flex justify-between items-center">
//             <label className="block text-sm font-medium">Product Amount</label>
//             <button
//               type="button"
//               onClick={addNewProductRow}
//               className="text-blue-600 flex items-center gap-1 text-sm hover:underline"
//             >
//               <FaPlus /> Add New Product
//             </button>
//           </div>

//           {receivableProducts.map((product, index) => (
//             <div key={product.productId} className="border p-4 rounded-lg mb-4 bg-gray-50 relative">
//               <button
//                 type="button"
//                 onClick={() => removeProduct(index)}
//                 className="absolute top-3 right-3 text-red-500 hover:text-red-700"
//               >
//                 <FaTimes />
//               </button>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Product Name</label>
//                   <input
//                     type="text"
//                     value={searchTerms[index] || ""}
//                     onChange={(e) => handleSearchChange(index, e.target.value)}
//                     placeholder="Search product..."
//                     className="w-full border border-gray-300 rounded-md px-4 py-2"
//                   />
//                   {activeSearchIndex === index && (searchTerms[index] || "").length > 0 && (
//                     <div className="absolute z-20 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
//                       {products
//                         .filter((p) =>
//                           p.name?.toLowerCase().includes((searchTerms[index] || "").toLowerCase())
//                         )
//                         .map((p) => (
//                           <div
//                             key={p._id}
//                             onClick={() => handleProductSelect(p, index)}
//                             className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
//                           >
//                             {p.name}
//                           </div>
//                         ))}
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Unit Price</label>
//                   <input
//                     type="text"
//                     value={`৳ ${product.unitPrice || 0}`}
//                     readOnly
//                     className="w-full border border-gray-300 bg-gray-100 rounded-md px-4 py-2 font-semibold"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Enter Quantity</label>
//                   <input
//                     type="number"
//                     value={product.quantity}
//                     onChange={(e) => handleQuantityChange(index, e.target.value)}
//                     min={0}
//                     className="w-full border border-gray-300 rounded-md px-4 py-2"
//                     required
//                   />
//                 </div>
//               </div>
//             </div>
//           ))}

//           {/* Total Summary + Validation Error */}
//           <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
//             <div className="flex justify-between text-sm">
//               <span><strong>Total Receive Quantity:</strong></span>
//               <span className="font-bold">{totalReceiveQty} / {maxDueQty}</span>
//             </div>
//             <div className="flex justify-between text-sm mt-1">
//               <span><strong>Total Receive Amount:</strong></span>
//               <span className="font-bold">৳ {totalReceiveAmount.toLocaleString("en-BD")}</span>
//             </div>
//           </div>

//           {errorMessage && (
//             <div className="mt-3 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
//               {errorMessage}
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={loading && aid}
//             className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium disabled:bg-gray-400"
//           >
//             {loading && aid ? "Receiving..." : "Receive"}
//           </button>
//         </form>

//         {/* Right Information */}
//         <div className="flex-1 md:border-l md:border-gray-200 md:pl-6">
//           <h2 className="text-xl font-semibold mb-4">Company Sales Return Information</h2>
//           <div className="space-y-2 text-sm">
//             <div><strong>Sale ID:</strong> {companySalesReturnSearchedById?._id}</div>
//             <div><strong>Memo:</strong> {companySalesReturnSearchedById?.memo}</div>
//             <div><strong>Supplier Name:</strong> {companySalesReturnSearchedById?.supplierName}</div>
//             <div><strong>Total Quantity:</strong> {companySalesReturnSearchedById?.totalAmountQty}</div>
//             <div><strong>Paid Quantity:</strong> {companySalesReturnSearchedById?.paidQty}</div>
//             <div><strong>Due Quantity:</strong> <span className="text-red-600 font-bold">{companySalesReturnSearchedById?.dueQty}</span></div>
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-end mt-6">
//         <button onClick={() => navigate(-1)} className="flex items-center text-green-600 hover:text-blue-800">
//           <FaArrowLeft className="mr-2" /> Go Back
//         </button>
//       </div>
//     </>
//   );
// };

// export default EditCompanySalesReturnDue;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaTimes, FaPlus } from "react-icons/fa";
import {
  addPayment,
  fetchCompanySalesReturnById,
} from "../features/CompanySalesReturn/companySalesReturnSlice";
import { fetchAllProducts } from "../features/product/productSlice";

const EditCompanySalesReturnDue = () => {
  const { user } = useSelector((state) => state.auth);
  const { companySalesReturnSearchedById, loading } = useSelector(
    (state) => state.companySalesReturn
  );
  const { products } = useSelector((state) => state.product);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [receivableProducts, setReceivableProducts] = useState([]);
  const [date, setDate] = useState("");
  const [dateRestriction, setDateRestriction] = useState("");
  const [searchTerms, setSearchTerms] = useState({});
  const [activeSearchIndex, setActiveSearchIndex] = useState(null);
  const [aid, setAid] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (id) dispatch(fetchCompanySalesReturnById(id));
    dispatch(fetchAllProducts());
  }, [dispatch, id]);

  useEffect(() => {
    if (companySalesReturnSearchedById?.products?.length > 0) {
      const restrictionDate = new Date(companySalesReturnSearchedById.createdAt)
        .toISOString()
        .split("T")[0];

      setDateRestriction(restrictionDate);
      setDate(restrictionDate);

      const initialProducts = companySalesReturnSearchedById.products.map((p, index) => ({
        ...p,
        quantity: p.availableQty || p.dueQty || 0,
        unitPrice: p.unitPrice || p.costPrice || 0,
        productId: `init-${index}`,
      }));

      setReceivableProducts(initialProducts);

      const initialSearch = {};
      initialProducts.forEach((p, i) => {
        initialSearch[i] = p.productName || "";
      });
      setSearchTerms(initialSearch);
    }
  }, [companySalesReturnSearchedById]);

  const handleSearchChange = (index, value) => {
    setSearchTerms((prev) => ({ ...prev, [index]: value }));
    setActiveSearchIndex(index);
  };

  const handleProductSelect = (product, index) => {
    const updated = [...receivableProducts];
    updated[index] = {
      ...updated[index],
      productName: product.name,
      unitPrice: product.costPrice || 0,
    };
    setReceivableProducts(updated);
    setSearchTerms((prev) => ({ ...prev, [index]: product.name }));
    setActiveSearchIndex(null);
  };

  const handleUnitPriceChange = (index, value) => {
    const updated = [...receivableProducts];
    updated[index].unitPrice = Number(value) || 0;
    setReceivableProducts(updated);
    setErrorMessage("");
  };

  const handleQuantityChange = (index, value) => {
    const updated = [...receivableProducts];
    updated[index].quantity = Number(value) || 0;
    setReceivableProducts(updated);
    setErrorMessage(""); 
  };

  const removeProduct = (index) => {
    const updated = receivableProducts.filter((_, i) => i !== index);
    setReceivableProducts(updated);

    const adjustedSearch = {};
    updated.forEach((p, i) => {
      adjustedSearch[i] = p.productName || "";
    });
    setSearchTerms(adjustedSearch);
    setErrorMessage("");
  };

  const addNewProductRow = () => {
    const newRow = {
      productName: "",
      unitPrice: 0,
      quantity: 0,
      productId: `new-${Date.now()}`,
    };
    setReceivableProducts([...receivableProducts, newRow]);
    setSearchTerms((prev) => ({ ...prev, [receivableProducts.length]: "" }));
  };

  const totalReceiveQty = receivableProducts.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const totalReceiveAmount = receivableProducts.reduce((sum, p) => {
    return sum + (p.quantity || 0) * (p.unitPrice || 0);
  }, 0);

  // কোয়ান্টিটি লিমিট
  const maxDueQty = companySalesReturnSearchedById?.dueQty || 0;
  
  // টাকার ডাইনামিক লিমিট: যদি ডাটাবেজে dueAmount থাকে তবে ওটাই সর্বোচ্চ, আর ওল্ড ডাটায় ০ থাকলে ডিফল্ট লিস্টের মোট যোগফলই সর্বোচ্চ সীমা
  const dbDueAmount = companySalesReturnSearchedById?.dueAmount || companySalesReturnSearchedById?.due || 0;
  const maxDueAmount = dbDueAmount === 0 
    ? receivableProducts.reduce((sum, p) => sum + ((p.availableQty || p.quantity || 0) * (p.unitPrice || 0)), 0)
    : dbDueAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (receivableProducts.length === 0) {
      setErrorMessage("At least one product is required");
      return;
    }

    if (totalReceiveQty > maxDueQty) {
      setErrorMessage(`Total Receive Quantity cannot exceed Due Quantity (${maxDueQty} Pcs)`);
      return;
    }

    if (totalReceiveAmount > maxDueAmount) {
      setErrorMessage(`Total Receive Amount (৳ ${totalReceiveAmount.toLocaleString("en-BD")}) cannot exceed remaining Due Amount (৳ ${maxDueAmount.toLocaleString("en-BD")})`);
      return;
    }

    const hasInvalidProduct = receivableProducts.some(p => !p.productName || p.quantity <= 0);
    if (hasInvalidProduct) {
      setErrorMessage("Please ensure all products have a valid name and quantity greater than 0");
      return;
    }

    setAid("Run");

    const payDetails = receivableProducts.map((p) => ({
      productName: p.productName,
      quantity: p.quantity,
      unitPrice: p.unitPrice, 
    }));

    try {
      await dispatch(
        addPayment({
          id,
          info: {
            date,
            amount: totalReceiveQty,
            receiveAmount: totalReceiveAmount, 
            payDetails,
            unchangedAmount: totalReceiveQty,
          },
        })
      ).unwrap();

      alert("Products Received Successfully!");
      navigate(-1);
    } catch (error) {
      console.error(error);
      alert("Failed to receive products!");
    } finally {
      setAid(null);
    }
  };

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  return (
    <>
      <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg p-4 md:p-6 gap-6">
        {/* Left Form */}
        <form onSubmit={handleSubmit} className="flex-1">
          <h2 className="text-xl font-semibold mb-4">Receive Product</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={date}
              min={dateRestriction}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2.5"
              required
            />
          </div>

          <div className="mb-3 flex justify-between items-center">
            <label className="block text-sm font-medium">Product List</label>
            <button
              type="button"
              onClick={addNewProductRow}
              className="text-blue-600 flex items-center gap-1 text-sm hover:underline font-semibold"
            >
              <FaPlus /> Add New/Alternative Product
            </button>
          </div>

          {receivableProducts.map((product, index) => (
            <div key={product.productId} className="border p-4 rounded-lg mb-4 bg-gray-50 relative">
              <button
                type="button"
                onClick={() => removeProduct(index)}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                title="Remove Product"
              >
                <FaTimes />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium mb-1">Product Name</label>
                  <input
                    type="text"
                    value={searchTerms[index] || ""}
                    onChange={(e) => handleSearchChange(index, e.target.value)}
                    placeholder="Search product..."
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                    required
                  />
                  {activeSearchIndex === index && (searchTerms[index] || "").length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                      {products
                        .filter((p) =>
                          p.name?.toLowerCase().includes((searchTerms[index] || "").toLowerCase())
                        )
                        .map((p) => (
                          <div
                            key={p._id}
                            onClick={() => handleProductSelect(p, index)}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                          >
                            {p.name} <span className="text-gray-400 text-xs">(Cost: ৳{p.costPrice})</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Unit Price (৳)</label>
                  <input
                    type="number"
                    value={product.unitPrice || 0}
                    onChange={(e) => handleUnitPriceChange(index, e.target.value)}
                    min={0}
                    step="any"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 font-semibold text-green-700 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Enter Quantity</label>
                  <input
                    type="number"
                    value={product.quantity || ""}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    min={1}
                    placeholder="Qty"
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                    required
                  />
                </div>
              </div>

              <div className="text-right text-xs text-gray-500 mt-2">
                Sub-total: ৳ {((product.quantity || 0) * (product.unitPrice || 0)).toLocaleString("en-BD")}
              </div>
            </div>
          ))}

          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between text-sm">
              <span><strong>Total Receive Quantity:</strong></span>
              <span className={`font-bold ${totalReceiveQty > maxDueQty ? 'text-red-600' : 'text-gray-800'}`}>
                {totalReceiveQty} / {maxDueQty} Pcs
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span><strong>Total Receive Amount:</strong></span>
              <span className={`font-bold ${totalReceiveAmount > maxDueAmount ? 'text-red-600' : 'text-gray-800'}`}>
                ৳ {totalReceiveAmount.toLocaleString("en-BD")} / ৳ {maxDueAmount.toLocaleString("en-BD")}
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-3 p-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading && aid}
            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium disabled:bg-gray-400"
          >
            {loading && aid ? "Receiving..." : "Receive"}
          </button>
        </form>

        {/* Right Information */}
        <div className="flex-1 md:border-l md:border-gray-200 md:pl-6">
          <h2 className="text-xl font-semibold mb-4">Company Sales Return Information</h2>
          <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg border">
            <div><strong>Sale ID:</strong> {companySalesReturnSearchedById?._id}</div>
            <div><strong>Memo:</strong> {companySalesReturnSearchedById?.memo}</div>
            <div><strong>Supplier Name:</strong> {companySalesReturnSearchedById?.supplierName}</div>
            <hr className="my-2" />
            <div><strong>Total Quantity:</strong> {companySalesReturnSearchedById?.totalAmountQty} Pcs</div>
            <div><strong>Paid Quantity:</strong> {companySalesReturnSearchedById?.paidQty} Pcs</div>
            <div><strong>Due Quantity:</strong> <span className="text-red-600 font-bold">{companySalesReturnSearchedById?.dueQty} Pcs</span></div>
            <hr className="my-2" />
            <div><strong>Due Amount:</strong> <span className="text-red-600 font-bold">৳ {maxDueAmount.toLocaleString("en-BD")}</span></div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-green-600 hover:text-blue-800 font-medium">
          <FaArrowLeft className="mr-2" /> Go Back
        </button>
      </div>
    </>
  );
};

export default EditCompanySalesReturnDue;