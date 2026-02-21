import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { useSelector } from "react-redux";
import Decimal from "decimal.js";

const InvoiceForPurchaseReturn = () => {
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
            {JSON.stringify(location.state)}
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceForPurchaseReturn;
