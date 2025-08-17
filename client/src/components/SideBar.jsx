import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SideBar = () => {
  const navigate = useNavigate();
  
  const handleOnClick = () => {
    navigate('/changepassword/id');
  }

  return (
    <div className="w-64 bg-gray-200 flex flex-col min-h-screen">
      <div className="p-6 text-lg font-bold border-b border-gray-300">
        POS and Inventory Management System
      </div>
      <nav className="flex flex-col mt-4">
        <Link
          to="/"
          className="flex items-center p-4 hover:bg-gray-300"
        >
          <span className="mr-3">📊</span> Dashboard
        </Link>
        <Link
          to="/product"
          className="flex items-center p-4 hover:bg-gray-300"
        >
          <span className="mr-3">📦</span> Inventory
        </Link>
        <Link
          to="/product/add"
          className="flex items-center p-4 hover:bg-gray-300"
        >
          <span className="mr-3">➕</span> Add Item
        </Link>
        <Link
          to="/sales-report"
          className="flex items-center p-4 hover:bg-gray-300"
        >
          <span className="mr-3">📅</span> Sales Report
        </Link>
        <Link
          to="/category"
          className="flex items-center p-4 hover:bg-gray-300"
        >
          <span className="mr-3">🏷️</span> Categories
        </Link>
        <Link
          to="/users"
          className="flex items-center p-4 hover:bg-gray-300"
        >
          <span className="mr-3">👤</span> User Management
        </Link>
        <Link
          to="/point-of-sale"
          className="flex items-center p-4 hover:bg-gray-300"
        >
          <span className="mr-3">📠</span> POS
        </Link>
      </nav>

      <div className="flex justify-center mt-2">
        <button onClick={handleOnClick} className="w-[60%] px-2 py-1 bg-blue-700 text-white rounded-lg cursor-pointer hover:bg-blue-800">Change Password</button>
      </div>
    </div>
  );
};

export default SideBar;
