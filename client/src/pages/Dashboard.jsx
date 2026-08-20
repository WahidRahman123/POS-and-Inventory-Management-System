import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardResult } from "../features/dashboard/dashboardSlice";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import GrandTotalCard from "../components/GrandTotalCard";

/* Row Item */
const Row = ({ label, value, suffix = "", textColor = "text-white" }) => (
  <div
    className={`flex justify-between text-xs sm:text-sm mt-2 ${textColor}/90`}
  >
    <span>{label}</span>
    <span className="font-medium">
      <CountUp
        end={value || 0}
        duration={0.4}
        preserveValue={true}
        formattingFn={(val) => Number(val).toLocaleString("en-BD") + suffix}
      />
    </span>
  </div>
);

/* Standard Card */
const DashboardCard = ({
  title,
  value,
  suffix = "",
  children,
  to = "#",
  color,
  textColor = "text-white",
}) => (
  <Link to={to} className="h-full">
    <div
      className={`${color} ${textColor} rounded-2xl p-4 sm:p-5 lg:p-6 
      shadow-sm hover:shadow-lg hover:scale-[1.02] transition 
      h-full flex flex-col`}
    >
      {/* Title */}
      <h2 className={`text-sm sm:text-base font-medium ${textColor}/80`}>
        {title}
      </h2>

      {/* Main Value */}
      <div className="mt-2 sm:mt-3">
        <div className="text-xl sm:text-2xl lg:text-3xl font-bold">
          <CountUp
            end={value || 0}
            duration={0.4}
            formattingFn={(val) => Number(val).toLocaleString("en-BD") + suffix}
          />
        </div>
      </div>

      {/* Bottom Content */}
      <div className="mt-auto pt-3">{children}</div>
    </div>
  </Link>
);

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [filterMode, setFilterMode] = useState("range");
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });
  const [singleDate, setSingleDate] = useState("");
  const [toggler, setToggler] = useState(false);

  const dispatch = useDispatch();
  const { dashboardResult, loading } = useSelector((state) => state.dashboard);

  // console.log(dashboardResult)

  // useEffect(() => {
  //   let payload = {};
  //   if (filterMode === "range" && dateRange.from && dateRange.to) {
  //     payload = {
  //       fromDate: dateRange.from,
  //       toDate: dateRange.to,
  //     };
  //   } else if (filterMode === "single" && singleDate) {
  //     payload = {
  //       date: singleDate,
  //     };
  //   }

  //   dispatch(fetchDashboardResult(payload));
  // }, [dispatch, toggler]);

  useEffect(() => {
    dispatch(fetchDashboardResult());
  }, [dispatch]);

  if (loading || !dashboardResult) {
    return <p className="p-4 sm:p-6">Loading...</p>;
  }

  // কাস্টমারের টোটাল প্রোডাক্ট ক্লেইম (যেমন: ১৫ টি)
  const totalCustomerReturn = (dashboardResult.totalSentItemsForSalesReturn || 0) + (dashboardResult.transactionSentItems || 0);
  // কাস্টমারকে অলরেডি দেওয়া প্রোডাক্ট (যেমন: ৫ টি)
  const totalGivenProducts = dashboardResult.cardSixGivenQty || 0;
  // কাস্টমার এখনো বাকি পাবে (১৫ - ৫ = ১০ টি)
  const remainingGetProducts = totalCustomerReturn - totalGivenProducts;

  // ক্যালকুলেশন: আজকের প্রকৃত নিট বিক্রি = আজকের মোট বিক্রি - আজকের মোট খরচ
  const todaysTotalSales = dashboardResult.salesTotalToday || 0;
  const todaysTotalExpense = dashboardResult.salesExpenseToday || 0;
  // const netSalesToday = todaysTotalSales - todaysTotalExpense;
  const netProfitToday = dashboardResult.salesProfitToday - dashboardResult.salesExpenseToday;


  return (
    <>
      <title>{`Dashboard | ${import.meta.env.VITE_COMPANY_NAME}`}</title>
      <div className="p-3 sm:p-5 lg:p-6 bg-gray-100 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Overview of your business statistics
            </p>
          </div>

          {/* Due List Button */}
          <Link
            to="/sales-report/due-list"
            className="
          inline-flex items-center gap-2
          bg-gradient-to-r from-red-500 to-rose-600
          hover:from-red-600 hover:to-rose-700
          text-white font-semibold
          px-5 py-2.5
          rounded-xl
          shadow-md hover:shadow-lg
          transition-all duration-200
          hover:scale-[1.03]
        "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8c-1.657 0-3 1.343-3 3m6 0a3 3 0 11-6 0m9 0c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.26-3.148A7.963 7.963 0 013 11c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Due List
          </Link>
        </div>

        {/* Date Filter */}
        {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Date Filter
              </h2>

              <p className="text-sm text-gray-500">
                Filter dashboard statistics by date
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setFilterMode("range");
                  setDateRange({
                    from: "",
                    to: "",
                  });
                  setSingleDate("");

                  setToggler((prev) => !prev);
                }}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={() => setToggler((prev) => !prev)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer"
              >
                Apply Filter
              </button>
            </div>

          </div>

          <div className="flex flex-wrap gap-6 mt-6">

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={filterMode === "range"}
                onChange={() => setFilterMode("range")}
              />

              <span className="font-medium">
                Date Range
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={filterMode === "single"}
                onChange={() => setFilterMode("single")}
              />

              <span className="font-medium">
                Single Date
              </span>
            </label>

          </div>

          {filterMode === "range" && (
            <div className="grid md:grid-cols-2 gap-4 mt-5">

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  From Date
                </label>

                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) =>
                    setDateRange({
                      ...dateRange,
                      from: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  To Date
                </label>

                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) =>
                    setDateRange({
                      ...dateRange,
                      to: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

            </div>
          )}

          {filterMode === "single" && (
            <div className="mt-5 max-w-sm">

              <label className="block text-sm font-medium text-gray-600 mb-1">
                Select Date
              </label>

              <input
                type="date"
                value={singleDate}
                onChange={(e) => setSingleDate(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />

            </div>
          )}
        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 items-stretch">
          {/* PURCHASE */}
          <DashboardCard
            title="কোম্পানির কাছ থেকে মোট কেনা"
            value={dashboardResult.purchaseTotalToday}
            suffix=" ৳"
            color="bg-blue-600"
            to="/purchase/supplier-balance-list"
          >
            <Row label="Total Purchase" value={dashboardResult.purchaseTotal} suffix=" ৳" />
            <Row label="Daily Purchase" value={dashboardResult.purchaseTotalToday} suffix=" ৳" />
            {/* <Row label="Due" value={dashboardResult.purchaseDue} suffix=" ৳" /> */}
            <div
              className={`flex justify-between text-xs sm:text-sm mt-2 text-white/90`}
            >
              <span>Due</span>
              <span className="font-medium">
                <CountUp
                  className={`${dashboardResult.purchaseDue > 0
                    ? "text-green-300"
                    : dashboardResult.purchaseDue < 0
                      ? "text-red-300"
                      : "text-white"}`}
                  end={dashboardResult.purchaseDue || 0}
                  duration={0.4}
                  formattingFn={(val) => Number(val).toLocaleString("en-BD") + " ৳"}
                />
              </span>
            </div>
            <div
              className={`flex justify-end text-sm font-semibold ${dashboardResult.purchaseDue > 0
                ? "text-green-300"
                : dashboardResult.purchaseDue < 0
                  ? "text-red-300"
                  : "text-white"
                }`}
            >
              {dashboardResult.purchaseDue > 0
                ? "(আমি পাবো)"
                : dashboardResult.purchaseDue < 0
                  ? "(কোম্পানি পাবে)"
                  : ""}
            </div>

            <Row label="Today's Advance" value={dashboardResult.advancePaymentTotal} suffix=" ৳" />
            <Row label="Products" value={dashboardResult.purchaseTotalQuantity} />
          </DashboardCard>

          {/* EXCHANGE */}
          <DashboardCard
            title="আমার দোকানে মোট এক্সচেঞ্জ প্রডাক্ট আছে"
            value={dashboardResult.exchangeTotalPrice}
            suffix=" ৳"
            color="bg-purple-600"
            to="/product-exchange"
          >
            <Row label="QTY" value={dashboardResult.exchangeTotalQuantity} />
            <Row label="KG" value={dashboardResult.exchangeTotalQuantityInKg} />
            {/* <Row
            label="Remaining"
            value={dashboardResult.exchangeTotalRemaining}
            suffix=" ৳"
          /> */}
          </DashboardCard>

          {/* CUSTOMER DUE AMOUNT */}
          <DashboardCard
            title="কাস্টমারের কাছে মোট বাকি পাব"
            value={dashboardResult.salesDue}
            suffix=" ৳"
            color="
    bg-gradient-to-br 
    from-rose-600 
    via-red-600 
    to-red-700
    shadow-red-300/40
  "
            textColor="text-white"
            to="/sales-report/due-list"
          >
            <div className="flex items-center justify-between mt-2">
              <div>
                <div className="text-xs text-white/80">Pending Collection</div>
                <div className="text-sm font-medium mt-1 text-white/90">
                  Customers Due Amount
                </div>
              </div>
              {/* Icon */}
              <div className="bg-white/15 p-2 rounded-xl backdrop-blur-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4m0 4h.01M10.29 3.86l-7.5 13A1 1 0 003.67 18h16.66a1 1 0 00.87-1.5l-7.5-13a1 1 0 00-1.74 0z"
                  />
                </svg>
              </div>
            </div>
          </DashboardCard>

          {/* STOCK */}
          <DashboardCard
            title="আমার স্টকে আছে"
            value={dashboardResult.totalStockValue || 0}
            color="bg-orange-500"
            suffix=" ৳"
            to="/product"
          >
            <Row
              label="Main Stock"
              value={dashboardResult.quantityDetails?.mainQuantity || 0}
              suffix=" Pcs"
            />
            <div className="text-xs text-white/80 mt-2">
              This is the Current Available Quantity and its Total value.
            </div>
          </DashboardCard>

          {/* ৫ নম্বর কার্ড - আমার দোকানের রিপ্লেস নেওয়া মাল আছে */}
          <DashboardCard
            title="আমার দোকানের রিপ্লেস নেওয়া মাল আছে"
            value={dashboardResult.cardFiveAmount || 0}
            suffix=" ৳"
            color="bg-indigo-600"
            to="/sales-return"
          >
            <Row
              label="Total Qty"
              value={dashboardResult.cardFiveQty || 0}
              suffix=" Pcs"
            />
            <div className="text-xs text-white/80 mt-2">
              দোকানে বর্তমানে থাকা ড্যামেজ/রিটার্ন মালের স্টক ও তার মূল্য।
            </div>
          </DashboardCard>

          {/* ৬ নম্বর কার্ড - রিপ্লেস নেওয়া মালের পরিবর্তে কাস্টমার পাবে */}
          <DashboardCard
            title="রিপ্লেস নেওয়া মালের পরিবর্তে কাস্টমার পাবে"
            value={dashboardResult.totalDueForSalesReturn || 0}
            suffix=" ৳"
            color="bg-indigo-600"
            to="/sales-return"
          >
            <Row
              label="Total Customer Return"
              value={totalCustomerReturn}
              suffix=" Pcs"
            />
            {/* এখানে ফিক্স করা হয়েছে: SlideRow থেকে Row তে পরিবর্তন */}
            <Row
              label="Total Given"
              value={totalGivenProducts}
              suffix=" Pcs"
            />
            <Row
              label="Remaining Get"
              value={remainingGetProducts}
              suffix=" Pcs"
            />
          </DashboardCard>

          {/* COMPANY SALES RETURN */}
          <DashboardCard
            title="রিপ্লেস নেওয়া মাল কোম্পানিতে পাঠানোর পর আমি পাব"
            value={dashboardResult.totalPaidForCSR || 0}
            suffix=" ৳"
            color="bg-red-600"
            to="/company-sales-return"
          >
            <Row
              label="Total Qty"
              value={dashboardResult.totalAmountQtyForCSR}
              suffix=" Pcs"
            />
            <Row
              label="Total Given"
              value={dashboardResult.totalPaidQtyForCSR}
              suffix=" Pcs"
            />
            <Row
              label="Claim Amount"
              value={dashboardResult.totalDueQtyForCSR}
              suffix=" Pcs"
            />
            <Row
              label="Total Received"
              value={dashboardResult.totalReceivedValueForCSR}
              suffix=" ৳"
            />
            <Row
              label="Total Due"
              value={dashboardResult.totalDueForCSR}
              suffix=" ৳"
            />
          </DashboardCard>

          {/* TODAY'S SALES & EXPENSES */}
          <DashboardCard
            title="আজকের মোট বিক্রি"
            value={todaysTotalSales}
            suffix=" ৳"
            color="bg-yellow-500"
            textColor="text-black"
            to="/sales-report"
          >
            {/* <Row
            label="Total Sales (আজকের মোট বিক্রি)"
            value={todaysTotalSales}
            suffix=" ৳"
            textColor="text-black font-semibold"
          />
          <Row
            label="Total Expense (আজকের মোট খরচ)"
            value={todaysTotalExpense}
            suffix=" ৳"
            textColor="text-red-700 font-semibold"
          /> */}
            {/* <hr className="border-black/20 my-1" /> */}
            <Row
              label="Total Sold Qty"
              value={dashboardResult.salesQtyToday || 0}
              suffix=" Pcs"
              textColor="text-black"
            />
            <Row
              label="Cash"
              value={dashboardResult.salesCashToday}
              suffix=" ৳"
              textColor="text-black"
            />
            <Row
              label="Exchange"
              value={dashboardResult.salesExchangeToday}
              suffix=" ৳"
              textColor="text-black"
            />
            <Row
              label="Bank Amount"
              value={dashboardResult.salesBankPaymentAmountToday}
              suffix=" ৳"
              textColor="text-black"
            />
            <Row
              label="Due"
              value={dashboardResult.salesDueToday}
              suffix=" ৳"
              textColor="text-black"
            />
            <Row
              label="Due Collection"
              value={dashboardResult.dueCollectionToday}
              suffix=" ৳"
              textColor="text-black"
            />
            {/* <Row
            label="Today's Advance"
            value={dashboardResult.salesAdvanceToday}
            suffix=" ৳"
            textColor="text-black"
          /> */}
            {/* <Row
            label="Advance"
            value={dashboardResult.advanceToday}
            suffix=" ৳"
            textColor="text-black"
          /> */}
            {user.role === "admin" && (<Row
              label="Profit"
              value={dashboardResult.salesProfitToday}
              suffix=" ৳"
              textColor="text-black"
            />)}

            <Row
              label="Expense"
              value={dashboardResult.salesExpenseToday}
              suffix=" ৳"
              textColor="text-black"
            />

            {user.role === "admin" && (<Row
              label="Net Profit"
              value={netProfitToday}
              suffix=" ৳"
              textColor="text-black"
            />)}

          </DashboardCard>

          {/* TOTAL SALES */}
          {user.role === "admin" && (<DashboardCard
            title="আমার দোকানে সর্বমোট বিক্রি"
            value={dashboardResult.salesTotal}
            suffix=" ৳"
            color="bg-green-600"
            to="/sales-report"
          >
            <Row label="Cash" value={dashboardResult.salesCash} suffix=" ৳" />
            <Row
              label="Exchange"
              value={dashboardResult.salesExchange}
              suffix=" ৳"
            />
            <Row
              label="Bank Amount"
              value={dashboardResult.salesBankPaymentAmount}
              suffix=" ৳"
            />
            <Row label="Due" value={dashboardResult.salesDue} suffix=" ৳" />
            <Row label="Profit" value={dashboardResult.salesProfit} suffix=" ৳" />
          </DashboardCard>)}

          {user.role === "admin" && (<GrandTotalCard dashboardResult={dashboardResult} />)}

        </div>
      </div>
    </>
  );
};

export default Dashboard;