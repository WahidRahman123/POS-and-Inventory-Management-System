import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSupplierDueList } from "../features/purchase/purchaseSlice";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { FaPrint, FaArrowLeft, FaMoneyBillWave, FaHandHoldingUsd } from "react-icons/fa";

const PurchaseSupplierDueList = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // রিডাক্স স্লাইস থেকে সার্বিক ব্যালেন্স ডাটা রিড করা
    const { supplierBalances, toggle, loading } = useSelector((state) => state.purchase);

    const [supplierName, setSupplierName] = useState("");
    const [sortOrder, setSortOrder] = useState(-1);

    const printRef = useRef(null);

    const reactToPrintFn = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Supplier-Balance-List-${new Date().toISOString().slice(0, 10)}`,
    });

    useEffect(() => {
        if (!user) navigate("/login");
        if (user && user.role !== "admin") navigate("/");
    }, [user, navigate]);

    useEffect(() => {
        if (user && user.role === "admin") {
            dispatch(
                fetchSupplierDueList({
                    supplierName,
                    order: sortOrder,
                }),
            );
        }
    }, [dispatch, user, sortOrder, supplierName, toggle]);

    if (user && user.role !== "admin") return null;

    return (
        <div className="p-3 sm:p-4 md:p-6 bg-white min-h-screen">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Supplier Overall Balance</h1>
                <div className="flex items-center gap-3">
                    <button
                        onClick={reactToPrintFn}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm cursor-pointer"
                    >
                        <FaPrint /> Print List
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-800 hover:text-white transition duration-200 cursor-pointer"
                    >
                        <FaArrowLeft /> Back
                    </button>
                </div>
            </div>

            {/* Filter Options */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 justify-between">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search by Supplier Name..."
                        value={supplierName}
                        onChange={(e) => setSupplierName(e.target.value)}
                        className="border border-gray-300 rounded px-4 py-2.5 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />

                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(Number(e.target.value))}
                        className="border border-gray-300 bg-white rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="-1">Highest Balance First</option>
                        <option value="1">Lowest Balance First</option>
                    </select>
                </div>

                {/* Short Note Info for Admins */}
                <div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 p-2.5 rounded-lg">
                    <p>💡 <span className="text-red-600 font-bold">Negative (-) Balance</span> = Supplier will get money (Due Pay Active)</p>
                    <p>💡 <span className="text-teal-600 font-bold">Positive (+) Balance</span> = Advance/Paid extra to supplier</p>
                </div>
            </div>

            {/* Main Table */}
            <div ref={printRef}>
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse text-sm">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="px-6 py-4 text-left">Supplier Name</th>
                                <th className="px-6 py-4 text-left">Mobile Number</th>
                                <th className="px-6 py-4 text-right">Current Account Balance</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {supplierBalances && supplierBalances.length > 0 ? (
                                supplierBalances.map((supplier, index) => {
                                    const isNegativeBalance = supplier.overallBalance < 0;

                                    return (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50 cursor-pointer transition duration-150"
                                            onClick={() =>
                                                navigate("/supplier-statement", {
                                                    state: {
                                                        supplierId: supplier.supplierId,
                                                        supplierName: supplier.supplierName,
                                                        supplierPhone: supplier.supplierPhone,
                                                    },
                                                })
                                            }
                                        >
                                            <td className="px-6 py-4 font-medium text-gray-900">{supplier.supplierName}</td>
                                            <td className="px-6 py-4 text-gray-600">{supplier.supplierPhone || "N/A"}</td>
                                            <td
                                                className={`px-6 py-4 text-right font-bold ${isNegativeBalance ? "text-red-600" : supplier.overallBalance > 0 ? "text-teal-600" : "text-gray-600"
                                                    }`}
                                            >
                                                ৳ {Number(supplier.overallBalance).toLocaleString("en-BD")}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex flex-wrap gap-1">
                                                    {/* Due Payment Button */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();

                                                            // আপনার অবজেক্ট স্ট্রাকচার চেক করার জন্য সেফগার্ড ডিফাইন করা হলো
                                                            const currentDue = supplier.balance ? supplier.balance : 0;
                                                            const supplierId = supplier._id || supplier.supplierId;
                                                            const supplierName = supplier.name || supplier.supplierName;

                                                            navigate("/purchase-report/due-payment", {
                                                                state: {
                                                                    supplierId: supplierId,
                                                                    supplierName: supplierName,
                                                                    totalDue: Number(currentDue), // নিশ্চিত করা হলো যেন NaN না হয়
                                                                    isSupplierLevel: true,
                                                                    address: supplier.address || "N/A", // ১ নং সমস্যার স্থায়ী সমাধান এখানেও দেওয়া হলো
                                                                    phone: supplier.phone || supplier.supplierPhone || ""
                                                                }
                                                            });
                                                        }}
                                                        className="text-xs text-white px-2 py-1 rounded cursor-pointer bg-red-600 hover:bg-red-700"
                                                    >
                                                        Due Payment
                                                    </button>

                                                    {/* Advance Payment Button */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();

                                                            const supplierId = supplier._id || supplier.supplierId;
                                                            const supplierName = supplier.name || supplier.supplierName;

                                                            navigate("/purchase", {
                                                                state: {
                                                                    fromAdvanceButton: true,
                                                                    supplierId: supplierId,
                                                                    supplierName: supplierName,
                                                                    address: supplier.address || "N/A", // এখানেও address পাস করা নিশ্চিত করা হলো
                                                                    supplierEmail: supplier.email || supplier.supplierEmail || "",
                                                                    supplierPhone: supplier.phone || supplier.supplierPhone || "",
                                                                    advanceBalance: Number(supplier.advanceBalance || 0)
                                                                }
                                                            });
                                                        }}
                                                        className="text-xs text-white px-2 py-1 rounded cursor-pointer bg-blue-600 hover:bg-blue-700"
                                                    >
                                                        Advance Payment
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-12 text-gray-500">
                                        {loading ? "Loading Supplier Balances..." : "No supplier records found."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PurchaseSupplierDueList;