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

  const { count, lowQuantityProducts, loading, deleteToggle, lqpage, lqpages } =
    useSelector((state) => state.product);
  const [did, setDid] = useState(null);
  const [currentPage, setCurrentPage] = useState(lqpage);
  const [sortOrder, setSortOrder] = useState(1);

  // console.log(lowQuantityProducts);  

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
    dispatch(
      lowQuantityProductList({
        page: currentPage,
        order: sortOrder,
      })
    );
  }, [user, navigate, dispatch, deleteToggle, sortOrder, currentPage]);

  useEffect(() => {
    dispatch(countLowQuantityProduct());
  }, [deleteToggle]);

  if (!user) return null;

  return (
    <div className="bg-slate-50 min-h-screen p-3 sm:p-4 md:p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h1 className="text-xl sm:text-2xl font-bold">Items low in quantity</h1>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 text-sm">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border text-gray-700 border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="1">Oldest First</option>
          <option value="-1">Newest First</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg text-xs sm:text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-center">Category</th>
              <th className="p-2 text-center">Qty</th>
              <th className="p-2 text-right">Cost</th>
              <th className="p-2 text-right">Sale</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lowQuantityProducts.length ? (
              lowQuantityProducts.map((product, index) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="p-2">{(lqpage - 1) * 15 + index + 1}</td>
                  <td className="p-2 whitespace-nowrap">{product.name}</td>
                  <td className="p-2 whitespace-nowrap text-center">
                    {product.category?.name || "-"}
                  </td>
                  <td
                    className={`p-2 text-center ${
                      product.quantity < 10 ? "font-bold text-red-500" : ""
                    }`}
                  >
                    {product.quantity}
                  </td>
                  <td className="p-2 text-right">৳{product.costPrice}</td>
                  <td className="p-2 text-right">৳{product.sellPrice}</td>
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
                  className="text-center text-gray-600 py-10 text-lg select-none"
                >
                  No Products Available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {lqpages ? (
        <div className="flex justify-center items-center mt-4 gap-2 text-sm">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={lqpage === 1}
            className={`${
              lqpage === 1
                ? ""
                : "cursor-pointer hover:bg-black hover:text-white"
            } px-2 py-1 border rounded  disabled:opacity-50`}
          >
            Prev
          </button>
          <span>
            Page {lqpage} of {lqpages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, lqpages))}
            disabled={lqpage === lqpages}
            className={`${
              lqpage === lqpages
                ? ""
                : "cursor-pointer hover:bg-black hover:text-white"
            }  px-2 py-1 border rounded  disabled:opacity-50`}
          >
            Next
          </button>
        </div>
      ) : ""}
    </div>
  );
};

export default LowQuantityProductsPage;
