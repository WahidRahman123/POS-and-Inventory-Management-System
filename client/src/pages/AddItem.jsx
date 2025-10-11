import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllCategories,
  fetchAllCategoriesNames,
} from "../features/category/categorySlice";
import {
  addProduct,
  countLowQuantityProduct,
} from "../features/product/productSlice";
import { useNavigate } from "react-router-dom";
import Decimal from "decimal.js";

const AddItem = () => {
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  const { categoriesNames } = useSelector((state) => state.category);
  const { loading, toggle } = useSelector((state) => state.product);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    sellPrice: 0,
    costPrice: 0,
    quantity: 1,
    categoryName: "",
  });
  const [aid, setAid] = useState(null);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setAid("Running");
      const newProduct = {
        ...product,
        sellPrice: Number(new Decimal(product.sellPrice).toFixed(4)),
        costPrice: Number(new Decimal(product.costPrice).toFixed(4)),
        quantity: Number(product.quantity),
      };
      await dispatch(addProduct(newProduct)).unwrap();

      setProduct({
        name: "",
        sellPrice: 0,
        costPrice: 0,
        quantity: 1,
        categoryName: "",
      });
      setAid(null);
    } catch (error) {
      console.log("Added Failed!");
      setAid(null);
    }
  };

  useEffect(() => {
    dispatch(fetchAllCategoriesNames());
  }, [dispatch]);

  useEffect(() => {
    dispatch(countLowQuantityProduct());
  }, [toggle]);

  return (
    <div className="bg-slate-50 min-h-screen p-3 sm:p-4 md:p-6 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Add New Item</h1>
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
              value={product.categoryName}
              onChange={handleOnChange}
              name="categoryName"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                Select an Option
              </option>
              {categoriesNames.length > 0 &&
                categoriesNames.map((category, index) => (
                  <option key={index} value={category.name}>
                    {category.name[0] + category.name.slice(1)}
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Cost Price
              </label>
              <input
                type="number"
                name="costPrice"
                value={product.costPrice}
                onChange={handleOnChange}
                min={0}
                step="any"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Sale Price
              </label>
              <input
                type="number"
                name="sellPrice"
                value={product.sellPrice}
                onChange={handleOnChange}
                min={0}
                step="any"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading && aid}
            className={`w-full text-white font-semibold py-2 rounded-md transition-colors ${
              loading && aid
                ? "cursor-not-allowed bg-blue-400"
                : "cursor-pointer bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading && aid ? "Adding..." : "Add Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
