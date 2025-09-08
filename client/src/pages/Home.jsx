// import React from "react";
// import SideBar from "../components/SideBar";
// import Topbar from "../components/Topbar";
// import Footer from "../components/Footer";
// import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import ProductLowQuantityMsg from "../components/ProductLowQuantityMsg";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import { countLowQuantityProduct } from "../features/product/productSlice";
// import { jwtDecode } from "jwt-decode";
// import { setUserToNull } from "../features/user/authSlice";

// const Home = () => {
//   const { user } = useSelector((state) => state.auth);
//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//     }
//   }, []);

//   const { count } = useSelector((state) => state.product);
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     // console.log('called')
//     if (user) {
//       dispatch(countLowQuantityProduct());
//     }
//   }, [location.pathname, count]);

//   //* Token Expiry:
//   function isTokenExpired(token) {
//     if (!token) return true;
//     try {
//       const decoded = jwtDecode(token);
//       const now = Math.floor(Date.now() / 1000);
//       const exp = Math.floor(decoded.exp);

//       return exp <= now;
//     } catch {
//       return true;
//     }
//   }

//   const onExpired = () => {
//     localStorage.removeItem("userInfo");
//     localStorage.removeItem("userToken");
//     dispatch(setUserToNull());
//     navigate("/login");
//   };

//   let timerID;
//   const MAX_TIMEOUT = 24 * 60 * 60 * 1000;

//   function scheduleLogout(timeUntilExpiry, onExpired) {
//     if (timeUntilExpiry <= 0) {
//       onExpired();
//       return;
//     }
//     const nextTimeout = Math.min(timeUntilExpiry * 1000, MAX_TIMEOUT);
//     if (timerID) clearTimeout(timerID);
//     timerID = setTimeout(() => {
//       scheduleLogout(timeUntilExpiry - nextTimeout / 1000, onExpired);
//     }, nextTimeout);
//   }

//   useEffect(() => {
//     if (user) {
//       const token = localStorage.getItem("userToken");
//       const expired = isTokenExpired(token);

//       if (expired) {
//         onExpired();
//       } else {
//         const decoded = jwtDecode(token);
//         const now = Date.now() / 1000;
//         const timeUntilExpiry = decoded.exp - now;

//         if (timeUntilExpiry <= 0) {
//           onExpired();
//         } else {
//           scheduleLogout(timeUntilExpiry, onExpired);
//         }
//       }
//     }
//   }, []);

//   //? Glimpse Stopper
//   if (!user) return;

//   return (
//     <>
//       <ToastContainer />
//       <div className="flex min-h-screen bg-gray-50">
//         {/* Sidebar */}
//         <SideBar />

//         {/* Main Content Area */}
//         <div className="flex flex-col flex-1">
//           {/* Topbar */}
//           <Topbar />
//           {count > 0 ? <ProductLowQuantityMsg count={count} /> : ""}

//           {/* Page Content */}
//           <main className="flex-1 p-6">
//             <Outlet />
//           </main>

//           {/* Footer */}
//           <Footer />
//         </div>
//       </div>
//     </>
//   );
// };

// export default Home;


import React, { useState } from "react";
import SideBar from "../components/SideBar";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProductLowQuantityMsg from "../components/ProductLowQuantityMsg";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { countLowQuantityProduct } from "../features/product/productSlice";
import { jwtDecode } from "jwt-decode";
import { setUserToNull } from "../features/user/authSlice";

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { count } = useSelector((state) => state.product);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (user) dispatch(countLowQuantityProduct());
  }, [location.pathname, user, dispatch]);

  // Token expiry logic...
  function isTokenExpired(token) {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      return decoded.exp <= Math.floor(Date.now() / 1000);
    } catch {
      return true;
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (isTokenExpired(token)) {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      dispatch(setUserToNull());
      navigate("/login");
    }
  }, [dispatch, navigate]);

  if (!user) return null;

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-200
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:relative md:translate-x-0 md:z-auto`}
        >
          <SideBar closeSidebar={() => setSidebarOpen(false)} />
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex flex-col flex-1">
          <Topbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          {count > 0 && <ProductLowQuantityMsg count={count} />}

          <main className="flex-1 p-6">
            <Outlet />
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;