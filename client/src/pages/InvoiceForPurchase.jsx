import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { useSelector } from "react-redux";

const InvoiceForPurchase = () => {
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const title = `invoice-${new Date()
    .toISOString()
    .split(".")[0]
    .replaceAll(":", "_")}`;
  // console.log(title)

  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef, documentTitle: title });

  useEffect(() => {
    if (user && !location.state) {
      navigate("/point-of-sale");
    }
  }, []);

  //? Glimpse Stopper
  if (!user) return;
  if (!location.state) return;

  return (
    <>
      <div className="m-5">
        <div className="flex gap-5">
          <button
            className="mt-5 bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 transition-all duration-300 cursor-pointer"
            onClick={reactToPrintFn}
          >
            Print
          </button>
          <button
            className="mt-5 bg-green-500 text-white font-bold py-2 px-6 rounded shadow border-2 border-green-500 hover:bg-transparent hover:text-green-500 transition-all duration-300 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>

        <div
          ref={contentRef}
          className="max-w-3xl mx-auto bg-white p-6 mt-5"
        >
          {/* ---- PURCHASE PRINT HEADER ---- */}
          <div className="max-w-4xl mx-auto">
            {/* Company Info */}
            <div className="flex justify-between items-start border-b-2 border-red-600 pb-3">
              <div className="space-y-1">
                <h1 className="text-2xl font-extrabold text-red-700">
                  সবুজ অটো
                </h1>
                <p className="text-sm font-bold text-gray-800">
                  প্রোঃ মোঃ সবুজ
                </p>
                <p className="text-xs text-gray-800 font-medium">
                  অটো রিকশা ও ভ্যানের পার্টস পাইকারি ও খুচরা বিক্রেতা
                </p>
                <p className="text-xs text-gray-700 leading-tight">
                  ঠিকানা: জি. এল. রায় রো (লায়ন্স স্কুলের বিপরীতে), ঝন্টুর
                  মোড়, রংপুর।
                </p>
              </div>

              <div className="text-right space-y-1 text-xs text-gray-700">
                <p>মোবাইল: 01773080202 | 01830685667</p>
                <p>দোকান: 01979080202</p>
              </div>
            </div>

            {/* Purchase Info (only required fields) */}
            <div className="flex justify-between mt-4 border-b border-gray-300 pb-2">
              <div>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(location.state.createdAt).toLocaleDateString(
                    "en-GB",
                    {
                      timeZone: "Asia/Dhaka",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </p>
                <p>
                  <span className="font-semibold">Memo:</span>{" "}
                  {location.state.memo}
                </p>
                <p>
                  <span className="font-semibold">Supplier:</span>{" "}
                  {location.state.supplierName}
                </p>
              </div>
              <div className="text-right">
                <p>
                  <span className="font-semibold">Products:</span>{" "}
                  {location.state.productNames}
                </p>
                <p>
                  <span className="font-semibold">Quantity:</span>{" "}
                  {location.state.quantity}
                </p>
              </div>
            </div>

            {/* Purchase Table (only required columns) */}
            <table className="w-full border-collapse mt-4 text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-2 py-1 text-left">Products</th>
                  <th className="border px-2 py-1 text-center">QTY</th>

                  <th className="border px-2 py-1 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="border px-2 py-1">
                    {location.state.productNames}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {location.state.quantity}
                  </td>

                  <td className="border px-2 py-1 text-right">
                    ৳ {(location.state.totalAmount / 10000).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Summary (only Total, Paid, Due) */}
            <div className="mt-4 text-sm">
              <p className="font-semibold text-gray-800">
                Total:{" "}
                <span className="float-right">
                  ৳ {(location.state.totalAmount / 10000).toLocaleString()}
                </span>
              </p>
              <p className="font-semibold text-gray-800">
                Paid:{" "}
                <span className="float-right">
                  ৳ {(location.state.paid / 10000).toLocaleString()}
                </span>
              </p>
              <p
                className={`font-semibold float-right ${
                  location.state.due > 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                Due: <span>৳ {(location.state.due / 10000).toLocaleString()}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceForPurchase;
