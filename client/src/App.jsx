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

function App() {
  const { value } = useSelector((state) => state.counter);
  const dispatch = useDispatch();

  return (
      <Routes>
        {/* Login page without layout */}
        <Route path="/login" element={<Login />} />

        {/* All other pages with Layout */}
        <Route path="/" element={<Home />}>
          <Route path="/" element={<Dashboard />} />

          <Route path="/category" element={<Category />} />
          <Route path="/category/:id/edit" element={<EditCategoryPage />} />

          <Route path="/product" element={<Product />} />
          <Route path="/product/add" element={<AddItem />} />
          <Route path="/product/:id/edit" element={<EditProductPage />} />
          <Route path="/product/:id/add-stock" element={<AddStock />} />

          <Route path="/point-of-sale" element={<PointOfSale />} />
          <Route path="/sales-report" element={<SalesReport />} />
          <Route path="/users" element={<UserManagement />} />
        </Route>
      </Routes>
  );
}

export default App;
