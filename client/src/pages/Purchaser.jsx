import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addSupplier, fetchAllSuppliers } from "../features/supplier/supplierSlice";


const Purchaser = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { suppliers, loading, toggle, page, pages } = useSelector(
    (state) => state.supplier
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(page);
  const [sortOrder, setSortOrder] = useState(1);

  const [supplier, setSupplier] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [aid, setAid] = useState(null);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setSupplier((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAid("Running");
    try {
      await dispatch(addSupplier(supplier)).unwrap();
      setSupplier({
        name: "",
        phone: "",
        email: "",
        address: "",
      });
    } catch {
      console.log("Add failed!");
    } finally {
      setAid(null);
    }
  };

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    dispatch(
      fetchAllSuppliers({
        page: currentPage,
        order: sortOrder,
      })
    );
  }, [dispatch, toggle, sortOrder, currentPage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-maroon-800 to-red-700 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl ring-1 ring-black/5 p-6 space-y-8">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800">
          Supplier Information
        </h1>

        {/* Entry Form */}
        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          onSubmit={handleAdd}
        >
          <input
            type="text"
            placeholder="Supplier Name"
            name="name"
            value={supplier.name}
            onChange={handleOnChange}
            className="border border-gray-300 rounded-md px-3 py-2"
            required
          />
          <input
          type="tel"
            placeholder="Phone"
            name="phone"
            value={supplier.phone}
            minLength={11}
            maxLength={14}
            onChange={handleOnChange}
            className="border border-gray-300 rounded-md px-3 py-2"
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={supplier.email}
            onChange={handleOnChange}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <input
          type="text"
            placeholder="Address"
            name="address"
            value={supplier.address}
            onChange={handleOnChange}
            className="border border-gray-300 rounded-md px-3 py-2"
            required
          />
          <div className="sm:col-span-2 flex justify-end">
            <button
              disabled={loading && aid}
              className={`text-white px-6 py-2 rounded-md ${
                loading && aid
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              }`}
            >
              {loading && aid ? "Saving..." : "Save Supplier"}
            </button>
          </div>
        </form>

        <div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="1">Oldest First</option>
            <option value="-1">Newest First</option>
          </select>
        </div>

        {/* Customer List */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">#</th>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Phone</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">Address</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length ? (
                suppliers.map((supplier, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 py-2">{index + 1}</td>
                    <td className="px-3 py-2 font-medium">{supplier.name}</td>
                    <td className="px-3 py-2">{supplier.phone}</td>
                    <td className="px-3 py-2">{supplier.email}</td>
                    <td className="px-3 py-2">{supplier.address}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-gray-500 py-6 select-none"
                  >
                    No suppliers added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages ? (
          <div className="flex justify-center items-center mt-4 gap-2 text-sm">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`${
                page === 1
                  ? ""
                  : "cursor-pointer hover:bg-black hover:text-white"
              } px-2 py-1 border rounded  disabled:opacity-50`}
            >
              Prev
            </button>
            <span>
              Page {page} of {pages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, pages))}
              disabled={page === pages}
              className={`${
                page === pages
                  ? ""
                  : "cursor-pointer hover:bg-black hover:text-white"
              }  px-2 py-1 border rounded  disabled:opacity-50`}
            >
              Next
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Purchaser;
