import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/user/authSlice";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const Login = () => {
  const { user, loading } = useSelector((state) => state.auth);
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  const [userInput, setUserInput] = useState({
    name: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await dispatch(login(userInput)).unwrap();
      navigate("/");
    } catch (error) {
      console.log("Login Failed!");
    }
  };
  return (
    <>
      <ToastContainer />
      <div className="flex flex-col min-h-screen bg-slate-100">
        {/* Topbar */}
        <header className="bg-blue-600 text-white py-4 shadow-md">
          <h1 className="text-center text-xl font-bold">Sobuj Auto</h1>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm bg-white shadow-xl rounded-lg p-8 space-y-6"
          >
            <h2 className="text-2xl font-bold text-center text-blue-600">
              Login
            </h2>

            <input
              type="text"
              placeholder="Username"
              value={userInput.name}
              onChange={(e) =>
                setUserInput({ ...userInput, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={userInput.password}
              onChange={(e) =>
                setUserInput({ ...userInput, password: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-500 disabled:cursor-not-allowed"
            >
              {loading ? "Loging in..." : "Login"}
            </button>
          </form>
        </main>

        {/* Footer */}
        <footer className="bg-gray-200 py-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} NexOrigin Software. All rights reserved.
        </footer>
      </div>
    </>
  );
};

export default Login;
