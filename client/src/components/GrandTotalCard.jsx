// import CountUp from "react-countup";

// const GrandTotalCard = ({ dashboardResult }) => {
//     return (
//         <div
//             className="
//                 lg:col-span-3
//                 rounded-3xl
//                 overflow-hidden
//                 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
//                 border border-slate-700
//                 shadow-2xl shadow-slate-900/40
//             "
//         >
//             {/* Header */}
//             <div className="flex items-center gap-4 px-6 py-5 border-b border-slate-700">

//                 <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
//                     <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth={2}
//                         stroke="currentColor"
//                         className="w-7 h-7 text-emerald-400"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M2.25 18L9 10.5l4.5 4.5L21.75 6"
//                         />
//                     </svg>
//                 </div>

//                 <div>
//                     <h2 className="text-2xl font-bold text-white">
//                         বর্তমান ব্যবসার অবস্থান
//                     </h2>

//                     <p className="text-sm text-slate-400 mt-1">
//                         প্রথম ৭টি গুরুত্বপূর্ণ হিসাবের সারসংক্ষেপ
//                     </p>
//                 </div>

//             </div>

//             {/* Summary */}
//             <div className="px-6 py-2">

//                 <SummaryRow
//                     title="কোম্পানির কাছ থেকে মোট কেনা"
//                     value={dashboardResult.purchaseDue}
//                     color="emerald"
//                 />

//                 <SummaryRow
//                     title="আমার দোকানে মোট এক্সচেঞ্জ প্রডাক্ট আছে"
//                     value={dashboardResult.exchangeTotalPrice}
//                     color="violet"
//                 />

//                 <SummaryRow
//                     title="কাস্টমারের কাছে মোট বাকি পাব"
//                     value={dashboardResult.salesDue}
//                     color="rose"
//                 />

//                 <SummaryRow
//                     title="আমার স্টকে আছে"
//                     value={dashboardResult.totalStockValue}
//                     color="orange"
//                 />

//                 <SummaryRow
//                     title="আমার দোকানের রিপ্লেস নেওয়া মাল আছে"
//                     value={dashboardResult.cardFiveAmount}
//                     color="indigo"
//                 />

//                 <SummaryRow
//                     title="রিপ্লেস নেওয়া মালের পরিবর্তে কাস্টমার পাবে"
//                     value={dashboardResult.totalDueForSalesReturn}
//                     prefix="- "
//                     color="red"
//                 />

//                 <SummaryRow
//                     title="রিপ্লেস নেওয়া মাল কোম্পানিতে পাঠানোর পর আমি পাব"
//                     value={dashboardResult.totalPaidForCSR}
//                     prefix="+ "
//                     color="green"
//                     last
//                 />

//             </div>

//             {/* Footer */}
//             <div
//                 className="
//                     border-t border-slate-700
//                     bg-gradient-to-r
//                     from-emerald-500/10
//                     via-transparent
//                     to-emerald-500/10
//                     px-6
//                     py-8
//                 "
//             >

//                 <p className="text-center uppercase tracking-[0.25em] text-xs text-slate-400">
//                     Total Ledger Value
//                 </p>

//                 <div
//                     className="
//                         mt-3
//                         text-center
//                         text-5xl
//                         font-black
//                         text-emerald-400
//                         drop-shadow-[0_0_18px_rgba(74,222,128,.35)]
//                     "
//                 >
//                     <CountUp
//                         end={Number(dashboardResult.totalLedgerValue)}
//                         duration={0.5}
//                         formattingFn={(v) =>
//                             Number(v).toLocaleString("en-BD") + " ৳"
//                         }
//                     />
//                 </div>

//                 <div className="mt-5 flex justify-center">
//                     <span
//                         className="
//                             px-5 py-2
//                             rounded-full
//                             bg-emerald-500/15
//                             border border-emerald-500/30
//                             text-emerald-300
//                             text-sm
//                             font-medium
//                         "
//                     >
//                         Net Business Position
//                     </span>
//                 </div>

//             </div>
//         </div>
//     );
// };

// const SummaryRow = ({
//     title,
//     value,
//     prefix = "",
//     color = "blue",
//     last = false,
// }) => {

//     const colors = {
//         emerald: {
//             dot: "bg-emerald-400",
//             text: "text-emerald-300",
//         },
//         violet: {
//             dot: "bg-violet-400",
//             text: "text-violet-300",
//         },
//         rose: {
//             dot: "bg-rose-400",
//             text: "text-rose-300",
//         },
//         orange: {
//             dot: "bg-orange-400",
//             text: "text-orange-300",
//         },
//         indigo: {
//             dot: "bg-indigo-400",
//             text: "text-indigo-300",
//         },
//         red: {
//             dot: "bg-red-400",
//             text: "text-red-300",
//         },
//         green: {
//             dot: "bg-green-400",
//             text: "text-green-300",
//         },
//     };

//     return (
//         <div
//             className={`
//                 flex items-center justify-between
//                 py-4 px-2
//                 rounded-xl
//                 transition-all duration-200
//                 hover:bg-white/5
//                 ${!last ? "border-b border-slate-700" : ""}
//             `}
//         >

//             <div className="flex items-center gap-3">

//                 <span
//                     className={`w-3 h-3 rounded-full ${colors[color].dot}`}
//                 ></span>

//                 <h3 className="text-sm md:text-base font-medium text-slate-300">
//                     {title}
//                 </h3>

//             </div>

//             <div className={`text-xl md:text-2xl font-bold ${colors[color].text}`}>
//                 {prefix}
//                 <CountUp
//                     end={Number(value || 0)}
//                     duration={0.4}
//                     formattingFn={(v) =>
//                         Number(v).toLocaleString("en-BD") + " ৳"
//                     }
//                 />
//             </div>

//         </div>
//     );
// };

// export default GrandTotalCard;

import React from "react";
import CountUp from "react-countup";

const GrandTotalCard = ({ dashboardResult }) => {
  const purchaseColor =
    dashboardResult.purchaseDue > 0
      ? "text-emerald-400"
      : dashboardResult.purchaseDue < 0
      ? "text-red-400"
      : "text-white";

  const Item = ({
    title,
    value,
    color = "text-white",
    prefix = "",
  }) => (
    <div
      className="
        rounded-xl
        p-3
        transition-all
        duration-200
        hover:bg-white/5
        hover:shadow-md
        hover:scale-[1.02]
        cursor-default
      "
    >
      <p className="text-slate-400 text-xs">{title}</p>

      <p className={`mt-1 text-lg font-bold ${color}`}>
        {prefix}
        <CountUp
          end={Number(value || 0)}
          duration={0.5}
          separator=","
          formattingFn={(val) =>
            Number(val).toLocaleString("en-BD") + " ৳"
          }
        />
      </p>
    </div>
  );

  return (
    <div
      className="
        lg:col-span-3
        rounded-2xl
        bg-gradient-to-r
        from-slate-900
        via-slate-800
        to-slate-900
        text-white
        p-6
        shadow-xl
        border border-slate-700
      "
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <p className="text-sm uppercase tracking-widest text-slate-300">
            Business Summary
          </p>

          <h2 className="text-2xl font-bold mt-1">
            Current Business Position
          </h2>

          <p className="text-slate-400 mt-1">
            Calculated from the first 7 dashboard cards.
          </p>
        </div>

        <div className="text-left lg:text-right">
          <p className="text-slate-300 text-sm">Grand Total</p>

          <div className="text-4xl font-extrabold text-emerald-400">
            <CountUp
              end={Number(dashboardResult.totalLedgerValue)}
              duration={0.6}
              separator=","
              formattingFn={(val) =>
                Number(val).toLocaleString("en-BD") + " ৳"
              }
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700 my-6"></div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <Item
          title="কোম্পানির লেনদেন"
          value={dashboardResult.purchaseDue}
          color={purchaseColor}
        />

        <Item
          title="এক্সচেঞ্জের জমা"
          value={dashboardResult.exchangeTotalPrice}
        />

        <Item
          title="বাকি"
          value={dashboardResult.salesDue}
        />

        <Item
          title="স্টকের ব্যালেন্স"
          value={dashboardResult.totalStockValue}
        />

        <Item
          title="রিপ্লেসের ব্যালেন্স"
          value={dashboardResult.cardFiveAmount}
        />

        <Item
          title="কাস্টমারের রিপ্লেসের ব্যালেন্স"
          value={dashboardResult.totalDueForSalesReturn}
          color="text-red-400"
          prefix="− "
        />

        <Item
          title="কোম্পানির রিপ্লেস ব্যালেন্স"
          value={dashboardResult.totalPaidForCSR}
          color="text-emerald-400"
          prefix="+ "
        />
      </div>
    </div>
  );
};

export default GrandTotalCard;