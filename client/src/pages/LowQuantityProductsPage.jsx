import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { lowQuantityProductList } from "../features/product/productSlice";

const LowQuantityProductsPage = () => {
  const { count, lowQuantityProducts } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(lowQuantityProductList());
  }, [dispatch]);

  return (
    <div className="bg-slate-50 min-h-screen p-6 font-sans">
      <div flex justify-between items-center mb-4>
        <h1 className="text-2xl font-bold mb-7">Products in Low Quantity</h1>
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-center">Quantity</th>
              <th className="p-2 text-right">Cost Price</th>
              <th className="p-2 text-right">Sale Price</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lowQuantityProducts.length > 0 ? (
              lowQuantityProducts.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{product.name}</td>
                  <td className="p-2">{product.category.name}</td>

                  <td
                    className={`p-2 text-center ${
                      product.quantity < 10 ? "font-bold text-red-500" : ""
                    }`}
                  >
                    {product.quantity}
                  </td>
                  <td className="p-2 text-right">৳ {product.costPrice}</td>
                  <td className="p-2 text-right">৳ {product.sellPrice}</td>
                  <td className="p-2 flex gap-2 justify-center">
                    <Link
                      to={`/product/${product._id}/add-stock`}
                      className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Stock Entry
                    </Link>
                    <Link
                      to={`/product/${product._id}/edit`}
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Update
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="cursor-pointer hover:bg-red-600 text-xs bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-center select-none text-gray-600 text-3xl">
                <td colSpan={7}>No Products Available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
};

export default LowQuantityProductsPage;
