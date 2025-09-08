// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import { BeatLoader } from "react-spinners"
// import {
//   addCategory,
//   deleteCategory,
//   fetchAllCategories,
// } from "../features/category/categorySlice";

// const Category = () => {
//   const { user } = useSelector((state) => state.auth);
//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//     }
//   }, []);

//   const { categories, loading, error, toggle } = useSelector(
//     (state) => state.category
//   );

//   const dispatch = useDispatch();
//   const [limit, setLimit] = useState(10);
//   const [categoryName, setCategoryName] = useState("");
//   const [aid, setAid] = useState(null);
//   const [did, setDid] = useState(null);
//   const navigate = useNavigate();

//   const handleDelete = async (cid) => {
//     try {
//       if (window.confirm("Are you sure you want to delete the Category?")) {
//         setDid(cid);
//         await dispatch(deleteCategory(cid)).unwrap();
//         setDid(null);
//       }
//     } catch (error) {
//       console.log("Delete Failed!");
//       setDid(null);
//     }
//   };

//   const handleSubmit = async (e) => {
//     try {
//       e.preventDefault();
//       setAid("Running");
//       await dispatch(addCategory({ name: categoryName })).unwrap();
//       setCategoryName("");
//       setAid(null);
//     } catch (error) {
//       console.log("Category Add Failed!");
//       setAid(null);
//     }
//   };

//   useEffect(() => {
//     dispatch(fetchAllCategories());
//   }, [dispatch, toggle]);

//   return (
//     <div className="bg-slate-50 min-h-screen p-6 font-sans">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Categories</h1>
//       </div>

//       {/* Add New */}
//       <form onSubmit={handleSubmit} className="max-w-md mb-6">
//         <label className="block text-sm font-medium mb-1">Category Name</label>
//         <div className="flex gap-2">
//           <input
//             type="text"
//             value={categoryName}
//             onChange={(e) => setCategoryName(e.target.value)}
//             placeholder="Enter Category Name Here"
//             className="flex-1 border border-gray-300 rounded-md px-3 py-2"
//             required
//           />
//           <button
//             type="submit"
//             disabled={loading && aid ? true : false}
//             className={` text-white px-4 py-2 rounded-md  ${
//               loading && aid
//                 ? "cursor-not-allowed bg-blue-500"
//                 : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
//             }`}
//           >
//             {loading && aid ? "Adding..." : "Add Category"}
//           </button>
//         </div>
//       </form>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full bg-white shadow-md rounded-lg text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-2 text-left">#</th>
//               <th className="p-2 text-left">Date/Time</th>
//               <th className="p-2 text-left">Name</th>
//               <th className="p-2 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {categories.length > 0 ? (
//               categories.map((category, index) => (
//                 <tr className="hover:bg-gray-50" key={index}>
//                   <td className="p-2">{index + 1}</td>
//                   <td className="p-2">
//                     {category.createdAt ? (
//                       `${new Date(category.createdAt)
//                         .toLocaleDateString("en-GB", { timeZone: "Asia/Dhaka" })
//                         .replaceAll("/", "-")} / ${new Date(
//                         category.createdAt
//                       ).toLocaleTimeString("en-US", {
//                         timeZone: "Asia/Dhaka",
//                       })}`
//                     ) : (
//                       <span className="font-bold">-</span>
//                     )}
//                   </td>
//                   <td className="p-2">{category.name}</td>
//                   <td className="p-2 flex gap-2 justify-center">
//                     <Link
//                       to={`/category/${category._id}/edit`}
//                       className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
//                     >
//                       Update
//                     </Link>
//                     <button
//                       disabled={loading && did && did === category._id ? true : false}
//                       onClick={() => handleDelete(category._id)}
//                       className={`text-xs text-white px-2 py-1 rounded ${loading && did && did === category._id ? "cursor-not-allowed bg-red-400" : "cursor-pointer bg-red-500 hover:bg-red-600"}`}
//                     >
//                       {loading && did && did === category._id ?<BeatLoader color="#FFFFFF" size={3} /> :"Delete"}
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr className="text-center select-none text-gray-500 text-3xl">
//                 <td colSpan={3} className="px-2 py-1">
//                   No Category Available.
//                 </td>
//               </tr>
//             )}

//             {/* Repeat rows as needed */}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Category;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import { BeatLoader } from "react-spinners";
// import {
//   addCategory,
//   deleteCategory,
//   fetchAllCategories,
// } from "../features/category/categorySlice";

// const Category = () => {
//   const { user } = useSelector((state) => state.auth);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { categories, loading, error, toggle } = useSelector(
//     (state) => state.category
//   );

//   const [limit, setLimit] = useState(10);
//   const [categoryName, setCategoryName] = useState("");
//   const [aid, setAid] = useState(null);
//   const [did, setDid] = useState(null);

//   useEffect(() => {
//     if (!user) navigate("/login");
//   }, [user, navigate]);

//   const handleDelete = async (cid) => {
//     try {
//       if (window.confirm("Are you sure you want to delete the Category?")) {
//         setDid(cid);
//         await dispatch(deleteCategory(cid)).unwrap();
//         setDid(null);
//       }
//     } catch (error) {
//       console.log("Delete Failed!");
//       setDid(null);
//     }
//   };

//   const handleSubmit = async (e) => {
//     try {
//       e.preventDefault();
//       setAid("Running");
//       await dispatch(addCategory({ name: categoryName })).unwrap();
//       setCategoryName("");
//       setAid(null);
//     } catch (error) {
//       console.log("Category Add Failed!");
//       setAid(null);
//     }
//   };

//   useEffect(() => {
//     dispatch(fetchAllCategories());
//   }, [dispatch, toggle]);

//   return (
//     <div className="bg-slate-50 min-h-screen p-3 sm:p-4 md:p-6 font-sans">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
//         <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">Categories</h1>
//       </div>

//       {/* Add New */}
//       <form onSubmit={handleSubmit} className="max-w-md mb-4 sm:mb-6">
//         <label className="block text-sm font-medium mb-1">Category Name</label>
//         <div className="flex flex-col sm:flex-row gap-2">
//           <input
//             type="text"
//             value={categoryName}
//             onChange={(e) => setCategoryName(e.target.value)}
//             placeholder="Enter Category Name Here"
//             className="flex-1 border border-gray-300 rounded-md px-3 py-2"
//             required
//           />
//           <button
//             type="submit"
//             disabled={loading && aid}
//             className={`text-white px-4 py-2 rounded-md text-sm ${
//               loading && aid
//                 ? "cursor-not-allowed bg-blue-400"
//                 : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             {loading && aid ? <BeatLoader color="#FFFFFF" size={3} /> : "Add"}
//           </button>
//         </div>
//       </form>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full bg-white shadow-md rounded-lg text-xs sm:text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-2 text-left">#</th>
//               <th className="p-2 text-left hidden sm:table-cell">Date/Time</th>
//               <th className="p-2 text-left">Name</th>
//               <th className="p-2 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {categories.length > 0 ? (
//               categories.map((category, index) => (
//                 <tr className="hover:bg-gray-50" key={index}>
//                   <td className="p-2">{index + 1}</td>
//                   <td className="p-2 hidden sm:table-cell">
//                     {category.createdAt ? (
//                       `${new Date(category.createdAt).toLocaleDateString(
//                         "en-GB",
//                         { timeZone: "Asia/Dhaka" }
//                       )} / ${new Date(category.createdAt).toLocaleTimeString(
//                         "en-US",
//                         { timeZone: "Asia/Dhaka" }
//                       )}`
//                     ) : (
//                       <span className="font-bold">-</span>
//                     )}
//                   </td>
//                   <td className="p-2">{category.name}</td>
//                   <td className="p-2 flex flex-wrap gap-1 justify-center">
//                     <Link
//                       to={`/category/${category._id}/edit`}
//                       className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
//                     >
//                       Update
//                     </Link>
//                     <button
//                       disabled={loading && did === category._id}
//                       onClick={() => handleDelete(category._id)}
//                       className={`text-xs text-white px-2 py-1 rounded ${
//                         loading && did === category._id
//                           ? "bg-red-400 cursor-not-allowed"
//                           : "bg-red-500 hover:bg-red-600"
//                       }`}
//                     >
//                       {loading && did === category._id ? (
//                         <BeatLoader color="#FFFFFF" size={3} />
//                       ) : (
//                         "Delete"
//                       )}
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan={4}
//                   className="text-center text-gray-500 py-10 text-lg"
//                 >
//                   No Category Available.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Category;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import {
  addCategory,
  deleteCategory,
  fetchAllCategories,
} from "../features/category/categorySlice";

const Category = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories, loading, toggle } = useSelector(
    (state) => state.category
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  // Search & Sort
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Add
  const [categoryName, setCategoryName] = useState("");
  const [aid, setAid] = useState(null);
  const [did, setDid] = useState(null);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch, toggle]);

  // Filter & Sort
  const filtered = categories
    .filter((cat) =>
      cat.name.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    setAid("Running");
    try {
      await dispatch(addCategory({ name: categoryName })).unwrap();
      setCategoryName("");
    } catch {
      console.log("Add failed!");
    } finally {
      setAid(null);
    }
  };

  const handleDelete = async (cid) => {
    if (window.confirm("Delete this category?")) {
      setDid(cid);
      try {
        await dispatch(deleteCategory(cid)).unwrap();
      } catch {
        console.log("Delete failed!");
      } finally {
        setDid(null);
      }
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-3 sm:p-4 md:p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">
          Categories
        </h1>
      </div>

      {/* Row: Add Form + Search/Sort (right corner) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
        {/* Add Category Form */}
        <form onSubmit={handleAdd} className="max-w-xs">
          <label className="block text-sm font-medium mb-1">Category Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter name"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
              required
            />
            <button
              type="submit"
              disabled={loading && aid}
              className={`text-white px-3 py-2 rounded-md text-sm ${
                loading && aid ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading && aid ? <BeatLoader size={3} /> : "Add"}
            </button>
          </div>
        </form>

        {/* Search + Sort → top-right corner */}
        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-32 sm:w-auto"
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="asc">Oldest First</option>
            <option value="desc">Newest First</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg text-xs sm:text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left hidden sm:table-cell">Date/Time</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length ? (
              currentItems.map((cat, idx) => (
                <tr key={cat._id} className="hover:bg-gray-50">
                  <td className="p-2">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="p-2 hidden sm:table-cell">
                    {cat.createdAt
                      ? `${new Date(cat.createdAt).toLocaleDateString(
                          "en-GB"
                        )} / ${new Date(cat.createdAt).toLocaleTimeString()}`
                      : "-"}
                  </td>
                  <td className="p-2">{cat.name}</td>
                  <td className="p-2 flex flex-wrap gap-1 justify-center">
                    <Link
                      to={`/category/${cat._id}/edit`}
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Update
                    </Link>
                    <button
                      disabled={loading && did === cat._id}
                      onClick={() => handleDelete(cat._id)}
                      className={`text-xs text-white px-2 py-1 rounded ${
                        loading && did === cat._id
                          ? "bg-red-400"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {loading && did === cat._id ? (
                        <BeatLoader size={3} />
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-10">
                  No Category Available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 gap-2 text-sm">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Category;