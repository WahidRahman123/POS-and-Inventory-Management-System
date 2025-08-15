// import { useState } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { increment } from "./features/counter/counter";
// import Product from "./pages/Product";
// import AddItem from "./pages/AddItem";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import Category from "./pages/Category";
// import AddStock from "./pages/AddStock";
// import SalesReport from "./pages/SalesReport";
// import UserManagement from "./pages/UserManagement";
// import EditProductPage from "./pages/EditProductPage";
// import EditCategoryPage from "./pages/EditCategoryPage";
// import Layout from "./components/Layout";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// function App() {  
//   const { value } = useSelector(state => state.counter);
//   const dispatch = useDispatch();
  
//   return (
//    <Router>
//       <Routes>
//          {/* Login page without layout */}
//         <Route path="/login" element={<Login />} />

//         {/* All other pages with layout */}
//         <Route
//           path="/"
//           element={
//             <Layout>
//               <h1 className="text-red-500">Hello World {value}</h1>
//             </Layout>
//           }
//         />
//         <Route
//           path="/dashboard"
//           element={
//             <Layout>
//               <Dashboard />
//             </Layout>
//           }
//         />
//         <Route
//           path="/category"
//           element={
//             <Layout>
//               <Category />
//             </Layout>
//           }
//         />
//         <Route
//           path="/add-item"
//           element={
//             <Layout>
//               <AddItem />
//             </Layout>
//           }
//         />
//         <Route
//           path="/add-stock"
//           element={
//             <Layout>
//               <AddStock />
//             </Layout>
//           }
//         />
//         <Route
//           path="/product"
//           element={
//             <Layout>
//               <Product />
//             </Layout>
//           }
//         />
//         <Route
//           path="/sales-report"
//           element={
//             <Layout>
//               <SalesReport />
//             </Layout>
//           }
//         />
//         <Route
//           path="/users"
//           element={
//             <Layout>
//               <UserManagement />
//             </Layout>
//           }
//         />
//         <Route
//           path="/edit-product-page/:id"
//           element={
//             <Layout>
//               <EditProductPage />
//             </Layout>
//           }
//         />
//         <Route
//           path="/edit-category-page/:id"
//           element={
//             <Layout>
//               <EditCategoryPage />
//             </Layout>
//           }
//         />
//         {/* <Route path="/" element={<h1 className="text-red-500">Hello World {value}</h1>} />
//         <Route path="/login" element={<Login/>}/>
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/category" element={<Category />} /> 
//         <Route path="/add-item" element={<AddItem />} />
//         <Route path="/add-stock" element={<AddStock />} />
//         <Route path="/product" element={<Product />} />
//         <Route path="/sales-report" element={<SalesReport />} />
//         <Route path="/users" element={<UserManagement />} />
//         <Route path="/edit-product-page/:id" element={<EditProductPage />} />
//         <Route path="/edit-category-page/:id" element={<EditCategoryPage />} /> */}



        
        
//       </Routes>
//     </Router>
//     // <>
//     //   <h1 className="text-red-500">Hello World {value}</h1>
//     //   <button onClick={() => dispatch(increment())}>Click Me</button>
//     // </>
//   )
// }

// export default App

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

function App() {
  const { value } = useSelector((state) => state.counter);
  const dispatch = useDispatch();

  return (
    <Router>
      <Routes>
        {/* Login page without layout */}
        <Route path="/login" element={<Login />} />

        {/* All other pages with Layout */}
        <Route
          path="/"
          element={
            <Layout>
              <h1 className="text-red-500">Hello World {value}</h1>
            </Layout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/category"
          element={
            <Layout>
              <Category />
            </Layout>
          }
        />
        <Route
          path="/add-item"
          element={
            <Layout>
              <AddItem />
            </Layout>
          }
        />
        <Route
          path="/add-stock"
          element={
            <Layout>
              <AddStock />
            </Layout>
          }
        />
        <Route
          path="/product"
          element={
            <Layout>
              <Product />
            </Layout>
          }
        />
        <Route
          path="/point-of-sale"
          element={
            <Layout>
              <PointOfSale />
            </Layout>
          }
        />
        <Route
          path="/sales-report"
          element={
            <Layout>
              <SalesReport />
            </Layout>
          }
        />
        <Route
          path="/users"
          element={
            <Layout>
              <UserManagement />
            </Layout>
          }
        />
        <Route
          path="/edit-product-page/:id"
          element={
            <Layout>
              <EditProductPage />
            </Layout>
          }
        />
        <Route
          path="/edit-category-page/:id"
          element={
            <Layout>
              <EditCategoryPage />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

