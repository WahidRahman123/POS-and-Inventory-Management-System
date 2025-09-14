import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { useSelector } from "react-redux";

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
            onClick={() => navigate("/point-of-sale")}
          >
            Back
          </button>
        </div>
        <div className="m-5">
          <div ref={contentRef} className="max-w-3xl mx-auto bg-white p-6 mt-5">
            <div className="flex justify-between items-start border-b border-red-500 pb-2">
              <div>
                <h1 className="text-xl font-bold text-red-600">Sobuj Auto </h1>
                <p className="text-sm text-gray-600">
                  Address: G.L. Roy Road(Opposite of Lions School), Jhantur Mor,
                  Rangpur.
                </p>
                <p className="text-sm text-gray-600">Mobile: 01773080202</p>
                <p className="text-sm text-gray-600">
                  Shop Mobile: 01979080202
                </p>
                {/* <p className="text-sm text-gray-600">
                  Email: info@biznishike.com
                </p>
                <p className="text-sm text-gray-600">
                  WebSite: biznishike.com, facebook.com/biznishike
                </p> */}
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">We Care For You</p>
              </div>
            </div>

            <div className="flex justify-between mt-4 border-b border-gray-300 pb-2">
              <p>
                <span className="font-semibold">M/s:</span>{" "}
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
                  <th className="border border-gray-300 px-2 py-1">No.</th>
                  <th className="border border-gray-300 px-2 py-1">Products</th>
                  <th className="border border-gray-300 px-2 py-1">QTY</th>

                  <th className="border border-gray-300 px-2 py-1">RATE</th>
                  <th className="border border-gray-300 px-2 py-1">AMOUNT</th>
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
                        {sale.sellPrice}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-right">
                        {sale.subtotal}
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
                Total Orders{" "}
                {location.state ? location.state.products.length : ""}{" "}
                <span className="float-right">
                  {location.state ? location.state.total : ""}
                </span>
              </p>
              <p>
                Bill Paid{" "}
                <span className="float-right">
                  {location.state ? location.state.paid : ""}
                </span>
              </p>
              <p>
                Due{" "}
                <span className="float-right">
                  {location.state
                    ? location.state.due < 0
                      ? `${Math.abs(location.state.due)} (ফেরত পাবে)`
                      : location.state.due
                    : ""}
                </span>
              </p>
            </div>

            <div className="mt-6">
              <p className="text-red-600 font-semibold">Remarks:</p>
              <div className="h-12 border border-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoicePage;
