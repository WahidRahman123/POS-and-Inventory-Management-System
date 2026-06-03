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
    <div className="w-64 bg-gray-200 flex flex-col h-screen shadow-xl ">
      <div className="p-6 text-lg font-bold border-b border-gray-300">
        ELITE BATTERY
      </div>

      <nav className="flex flex-col mt-4 overflow-y-auto">
        <Link
          to="/"
          onClick={closeSidebar}
          className="flex items-center p-4 hover:bg-gray-300"
        >
          <span className="mr-3">📊</span> Dashboard
        </Link>
        <Link
          to="/point-of-sale"
          onClick={closeSidebar}
          className="flex items-center p-4 hover:bg-gray-300"
        >
          <span className="mr-3">📠</span> POS
        </Link>

        <Link
          to="/product"
          onClick={closeSidebar}
          className="flex items-center p-4 hover:bg-gray-300"
        >
          <span className="mr-3">📦</span> Inventory
        </Link>
        <Link
          to="/product/add"
          onClick={closeSidebar}
          className="flex items-center p-4 hover:bg-gray-300"
        >
          <span className="mr-3">➕</span> Add Item
        </Link>
        <Link
          to="/purchase"
          onClick={closeSidebar}
          className="flex items-center p-4 hover:bg-gray-300"
        >
          <span className="mr-3">📅</span> Purchase
        </Link>
        <Link
            to="/product-exchange"
            onClick={closeSidebar}
            className="flex items-center p-4 hover:bg-gray-300"
          >
            <span className="mr-3">📅</span> Product Exchange
          </Link>
        <Link
            to="/exchange-product-sell"
            onClick={closeSidebar}
            className="flex items-center p-4 hover:bg-gray-300"
          >
            <span className="mr-3">📅</span> Exchange Product Sell
          </Link>
          <Link
            to="/company-return"
            onClick={closeSidebar}
            className="flex items-center p-4 hover:bg-gray-300"
          >
            <span className="mr-3">📅</span> Exchange Return To Company
          </Link>
          <Link
            to="/company-sales-return"
            onClick={closeSidebar}
            className="flex items-center p-4 hover:bg-gray-300"
          >
            <span className="mr-3">📅</span> Sales Return To Company
          </Link>

          <Link
            to="/purchase-return"
            onClick={closeSidebar}
            className="flex items-center p-4 hover:bg-gray-300"
          >
            <span className="mr-3">📅</span> Purchase Return
          </Link>
          <Link
            to="/purchase-return-statement"
            onClick={closeSidebar}
            className="flex items-center p-4 hover:bg-gray-300"
          >
            <span className="mr-3">📅</span> Purchase Return Statement
          </Link>
          <Link
            to="/sales-return"
            onClick={closeSidebar}
            className="flex items-center p-4 hover:bg-gray-300"
          >
            <span className="mr-3">📅</span> Sales Return
          </Link>
          <Link
            to="/sales-return-statement"
            onClick={closeSidebar}
            className="flex items-center p-4 hover:bg-gray-300"
          >
            <span className="mr-3">📅</span> Sales Return Statement
          </Link>

        {user?.role === "admin" && (
          <Link
            to="/sales-report"
            onClick={closeSidebar}
            className="flex items-center p-4 hover:bg-gray-300"
          >
            <span className="mr-3">📅</span> Sales Report
          </Link>
          
        )}

        <Link
          to="/category"
          onClick={closeSidebar}
          className="flex items-center p-4 hover:bg-gray-300"
        >
          <span className="mr-3">🏷️</span> Categories
        </Link>

        <Link
          to="/customer"
          onClick={closeSidebar}
          className="flex items-center p-4 hover:bg-gray-300"
        >
          <span className="mr-3">👤</span> Customer
        </Link>
        <Link to="/customer-statement" onClick={closeSidebar} className="flex items-center p-4 hover:bg-gray-300">
          <span className="mr-3">📅</span> Customer Statement 
        </Link>

        <Link
          to="/purchaser"
          onClick={closeSidebar}
          className="flex items-center p-4 hover:bg-gray-300"
        >
          <span className="mr-3">👤</span> Supplier
        </Link>
        <Link
          to="/purchaser-statement"
          onClick={closeSidebar}
          className="flex items-center p-4 hover:bg-gray-300"
        >
          <span className="mr-3">📅</span> Supplier Statement
        </Link>
        <Link to="/expense-management" onClick={closeSidebar} className="flex items-center p-4 hover:bg-gray-300">
          <span className="mr-3">💸</span> Expense Management
        </Link>

        {user?.role === "admin" && (
          <Link
            to="/users"
            onClick={closeSidebar}
            className="flex items-center p-4 hover:bg-gray-300"
          >
            <span className="mr-3">👤</span> User Management
          </Link>
        )}
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
