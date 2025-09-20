import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addPayment, fetchSaleById } from "../features/sales/salesSlice";
import { FaArrowLeft } from "react-icons/fa";

const EditDue = () => {
  const { user } = useSelector((state) => state.auth);
  const { saleSearchedById, loading } = useSelector((state) => state.sales);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [due, setDue] = useState(0);
  const [aid, setAid] = useState(null);
  const { id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAid("Run");
    let amount;
    if(due > saleSearchedById.due) {
        amount = Number(saleSearchedById.due);
    } else {
        amount = Number(due);
    }
    try {
      await dispatch(
        addPayment({ id, info: { amount } })
      ).unwrap();
      navigate("/sales-report");
    } catch {
      console.log("Payment Failed!");
    } finally {
      setAid(null);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.role === "admin") {
      dispatch(fetchSaleById(id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (saleSearchedById) {
      setDue(saleSearchedById.due);
    }
  }, [saleSearchedById]);

  if (user && user.role !== "admin") return null;
  return (
    <>
      <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg p-3 sm:p-4 md:p-6 gap-4 md:gap-8">
        {/* Left: Stock Form */}
        <form onSubmit={handleSubmit} className="flex-1">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Add Payment</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Pay</label>
            <input
              type="number"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              min={0}
              placeholder="Add Payment"
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
                : "bg-green-500 hover:bg-green-600 cursor-pointer"
            }`}
          >
            {loading && aid ? "Paying..." : "Pay"}
          </button>
        </form>

        {/* Right: Item Information */}
        <div className="flex-1 md:border-l md:border-gray-200 md:pl-6 mt-6 md:mt-0">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Sale Information
          </h2>
          <div className="space-y-1 text-sm">
            <div className="flex">
              <span className="w-28 font-medium">Sale ID</span>
              <span>: {saleSearchedById?._id}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-medium">Customer Name</span>
              <span>: {saleSearchedById?.customerName}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-medium">Products</span>
              <ul>
                {saleSearchedById?.products?.map((p, i) => (
                  <li key={i}>: {p.productName}</li>
                ))}
              </ul>
            </div>
            <div className="flex">
              <span className="w-28 font-medium">Total</span>
              <span>
                : <span className="font-bold">{saleSearchedById?.total}</span>
              </span>
            </div>
            <div className="flex">
              <span className="w-28 font-medium">Paid</span>
              <span>: {saleSearchedById?.paid}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-medium">Due</span>
              <span>
                :{" "}
                <span
                  className={`w-28 ${
                    saleSearchedById?.due > 0
                      ? "text-red-500 font-bold"
                      : "font-medium"
                  }`}
                >
                  {saleSearchedById?.due}
                </span>
              </span>
            </div>
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

export default EditDue;
