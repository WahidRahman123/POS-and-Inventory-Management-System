import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSpecificCategory,
  updateCategory,
} from "../features/category/categorySlice";
import { useNavigate, useParams } from "react-router-dom";

const EditCategoryPage = () => {
  //For Autherization
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  //* Date:
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
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    name: "",
  });
  const [uid, setUid] = useState(null);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setUid('Running');
      await dispatch(updateCategory({ id, info: category })).unwrap();
      setUid(null);
      navigate("/category");
    } catch (error) {
      console.log("Update Failed!");
      setUid(null);
    }
  };

  useEffect(() => {
    dispatch(fetchSpecificCategory(id));
  }, [dispatch]);


  useEffect(() => {
    if (categoryById && categoryById.name) {
      setCategory({
        ...category,
        name: categoryById.name,
      });
    }
  }, [categoryById]);

  return (
    <div className="bg-slate-50 min-h-screen p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <span className="text-sm text-gray-500">
          {tdate[2]}, {tdate[0]} {tdate[1]} | {user ? user.role : ""}
        </span>
      </div>

      {/* Add New */}
      <form onSubmit={handleSubmit} className="max-w-md mb-6">
        <label className="block text-sm font-medium mb-1">Category Name</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={category.name}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
            placeholder="Enter Category Name Here"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2"
            required
          />
          <button
            type="submit"
            disabled={loading && uid ? true : false}
            className={` text-white px-4 py-2 rounded-md  ${loading && uid ? "cursor-not-allowed bg-blue-500" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"}`}
          >
            {loading && uid ? "Updating..." : "Update Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategoryPage;
