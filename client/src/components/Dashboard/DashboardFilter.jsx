import { useState } from "react";

const DashboardFilter = ({ onFilter }) => {
  const [active, setActive] = useState("today");
  const [week, setWeek] = useState(1);
  const [singleDate, setSingleDate] = useState("");
  const [range, setRange] = useState({
    startDate: "",
    endDate: "",
  });

  const quickFilters = [
    { id: "today", label: "Today" },
    { id: "yesterday", label: "Yesterday" },
    { id: "thisWeek", label: "This Week" },
    { id: "thisMonth", label: "This Month" },
  ];

  const handleQuickFilter = (type) => {
    setActive(type);

    onFilter({
      type,
    });
  };

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-4 mb-6">

      <div className="flex flex-wrap items-center gap-3">

        {/* Quick Buttons */}

        <div className="flex flex-wrap gap-2">

          {quickFilters.map((item) => (
            <button
              key={item.id}
              onClick={() => handleQuickFilter(item.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200

              ${
                active === item.id
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {item.label}
            </button>
          ))}

        </div>

        {/* Right Side */}

        <div className="ml-auto flex flex-wrap gap-2">

          <select
            value={active}
            onChange={(e) => setActive(e.target.value)}
            className="rounded-xl border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Custom Filter</option>

            <option value="week">Week</option>

            <option value="single">Single Date</option>

            <option value="range">Date Range</option>

          </select>

        </div>

      </div>

      {/* WEEK */}

      {active === "week" && (
        <div className="mt-5 flex flex-wrap gap-3 items-center">

          <select
            value={week}
            onChange={(e) => setWeek(Number(e.target.value))}
            className="rounded-xl border px-3 py-2"
          >
            <option value={1}>1st Week</option>
            <option value={2}>2nd Week</option>
            <option value={3}>3rd Week</option>
            <option value={4}>4th Week</option>
            <option value={5}>5th Week</option>
          </select>

          <button
            onClick={() =>
              onFilter({
                type: "week",
                week,
              })
            }
            className="rounded-xl bg-blue-600 text-white px-5 py-2 hover:bg-blue-700"
          >
            Apply
          </button>

        </div>
      )}

      {/* SINGLE DATE */}

      {active === "single" && (
        <div className="mt-5 flex flex-wrap gap-3 items-center">

          <input
            type="date"
            value={singleDate}
            onChange={(e) => setSingleDate(e.target.value)}
            className="rounded-xl border px-3 py-2"
          />

          <button
            onClick={() =>
              onFilter({
                type: "single",
                date: singleDate,
              })
            }
            className="rounded-xl bg-blue-600 text-white px-5 py-2 hover:bg-blue-700"
          >
            Apply
          </button>

        </div>
      )}

      {/* RANGE */}

      {active === "range" && (
        <div className="mt-5 flex flex-wrap gap-3 items-center">

          <input
            type="date"
            value={range.startDate}
            onChange={(e) =>
              setRange({
                ...range,
                startDate: e.target.value,
              })
            }
            className="rounded-xl border px-3 py-2"
          />

          <span className="text-gray-500">to</span>

          <input
            type="date"
            value={range.endDate}
            onChange={(e) =>
              setRange({
                ...range,
                endDate: e.target.value,
              })
            }
            className="rounded-xl border px-3 py-2"
          />

          <button
            onClick={() =>
              onFilter({
                type: "range",
                startDate: range.startDate,
                endDate: range.endDate,
              })
            }
            className="rounded-xl bg-blue-600 text-white px-5 py-2 hover:bg-blue-700"
          >
            Apply
          </button>

        </div>
      )}

    </div>
  );
};

export default DashboardFilter;