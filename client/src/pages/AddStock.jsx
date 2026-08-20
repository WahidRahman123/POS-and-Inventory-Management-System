import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addStock, fetchProductById } from "../features/product/productSlice";
import { FaArrowLeft } from "react-icons/fa";

const AddStock = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { id } = useParams();

  const [stockValue, setStockValue] = useState(0);
  const [aid, setAid] = useState(null);
  const { productSearchedById, loading } = useSelector(
    (state) => state.product
  );

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAid("Run");
    try {
      await dispatch(addStock({ id, info: { quantity: Number(stockValue), userId: user._id } })).unwrap();
      navigate("/product");
    } catch {
      console.log("Add Stock Failed!");
    } finally {
      setAid(null);
    }
  };

  useEffect(() => {
    if (!user) navigate("/login");
    if (user && user.role !== "admin") navigate("/");
    dispatch(fetchProductById(id));
  }, [user, id, navigate, dispatch]);

  if (!user || user.role !== "admin") return null;

  return (
    <>
      <title>{`Add Stock | ${import.meta.env.VITE_COMPANY_NAME}`}</title>
      <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg p-3 sm:p-4 md:p-6 gap-4 md:gap-8">
        {/* Left: Stock Form */}
        <form onSubmit={handleSubmit} className="flex-1">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Add Stock/s</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Stock In</label>
            <input
              type="number"
              value={stockValue}
              onChange={(e) => setStockValue(e.target.value)}
              min={0}
              placeholder="Enter Stocks To Add"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading && aid}
            className={`text-white px-4 py-2 rounded text-sm ${
              loading && aid
                ? "cursor-not-allowed bg-green-400"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loading && aid ? "Adding..." : "Add"}
          </button>
        </form>

        {/* Right: Item Information */}
        <div className="flex-1 md:border-l md:border-gray-200 md:pl-6 mt-6 md:mt-0">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Item Information</h2>
          <div className="space-y-1 text-sm">
            {[
              { label: "ID", value: productSearchedById?._id },
              { label: "Name", value: productSearchedById?.name },
              { label: "Category", value: productSearchedById?.category?.name || "-" },
              { label: "Quantity", value: productSearchedById?.quantity },
              { label: "Price", value: productSearchedById?.sellPrice },
            ].map(({ label, value }) => (
              <div key={label} className="flex">
                <span className="w-28 font-medium">{label}</span>
                <span>: {value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm sm:text-base font-medium text-green-600 hover:text-blue-800 cursor-pointer"
        >
          <FaArrowLeft className="mr-1 sm:mr-2" /> Go Back
        </button>
      </div>
    </>
  );
};

export default AddStock;