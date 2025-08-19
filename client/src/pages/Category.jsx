import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners"
import {
  addCategory,
  deleteCategory,
  fetchAllCategories,
} from "../features/category/categorySlice";

const Category = () => {
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  const { categories, loading, error, toggle } = useSelector(
    (state) => state.category
  );

  const dispatch = useDispatch();
  const [limit, setLimit] = useState(10);
  const [categoryName, setCategoryName] = useState("");
  const [aid, setAid] = useState(null);
  const [did, setDid] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async (cid) => {
    try {
      if (window.confirm("Are you sure you want to delete the Category?")) {
        setDid(cid);
        await dispatch(deleteCategory(cid)).unwrap();
        setDid(null);
      }
    } catch (error) {
      console.log("Delete Failed!");
      setDid(null);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setAid("Running");
      await dispatch(addCategory({ name: categoryName })).unwrap();
      setCategoryName("");
      setAid(null);
    } catch (error) {
      console.log("Category Add Failed!");
      setAid(null);
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
            disabled={loading && aid ? true : false}
            className={` text-white px-4 py-2 rounded-md  ${
              loading && aid
                ? "cursor-not-allowed bg-blue-500"
                : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            }`}
          >
            {loading && aid ? "Adding..." : "Add Category"}
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
                        .toLocaleDateString("en-GB", { timeZone: "Asia/Dhaka" })
                        .replaceAll("/", "-")} / ${new Date(
                        category.createdAt
                      ).toLocaleTimeString("en-US", {
                        timeZone: "Asia/Dhaka",
                      })}`
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
                      disabled={loading && did && did === category._id ? true : false}
                      onClick={() => handleDelete(category._id)}
                      className={`text-xs text-white px-2 py-1 rounded ${loading && did && did === category._id ? "cursor-not-allowed bg-red-400" : "cursor-pointer bg-red-500 hover:bg-red-600"}`}
                    >
                      {loading && did && did === category._id ?<BeatLoader color="#FFFFFF" size={3} /> :"Delete"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-center select-none text-gray-500 text-3xl">
                <td colSpan={3} className="px-2 py-1">
                  No Category Available.
                </td>
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
