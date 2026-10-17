import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalesDueList } from "../features/sales/salesSlice";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { FaPrint, FaArrowLeft } from "react-icons/fa";
import { fetchSalesReturnList } from "../features/SalesReturn/salesReturnSlice";
import { fetchCompanySalesReturnList } from "../features/CompanySalesReturn/companySalesReturnSlice";

const CompanySalesReturnList = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    companySalesReturnList,
    listLoading
  } = useSelector((state) => state.companySalesReturn);

  const [supplierName, setSupplierName] = useState("");

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
        fetchCompanySalesReturnList({
          supplierName,
        }),
      );
    }
  }, [dispatch, user, supplierName]);

  // console.log(companySalesReturnList);

  const grandTotalDue =
    companySalesReturnList && companySalesReturnList.length > 0
      ? companySalesReturnList.reduce(
        (sum, companySalesReturn) => sum + Number(companySalesReturn.totalDue || 0),
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
            Company Sales Return List
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
              placeholder="Search by Company Name..."
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2.5 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* সর্ট অর্ডার ফিল্ডের পাশে অল-রেকর্ডস গ্র্যান্ড টোটাল */}
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-2.5 flex items-center justify-between sm:justify-start gap-4 shadow-sm w-full sm:w-auto self-stretch sm:self-center">
            <span className="text-xs sm:text-sm font-semibold text-green-700 uppercase tracking-wider">
              Total Quantity Receivable:
            </span>
            <span className="text-base sm:text-lg font-black text-green-600 animate-pulse">
              {grandTotalDue.toLocaleString("en-BD")} Pcs
            </span>
          </div>
        </div>

        {/* Printable Content */}


        <div ref={printRef} className="print:m-5">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-gray-800 text-white print:bg-gray-200 print:text-black">
                <tr>
                  <th className="px-5 py-4 text-left font-bold">#</th>
                  <th className="px-5 py-4 text-left font-bold">Company Name</th>
                  <th className="px-5 py-4 text-left font-bold text-red-300">
                    Total Sent
                  </th>

                  <th className="px-5 py-4 text-right font-bold text-green-300">
                    Total Claim
                  </th>

                  <th className="px-5 py-4 text-center font-bold text-green-300">
                    Total Receivable
                  </th>
                  <th className="px-5 py-4 text-center print:hidden">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {companySalesReturnList && companySalesReturnList.length > 0 ? (
                  companySalesReturnList.map((companySalesReturn, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() =>
                        navigate("/company-sales-return-statement", {
                          state: {
                            supplierName: companySalesReturn.supplierName,
                            supplierPhone: companySalesReturn.supplierPhone,
                            supplierEmail: companySalesReturn.supplierEmail,
                          },
                        })
                      }
                    >
                      <td className="px-6 py-4 text-gray-500">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4 font-medium text-gray-800">
                        {companySalesReturn.supplierName}
                      </td>

                      {/* Total Return */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 rounded-lg
    border border-red-200 bg-red-50 px-3 py-2
    font-bold text-red-700 shadow-sm">
                          <span className="h-2 w-2 rounded-full bg-red-500"></span>
                          {Number(companySalesReturn.totalAmount || 0).toLocaleString("en-BD")} Pcs
                        </span>
                      </td>

                      {/* Total Given */}
                      <td className="px-5 py-4 text-right">
                        <span className="inline-flex items-center gap-2 rounded-lg
    border border-green-200 bg-green-50 px-3 py-2
    font-bold text-green-700 shadow-sm">
                          <span className="h-2 w-2 rounded-full bg-green-500"></span>
                          {Number(companySalesReturn.totalPaid || 0).toLocaleString("en-BD")} Pcs
                        </span>
                      </td>

                      {/* Pending */}
                      <td className="px-5 py-4 text-center">
                        <span
                          className="inline-flex items-center gap-2 rounded-lg
      border border-blue-200 bg-blue-50 px-3 py-2
      font-extrabold text-blue-700 shadow-sm
      print:border-0 print:bg-transparent"
                        >
                          <span className="h-2 w-2 rounded-full bg-blue-500 print:hidden"></span>
                          {Number(companySalesReturn.totalDue || 0).toLocaleString("en-BD")} Pcs
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-center print:hidden">
                        <div className="flex flex-wrap gap-1 justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/company-sales-return-statement-pay", {
                                state: {
                                  supplierName: companySalesReturn.supplierName,
                                  supplierPhone: companySalesReturn.supplierPhone,
                                  supplierEmail: companySalesReturn.supplierEmail,
                                }
                              });
                            }}
                            className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-3 py-1.5 rounded font-semibold transition-colors"
                          >
                            Receive
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

export default CompanySalesReturnList;
