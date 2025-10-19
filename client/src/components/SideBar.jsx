import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const SideBar = ({ closeSidebar }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleOnClick = () => {
    navigate("/changepassword");
    closeSidebar?.(); 
  };

  return (
    <div className="w-64 bg-gray-200 flex flex-col min-h-screen">
      <div className="p-6 text-lg font-bold border-b border-gray-300">
       POS-IMS
      </div>

      <nav className="flex flex-col mt-4">
        <Link to="/" onClick={closeSidebar} className="flex items-center p-4 hover:bg-gray-300">
          <span className="mr-3">📊</span> Dashboard
        </Link>
        <Link to="/product" onClick={closeSidebar} className="flex items-center p-4 hover:bg-gray-300">
          <span className="mr-3">📦</span> Inventory
        </Link>
        <Link to="/product/add" onClick={closeSidebar} className="flex items-center p-4 hover:bg-gray-300">
          <span className="mr-3">➕</span> Add Item
        </Link>
        <Link to="/purchase" onClick={closeSidebar} className="flex items-center p-4 hover:bg-gray-300">
          <span className="mr-3">📅</span> Purchase
        </Link>
        {user?.role === "admin" && (
          <Link to="/sales-report" onClick={closeSidebar} className="flex items-center p-4 hover:bg-gray-300">
            <span className="mr-3">📅</span> Sales Report
          </Link>
        )}

        <Link to="/category" onClick={closeSidebar} className="flex items-center p-4 hover:bg-gray-300">
          <span className="mr-3">🏷️</span> Categories
        </Link>

        <Link to="/customer" onClick={closeSidebar} className="flex items-center p-4 hover:bg-gray-300">
          <span className="mr-3">👤</span> Customer
        </Link>
        <Link to="/customer-statement" onClick={closeSidebar} className="flex items-center p-4 hover:bg-gray-300">
          <span className="mr-3">📅</span> Customer Statement 
        </Link>

        <Link to="/purchaser" onClick={closeSidebar} className="flex items-center p-4 hover:bg-gray-300">
          <span className="mr-3">👤</span> Supplier
        </Link>
        <Link to="/purchaser-statement" onClick={closeSidebar} className="flex items-center p-4 hover:bg-gray-300">
          <span className="mr-3">📅</span> Supplier Statement 
        </Link>
        <Link to="/expense-management" onClick={closeSidebar} className="flex items-center p-4 hover:bg-gray-300">
          <span className="mr-3">💸</span> Expense Management
        </Link>





        {user?.role === "admin" && (
          <Link to="/users" onClick={closeSidebar} className="flex items-center p-4 hover:bg-gray-300">
            <span className="mr-3">👤</span> User Management
          </Link>
        )}

        <Link to="/point-of-sale" onClick={closeSidebar} className="flex items-center p-4 hover:bg-gray-300">
          <span className="mr-3">📠</span> POS
        </Link>
      </nav>

      <div className="flex justify-center mt-2 mb-5">
        <button
          onClick={handleOnClick}
          className="w-[60%] px-2 py-1 bg-blue-700 text-white rounded-lg hover:bg-blue-800 cursor-pointer"
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default SideBar;