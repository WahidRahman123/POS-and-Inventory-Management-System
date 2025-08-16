import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { increment } from "./features/counter/counter";

import Layout from "./components/Layout";
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
    <Router>
      <Routes>
        {/* Login page without layout */}
        <Route path="/login" element={<Login />} />

        {/* All other pages with Layout */}
        <Route path="/" element={<Home />}>
          <Route
            path="/dashboard"
            element={
                <Dashboard />
            }
          />
          <Route
            path="/category"
            element={
                <Category />
            }
          />
          <Route
            path="/add-item"
            element={
                <AddItem />
            }
          />
          <Route
            path="/add-stock"
            element={
                <AddStock />
            }
          />
          <Route
            path="/product"
            element={
                <Product />
            }
          />
          <Route
            path="/pointOfSale"
            element={
                <PointOfSale />
            }
          />
          <Route
            path="/salesReport"
            element={
                <SalesReport />
            }
          />
          <Route
            path="/users"
            element={
                <UserManagement />
            }
          />
          <Route
            path="/edit-Product-Page/:id"
            element={
                <EditProductPage />
            }
          />
          <Route
            path="/editPategoryPage/:id"
            element={
                <EditCategoryPage />
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
