import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser, deleteUser, fetchUsers } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import dayjs from "../utils/date.js";

const UserManagement = () => {
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, []);

  const { users, loading, error, toggle } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [aid, setAid] = useState(null);
  const [did, setDid] = useState(null);
  const [passerror, setPasserror] = useState(null);
  const [userInput, setUserInput] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    role: "cashier",
  });

  const handleDelete = async (uid) => {
    try {
      if (window.confirm("Are you sure you want to delete the User?")) {
        setDid(uid);
        await dispatch(deleteUser(uid)).unwrap();
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
      if (userInput.password !== userInput.confirmPassword) {
        setPasserror("*Password does not match!");
        return;
      } else {
        setPasserror(null);
        await dispatch(
          addUser({
            name: userInput.name,
            password: userInput.password,
            role: userInput.role,
          })
        ).unwrap();

        setUserInput({
          name: "",
          password: "",
          confirmPassword: "",
          role: "cashier",
        });
        setAid(null);
      }
    } catch (error) {
      console.log("User Addition Failed!");
      setAid(null);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      // console.log('fetching...');
      dispatch(fetchUsers());
    }
  }, [dispatch, toggle]);

  //? Glimpse Stopper
  if (user && user.role !== "admin") return;

  return (
    <>
      <title>{`User Management | ${import.meta.env.VITE_COMPANY_NAME}`}</title>

      <div className="bg-slate-50 min-h-screen p-6 font-sans">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>

        {/* Add New User */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center bg-gray-50 mb-5"
        >
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={userInput.name}
              onChange={(e) =>
                setUserInput({ ...userInput, name: e.target.value })
              }
              placeholder="Username"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
              required
            />
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={userInput.password}
              onChange={(e) =>
                setUserInput({ ...userInput, password: e.target.value })
              }
              placeholder="Password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
              required
            />
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={userInput.confirmPassword}
              onChange={(e) =>
                setUserInput({ ...userInput, confirmPassword: e.target.value })
              }
              placeholder="Confirm Password"
              className={`w-full border border-gray-300 rounded-md px-3 py-2 ${passerror ? "" : "mb-1"
                }`}
              required
            />
            <div className="text-red-700 text-sm mb-2">
              {passerror ? passerror : ""}
            </div>

            <label className="block text-sm font-medium mb-1">Account Type</label>
            <select
              value={userInput.role}
              onChange={(e) =>
                setUserInput({ ...userInput, role: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
              required
            >
              <option value="admin">Admin</option>
              <option value="cashier">Cashier</option>
            </select>
            <button
              type="submit"
              disabled={loading && aid ? true : false}
              className={`w-full text-white font-semibold py-2 rounded-md ${loading && aid
                ? "cursor-not-allowed bg-blue-500"
                : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                }`}
            >
              {loading && aid ? "Adding..." : "Add New User"}
            </button>
          </div>
        </form>

        {/* All Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-lg text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Username</th>
                <th className="p-2 text-left">Account Type</th>
                <th className="p-2 text-left">Date/Time Created</th>
                <th className="p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr className="hover:bg-gray-50" key={index}>
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.role}</td>
                    <td className="p-2">
                      {user.createdAt ? (
                        dayjs(user.createdAt)
                          .tz("Asia/Dhaka")
                          .format("DD-MM-YYYY / hh:mm A")
                      ) : (
                        <span className="font-bold">-</span>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleDelete(user._id)}
                        disabled={
                          user._id === "689e359f51378e685a5e5ad5" ||
                            (loading && did && did === user._id)
                            ? true
                            : false
                        }
                        className={`text-xs  text-white px-2 py-1 rounded  ${user._id === "689e359f51378e685a5e5ad5" ||
                          (loading && did && did === user._id)
                          ? "cursor-not-allowed bg-red-400"
                          : "hover:bg-red-600 bg-red-500 cursor-pointer"
                          }`}
                      >
                        {loading && did && did === user._id
                          ? "Deleting..."
                          : "Delete User"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="text-center text-gray-500 text-lg select-none">
                  <td colSpan={4} className="px-4 py-2">
                    No Users Available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default UserManagement;
