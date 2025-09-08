// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { BeatLoader } from "react-spinners";
// import {
//   countLowQuantityProduct,
//   deleteProduct,
//   lowQuantityProductList,
// } from "../features/product/productSlice";

// const LowQuantityProductsPage = () => {
//   const { user } = useSelector((state) => state.auth);
//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//     }
//   }, []);

//   const { count, lowQuantityProducts, loading, deleteToggle } = useSelector(
//     (state) => state.product
//   );
//   const [did, setDid] = useState(null);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleDelete = async (pid) => {
//     try {
//       if (window.confirm("Are you sure you want to delete the Product?")) {
//         setDid(pid);
//         await dispatch(deleteProduct(pid)).unwrap();
//         setDid(null);
//       }
//     } catch (error) {
//       console.log("Delete Failed!");
//       setDid(null);
//     }
//   };

//   useEffect(() => {
//     dispatch(lowQuantityProductList());
//   }, [dispatch, deleteToggle]);

//   useEffect(() => {
//     dispatch(countLowQuantityProduct());
//   }, [deleteToggle]);

//   return (
//     <div className="bg-slate-50 min-h-screen p-6 font-sans">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Items low in quantity</h1>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full bg-white shadow-md rounded-lg text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-2 text-left">#</th>
//               <th className="p-2 text-left">Name</th>
//               <th className="p-2 text-center">Category</th>
//               <th className="p-2 text-center">Quantity</th>
//               <th className="p-2 text-right">Cost Price</th>
//               <th className="p-2 text-right">Sale Price</th>
//               <th className="p-2 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {lowQuantityProducts.length > 0 ? (
//               lowQuantityProducts.map((product, index) => (
//                 <tr key={index} className="hover:bg-gray-50">
//                   <td className="p-2">{index + 1}</td>
//                   <td className="p-2">{product.name}</td>
//                   {/* <td className="p-2">{product.category.name}</td> */}
//                   {product.category && product.category.name ? (
//                     <td className="p-2 whitespace-nowrap">
//                       {product.category.name}
//                     </td>
//                   ) : (
//                     <td className="p-2 whitespace-nowrap text-center font-bold">-</td>
//                   )}

//                   <td
//                     className={`p-2 text-center ${
//                       product.quantity < 10 ? "font-bold text-red-500" : ""
//                     }`}
//                   >
//                     {product.quantity}
//                   </td>
//                   <td className="p-2 text-right">৳ {product.costPrice}</td>
//                   <td className="p-2 text-right">৳ {product.sellPrice}</td>
//                   <td className="p-2 flex gap-2 justify-center">
//                     <Link
//                       to={`/product/${product._id}/add-stock`}
//                       className="text-xs bg-green-500 text-white px-2 py-1 rounded"
//                     >
//                       Stock Entry
//                     </Link>
//                     <Link
//                       to={`/product/${product._id}/edit`}
//                       className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
//                     >
//                       Update
//                     </Link>
//                     <button
//                       onClick={() => handleDelete(product._id)}
//                       disabled={
//                         loading && did && did === product._id ? true : false
//                       }
//                       className={`text-white  py-1 rounded ${
//                         loading && did && did === product._id
//                           ? "bg-red-400 cursor-not-allowed px-[12px]"
//                           : "cursor-pointer hover:bg-red-600 text-xs bg-red-500 px-2"
//                       }`}
//                     >
//                       {loading && did && did === product._id ? (
//                         <BeatLoader color="#FFFFFF" size={3} />
//                       ) : (
//                         "Delete"
//                       )}
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr className="text-center select-none text-gray-600 text-3xl">
//                 <td colSpan={7}>No Products Available.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default LowQuantityProductsPage;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import {
  countLowQuantityProduct,
  deleteProduct,
  lowQuantityProductList,
} from "../features/product/productSlice";

const LowQuantityProductsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { count, lowQuantityProducts, loading, deleteToggle } = useSelector(
    (state) => state.product
  );
  const [did, setDid] = useState(null);

  const handleDelete = async (pid) => {
    if (window.confirm("Are you sure you want to delete the Product?")) {
      setDid(pid);
      try {
        await dispatch(deleteProduct(pid)).unwrap();
      } catch {
        console.log("Delete Failed!");
      } finally {
        setDid(null);
      }
    }
  };

  useEffect(() => {
    if (!user) navigate("/login");
    dispatch(lowQuantityProductList());
  }, [user, navigate, dispatch, deleteToggle]);

  useEffect(() => {
    dispatch(countLowQuantityProduct());
  }, [deleteToggle]);

  return (
    <div className="bg-slate-50 min-h-screen p-3 sm:p-4 md:p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h1 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-0">
          Items low in quantity
        </h1>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg text-xs sm:text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-center hidden sm:table-cell">Category</th>
              <th className="p-2 text-center">Qty</th>
              <th className="p-2 text-right hidden sm:table-cell">Cost</th>
              <th className="p-2 text-right hidden sm:table-cell">Sale</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lowQuantityProducts.length > 0 ? (
              lowQuantityProducts.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2 whitespace-nowrap">{product.name}</td>

                  <td className="p-2 whitespace-nowrap text-center hidden sm:table-cell">
                    {product.category?.name || "-"}
                  </td>

                  <td
                    className={`p-2 text-center ${
                      product.quantity < 10 ? "font-bold text-red-500" : ""
                    }`}
                  >
                    {product.quantity}
                  </td>

                  <td className="p-2 text-right hidden sm:table-cell">
                    ৳ {product.costPrice}
                  </td>
                  <td className="p-2 text-right hidden sm:table-cell">
                    ৳ {product.sellPrice}
                  </td>

                  <td className="p-2">
                    <div className="flex flex-wrap gap-1 justify-center">
                      <Link
                        to={`/product/${product._id}/add-stock`}
                        className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Stock
                      </Link>
                      <Link
                        to={`/product/${product._id}/edit`}
                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        disabled={loading && did === product._id}
                        className={`text-xs text-white px-2 py-1 rounded ${
                          loading && did === product._id
                            ? "bg-red-400 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {loading && did === product._id ? (
                          <BeatLoader color="#FFFFFF" size={3} />
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center text-gray-600 py-10 text-lg"
                >
                  No Products Available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LowQuantityProductsPage;