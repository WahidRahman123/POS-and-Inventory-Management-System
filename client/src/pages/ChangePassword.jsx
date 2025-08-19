import React, { useEffect, useState } from "react";
import { changeUserPassword } from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  const [inputUser, setInputUser] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passerror, setPasserror] = useState(null);
  const [passSameErr, setpassSameErr] = useState(null);
  // const id = "689e35b551378e685a5e5ad7"; //! Change it
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (inputUser.newPassword !== inputUser.confirmNewPassword) {
        setPasserror("*New Password does not match!");
        return;
      } else if (inputUser.oldPassword === inputUser.newPassword) {
        setpassSameErr("*Old and new password cannot be same!");
        return;
      } else {
        setPasserror(null);
        setpassSameErr(null);
        await dispatch(
          changeUserPassword({
            id: user._id,
            info: {
              oldPassword: inputUser.oldPassword,
              newPassword: inputUser.newPassword,
            },
          })
        ).unwrap();
        navigate("/");
      }
    } catch (error) {
      console.log("Something Went Wrong!");
    }
  };

  
  return (
    <div className="bg-slate-50 min-h-screen p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Change Password</h1>
      </div>

      {/* Add New User */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center bg-gray-50 mb-5"
      >
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <label className="block text-sm font-medium mb-1">Old Password</label>
          <input
            type="password"
            value={inputUser.oldPassword}
            onChange={(e) =>
              setInputUser({ ...inputUser, oldPassword: e.target.value })
            }
            placeholder="Old Password"
            className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
              passSameErr ? "" : "mb-1"
            }`}
            required
          />
          <div className="text-red-700 text-sm mb-2">
            {passSameErr ? passSameErr : ""}
          </div>

          <label className="block text-sm font-medium mb-1">New Password</label>
          <input
            type="password"
            placeholder="New Password"
            value={inputUser.newPassword}
            onChange={(e) =>
              setInputUser({ ...inputUser, newPassword: e.target.value })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
            required
          />
          <label className="block text-sm font-medium mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            placeholder="Confirm New Password"
            value={inputUser.confirmNewPassword}
            onChange={(e) =>
              setInputUser({ ...inputUser, confirmNewPassword: e.target.value })
            }
            className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
              passerror ? "" : "mb-1"
            }`}
            required
          />
          <div className="text-red-700 text-sm mb-2">
            {passerror ? passerror : ""}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
