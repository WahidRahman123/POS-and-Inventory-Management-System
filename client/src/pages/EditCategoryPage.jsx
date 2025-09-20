import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpecificCategory, updateCategory } from "../features/category/categorySlice";
import { useNavigate, useParams } from "react-router-dom";

const EditCategoryPage = () => {
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

  const { categoryById, loading } = useSelector((state) => state.category);
  const dispatch = useDispatch();

  const [category, setCategory] = useState({ name: "" });
  const [uid, setUid] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUid("Running");
    try {
      await dispatch(updateCategory({ id, info: category })).unwrap();
      navigate("/category");
    } catch {
      console.log("Update Failed!");
    } finally {
      setUid(null);
    }
  };

  useEffect(() => {
    if (!user) navigate("/login");
    dispatch(fetchSpecificCategory(id));
  }, [user, id, navigate, dispatch]);

  useEffect(() => {
    if (categoryById?.name) {
      setCategory({ name: categoryById.name });
    }
  }, [categoryById]);

  return (
    <div className="bg-slate-50 min-h-screen p-3 sm:p-4 md:p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h1 className="text-xl sm:text-2xl font-bold">Edit Category</h1>
        <span className="text-xs sm:text-sm text-gray-500">
          {tdate[2]}, {tdate[0]} {tdate[1]} | {user?.role || ""}
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-md">
        <label className="block text-sm font-medium mb-1">Category Name</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={category.name}
            onChange={(e) => setCategory({ name: e.target.value })}
            placeholder="Enter new name"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
            required
          />
          <button
            type="submit"
            disabled={loading && uid}
            className={`text-white px-3 py-2 rounded-md text-sm ${
              loading && uid
                ? "cursor-not-allowed bg-blue-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading && uid ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategoryPage;