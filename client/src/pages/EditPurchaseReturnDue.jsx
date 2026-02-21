import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Decimal from "decimal.js";
import { addPayment, fetchPurchaseReturnById } from "../features/PurchaseReturn/purchaseReturnSlice";

const EditPurchaseReturnDue = () => {
  const { user } = useSelector((state) => state.auth);
  const { purchaseReturnSearchById, loading } = useSelector(
    (state) => state.purchaseReturn
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
    if (new Decimal(due).greaterThan(new Decimal(purchaseReturnSearchById.refundDue))) {
      amount = Number(new Decimal(purchaseReturnSearchById.refundDue).toFixed(4));
    } else {
      amount = Number(new Decimal(due).toFixed(4));
    }
    try {
      await dispatch(addPayment({ id, info: { amount } })).unwrap();
      navigate("/purchase-return");
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
      dispatch(fetchPurchaseReturnById(id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (purchaseReturnSearchById) {
      setDue(purchaseReturnSearchById.refundDue);
    }
  }, [purchaseReturnSearchById]);

  if (!user) return null;
  return (
    <>
      <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg p-3 sm:p-4 md:p-6 gap-4 md:gap-8">
        {/* Left: Stock Form */}
        <form onSubmit={handleSubmit} className="flex-1">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Add Refund</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Refund</label>
            <input
              type="number"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              min={0}
              placeholder="Add Refund"
              step="any"
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
            {loading && aid ? "Refunding..." : "Refund"}
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
              <span>: {purchaseReturnSearchById?._id}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-medium">Memo</span>
              <span>: {purchaseReturnSearchById?.memo}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-medium">Supplier Name</span>
              <span>: {purchaseReturnSearchById?.supplierName}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-medium">Products</span>
              <ul>
                {purchaseReturnSearchById?.products?.map((p, i) => (
                  <li key={i}>: {p.productName}</li>
                ))}
              </ul>
            </div>
            <div className="flex">
              <span className="w-28 font-medium">Return Amount</span>
              <span>
                :{" "}
                <span className="font-bold">
                  {purchaseReturnSearchById?.returnAmount}
                </span>
              </span>
            </div>
            <div className="flex">
              <span className="w-28 font-medium">Refund Received</span>
              <span>: {purchaseReturnSearchById?.refundReceived}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-medium">Refund Due</span>
              <span>
                :{" "}
                <span
                  className={`w-28 ${
                    purchaseReturnSearchById?.refundDue > 0
                      ? "text-red-500 font-bold"
                      : "font-medium"
                  }`}
                >
                  {purchaseReturnSearchById?.refundDue}
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

export default EditPurchaseReturnDue;
