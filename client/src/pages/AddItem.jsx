import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategories } from "../features/category/categorySlice";
import { addProduct } from "../features/product/productSlice";
import { useNavigate } from "react-router-dom";

const AddItem = () => {
  const { categories, loading, error } = useSelector((state) => state.category);
  const dispatch = useDispatch();
  const [product, setProduct] = useState({
    name: "",
    sellPrice: 0,
    costPrice: 0,
    quantity: 1,
    categoryName: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const newProduct = {
        ...product,
        sellPrice: Number(product.sellPrice),
        costPrice: Number(product.costPrice),
        quantity: Number(product.quantity),
      };
      // console.log(newProduct)
      await dispatch(addProduct(newProduct)).unwrap();

      setProduct({
        name: "",
        sellPrice: 0,
        costPrice: 0,
        quantity: 1,
        categoryName: "",
      });
    } catch (error) {
      console.log("Added Failed!");
    }
  };

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);
  return (
    <div className="bg-slate-50 min-h-screen p-6 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add New Item</h1>
      </header>

      {/* Form Card */}
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium mb-1">Item Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleOnChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={product.categoryName}
            onChange={handleOnChange}
            name="categoryName"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>
              Select an Option
            </option>
            {categories.length > 0 &&
              categories.map((category, index) => (
                <option key={index} value={category.name}>
                  {category.name[0] + category.name.slice(1)}
                </option>
              ))}
          </select>

          <label className="block text-sm font-medium mb-1">Cost Price</label>
          <input
            type="number"
            name="costPrice"
            value={product.costPrice}
            onChange={handleOnChange}
            min={0}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <label className="block text-sm font-medium mb-1">Sale Price</label>
          <input
            type="number"
            name="sellPrice"
            value={product.sellPrice}
            onChange={handleOnChange}
            min={0}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            min={1}
            value={product.quantity}
            onChange={handleOnChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="cursor-pointer w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700"
          >
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
