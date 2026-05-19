import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardResult } from "../features/dashboard/dashboardSlice";
import { Link } from "react-router-dom";
import CountUp from "react-countup";

/* Row Item */
const Row = ({ label, value, suffix = "" , textColor = "text-white"}) => (
  <div className={`flex justify-between text-xs sm:text-sm mt-2 ${textColor}/90`}>
    <span>{label}</span>
    <span className="font-medium">
      <CountUp
        end={value || 0}
        duration={0.4}
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
  textColor = "text-white"
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
  const dispatch = useDispatch();
  const { dashboardResult, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardResult());
  }, [dispatch]);

  if (loading || !dashboardResult) {
    return <p className="p-4 sm:p-6">Loading...</p>;
  }

  return (
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 items-stretch">
        {/* PURCHASE */}
        <DashboardCard
          title="Total Purchase"
          value={dashboardResult.purchaseTotal}
          suffix=" ৳"
          color="bg-blue-600"
          to="/purchase"
        >
          <Row label="Due" value={dashboardResult.purchaseDue} suffix=" ৳" />
          <Row label="Products" value={dashboardResult.purchaseTotalQuantity} />
        </DashboardCard>

        {/* EXCHANGE */}
        <DashboardCard
          title="Exchange"
          value={dashboardResult.exchangeTotalPrice}
          suffix=" ৳"
          color="bg-purple-600"
          to="/product-exchange"
        >
          <Row label="QTY" value={dashboardResult.exchangeTotalQuantity} />
          <Row label="KG" value={dashboardResult.exchangeTotalQuantityInKg} />
          <Row
            label="Remaining"
            value={dashboardResult.exchangeTotalRemaining}
            suffix=" ৳"
          />
        </DashboardCard>

        {/* SALES */}
        <DashboardCard
          title="Sales"
          value={dashboardResult.salesTotal}
          suffix=" ৳"
          color="bg-green-600"
          to="/sales-report"
        >
          <Row label="Cash" value={dashboardResult.salesCash} suffix=" ৳" />
          <Row label="Exchange" value={dashboardResult.salesExchange} suffix=" ৳" />
          <Row label="Due" value={dashboardResult.salesDue} suffix=" ৳" />
          <Row label="Profit" value={dashboardResult.salesProfit} suffix=" ৳" />
        </DashboardCard>

        {/* STOCK */}
        <DashboardCard
          title="Main Stock"
          value={dashboardResult.quantityDetails.mainQuantity}
          color="bg-orange-500"
          to="/product"
        >
          <div className="text-xs text-white/80 mt-2">
            Current Available Quantity
          </div>
        </DashboardCard>

        <DashboardCard
          title="Total Sales Return"
          value={dashboardResult.totalSentItemsForSalesReturn}
          suffix=" Pcs"
          color="bg-indigo-600"
          to="/sales-return"
        >
          <Row
            label="Customer Receivable"
            value={dashboardResult.totalAmountForSalesReturn}
            suffix=" ৳"
          />
          <Row
            label="Total Given"
            value={dashboardResult.totalPaidForSalesReturn}
            suffix=" ৳"
          />

          <Row
            label="Total Due"
            value={dashboardResult.totalDueForSalesReturn}
            suffix=" ৳"
          />
        </DashboardCard>

        <DashboardCard
          title="Total Company Sales Return"
          value={dashboardResult.totalAmountQtyForCSR}
          suffix=" Pcs"
          color="bg-red-600"
          to="/company-sales-return"
        >
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
            label="Amount Receivable"
            value={dashboardResult.totalAmountForCSR}
            suffix=" ৳"
          />
          <Row
            label="Total Received"
            value={dashboardResult.totalPaidForCSR}
            suffix=" ৳"
          />
          <Row
            label="Total Due"
            value={dashboardResult.totalDueForCSR}
            suffix=" ৳"
          />
        </DashboardCard>

        {/* TODAY'S SALES */}
        <DashboardCard
          title="Todays's Sales"
          value={dashboardResult.salesTotalToday}
          suffix=" ৳"
          color="bg-yellow-500"
          textColor="text-black"
          to="/sales-report"
        >
          <Row label="Cash" value={dashboardResult.salesCashToday} suffix=" ৳" textColor="text-black"/>
          <Row label="Exchange" value={dashboardResult.salesExchangeToday} suffix=" ৳" textColor="text-black"/>
          <Row label="Due" value={dashboardResult.salesDueToday} suffix=" ৳" textColor="text-black"/>
          <Row label="Profit" value={dashboardResult.salesProfitToday} suffix=" ৳" textColor="text-black"/>
        </DashboardCard>
      </div>
    </div>
  );
};

export default Dashboard;
