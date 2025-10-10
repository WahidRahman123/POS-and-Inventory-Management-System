import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import {
  countLowQuantityProduct,
  deleteProduct,
  fetchAllProducts,
  searchProducts,
} from "../features/product/productSlice";

const Product = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products, loading, deleteToggle, page, pages } = useSelector(
    (state) => state.product
  );
  const [did, setDid] = useState(null);
  const [searchProduct, setSearchProduct] = useState("");
  const [currentPage, setCurrentPage] = useState(page);
  const [sortOrder, setSortOrder] = useState(1);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // fetch on mount / limit change
  useEffect(() => {
    dispatch(fetchAllProducts({
      page: currentPage,
      search: searchProduct,
      order: sortOrder
    }));
  }, [dispatch, deleteToggle, sortOrder, currentPage]);

  useEffect(() => {
    dispatch(countLowQuantityProduct());
  }, [deleteToggle]);

  // search handler
  const handleSearchProduct = (e) => {
    const searchValue = e.target.value;
    setSearchProduct(searchValue);
    setCurrentPage(1); // reset page
    
    dispatch(fetchAllProducts({
      page: currentPage,
      search: searchValue,
      order: sortOrder
    }));
  };

  // delete handler
  const handleDelete = async (pid) => {
    if (window.confirm("Are you sure you want to delete the Product?")) {
      setDid(pid);
      try {
        await dispatch(deleteProduct(pid)).unwrap();
      } catch {
        /* ignore */
      } finally {
        setDid(null);
      }
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-3 sm:p-4 md:p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h1 className="text-xl sm:text-2xl font-bold">Inventory List</h1>
        <Link
          to="/product/add"
          className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm sm:text-base"
        >
          Add Item
        </Link>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 text-sm">
        {/* <div className="text-gray-600">
          Show{" "}
          <input
            type="number"
            min={0}
            value={limit}
            disabled
            onChange={(e) => dispatch(fetchAllProducts(+e.target.value))}
            className="w-14 outline-none px-1 rounded border"
          />{" "}
          entries
        </div> */}

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border text-gray-700 border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="1">Oldest First</option>
          <option value="-1">Newest First</option>
        </select>

        <input
          type="search"
          placeholder="Search..."
          value={searchProduct}
          onChange={handleSearchProduct}
          className="border border-gray-300 rounded px-3 py-1 w-full sm:w-auto"
        />
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
            {products.length ? (
              products.map((product, index) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="p-2">
                    { (page - 1) * 15 + index + 1 }
                  </td>
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
                  <td className="p-2 text-right">৳{product.costPrice / 10000}</td>
                  <td className="p-2 text-right">৳{product.sellPrice / 10000}</td>
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
      {pages ? (
        <div className="flex justify-center items-center mt-4 gap-2 text-sm">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className={`${page === 1 ? '' : 'cursor-pointer hover:bg-black hover:text-white'} px-2 py-1 border rounded  disabled:opacity-50`}
          >
            Prev
          </button>
          <span>
            Page {page} of {pages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, pages))}
            disabled={page === pages}
            className={`${page === pages ? '' : 'cursor-pointer hover:bg-black hover:text-white'}  px-2 py-1 border rounded  disabled:opacity-50`}
          >
            Next
          </button>
        </div>
      ) : ""}
    </div>
  );
};

export default Product;
