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

  
  const { categoryById } = useSelector((state) => state.category);

  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    name: "",
  });

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await dispatch(updateCategory({ id, info: category })).unwrap();
      navigate("/category");
    } catch (error) {
      console.log("Update Failed!");
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
          Friday, December 2023 | admin
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
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Update Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategoryPage;
