import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalesDueList } from "../features/sales/salesSlice";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { FaPrint, FaArrowLeft } from "react-icons/fa";
import { fetchSalesReturnList } from "../features/SalesReturn/salesReturnSlice";

const SalesReturnList = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    salesReturnList,
    listLoading
  } = useSelector((state) => state.salesReturn);

  const [customerName, setCustomerName] = useState("");

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
        fetchSalesReturnList({
          customerName
        }),
      );
    }
  }, [dispatch, user, customerName]);

  // console.log(salesReturnList);

  const grandTotalDue =
    salesReturnList && salesReturnList.length > 0
      ? salesReturnList.reduce(
        (sum, salesReturn) => sum + Number(salesReturn.remainingQuantity || 0),
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
            Sales Return List
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={reactToPrintFn}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              <FaPrint /> Print Return List
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
          </div>

          {/* সর্ট অর্ডার ফিল্ডের পাশে অল-রেকর্ডস গ্র্যান্ড টোটাল */}
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-2.5 flex items-center justify-between sm:justify-start gap-4 shadow-sm w-full sm:w-auto self-stretch sm:self-center">
            <span className="text-xs sm:text-sm font-semibold text-red-700 uppercase tracking-wider">
              Total Quantity Due:
            </span>
            <span className="text-base sm:text-lg font-black text-red-600 animate-pulse">
              {grandTotalDue.toLocaleString("en-BD")} Pcs
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
                  <th className="px-6 py-4 text-left">Total Return</th>
                  <th className="px-6 py-4 text-right">Total Given</th>
                  <th className="px-6 py-4 text-center">Pending</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {salesReturnList && salesReturnList.length > 0 ? (
                  salesReturnList.map((salesReturn, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() =>
                        navigate("/sales-return-statement", {
                          state: {
                            customerName: salesReturn.customerName,
                            customerPhone: salesReturn.customerPhone,
                            customerEmail: salesReturn.customerEmail,
                          },
                        })
                      }
                    >
                      <td className="px-6 py-4 text-gray-500">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4 font-medium text-gray-800">
                        {salesReturn.customerName}
                      </td>

                      {/* Total Return */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-gray-700">
                            <span className="text-xs text-gray-500">Qty:</span>{" "}
                            <span className="font-semibold">
                              {Number(
                                salesReturn.totalReturnQuantity || 0,
                              ).toLocaleString("en-BD")} Pcs
                            </span>
                          </span>

                          <span className="font-bold text-gray-900">
                            <span className="text-xs font-normal text-gray-500">
                              Price:
                            </span>{" "}
                            ৳
                            {Number(
                              salesReturn.totalAmount || 0,
                            ).toLocaleString("en-BD")}
                          </span>
                        </div>
                      </td>

                      {/* Total Given */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex flex-col items-end gap-1.5">
                          <span className="text-gray-700">
                            <span className="text-xs text-gray-500">Qty:</span>{" "}
                            <span className="font-semibold">
                              {Number(
                                salesReturn.totalExchangeQuantity || 0,
                              ).toLocaleString("en-BD")} Pcs
                            </span>
                          </span>

                          <span className="font-bold text-green-700">
                            <span className="text-xs font-normal text-gray-500">
                              Price:
                            </span>{" "}
                            ৳
                            {Number(
                              salesReturn.totalPaid || 0,
                            ).toLocaleString("en-BD")}
                          </span>
                        </div>
                      </td>

                      {/* Pending */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="text-gray-700">
                            <span className="text-xs text-gray-500">Qty:</span>{" "}
                            <span className="font-semibold">
                              {Number(
                                salesReturn.remainingQuantity || 0,
                              ).toLocaleString("en-BD")} Pcs
                            </span>
                          </span>

                          <span className="font-bold text-red-600">
                            <span className="text-xs font-normal text-gray-500">
                              Price:
                            </span>{" "}
                            ৳
                            {Number(
                              salesReturn.totalDue || 0,
                            ).toLocaleString("en-BD")}
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/sales/due-payment");
                            }}
                            className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-3 py-1.5 rounded font-semibold transition-colors"
                          >
                            Return Pay
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-12 text-gray-500"
                    >
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>


      </div>
    </>
  );
};

export default SalesReturnList;
