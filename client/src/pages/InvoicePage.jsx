import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { useSelector } from "react-redux";
import Decimal from "decimal.js";

const InvoicePage = () => {
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
        <div className="m-5">
          <div ref={contentRef} className="max-w-3xl mx-auto bg-white p-6 mt-5">
            <div className="flex justify-between items-start border-b-2 border-red-600 pb-3">
              {/* LEFT : centre-aligned text block */}
              <div className="text-center sm:text-left space-y-1">
                <h1 className="text-2xl font-extrabold text-red-700">
                  Ellite Bettary 
                </h1>
                {/* <p className="text-sm font-bold text-gray-800">
                  প্রোঃ মোঃ সবুজ
                </p> */}
                <p className="text-xs text-gray-800 font-medium">
                  Auto Rickshaw & Van Parts Wholesaler & Retailer
                </p>
                <p className="text-xs text-gray-700 leading-tight">
                  
                    Address:Shapla Chattar, College Road, Rangpur  
                   
                  
                </p>
              </div>
              {/* RIGHT : mobile numbers + invoice number (image-মতো) */}
              <div className="text-right space-y-1 text-xs text-gray-700">
                <p>Mobile: 01773080202 | 01830685667</p>
                <p>Shop: 01979080202</p>
                {/* Invoice Number sits exactly under mobile numbers, above the border */}

                <p className="mt-6 font-semibold text-gray-800">
                  Invoice No:{" "}
                  <span className="text-red-700">
                    {location.state?.invoiceNo || "--------"}
                  </span>
                </p>
              </div>
            </div>
            {/* <div className="flex justify-between items-start border-b border-red-500 pb-2">
              <div>
                <h1 className="text-xl font-bold text-red-600">সবুজ অটো </h1>
                <p className="text-sm text-gray-600">
                  ঠিকানা: জি. এল. রায় রোড( লায়ন্স স্কুলের বিপরীতে), ঝন্টুর মোড়, রংপুর|
                </p>
                <p className="text-sm text-gray-600">মোবাইল: 01773080202</p>
                <p className="text-sm text-gray-600">মোবাইল: 01830685667</p>
                <p className="text-sm text-gray-600">
                  দোকান: 01979080202
                </p>
                <p className="text-sm text-gray-600">
                  Email: info@biznishike.com
                </p>
                <p className="text-sm text-gray-600">
                  WebSite: biznishike.com, facebook.com/biznishike
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">অটো রিকশা ও ভ্যানের পার্টস পাইকারি ও খুচরা বিক্রেতা</p>
              </div>
            </div> */}

            <div className="flex justify-between mt-4 border-b border-gray-300 pb-2">
              <p>
                <span className="font-semibold">Customer:</span>{" "}
                {location.state ? location.state.customerName : ""}
              </p>
              <p>
                <span className="font-semibold">Address: </span>
                {location.state?.address ?? ""}
              </p>
              <div className="text-right">
                {/* <p>
                  <span className="font-semibold">Sr.#</span> 4
                </p> */}
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date().toLocaleDateString("en-GB", {
                    timeZone: "Asia/Dhaka",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  {new Date().toLocaleTimeString("en-US", {
                    timeZone: "Asia/Dhaka",
                  })}
                </p>
              </div>
            </div>

            <table className="w-full border-collapse mt-4 text-sm">
              <thead>
                <tr className="bg-red-600 text-white">
                  <th className="border border-gray-300 px-2 py-1">SL.</th>
                  <th className="border border-gray-300 px-2 py-1">
                    Product Description
                  </th>
                  <th className="border border-gray-300 px-2 py-1">Quantity</th>

                  <th className="border border-gray-300 px-2 py-1">Price</th>
                  <th className="border border-gray-300 px-2 py-1">Total</th>
                </tr>
              </thead>
              <tbody>
                {location.state ? (
                  location.state.products.map((sale, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-2 py-1 text-center">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {sale.productName}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-center">
                        {sale.quantity}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-right">
                        {new Decimal(sale.sellPrice).toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-right">
                        {new Decimal(sale.subtotal).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr></tr>
                )}
              </tbody>
            </table>

            <div className="mt-4 text-sm">
              <p className="font-semibold text-red-600">
                Total {location.state ? location.state.products.length : ""}{" "}
                <span className="float-right">
                  {location.state
                    ? new Decimal(location.state.totalWithoutDiscount).toFixed(
                        2
                      )
                    : ""}
                </span>
              </p>
              <p>
                Discount{" "}
                <span className="float-right">
                  {location.state
                    ? location.state.discount
                      ? new Decimal(location.state.discount).toFixed(2)
                      : 0
                    : ""}
                </span>
              </p>
              <p>
                Payable Amount{" "}
                <span className="float-right">
                  {location.state
                    ? new Decimal(location.state.total).toFixed(2)
                    : ""}
                </span>
              </p>
              <br />
              <p>
                Cash{" "}
                <span className="float-right">
                  {location.state
                    ? location.state.cash
                      ? new Decimal(location.state.cash).toFixed(2)
                      : 0
                    : ""}
                </span>
              </p>
              <p>
                Exchange{" "}
                <span className="float-right">
                  {location.state
                    ? location.state.exchange
                      ? new Decimal(location.state.exchange).toFixed(2)
                      : 0
                    : ""}
                </span>
              </p>
              <p>
                Total Paid{" "}
                <span className="float-right">
                  {location.state
                    ? location.state.paid
                      ? new Decimal(location.state.paid).toFixed(2)
                      : 0
                    : ""}
                </span>
              </p>
              <p>
                Due Amount{" "}
                <span className="float-right">
                  {location.state
                    ? new Decimal(location.state.due).lessThan(new Decimal(0))
                      ? `${new Decimal(location.state.due)
                          .abs()
                          .toFixed(2)} (Refund)`
                      : location.state.due
                      ? new Decimal(location.state.due).toFixed(2)
                      : 0
                    : ""}
                </span>
              </p>
            </div>

            <div className="mt-6">
              <p className="text-red-600 font-semibold">Remarks:</p>
              <div className="h-12 border border-gray-300 rounded">
                {location.state.remarks}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoicePage;
