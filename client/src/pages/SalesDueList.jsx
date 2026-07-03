import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalesDueList } from "../features/sales/salesSlice";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { FaPrint, FaArrowLeft } from "react-icons/fa";

const SalesDueList = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // পেজিনেশনের page এবং pages ভেরিয়েবলগুলো স্টেট থেকে বাদ দেওয়া হয়েছে
  const {
    salesOfDues,
    customerPage: page,
    customerPages: pages,
  } = useSelector((state) => state.sales);

  const [customerName, setCustomerName] = useState("");
  const [sortOrder, setSortOrder] = useState(-1);
  const [currentPage, setCurrentPage] = useState(page);

  // Print Reference
  const printRef = useRef(null);

  const reactToPrintFn = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Sales-Due-List-${new Date().toISOString().slice(0, 10)}`,
  });

  useEffect(() => {
    if (!user) navigate("/login");
    if (user && user.role !== "admin") navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.role === "admin") {
      dispatch(
        fetchSalesDueList({
          customerName,
          order: sortOrder,
          page: currentPage,
        }),
      );
    }
  }, [dispatch, user, sortOrder, customerName, currentPage]);

  // console.log(salesOfDues);

  const grandTotalDue =
    salesOfDues && salesOfDues.length > 0
      ? salesOfDues.reduce(
        (sum, customer) => sum + Number(customer.due || 0),
        0,
      )
      : 0;

  if (user && user.role !== "admin") return null;

  return (
    <>
      <title>{`Sales Due List | ${import.meta.env.VITE_COMPANY_NAME}`}</title>
      <div className="p-3 sm:p-4 md:p-6 bg-white min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Sales Due List
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={reactToPrintFn}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              <FaPrint /> Print Due List
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-800 hover:text-white transition duration-200 cursor-pointer"
            >
              <FaArrowLeft /> Back
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by Customer Name..."
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2.5 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* <select
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="border border-gray-300 bg-white rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="-1">Highest Due First</option>
            <option value="1">Lowest Due First</option>
          </select> */}
          </div>

          {/* সর্ট অর্ডার ফিল্ডের পাশে অল-রেকর্ডস গ্র্যান্ড টোটাল */}
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-2.5 flex items-center justify-between sm:justify-start gap-4 shadow-sm w-full sm:w-auto self-stretch sm:self-center">
            <span className="text-xs sm:text-sm font-semibold text-green-700 uppercase tracking-wider">
              Total Customers Due:
            </span>
            <span className="text-base sm:text-lg font-black text-green-600 animate-pulse">
              ৳ {grandTotalDue.toLocaleString("en-BD")}
            </span>
          </div>
        </div>

        {/* Printable Content */}
        <div ref={printRef}>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">#</th>
                  <th className="px-6 py-4 text-left">Customer Name</th>
                  <th className="px-6 py-4 text-left">Mobile Number</th>
                  <th className="px-6 py-4 text-right">Current Balance</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {salesOfDues && salesOfDues.length > 0 ? (
                  salesOfDues.map((customer, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() =>
                        navigate("/customer-statement", {
                          state: {
                            customerName: customer.name,
                            customerPhone: customer.phone,
                          },
                        })
                      }
                    >
                      <td className="p-2">{(page - 1) * 15 + index + 1}</td>
                      <td className="px-6 py-4 font-medium">{customer.name}</td>
                      <td className="px-6 py-4">{customer.phone || "N/A"}</td>
                      <td
                        className={`px-6 py-4 text-right font-bold ${customer.currentBalance > 0 && "text-red-600"} ${customer.currentBalance < 0 && "text-green-600"}`}
                      >
                        ৳{" "}
                        {Number(customer.currentBalance || 0).toLocaleString(
                          "en-BD",
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {/* <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentDue = customer.due;
                            const customerId = customer._id;
                            const customerName = customer.name;

                            navigate("/sales/due-payment", {
                              state: {
                                customerName,
                              },
                            });

                            // currentDue <= 0
                            //   ? navigate("")
                            //   : navigate("/sales/due-payment", {
                            //       state: {
                            //         customerName
                            //       },
                            //     });
                          }}
                          // className={`text-xs text-white px-2 py-1 rounded  ${customer.due <= 0 ? "cursor-not-allowed bg-red-500" : "cursor-pointer bg-red-600 hover:bg-red-700"}`}
                          // disabled={customer.due <= 0}

                          className={`text-xs text-white px-2 py-1 rounded  ${customer.currentBalance >= 0 ? "cursor-not-allowed bg-red-500" : "cursor-pointer bg-red-600 hover:bg-red-700"}`}
                          disabled={customer.currentBalance >= 0}
                        >
                          Due Payment
                        </button> */}
                          <button
                            onClick={(e) => {
                              // e.stopPropagation();
                              // navigate("/customer-statement", {
                              //   state: {
                              //     customerName: customer.name,
                              //     customerPhone: customer.phone,
                              //   },
                              // });

                              e.stopPropagation();
                              const currentDue = customer.due;
                              const customerId = customer._id;
                              const customerName = customer.name;

                              navigate("/sales/due-payment", {
                                state: {
                                  customerName,
                                },
                              });
                            }}
                            className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-2 py-1 rounded font-semibold"
                          >
                            নিচ্ছি
                          </button>
                          <button
                            onClick={(e) => {
                              // e.stopPropagation();
                              // navigate("/customer-statement", {
                              //   state: {
                              //     customerName: customer.name,
                              //     customerPhone: customer.phone,
                              //   },
                              // });

                              e.stopPropagation();
                              const currentDue = customer.due;
                              const customerId = customer._id;
                              const customerName = customer.name;

                              navigate("/point-of-sale", {
                                state: customer,
                              });
                            }}
                            className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-2 py-1 rounded font-semibold"
                          >
                            দিচ্ছি
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-gray-500">
                      No due records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pages ? (
          <div className="flex justify-center items-center mt-4 gap-2 text-sm">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`${page === 1 ? "" : "cursor-pointer hover:bg-black hover:text-white"} px-2 py-1 border rounded  disabled:opacity-50`}
            >
              Prev
            </button>
            <span>
              Page {page} of {pages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, pages))}
              disabled={page === pages}
              className={`${page === pages ? "" : "cursor-pointer hover:bg-black hover:text-white"}  px-2 py-1 border rounded  disabled:opacity-50`}
            >
              Next
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default SalesDueList;
