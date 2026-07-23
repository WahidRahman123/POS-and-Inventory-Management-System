import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import {
  fetchProductById,
  updateProduct,
} from "../features/product/productSlice";
import { fetchAllCategories, fetchAllCategoriesNames } from "../features/category/categorySlice";
import Decimal from "decimal.js";

const EditProductPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { id } = useParams();

  // Date formatting
  const now = new Date();
  const tdate = now
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      year: "numeric",
    })
    .split(" ");

  const { productSearchedById, loading } = useSelector((state) => state.product);
  const { categoriesNames } = useSelector((state) => state.category);
  const dispatch = useDispatch();

  const [product, setProduct] = useState({
    name: "",
    sellPrice: 0,
    costPrice: 0,
    quantity: 1,
    categoryName: "",
  });
  const [eid, setEid] = useState(null);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEid("Running");
    try {
      const newProduct = {
        ...product,
        sellPrice: Number(new Decimal(product.sellPrice).toFixed(4)),
        costPrice: Number(new Decimal(product.costPrice).toFixed(4)),
        quantity: Number(product.quantity),
      };
      await dispatch(updateProduct({ id, item: { ...newProduct, userId: user._id } })).unwrap();
      navigate("/product");
    } catch {
      console.log("Submission Failed!");
    } finally {
      setEid(null);
    }
  };

  useEffect(() => {
    if (!user) navigate("/login");
    dispatch(fetchProductById(id));
    dispatch(fetchAllCategoriesNames());
  }, [user, id, navigate, dispatch]);

  useEffect(() => {
    if (productSearchedById?.name) {
      setProduct({
        name: productSearchedById.name,
        sellPrice: productSearchedById.sellPrice,
        costPrice: productSearchedById.costPrice,
        quantity: productSearchedById.quantity,
        categoryName: productSearchedById.category?.name || "",
      });
    }
  }, [productSearchedById]);

  return (
    <>
    <title>{`Edit Inventory Item | ${import.meta.env.VITE_COMPANY_NAME}`}</title>
    <div className="bg-slate-50 min-h-screen p-3 sm:p-4 md:p-6 font-sans">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h1 className="text-lg sm:text-2xl font-bold">Update Item</h1>
        <span className="text-xs sm:text-sm text-gray-500">
          {tdate[2]}, {tdate[0]} {tdate[1]} | {user?.role || ""}
        </span>
      </header>

      {/* Form Card */}
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Item Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleOnChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="categoryName"
              value={product.categoryName}
              onChange={handleOnChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              {categoriesNames.map((cat, index) => (
                <option key={index} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Cost Price</label>
              <input
                type="number"
                name="costPrice"
                value={product.costPrice}
                onChange={handleOnChange}
                step="any"
                min={0}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sale Price</label>
              <input
                type="number"
                name="sellPrice"
                value={product.sellPrice}
                onChange={handleOnChange}
                step="any"
                min={0}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              min={1}
              value={product.quantity}
              onChange={handleOnChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading && eid}
            className={`w-full text-white font-semibold py-2 rounded-md text-sm ${
              loading && eid
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading && eid ? "Updating..." : "Update Item"}
          </button>
        </form>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm sm:text-base font-medium text-green-600 hover:text-blue-800 cursor-pointer"
          >
            <FaArrowLeft className="mr-1 sm:mr-2" /> Back
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default EditProductPage;