import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSalesByDate,
  fetchSalesByIndividualDate,
} from "../features/sales/salesSlice";
import { Link, useNavigate } from "react-router-dom";
import Decimal from "decimal.js";

const SalesReport = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedRange, setSelectedRange] = useState("t");
  const [selectedRangeLabel, setSelectedRangeLabel] = useState("Today");
  const [searchFilters, setSearchFilters] = useState({
    productName: "",
    customerName: "",
    date: "",
  });
  const [filterToggle, setFilterToggle] = useState(false);

  const { sales, loading, error, page, pages, totalSales, totalCosts, profit } =
    useSelector((state) => state.sales);

  // Pagination
  // const [currentPage, setCurrentPage] = useState(page);
  const [sortOrder, setSortOrder] = useState(-1);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  console.log(selectedRange)

  useEffect(() => {
    if (user && user.role === "admin") {
      if (selectedRange) {
        dispatch(
          fetchSalesByDate({
            date: selectedRange,
            // page: currentPage,
            order: sortOrder,
          }),
        );
      } else {
        dispatch(
          fetchSalesByIndividualDate({
            ...searchFilters,
            order: sortOrder,
          }),
        );
      }
    }
  }, [dispatch, user, filterToggle, selectedRange, sortOrder]);

  if (user && user.role !== "admin") return null;

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-white min-h-screen">
      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-bold mb-2">Sales Report</h1>
      <hr className="mb-4" />

      {/* Buttons */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 font-medium">View:</span>
          <select
            value={selectedRange}
            className="w-full sm:w-auto appearance-none border border-gray-300 rounded-md px-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 bg-gray-50"
            onChange={(e) => {
              const query = e.target.value;
              const label = e.target.selectedOptions[0].text;

              setSelectedRangeLabel(label);
              setSelectedRange(query);
              setSearchFilters({
                productName: "",
                customerName: "",
                date: "",
              });
            }}
          >
            <option disabled value="">
              Select
            </option>
            <option value="t">Today</option>
            <option value="w">This Week</option>
            <option value="m">This Month</option>
            <option value="y">This Year</option>
          </select>
        </div>

        <Link to="/sales-report/due-list" className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm transition duration-200 cursor-pointer">
          Full Due List
        </Link>
      </div>

      {/* Report Title */}

      <div className="flex flex-col sm:flex-row justify-between items-start my-4 gap-3">
        <h2 className="text-lg sm:text-xl font-semibold">
          {selectedRangeLabel}
          {selectedRangeLabel === "Filtered" ? "" : "'s"} Report
        </h2>
      </div>

      {/* Summary */}
      {sales.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Sales</p>
            <p className="text-lg font-bold text-green-600">
              ৳ {totalSales || 0}
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Costs</p>
            <p className="text-lg font-bold text-green-600">
              ৳ {totalCosts || 0}
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-500">Profit</p>
            <p className="text-lg font-bold text-green-600">৳ {profit || 0}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-3">
        <div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 bg-white rounded-md px-3 py-2 text-sm shadow-sm hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="1">Oldest First</option>
            <option value="-1">Newest First</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 w-full lg:w-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:ml-auto w-full">
            <label className="text-xs sm:text-sm text-gray-600">
              Search by Product Name:
            </label>
            <input
              type="text"
              value={searchFilters.productName}
              onChange={(e) =>
                setSearchFilters((prev) => ({
                  ...prev,
                  productName: e.target.value,
                }))
              }
              placeholder="Product Name"
              className="w-full sm:w-40 border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:ml-auto w-full">
            <label className="text-xs sm:text-sm text-gray-600">
              Search by Customer Name:
            </label>
            <input
              type="text"
              value={searchFilters.customerName}
              onChange={(e) =>
                setSearchFilters((prev) => ({
                  ...prev,
                  customerName: e.target.value,
                }))
              }
              placeholder="Customer Name"
              className="w-full sm:w-40 border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            />
          </div>

          {/* Date Search — Right side top */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:ml-auto w-full">
            <label className="text-xs sm:text-sm text-gray-600">
              Search by Date:
            </label>
            <input
              type="date"
              value={searchFilters.date}
              onChange={(e) => {
                setSearchFilters((prev) => ({
                  ...prev,
                  date: e.target.value,
                }));
              }}
              className="w-full sm:w-40 border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            />
          </div>

          <div className="flex gap-2 justify-start sm:justify-end  w-full">
            <button
              onClick={() => {
                if (
                  searchFilters.customerName === "" &&
                  searchFilters.productName === "" &&
                  searchFilters.date === ""
                ) {
                  if (!selectedRange) {
                    setSelectedRange("t");
                    setSelectedRangeLabel("Today");
                  }
                } else {
                  searchFilters.date
                    ? setSelectedRangeLabel(searchFilters.date)
                    : setSelectedRangeLabel("Filtered");

                  setSelectedRange("");
                  setFilterToggle(!filterToggle);
                }
              }}
              className="flex-1 sm:flex-none bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
              type="button"
            >
              Filter
            </button>
            <button
              onClick={() => {
                if (
                  searchFilters.productName !== "" ||
                  searchFilters.customerName !== "" ||
                  searchFilters.date !== ""
                ) {
                  setSearchFilters({
                    productName: "",
                    customerName: "",
                    date: "",
                  });

                  setSelectedRangeLabel("Today");
                  setSelectedRange("t");
                } else {
                  if (!selectedRange) {
                    setSelectedRangeLabel("Today");
                    setSelectedRange("t");
                  }
                }
              }}
              className="flex-1 sm:flex-none bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
              type="button"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs sm:text-sm border-collapse">
          <thead className="bg-gray-300">
            <tr>
              <th
                rowSpan={2}
                className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
              >
                Date
              </th>
              <th
                rowSpan={2}
                className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
              >
                Cutomer Name
              </th>
              <th
                colSpan={3}
                className="border px-2 py-1 sm:px-4 sm:py-2 text-center"
              >
                Products
              </th>
              <th
                rowSpan={2}
                className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
              >
                Discount
              </th>
              <th
                rowSpan={2}
                className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
              >
                Total
              </th>

              <th
                rowSpan={2}
                className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
              >
                Paid
              </th>
              <th
                rowSpan={2}
                className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
              >
                Due
              </th>
              <th
                rowSpan={2}
                className="border px-2 py-1 sm:px-4 sm:py-2 text-center"
              >
                Action
              </th>
            </tr>
            <tr>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-center">
                Name
              </th>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                Price
              </th>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                Qty
              </th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map((sale, index) => {
                const rowspan = sale.products.length;
                const isEven = index % 2 === 0;

                return sale.products.map((product, index) => (
                  <tr
                    onClick={(e) => {
                      if (e.target.tagName !== "TD") return;
                      navigate("/customer-statement", { state: sale });
                    }}
                    key={index}
                    className={
                      isEven
                        ? "bg-white cursor-pointer"
                        : "bg-gray-50 cursor-pointer"
                    }
                  >
                    {index === 0 && (
                      <>
                        <td
                          rowSpan={rowspan}
                          className="border px-2 py-1 sm:px-4 sm:py-2"
                        >
                          {new Date(sale.createdAt)
                            .toLocaleDateString("en-GB", {
                              timeZone: "Asia/Dhaka",
                            })
                            .replaceAll("/", "-")}
                        </td>
                        <td
                          rowSpan={rowspan}
                          className="border px-2 py-1 sm:px-4 sm:py-2"
                        >
                          {sale.customerName}
                        </td>
                      </>
                    )}

                    <td
                      className={`border px-2 py-1 sm:px-4 sm:py-2 ${
                        index !== sale.products.length - 1
                          ? "border-b-gray-300"
                          : ""
                      }`}
                    >
                      {product.productName}
                    </td>
                    <td
                      className={`border px-2 py-1 sm:px-4 sm:py-2 ${
                        index !== sale.products.length - 1
                          ? "border-b-gray-300"
                          : ""
                      }`}
                    >
                      {product.sellPrice}
                    </td>
                    <td
                      className={`border px-2 py-1 sm:px-4 sm:py-2 ${
                        index !== sale.products.length - 1
                          ? "border-b-gray-300"
                          : ""
                      }`}
                    >
                      {product.quantity}
                    </td>

                    {index === 0 && (
                      <>
                        <td
                          rowSpan={rowspan}
                          className="border px-2 py-1 sm:px-4 sm:py-2"
                        >
                          {sale.discount ? sale.discount : 0}
                        </td>
                        <td
                          rowSpan={rowspan}
                          className="border px-2 py-1 sm:px-4 sm:py-2"
                        >
                          {sale.total}
                        </td>

                        <td
                          rowSpan={rowspan}
                          className="border px-2 py-1 sm:px-4 sm:py-2"
                        >
                          {sale.paid}
                        </td>
                        <td
                          rowSpan={rowspan}
                          className={`border px-2 py-1 sm:px-4 sm:py-2 ${
                            sale.due > 0 ? "text-red-500 font-bold" : ""
                          }`}
                        >
                          {sale.due}
                        </td>
                        <td
                          rowSpan={rowspan}
                          className="border px-2 py-1 sm:px-4 sm:py-2"
                        >
                          <div className="flex flex-wrap gap-1">
                            <Link
                              to={
                                sale.due
                                  ? `/sales-report/${sale._id}/edit-due`
                                  : "#"
                              }
                              className={`text-xs text-white px-2 py-1 rounded ${
                                sale.due
                                  ? "bg-green-600 hover:bg-green-700"
                                  : "cursor-no-drop bg-green-500"
                              }`}
                            >
                              Add Payment
                            </Link>
                            <Link
                              to="/invoice"
                              state={sale}
                              className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 cursor-pointer"
                            >
                              Print
                            </Link>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ));
              })
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="text-center text-gray-500 py-10 text-lg select-none border"
                >
                  No Sales Available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReport;
