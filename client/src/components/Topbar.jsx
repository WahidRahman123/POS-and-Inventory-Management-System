import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../features/user/authSlice";
import adminImage from '../assets/admin.png';
import cashierImage from '../assets/cashier.png';

const Topbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);


  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  }
  return (
    <div className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <Link to="/">
        <h1 className="text-lg font-bold">Dashboard</h1>
      </Link>
      <div className="flex items-center gap-4">
        <button onClick={handleLogout} className="px-2 py-1 bg-red-500 text-white text-sm rounded-lg cursor-pointer hover:bg-red-600">Logout</button>
        <span className="text-sm text-gray-600">{user && user.role === 'admin' ? 'Admin': 'Cashier'}</span>
        <img
          src={user && user.role === 'admin' ? adminImage : cashierImage}
          alt="User Avatar"
          className="w-8 h-8 rounded-full border"
        />
      </div>
    </div>
  );
};

export default Topbar;
