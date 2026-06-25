import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { useSelector } from "react-redux";
import Decimal from "decimal.js";
import dayjs from "../utils/date.js";

const InvoiceForCustomer = () => {
	const { user } = useSelector((state) => state.auth);
	const navigate = useNavigate();
	const location = useLocation();
	// console.log(location.state)

	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
		if (user && !location.state) {
			navigate("/point-of-sale");
		}
	}, [user, location.state, navigate]);

	const title = `invoice-${new Date()
		.toISOString()
		.split(".")[0]
		.replaceAll(":", "_")}`;

	const contentRef = useRef(null);
	const reactToPrintFn = useReactToPrint({ contentRef, documentTitle: title });

	if (!user || !location.state) return null;

	const {
		customerName,
		address,
		customerPhone,
		invoiceNo,
		products,
		totalWithoutDiscount,
		discount,
		advanceAmount,
		loan,
		saleType,
		refMemo,
		total,
		cash,
		exchange,
		exchangeDetails, // মেমোর ডাটা
		// paid,
		paidAmount,
		salesId,
		due,
		bankPaymentAmount,
		previousBalance,
		currentBalance,
		remarks,
		createdAt,
		amountToBePaid,
	} = location.state;

	const scrapTotal =
		location.state.scrapProductSellId?.products?.reduce((total, product) => {
			return new Decimal(total)
				.plus(
					new Decimal(product.qtyInKg).times(product.unitPrice)
				)
				.toNumber();
		}, 0) || 0;

	// console.log(saleType);

	const isDuePayment = location.state && refMemo?.includes("DP-");

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
						{/* Header Section */}
						<div className="flex justify-between items-start border-b-2 border-red-600 pb-3">
							<div className="text-center sm:text-left space-y-1">
								<h1 className="text-2xl font-extrabold text-red-700">
									Ellite Battery
								</h1>
								<p className="text-xs text-gray-800 font-medium">
									Auto Rickshaw & Van Parts Wholesaler & Retailer
								</p>
								<p className="text-xs text-gray-700 leading-tight">
									Address: Shapla Chattar, College Road, Rangpur
								</p>
							</div>
							<div className="text-right space-y-1 text-xs text-gray-700">
								<p>Mobile: 01773080202 | 01830685667</p>
								<p>Shop: 01979080202</p>
								<p className="mt-6 font-semibold text-gray-800">
									Memo No:{" "}
									<span className="text-red-700">{location.state.refMemo || "--------"}</span>
								</p>
							</div>
						</div>

						{/* Customer Info Section */}
						<div className="flex justify-between mt-4  pb-2 text-sm ">
							<p><span className="font-semibold">Customer:</span> {customerName}</p>
							<p><span className="font-semibold">Address:</span> {address}</p>
							<div className="text-right">
								<p>
									<span className="font-semibold">Date:</span>{" "}
									{
										dayjs(createdAt)
											.tz("Asia/Dhaka")
											.format("DD MMM YYYY")
									}{" "}
									{/* {new Date(createdAt).toLocaleTimeString("en-US")} */}
								</p>
							</div>

						</div>
						<p className="border-b border-gray-300 pb-2 text-sm"><span className="font-semibold ">Customer Mobile:</span> {customerPhone}</p>

						{saleType !== "normal" && saleType !== "loan" && (
							<div className="my-5 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-center">
								<p className="text-lg font-bold text-red-700 uppercase tracking-wide">
									{saleType !== "scrap-sell" ? amountToBePaid === 0 ? "Advance Payment" : "Due Payment" : ""}
									{saleType === "scrap-sell" && "EXCHANGE PRODUCT SALE TRANSACTION"}
								</p>

								<p className="mt-1 text-sm text-gray-700">
									Against Memo No :
									<span className="ml-2 font-semibold text-gray-900">
										{refMemo}
									</span>
								</p>
							</div>
						)}


						{/* Main Products Table */}
						{!isDuePayment && saleType !== "scrap-sell" && (<table className="w-full border-collapse mt-4 text-sm">
							<thead>
								<tr className="bg-red-600 text-white">
									<th className="border border-gray-300 px-2 py-1">SL.</th>
									<th className="border border-gray-300 px-2 py-1 text-left">Product Description</th>
									<th className="border border-gray-300 px-2 py-1 text-center">Quantity</th>
									<th className="border border-gray-300 px-2 py-1 text-right">Price</th>
									<th className="border border-gray-300 px-2 py-1 text-right">Total</th>
								</tr>
							</thead>
							<tbody>
								{salesId.products && salesId.products.length > 0 ? salesId.products.map((sale, index) => (
									<tr key={index}>
										<td className="border border-gray-300 px-2 py-1 text-center">{index + 1}</td>
										<td className="border border-gray-300 px-2 py-1">{sale.productName}</td>
										<td className="border border-gray-300 px-2 py-1 text-center">{sale.quantity}</td>
										<td className="border border-gray-300 px-2 py-1 text-right">
											{new Decimal(sale.sellPrice).toFixed(2)}
										</td>
										<td className="border border-gray-300 px-2 py-1 text-right">
											{new Decimal(sale.subTotal).toFixed(2)}
										</td>
									</tr>
								)) : (
									<tr>
										<td className="border border-gray-300 px-4 py-2 text-gray-500 select-none text-center" colSpan={5}>
											No products sold.
										</td>
									</tr>
								)}
							</tbody>
						</table>)}

						{saleType === "scrap-sell" && (
							<table className="w-full border-collapse mt-4 text-sm">
								<thead>
									<tr className="bg-red-600 text-white">
										<th className="border border-gray-300 px-2 py-1 text-left">
											Product
										</th>
										<th className="border border-gray-300 px-2 py-1 text-center">
											Qty
										</th>
										<th className="border border-gray-300 px-2 py-1 text-center">
											Weight
										</th>
										<th className="border border-gray-300 px-2 py-1 text-right">
											Unit Price
										</th>
									</tr>
								</thead>

								<tbody>
									{location.state.scrapProductSellId?.products?.map((product, i) => (
										<tr key={i}>
											<td className="border border-gray-300 px-2 py-1">
												{product.productName}
											</td>

											<td className="border border-gray-300 px-2 py-1 text-center">
												{product.quantity}
											</td>

											<td className="border border-gray-300 px-2 py-1 text-center">
												{product.qtyInKg} Kg
											</td>

											<td className="border border-gray-300 px-2 py-1 text-right">
												৳ {new Decimal(product.unitPrice).toFixed(2)}
											</td>
										</tr>
									))}
								</tbody>
								<tfoot>
									<tr className="bg-gray-100 font-bold">
										<td
											colSpan={3}
											className="border border-gray-300 px-2 py-2 text-right"
										>
											Total
										</td>
										<td className="border border-gray-300 px-2 py-2 text-right">
											৳ {new Decimal(scrapTotal).toFixed(2)}
										</td>
									</tr>
								</tfoot>
							</table>
						)}


						{/* --- EXCHANGE DETAILS SECTION (NEW) --- */}
						{/* --- EXCHANGE DETAILS SECTION --- */}
						{exchangeDetails && exchangeDetails.products.length > 0 && (
							<div className="mt-6 border-2 border-gray-200 rounded">
								<div className="bg-gray-100 px-2 py-1 border-b border-gray-200 flex justify-between items-center">
									<h3 className="text-xs font-bold text-gray-700">
										Exchange Item Details (Against Memo: {exchangeDetails.memo})
									</h3>
									{/* এখানে মেমোর অবশিষ্ট ব্যালেন্স দেখানো হচ্ছে */}
									{/* <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-gray-300 font-bold text-blue-700">
                    Remaining: ৳{new Decimal(exchangeDetails.remainingBalance || 0).toFixed(2)}
                  </span> */}
								</div>
								<table className="w-full text-xs border-collapse">
									<thead>
										<tr className="bg-gray-50">
											<th className="border px-2 py-1 text-left">Product Name</th>
											<th className="border px-2 py-1 text-center">Qty/Kg</th>
											<th className="border px-2 py-1 text-right">Rate</th>
											<th className="border px-2 py-1 text-right">Subtotal</th>
										</tr>
									</thead>
									<tbody>
										{exchangeDetails.products?.map((p, i) => (
											<tr key={i}>
												<td className="border px-2 py-1">{p.productName}</td>
												<td className="border px-2 py-1 text-center">
													{p.quantity} {p.qtyInKg > 0 ? `(${p.qtyInKg} kg)` : ""}
												</td>
												<td className="border px-2 py-1 text-right">{p.unitPrice.toFixed(2)}</td>
												<td className="border px-2 py-1 text-right">{p.subTotal.toFixed(2)}</td>
											</tr>
										))}
									</tbody>
								</table>
								{/* নিচে আলাদা করে হাইলাইট করার জন্য */}
								<div className="bg-gray-50 text-right p-1 text-[10px] font-semibold text-orange-700 border-t">
									Amount Adjusted in this Invoice: ৳{new Decimal(exchange).toFixed(2)}
								</div>
							</div>
						)}



						{/* Summary Section */}
						<div className="mt-4 text-sm space-y-1">
							{!isDuePayment && saleType !== "scrap-sell" && (
								<>
									<div className="font-semibold text-red-600">
										Total Item(s): {salesId.products?.length || 0}
										<span className="float-right">
											{new Decimal(salesId.totalWithoutDiscount).toFixed(2)}
										</span>

										<p>Discount<span className="float-right">{salesId.discount ? new Decimal(salesId.discount).toFixed(2) : "0.00"}</span></p>

										<p className="text-red-600 font-medium">
											Loan Amount (+) / Customer Payment Amount<span className="float-right">{salesId.loan ? new Decimal(salesId.loan).toFixed(2) : "0.00"}</span>
										</p>

										<p className="font-bold border-t border-gray-200 pt-1">
											Payable Amount<span className="float-right">{new Decimal(salesId.total).toFixed(2)}</span>
										</p>
									</div>
								</>
							)}



							{saleType === "due-payment" ? (
								<p className="font-bold border-t border-gray-200 pt-1">
									Amount To Be Paid<span className="float-right">{new Decimal(amountToBePaid).toFixed(2)}</span>
								</p>
							) : ""}
							<div className="pt-2 border-t border-dotted border-gray-300">
								<p>Cash<span className="float-right">{cash ? new Decimal(cash).toFixed(2) : "0.00"}</span></p>
								<p>Bank<span className="float-right">{bankPaymentAmount ? new Decimal(bankPaymentAmount).toFixed(2) : "0.00"}</span></p>
								<p>Exchange<span className="float-right">{exchange ? new Decimal(exchange).toFixed(2) : "0.00"}</span></p>
								<p className="font-bold">Total Paid<span className="float-right">{paidAmount || advanceAmount ? new Decimal(paidAmount).plus(new Decimal(advanceAmount)).toFixed(2) : "0.00"}</span></p>
								<p className="font-bold">Previous Balance<span className="float-right">{previousBalance ? new Decimal(previousBalance || 0).toFixed(2) : "0.00"}</span></p>
								{/* <p className="font-bold text-red-700">
                  Due Amount
                  <span className="float-right">
                    {new Decimal(due).lessThan(0)
                      ? `${new Decimal(due).abs().toFixed(2)} (Refund)`
                      : new Decimal(due).toFixed(2)}
                  </span>
                </p> */}
								{/* <p className="font-bold">Advance Paid<span className="float-right">{advanceAmount ? new Decimal(advanceAmount).toFixed(2) : "0.00"}</span></p> */}
								<p className="font-bold">Current Balance<span className="float-right">{currentBalance ? new Decimal(currentBalance || 0).toFixed(2) : "0.00"}</span></p>
							</div>
						</div>

						{/* Remarks Section */}
						<div className="mt-6">
							<p className="text-red-600 font-semibold text-xs">Remarks:</p>
							<div className="min-h-[40px] border border-gray-300 rounded p-2 text-xs italic text-gray-600">
								{remarks || "No remarks"}
							</div>
						</div>

						<div className="mt-16 flex justify-between text-sm">
							<div>
								<p className="font-medium">Customer Signature</p>
								<div className="w-52 h-px bg-gray-400 mt-8"></div>
							</div>
							<div className="text-right">
								<p className="font-medium">Authorized Signature</p>
								<div className="w-52 h-px bg-gray-400 mt-8"></div>
							</div>
						</div>

						<div className="mt-8 text-center text-[10px] text-gray-500 border-t pt-2">
							Thank you for your business!
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default InvoiceForCustomer;