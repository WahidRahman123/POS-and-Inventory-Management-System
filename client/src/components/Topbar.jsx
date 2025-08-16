import React from "react";
import { Link } from "react-router-dom";

const Topbar = () => {
  return (
    <div className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <Link to="/">
        <h1 className="text-lg font-bold">Dashboard</h1>
      </Link>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Admin</span>
        <img
          src="/avatar.png"
          alt="User Avatar"
          className="w-8 h-8 rounded-full border"
        />
      </div>
    </div>
  );
};

export default Topbar;
