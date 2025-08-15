// import React from 'react'

// const SideBar = () => {
//   return (
//     <div className="w-64 bg-gray-200 flex flex-col">
//     <div className="p-6 text-lg font-bold border-b border-gray-300">
//       POS and Inventory Management System
//     </div>
//     <nav className="flex flex-col mt-4">
//       <a href="/dashboard" className="flex items-center p-4 hover:bg-gray-300">
//         <span className="mr-3">📊</span> Dashboard
//       </a>
//       <a href="/inventory" className="flex items-center p-4 hover:bg-gray-300">
//         <span className="mr-3">📦</span> Inventory
//       </a>
//       <a href="/add-item" className="flex items-center p-4 hover:bg-gray-300">
//         <span className="mr-3">➕</span> Add Item
//       </a>
//       <a href="/sales-report" className="flex items-center p-4 hover:bg-gray-300">
//         <span className="mr-3">📅</span> Sales Report
//       </a>
//       <a href="/categories" className="flex items-center p-4 hover:bg-gray-300">
//         <span className="mr-3">🏷️</span> Categories
//       </a>
//       <a href="/user-management" className="flex items-center p-4 hover:bg-gray-300">
//         <span className="mr-3">👤</span> User Management
//       </a>
//     </nav>
//   </div>

//   )
// }

// export default SideBar

import React from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="w-64 bg-gray-200 flex flex-col min-h-screen">
      <div className="p-6 text-lg font-bold border-b border-gray-300">
        POS and Inventory Management System
      </div>
      <nav className="flex flex-col mt-4">
        <Link
          to="/dashboard"
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
          to="/add-item"
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
      </nav>
    </div>
  );
};

export default SideBar;
