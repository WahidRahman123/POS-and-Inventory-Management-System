import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTruck,
  FaBox,
  FaWeightHanging,
  FaMoneyBillWave,
  FaPlus,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { useState } from "react";
import Decimal from "decimal.js";
import { useDispatch, useSelector } from "react-redux";
import {
  addCompanyProductReturn,
  fetchCompanyProductReturnById,
  fetchCompanyProductReturns,
  fetchProductExchangeReportData,
} from "../features/CompanyProductReturn/companyProductReturnSlice";
import { useEffect } from "react";

const CompanyReturn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    companyProductReturns,
    productExchangeReportData,
    addLoading,
    toggle,
    page,
    pages,
  } = useSelector((state) => state.companyProductReturn);
  const [currentPage, setCurrentPage] = useState(page);
  const [memoSearch, setMemoSearch] = useState("");
  const [formData, setFormData] = useState({
    date: "",
    productName: "",
    quantity: "",
    qtyInKg: "",
    unitPrice: "",
    subTotal: "",
  });

  const handleOnChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //* Company Name Handle - starts
  const [supplier, setSupplier] = useState("");
  const loadOptions = async (inputValue, callback) => {
    if (!inputValue) return callback([]);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/supplier/purchase`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          params: {
            q: inputValue,
          },
        },
      );
      if (data && Array.isArray(data)) {
        const options = data.map((item) => ({
          label: item.name,
          value: item,
        }));
        callback(options);
      }
    } catch (error) {
      callback([]);
    }
  };
  //* Company Name Handle - ends

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supplier) return alert("Select a Company!");

    const returnData = {
      createdAt: formData.date,
      issuedAt: new Date(),
      supplierId: supplier._id,
      supplierName: supplier.name,
      address: supplier.address,
      supplierEmail: supplier.email,
      supplierPhone: supplier.phone,
      userId: user._id,

      productName: formData.productName,
      quantity: Number(formData.quantity),
      qtyInKg: Number(formData.qtyInKg),
      unitPrice: Number(formData.unitPrice),
      subTotal: Number(formData.subTotal),

      totalAmount: Number(formData.subTotal),
      paid: 0,
      due: Number(formData.subTotal),

      unchangedPaid: 0,
      unchangedDue: Number(formData.subTotal),
    };

    try {
      await dispatch(addCompanyProductReturn(returnData)).unwrap();
      setFormData({
        date: "",
        productName: "",
        quantity: "",
        qtyInKg: "",
        unitPrice: "",
        subTotal: "",
      });
      setSupplier("");
    } catch (error) {
      console.log("Failed!");
    }
  };

  useEffect(() => {
    if (user) {
      dispatch(
        fetchCompanyProductReturns({
          memoSearch,
          page: currentPage,
        }),
      );
    }
  }, [dispatch, user, toggle, currentPage, memoSearch]);

  useEffect(() => {
    if (user) {
      dispatch(
        fetchProductExchangeReportData({
          memoSearch,
          page: currentPage,
        }),
      );
    }
  }, [dispatch, user, toggle]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* --- Section 1: Financial Summary (Updated to reflect Cash flow) --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 shadow-sm border-b-4 border-blue-600 rounded-sm">
            <div className="flex items-center gap-3 mb-2 text-blue-600">
              <FaBox size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                Total Sent Items
              </p>
            </div>
            <p className="text-2xl font-black text-gray-800">
              {productExchangeReportData
                ? productExchangeReportData.totalSentItems
                : "--"}{" "}
              <span className="text-xs">Pcs</span>
            </p>
          </div>

          <div className="bg-white p-5 shadow-sm border-b-4 border-orange-500 rounded-sm">
            <div className="flex items-center gap-3 mb-2 text-orange-500">
              <FaWeightHanging size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                Total Weight
              </p>
            </div>
            <p className="text-2xl font-black text-gray-800">
              {productExchangeReportData
                ? productExchangeReportData.totalWeight
                : "--"}{" "}
              <span className="text-xs">Kg</span>
            </p>
          </div>

          <div className="bg-gray-900 p-5 shadow-sm border-b-4 border-green-600 rounded-sm">
            <div className="flex items-center gap-3 mb-2 text-green-500">
              <FaMoneyBillWave size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Total Receivable
              </p>
            </div>
            <p className="text-2xl font-black text-white">
              ৳{" "}
              {productExchangeReportData
                ? productExchangeReportData.totalAmount
                : "--"}
            </p>
          </div>

          <div className="bg-white p-5 shadow-sm border-b-4 border-red-600 rounded-sm">
            <div className="flex items-center gap-3 mb-2 text-red-500">
              <FaTruck size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                Pending From Co.
              </p>
            </div>
            <p className="text-2xl font-black text-gray-800">
              ৳{" "}
              {productExchangeReportData
                ? productExchangeReportData.totalDue
                : "--"}
            </p>
          </div>
        </div>

        {/* --- Section 2: Horizontal Entry Form --- */}
        <div className="bg-white p-6 rounded-sm shadow-md mb-8 border-t-4 border-blue-600">
          <h2 className="text-xs font-black mb-4 flex items-center gap-2 text-gray-700 uppercase">
            <FaPlus className="text-blue-600" /> Dispatch New Return to Company
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-3 items-end"
          >
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                Dispatch Date
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 text-xs font-bold outline-none"
                value={formData.date}
                onChange={(e) => handleOnChange("date", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                Select Company
              </label>

              <AsyncSelect
                className="text-xs font-bold"
                cacheOptions
                loadOptions={loadOptions}
                defaultOptions
                isClearable
                value={
                  supplier ? { label: supplier.name, value: supplier } : null
                }
                noOptionsMessage={() => "No Company Found!"}
                components={{ DropdownIndicator: () => null }}
                onChange={(selected) => {
                  selected ? setSupplier(selected.value) : setSupplier("");
                }}
                placeholder="Search..."
              />
            </div>
            <div className="space-y-1 lg:col-span-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                Product Name
              </label>
              <input
                type="text"
                placeholder="12V 100AH"
                className="w-full p-2 border border-gray-300 text-xs outline-none"
                value={formData.productName}
                onChange={(e) => handleOnChange("productName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                Qty & Weight
              </label>
              <div className="flex gap-1">
                <input
                  type="number"
                  step="any"
                  placeholder="Qty"
                  min="1"
                  className="w-1/2 p-2 border border-gray-300 text-xs font-bold outline-none"
                  value={formData.quantity}
                  max={productExchangeReportData?.totalSentItems || ""}
                  onChange={(e) => {
                    handleOnChange("quantity", e.target.value);
                    const subTotal = new Decimal(Number(e.target.value)).mul(
                      new Decimal(Number(formData.unitPrice)),
                    );

                    handleOnChange("subTotal", Number(subTotal.toFixed(4)));
                  }}
                  required
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Kg"
                  min="1"
                  className="w-1/2 p-2 border border-gray-300 text-xs font-bold outline-none"
                  value={formData.qtyInKg}
                  max={productExchangeReportData?.totalWeight || ""}
                  onChange={(e) => {
                    handleOnChange("qtyInKg", e.target.value);
                  }}
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                Price Per Unit
              </label>
              <input
                type="number"
                step="any"
                placeholder="৳"
                min="1"
                className="w-full p-2 border border-gray-300 text-xs font-bold outline-none"
                value={formData.unitPrice}
                onChange={(e) => {
                  handleOnChange("unitPrice", e.target.value);

                  const subTotal = new Decimal(Number(e.target.value)).mul(
                    new Decimal(Number(formData.quantity)),
                  );

                  handleOnChange("subTotal", Number(subTotal.toFixed(4)));
                }}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                Total Claim
              </label>
              <input
                type="number"
                step="any"
                readOnly
                className="w-full p-2 border border-gray-300 text-xs font-black bg-blue-50 text-blue-700 outline-none"
                value={formData.subTotal}
              />
            </div>
            <button
              type="submit"
              disabled={addLoading}
              className="relative bg-blue-700 hover:bg-black text-white font-black py-2.5 rounded-sm transition uppercase text-[10px] cursor-pointer tracking-widest disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              <span className="invisible">Save & Send</span>

              <span className="absolute inset-0 flex items-center justify-center">
                {addLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "Save & Send"
                )}
              </span>
            </button>
          </form>
        </div>

        {/* --- Section 3: History Table (Payment Focused) --- */}
        <div className="bg-white shadow-xl border-t-4 border-gray-800 overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <h2 className="text-[10px] font-black uppercase text-gray-600 tracking-widest">
              Company Payment Tracking
            </h2>
            <input
              type="search"
              value={memoSearch}
              onChange={(e) => setMemoSearch(e.target.value)}
              placeholder="Search Memo..."
              className="text-[10px] border px-3 py-1.5 outline-none w-48 font-bold"
            />
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100 text-[10px] uppercase font-black text-gray-500 border-b">
                <th className="p-4">Date</th>
                <th className="p-4">Memo</th>
                <th className="p-4">Company</th>
                <th className="p-4">Product Info</th>
                <th className="p-4 text-center">Dispatch Qty</th>
                <th className="p-4 text-right">Claim Amount (৳)</th>
                <th className="p-4 text-center">Payment Status</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {companyProductReturns.length > 0 ? (
                companyProductReturns.map((productReturn, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-blue-50 transition-colors cursor-pointer group"
                    onClick={() =>
                      navigate("/company-statement", { state: productReturn })
                    }
                  >
                    <td className="p-4 font-bold text-gray-400 italic font-mono">
                      {new Date(productReturn.createdAt)
                        .toLocaleDateString("en-GB", {
                          timeZone: "Asia/Dhaka",
                        })
                        .replaceAll("/", "-")}
                    </td>
                    <td className="p-4 text-gray-500 uppercase font-black">
                      {productReturn.memo}
                    </td>
                    <td className="p-4 font-black text-blue-600 group-hover:underline uppercase tracking-tighter">
                      {productReturn.supplierName}
                    </td>
                    <td className="p-4 font-semibold text-gray-600 uppercase">
                      {productReturn.productName}
                    </td>
                    <td className="p-4 text-center font-black">
                      {`${productReturn.quantity} Pcs | ${productReturn.qtyInKg} Kg`}
                    </td>
                    <td className="p-4 text-right font-black text-gray-800 tracking-tighter text-sm">
                      ৳ {productReturn.totalAmount}
                    </td>
                    <td className="p-4 text-center">
                      {productReturn.due > 0 ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full">
                          <FaExclamationCircle
                            size={10}
                            className="animate-pulse"
                          />
                          <span className="text-[9px] font-black uppercase tracking-tighter italic">
                            ৳ {productReturn.due} Pending
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-full">
                          <FaCheckCircle size={10} />
                          <span className="text-[9px] font-black uppercase tracking-tighter">
                            Full Paid
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center text-gray-500 py-10 text-lg border-b border-gray-400"
                  >
                    No Return Available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination logic remains unchanged */}
        {pages > 0 && (
          <div className="flex justify-center items-center mt-4 gap-2 text-sm">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`${page === 1 ? "" : "cursor-pointer hover:bg-black hover:text-white"} px-2 py-1 border rounded disabled:opacity-50`}
            >
              Prev
            </button>
            <span>
              Page {page} of {pages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, pages))}
              disabled={page === pages}
              className={`${page === pages ? "" : "cursor-pointer hover:bg-black hover:text-white"} px-2 py-1 border rounded disabled:opacity-50`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyReturn;
