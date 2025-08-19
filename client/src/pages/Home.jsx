import React from "react";
import SideBar from "../components/SideBar";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ProductLowQuantityMsg from "../components/ProductLowQuantityMsg";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { countLowQuantityProduct } from "../features/product/productSlice";
import { jwtDecode } from "jwt-decode";
import { setUserToNull } from "../features/user/authSlice";

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  const { count } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // console.log('called')
    if (user) {
      dispatch(countLowQuantityProduct());
    }
  }, [location.pathname, count]);

  //* Token Expiry:
  function isTokenExpired(token) {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      const exp = Math.floor(decoded.exp);

      return exp <= now;
    } catch {
      return true;
    }
  }

  const onExpired = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userToken");
    dispatch(setUserToNull());
    navigate("/login");
  };

  let timerID;
  const MAX_TIMEOUT = 24 * 60 * 60 * 1000;

  function scheduleLogout(timeUntilExpiry, onExpired) {
    if (timeUntilExpiry <= 0) {
      onExpired();
      return;
    }
    const nextTimeout = Math.min(timeUntilExpiry * 1000, MAX_TIMEOUT);
    if (timerID) clearTimeout(timerID);
    timerID = setTimeout(() => {
      scheduleLogout(timeUntilExpiry - nextTimeout / 1000, onExpired);
    }, nextTimeout);
  }

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("userToken");
      const expired = isTokenExpired(token);

      if (expired) {
        onExpired();
      } else {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        const timeUntilExpiry = decoded.exp - now;

        if (timeUntilExpiry <= 0) {
          onExpired();
        } else {
          scheduleLogout(timeUntilExpiry, onExpired);
        }
      }
    }
  }, []);

  //? Glimpse Stopper
  if (!user) return;

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <SideBar />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1">
          {/* Topbar */}
          <Topbar />
          {count > 0 ? <ProductLowQuantityMsg count={count} /> : ""}

          {/* Page Content */}
          <main className="flex-1 p-6">
            <Outlet />
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
