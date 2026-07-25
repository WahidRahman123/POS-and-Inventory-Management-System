import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { fetchProductStatementReport } from "../features/ProductStatement/productStatementSlice";
import dayjs from "../utils/date.js";
import { FaArrowLeft } from "react-icons/fa";

const ProductStatement = () => {
	const { user } = useSelector((state) => state.auth);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { state } = useLocation();

	// console.log(state)

	const { productStatementReport, page, pages, loading } =
		useSelector((state) => state.productStatement);

	// console.log(productStatementReport);
	const [productName, setProductName] = useState("");
	const [dateSearch, setDateSearch] = useState("");
	// const [filterToggler, setFilterToggler] = useState(true);
	const [currentPage, setCurrentPage] = useState(page);
	// const [sortOrder, setSortOrder] = useState(1);

	useEffect(() => {
		if (!user) navigate("/login");
		dispatch(
			fetchProductStatementReport({
				page: currentPage,
				// order: sortOrder,
				productName,
				dateSearch
			})
		);
	}, [user, navigate, dispatch, currentPage, productName, dateSearch]);

	useEffect(() => {
		setProductName(state)
	}, [state])

	if (!user) return null;

	return (
		<div className="bg-slate-50 min-h-screen p-3 sm:p-4 md:p-6 font-sans">
			{/* Header */}
			{/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
				<h1 className="text-xl sm:text-2xl font-bold">Product Statement</h1>
			</div> */}

			{/* Controls */}
			<div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
				<h2 className="text-2xl font-bold text-gray-800">Product Statement for <span className="text-green-800">"{state}"</span></h2>
				<div className="flex flex-wrap gap-4 items-end">
					{/* <input
						type="search"
						value={productName}
						onChange={(e) => setProductName(e.target.value)}
						placeholder="Search Product"
						className="px-4 py-2 border border-gray-400 rounded-md text-sm"
					/> */}
					<input
						type="date"
						value={dateSearch}
						onChange={(e) => setDateSearch(e.target.value)}
						className="px-4 py-2 border border-gray-400 rounded-md text-sm"
					/>
					<button
						onClick={() => navigate(-1)}
						className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-800 hover:text-white transition duration-200 cursor-pointer"
					>
						<FaArrowLeft /> Back
					</button>
					{/* <button
						onClick={() => setFilterToggler(!filterToggler)}
						className="px-4 py-2 bg-red-500 text-white rounded-md text-sm"
					>
						Filter
					</button>
					<button
						onClick={() => {
							setDateSearch("");
							setProductName("");
							setFilterToggler(!filterToggler);
						}}
						className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm"
					>
						Clear
					</button> */}
				</div>
			</div>

			<div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
				<div className="overflow-x-auto">
					<table className="min-w-full text-sm">
						<thead className="border-b bg-gray-50">
							<tr className="text-xs font-semibold uppercase tracking-wider text-gray-600">
								<th className="px-4 py-3 text-left">#</th>
								<th className="px-4 py-3 text-left">Date & Time</th>
								<th className="px-4 py-3 text-left">Product</th>
								<th className="px-4 py-3 text-left">Customer / Supplier</th>
								<th className="px-4 py-3 text-left">Transaction</th>
								<th className="px-4 py-3 text-right">Previous</th>
								<th className="px-4 py-3 text-right">Quantity</th>
								<th className="px-4 py-3 text-right">Current</th>
								<th className="px-4 py-3 text-center">Status</th>
							</tr>
						</thead>

						<tbody className="divide-y divide-gray-100">
							{productStatementReport.length ? (
								productStatementReport.map((item, index) => (
									<tr
										key={item._id}
										className="transition-colors hover:bg-gray-50"
									>
										{/* Serial */}
										<td className="px-4 py-3">
											{(page - 1) * 10 + index + 1}
										</td>

										{/* Date */}
										<td className="whitespace-nowrap px-4 py-3">
											<div className="font-medium text-gray-800">
												{dayjs(item.createdAt)
													.tz("Asia/Dhaka")
													.format("DD-MM-YYYY")}
											</div>
											<div className="text-xs text-gray-500">
												{dayjs(item.createdAt)
													.tz("Asia/Dhaka")
													.format("h:mm A")}
											</div>
										</td>

										{/* Product */}
										<td className="whitespace-nowrap px-4 py-3 font-medium text-gray-800">
											{item.productName}
										</td>

										{/* Customer / Supplier */}
										<td className="px-4 py-3 whitespace-nowrap">
											{item.customerName ? (
												<div className="flex items-center gap-2">
													<span className="font-medium text-gray-800">
														{item.customerName}
													</span>
													<span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
														Customer
													</span>
												</div>
											) : item.supplierName ? (
												<div className="flex items-center gap-2">
													<span className="font-medium text-gray-800">
														{item.supplierName}
													</span>
													<span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
														Supplier
													</span>
												</div>
											) : (
												<span className="text-red-800 font-medium text-center">Admin</span>
											)}
										</td>

										{/* Transaction */}
										<td className="px-4 py-3">
											<span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
												{item.transactionType}
											</span>
										</td>

										{/* Previous */}
										<td className="px-4 py-3 text-right font-medium text-gray-700">
											{item.previousQuantity}
										</td>

										{/* Quantity */}
										<td className="px-4 py-3 text-right font-medium text-gray-700">
											{item.quantityAmount}
										</td>

										{/* Current */}
										<td className="px-4 py-3 text-right font-semibold text-gray-900">
											{item.CurrentQuantity}
										</td>

										{/* Status */}
										<td className="px-4 py-3 text-center">
											<span
												className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${item.status === "created"
													? "bg-green-100 text-green-700"
													: item.status === "increased"
														? "bg-emerald-100 text-emerald-700"
														: item.status === "decreased"
															? "bg-red-100 text-red-700"
															: "bg-gray-100 text-gray-700"
													}`}
											>
												{item.status}
											</span>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={9}
										className="py-10 text-center text-lg text-gray-500"
									>
										No transaction history found.
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
						className={`${page === 1 ? '' : 'cursor-pointer hover:bg-black hover:text-white'} px-2 py-1 border rounded  disabled:opacity-50`}
					>
						Prev
					</button>
					<span>
						Page {page} of {pages}
					</span>
					<button
						onClick={() => setCurrentPage((p) => Math.min(p + 1, pages))}
						disabled={page === pages}
						className={`${page === pages ? '' : 'cursor-pointer hover:bg-black hover:text-white'}  px-2 py-1 border rounded  disabled:opacity-50`}
					>
						Next
					</button>
				</div>
			) : ""}
		</div>
	);
};

export default ProductStatement;
