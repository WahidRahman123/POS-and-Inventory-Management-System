import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Product from "./pages/Product";
import AddItem from "./pages/AddItem";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Category from "./pages/Category";
import AddStock from "./pages/AddStock";
import SalesReport from "./pages/SalesReport";
import UserManagement from "./pages/UserManagement";
import EditProductPage from "./pages/EditProductPage";
import EditCategoryPage from "./pages/EditCategoryPage";
import PointOfSale from "./pages/PointOfSale";
import Home from "./pages/Home";
import ChangePassword from "./pages/ChangePassword";
import InvoicePage from "./pages/InvoicePage";
import LowQuantityProductsPage from "./pages/LowQuantityProductsPage";
import EditDue from "./pages/EditDue";

function App() {
  const { value } = useSelector((state) => state.counter);
  const dispatch = useDispatch();

  return (
      <Routes>
        {/* Login page without layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/invoice" element={<InvoicePage />} />


        {/* All other pages with Layout */}
        <Route path="/" element={<Home />}>
          <Route path="/" element={<Dashboard />} />

          <Route path="/category" element={<Category />} />
          <Route path="/category/:id/edit" element={<EditCategoryPage />} />

          <Route path="/product" element={<Product />} />
          <Route path="/product/add" element={<AddItem />} />
          <Route path="/product/:id/edit" element={<EditProductPage />} />
          <Route path="/product/:id/add-stock" element={<AddStock />} />
          <Route path="/product/low-stock" element={<LowQuantityProductsPage />} />

          <Route path="/point-of-sale" element={<PointOfSale />} />
          {/* for admin */}
          <Route path="/sales-report" element={<SalesReport />} />
          <Route path="/sales-report/:id/edit-due" element={<EditDue />} />
          {/* for admin */}
          <Route path="/users" element={<UserManagement />} />
          <Route path="/changepassword" element={<ChangePassword />} />
        </Route>
      </Routes>
  );
}

export default App;
