import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchProductById,
  updateProduct,
} from "../features/product/productSlice";
import { fetchAllCategories } from "../features/category/categorySlice";

const EditProductPage = () => {
  //* Date:
  const now = new Date();

  const tdate = now
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      year: "numeric",
    })
    .split(" ");

  const { productSearchedById, error, loading } = useSelector(
    (state) => state.product
  );
  const { categories } = useSelector((state) => state.category);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
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

      await dispatch(updateProduct({ id, item: newProduct })).unwrap();

      navigate("/product");
    } catch (error) {
      console.log("Submission Failed!");
    }
  };

  useEffect(() => {
    dispatch(fetchProductById(id));
    dispatch(fetchAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (productSearchedById && productSearchedById.name) {
      setProduct({
        ...product,
        name: productSearchedById.name,
        sellPrice: productSearchedById.sellPrice,
        costPrice: productSearchedById.costPrice,
        quantity: productSearchedById.quantity,
        categoryName: productSearchedById.category.name,
      });
    }
  }, [productSearchedById]);

  return (
    <div className="bg-slate-50 min-h-screen p-6 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Update Item</h1>
        <span className="text-sm text-gray-500">
          {tdate[2]}, {tdate[0]} {tdate[1]} | admin
        </span>
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
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700"
          >
            Update Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProductPage;
