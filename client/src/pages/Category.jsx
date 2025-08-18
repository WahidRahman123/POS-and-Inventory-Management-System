import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  addCategory,
  deleteCategory,
  fetchAllCategories,
} from "../features/category/categorySlice";

const Category = () => {
  const { categories, loading, error, toggle } = useSelector(
    (state) => state.category
  );
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(10);
  const [categoryName, setCategoryName] = useState("");

  const handleDelete = (cid) => {
    if (window.confirm("Are you sure you want to delete the Category?")) {
      dispatch(deleteCategory(cid));
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await dispatch(addCategory({ name: categoryName })).unwrap();
      setCategoryName("");
    } catch (error) {
      console.log('Category Add Failed!');
    }
  };

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch, toggle]);

  return (
    <div className="bg-slate-50 min-h-screen p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
      </div>

      {/* Add New */}
      <form onSubmit={handleSubmit} className="max-w-md mb-6">
        <label className="block text-sm font-medium mb-1">Category Name</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter Category Name Here"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Category
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Date/Time</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <tr className="hover:bg-gray-50" key={index}>
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">
                    {category.createdAt ? (
                      `${new Date(category.createdAt)
                        .toLocaleDateString("en-GB", { timeZone: 'Asia/Dhaka' })
                        .replaceAll("/", "-")} / ${new Date(
                        category.createdAt
                      ).toLocaleTimeString("en-US", { timeZone: 'Asia/Dhaka' })}`
                    ) : (
                      <span className="font-bold">-</span>
                    )}
                  </td>
                  <td className="p-2">{category.name}</td>
                  <td className="p-2 flex gap-2 justify-center">
                    <Link
                      to={`/category/${category._id}/edit`}
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Update
                    </Link>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="cursor-pointer text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-center select-none text-gray-500 text-3xl">
                <td colSpan={3} className="px-2 py-1">No Category Available.</td>
              </tr>
            )}

            {/* Repeat rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Category;
