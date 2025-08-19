import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalesByDate } from "../features/sales/salesSlice";
import { useNavigate } from "react-router-dom";

const SalesReport = () => {
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (user && user.role !== 'admin') {
      navigate("/");
    }
  }, []);
  
  const { sales, loading, error, totalSales } = useSelector(
    (state) => state.sales
  );
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [day, setDay] = useState("Today");

  const handleOnClick = (query, d) => {
    setDay(d);
    dispatch(fetchSalesByDate(query));
  };

  useEffect(() => {
    if(user && user.role === 'admin'){
      // console.log('fetching...')
      dispatch(fetchSalesByDate("t"));
    }
  }, [dispatch]);

  //? Glimpse Stopper
  if(user && user.role !== 'admin') return;
 
  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-2">Sales Report</h1>
      <hr className="mb-4" />

      {/* Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => handleOnClick("t", "Today")}
          className="cursor-pointer flex items-center border px-4 py-2 bg-white hover:bg-gray-50"
        >
          <span className="mr-2">📅</span> Today's Sales
        </button>
        <button
          onClick={() => handleOnClick("w", "This Week")}
          className="cursor-pointer flex items-center border px-4 py-2 bg-white hover:bg-gray-50"
        >
          <span className="mr-2">📅</span> This Week
        </button>
        <button
          onClick={() => handleOnClick("m", "This Month")}
          className="cursor-pointer flex items-center border px-4 py-2 bg-white hover:bg-gray-50"
        >
          <span className="mr-2">📅</span> Monthly Sales
        </button>
        <button
          onClick={() => handleOnClick("y", "This Year")}
          className="cursor-pointer flex items-center border px-4 py-2 bg-white hover:bg-gray-50"
        >
          <span className="mr-2">📅</span> Annual Sales
        </button>
      </div>

      {/* Today's Report Title */}
      <h2 className="text-xl font-semibold mb-2">{day}'s Report</h2>
      <hr className="mb-4" />

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Date</th>
              <th className="border px-4 py-2 text-left">Item</th>
              <th className="border px-4 py-2 text-left">Price</th>
              <th className="border px-4 py-2 text-left">Quantity</th>
              <th className="border px-4 py-2 text-left">Sub Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map((sale, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    {new Date(sale.createdAt)
                      .toLocaleDateString("en-GB", { timeZone: "Asia/Dhaka" })
                      .replaceAll("/", "-")}
                  </td>
                  <td className="border px-4 py-2">{sale.productName}</td>
                  <td className="border px-4 py-2">৳ {sale.sellPrice}</td>
                  <td className="border px-4 py-2">{sale.quantity}</td>
                  <td className="border px-4 py-2">৳ {sale.subtotal}</td>
                </tr>
              ))
            ) : (
              <tr className="text-center select-none text-gray-500 text-3xl">
                <td colSpan={5} className="px-4 py-2">
                  No Sales Available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Total Sales */}
      <div className="mt-4 font-semibold">
        Total Sales {day}:
        <span className="text-green-600">
          {totalSales ? "৳" : ""} {totalSales}
        </span>
      </div>
    </div>
  );
};

export default SalesReport;
