import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { addPayment, fetchPurchaseById } from "../features/purchase/purchaseSlice";

const EditPurchaseDue = () => {
  const { user } = useSelector((state) => state.auth);
  const { purchaseSearchedById, loading } = useSelector(
    (state) => state.purchase
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [due, setDue] = useState(0);
  const [aid, setAid] = useState(null);
  const { id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAid("Run");
    let amount;
    if (due > purchaseSearchedById.due) {
      amount = Number(purchaseSearchedById.due) * 10000;
    } else {
      amount = Number(due) * 10000;
    }
    try {
      await dispatch(addPayment({ id, info: { amount } })).unwrap();
      navigate("/purchase");
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
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      dispatch(fetchPurchaseById(id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (purchaseSearchedById) {
      setDue(purchaseSearchedById.due);
    }
  }, [purchaseSearchedById]);

  if (!user) return null;
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
              step="any"
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
            Purchase Information
          </h2>
          <div className="space-y-1 text-sm">
            <div className="flex">
              <span className="w-28 font-medium">Sale ID</span>
              <span>: {purchaseSearchedById?._id}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-medium">Memo</span>
              <span>: {purchaseSearchedById?.memo}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-medium">Supplier Name</span>
              <span>: {purchaseSearchedById?.supplierName}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-medium">Products</span>
              <span className="max-w-80">: {purchaseSearchedById?.productNames}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-medium">Total</span>
              <span>
                :{" "}
                <span className="font-bold">
                  {purchaseSearchedById?.totalAmount}
                </span>
              </span>
            </div>
            <div className="flex">
              <span className="w-28 font-medium">Paid</span>
              <span>: {purchaseSearchedById?.paid}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-medium">Due</span>
              <span>
                :{" "}
                <span
                  className={`w-28 ${
                    purchaseSearchedById?.due > 0
                      ? "text-red-500 font-bold"
                      : "font-medium"
                  }`}
                >
                  {purchaseSearchedById?.due}
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

export default EditPurchaseDue;
