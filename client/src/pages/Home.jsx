import React from "react";
import SideBar from "../components/SideBar";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ProductLowQuantityMsg from "../components/ProductLowQuantityMsg";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { countLowQuantityProduct } from "../features/product/productSlice";

const Home = () => {
  const { count } = useSelector(state => state.product);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // console.log('called')
    dispatch(countLowQuantityProduct());
  }, [location.pathname, count])
  
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
          {count > 0 ? <ProductLowQuantityMsg count={count} /> : ''}
          

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
