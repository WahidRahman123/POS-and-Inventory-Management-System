import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import {
  addPayment,
  fetchCompanySalesReturnById,
} from "../features/CompanySalesReturn/companySalesReturnSlice";
import Decimal from "decimal.js";

const EditCompanySalesReturnDue = () => {
  const { user } = useSelector((state) => state.auth);
  const { companySalesReturnSearchedById, loading } = useSelector(
    (state) => state.companySalesReturn,
  );
  // console.log(companySalesReturnSearchedById);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [due, setDue] = useState(0);
  const [aid, setAid] = useState(null);
  const [date, setDate] = useState("");
  const [dateRestriction, setDateRestriction] = useState("");
  const { id } = useParams();

  const [originalReceivableProducts, setOriginalReceivableProducts] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAid("Run");
    let amount;
    const due = Number(originalReceivableProducts.reduce((acc, p) => acc + p.quantity, 0));

    if (
      new Decimal(due).greaterThan(
        new Decimal(companySalesReturnSearchedById.dueQty),
      )
    ) {
      amount = Number(
        new Decimal(companySalesReturnSearchedById.dueQty).toFixed(4),
      );
    } else {
      amount = Number(new Decimal(due).toFixed(4));
    }

    const payDetails = originalReceivableProducts.map((p, i) => ({ productName: p.productName, quantity: p.quantity }));

    try {
      await dispatch(
        addPayment({
          id,
          info: {
            date,
            amount,
            payDetails,
            unchangedAmount: Number(new Decimal(due).toFixed(4)),
          },
        }),
      ).unwrap();
      navigate(-1);
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
      dispatch(fetchCompanySalesReturnById(id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (companySalesReturnSearchedById) {
      // setDue(companySalesReturnSearchedById.dueQty);
      const restrictionDate = new Date(companySalesReturnSearchedById.createdAt)
        .toISOString()
        .split("T")[0];
      setDateRestriction(restrictionDate);

      if (companySalesReturnSearchedById.products?.length > 0) {
        const productsToAdd = companySalesReturnSearchedById.products.map((product, index) => ({...product, quantity: product.availableQty, productId: index + 1}));

        setOriginalReceivableProducts(productsToAdd);
      } else {
        navigate(-1);
      }
    }
  }, [companySalesReturnSearchedById]);

  //* Due 0 redirection
  useEffect(() => {
    if (companySalesReturnSearchedById?.dueQty === 0) {
      navigate("/company-return");
    }
  }, [companySalesReturnSearchedById]);

  if (!user) return null;
  return (
    <>
      <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg p-3 sm:p-4 md:p-6 gap-4 md:gap-8">
        {/* Left: Stock Form */}
        <form onSubmit={handleSubmit} className="flex-1">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Receive Product
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={date}
              min={dateRestriction}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <label className="block text-sm font-medium mb-1">
            Product Amount
          </label>
          {originalReceivableProducts.length > 0
            ? originalReceivableProducts.map((product, index) => (
                <div className="mb-4 flex gap-2" key={index}>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Product Name:
                    </label>
                    <input
                      type="text"
                      value={product.productName}
                      min={0}
                      placeholder="Add Payment"
                      step="any"
                      className="w-full border border-gray-300 bg-gray-100 text-gray-800 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Enter Quantity:
                    </label>
                    <input
                      type="number"
                      value={product.quantity}
                      max={product.availableQty}
                      onChange={(e) => {
                        setOriginalReceivableProducts((prev) =>
                          prev.map((p, i) =>
                            i === index
                              ? {
                                  ...p,
                                  quantity: Number(e.target.value),
                                }
                              : p,
                          ),
                        );
                      }}
                      step="any"
                      min={0}
                      placeholder="Add Payment"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  {originalReceivableProducts.length > 1 ? (
                          <button
                            type="button"
                            onClick={() => {
                              setOriginalReceivableProducts((prev) =>
                                prev.filter((p, i) => p.productId !== product.productId),
                              );
                            }}
                            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm h-fit mt-5 cursor-pointer"
                          >
                            ×
                          </button>
                        ) : (
                          ""
                        )}
                </div>
              ))
            : ""}

          <button
            type="submit"
            disabled={loading && aid}
            className={`text-white px-4 py-2 rounded text-sm ${
              loading && aid
                ? "cursor-not-allowed bg-green-400"
                : "bg-green-500 hover:bg-green-600 cursor-pointer"
            }`}
          >
            {loading && aid ? "Receiving..." : "Receive"}
          </button>
        </form>

        {/* Right: Item Information */}
        <div className="flex-1 md:border-l md:border-gray-200 md:pl-6 mt-6 md:mt-0">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Company Sales Return Information
          </h2>
          <div className="space-y-1 text-sm">
            <div className="flex">
              <span className="w-28 font-medium">Sale ID</span>
              <span>: {companySalesReturnSearchedById?._id}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-medium">Memo</span>
              <span>: {companySalesReturnSearchedById?.memo}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-medium">Supplier Name</span>
              <span>: {companySalesReturnSearchedById?.supplierName}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-medium">Product Name</span>
              <ul>{companySalesReturnSearchedById?.productName}</ul>
            </div>
            <div className="flex">
              <span className="w-28 font-medium">Total Quantity</span>
              <span>
                :{" "}
                <span className="font-bold">
                  {companySalesReturnSearchedById?.totalAmountQty}
                </span>
              </span>
            </div>
            <div className="flex">
              <span className="w-28 font-medium">Paid Quantity</span>
              <span>: {companySalesReturnSearchedById?.paidQty}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-medium">Due Quantity</span>
              <span>
                :{" "}
                <span
                  className={`w-28 ${
                    companySalesReturnSearchedById?.dueQty > 0
                      ? "text-red-500 font-bold"
                      : "font-medium"
                  }`}
                >
                  {companySalesReturnSearchedById?.dueQty}
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

export default EditCompanySalesReturnDue;
