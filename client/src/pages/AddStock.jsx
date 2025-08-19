import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addStock, fetchProductById } from "../features/product/productSlice";
import { FaArrowLeft } from "react-icons/fa";

const AddStock = () => {
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  const { id } = useParams();
  const [stockValue, setStockValue] = useState(0);
  const [aid, setAid] = useState(null);
  const { productSearchedById, loading } = useSelector((state) => state.product);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setAid('Run');
      const info = {
        quantity: Number(stockValue),
      };
      await dispatch(addStock({ id, info })).unwrap();
      setAid(null);
      navigate("/product");
    } catch (error) {
      console.log("Add Stock Failed!");
      setAid(null);
    }
  };

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch]);

  return (
    <>
      <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg p-6 gap-8">
        {/* Left: Stock Form */}
        <form onSubmit={handleSubmit} className="flex-1">
          <h2 className="text-xl font-semibold mb-4">Add Stock/s</h2>

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
            disabled={loading && aid ? true : false}
            className={` text-white px-4 py-2 rounded  ${ loading && aid ? "cursor-not-allowed bg-green-400 " : "cursor-pointer bg-green-500 hover:bg-green-600"}`}
          >
            { loading && aid ? "Adding..." : "Add"}
          </button>
        </form>

        {/* Right: Item Information */}
        <div className="flex-1 border-l border-gray-200 pl-6">
          <h2 className="text-xl font-semibold mb-4">Item Information</h2>
          <div className="space-y-2 text-sm">
            <div className="flex">
              <span className="w-28 font-medium">ID</span>
              <span>
                : {productSearchedById._id ? productSearchedById._id : ""}
              </span>
            </div>
            <div className="flex">
              <span className="w-28 font-medium">Name</span>
              <span>
                : {productSearchedById._id ? productSearchedById.name : ""}
              </span>
            </div>
            <div className="flex">
              <span className="w-28 font-medium">Category</span>
              <span>
                :{" "}
                {productSearchedById._id
                  ? productSearchedById.category.name
                  : ""}
              </span>
            </div>
            <div className="flex">
              <span className="w-28 font-medium">Quantity</span>
              <span>
                : {productSearchedById._id ? productSearchedById.quantity : ""}
              </span>
            </div>
            <div className="flex">
              <span className="w-28 font-medium">Price</span>
              <span>
                : {productSearchedById._id ? productSearchedById.sellPrice : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <div
          onClick={() => navigate(-1)}
          className="flex mt-4 items-center text-lg font-medium text-green-600 hover:text-blue-800 cursor-pointer"
        >
          <FaArrowLeft className="mr-2" /> Go Back
        </div>
      </div>
    </>
  );
};

export default AddStock;
