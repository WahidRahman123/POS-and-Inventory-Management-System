// CustomerStatement.jsx
import React from "react";

const CustomerStatement = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-700 via-maroon-800 to-red-700 p-4 sm:p-6">
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl ring-1 ring-black/5 p-6 space-y-6">
      {/* ---------- Header ---------- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Customer Statement</h1>
        <div className="flex gap-2">
          <input
            type="date"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
            Filter
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm">
            Print
          </button>
        </div>
      </div>

      {/* ---------- Customer Info Card ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 border rounded-lg p-4 bg-gray-50">
        <div>
          <span className="text-xs text-gray-500">Name</span>
          <div className="font-semibold">John Doe</div>
        </div>
        <div>
          <span className="text-xs text-gray-500">Phone</span>
          <div className="font-semibold">01712345678</div>
        </div>
        <div>
          <span className="text-xs text-gray-500">Email</span>
          <div className="font-semibold">john@mail.com</div>
        </div>
        <div>
          <span className="text-xs text-gray-500">Total Due</span>
          <div className="font-semibold text-red-600">৳ 16000</div>
        </div>
      </div>

      {/* ---------- Statement Table (Row-span) ---------- */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full text-xs sm:text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th
                rowSpan={2}
                className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
              >
                Date
              </th>
              <th
                rowSpan={2}
                className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
              >
                Invoice
              </th>
              <th
                colSpan={3}
                className="border px-2 py-1 sm:px-4 sm:py-2 text-center"
              >
                Products
              </th>
              <th
                rowSpan={2}
                className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
              >
                Discount
              </th>
              <th
                rowSpan={2}
                className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
              >
                Total
              </th>
              <th
                rowSpan={2}
                className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
              >
                Paid
              </th>
              <th
                rowSpan={2}
                className="border px-2 py-1 sm:px-4 sm:py-2 text-left"
              >
                Due
              </th>
              <th
                rowSpan={2}
                className="border px-2 py-1 sm:px-4 sm:py-2 text-center"
              >
                Action
              </th>
            </tr>
            <tr>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-center">
                Name
              </th>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                Price
              </th>
              <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                Qty
              </th>
            </tr>
          </thead>
          <tbody>
            {/* ---- Example Row ---- */}
            {(() => {
              const sale = {
                date: "01-06-2025",
                invoice: "INV-1001",
                products: [
                  { productName: "Laptop", sellPrice: 45000, quantity: 1 },
                  { productName: "Mouse", sellPrice: 500, quantity: 2 },
                ],
                discount: 0,
                total: 46000,
                paid: 30000,
                due: 16000,
              };
              const rowspan = sale.products.length;
              return sale.products.map((p, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {idx === 0 && (
                    <>
                      <td
                        rowSpan={rowspan}
                        className="border px-2 py-1 sm:px-4 sm:py-2"
                      >
                        {sale.date}
                      </td>
                      <td
                        rowSpan={rowspan}
                        className="border px-2 py-1 sm:px-4 sm:py-2"
                      >
                        {sale.invoice}
                      </td>
                    </>
                  )}
                  <td
                    className={`border px-2 py-1 sm:px-4 sm:py-2 ${
                      idx !== sale.products.length - 1
                        ? "border-b-gray-300"
                        : ""
                    }`}
                  >
                    {p.productName}
                  </td>
                  <td
                    className={`border px-2 py-1 sm:px-4 sm:py-2 ${
                      idx !== sale.products.length - 1
                        ? "border-b-gray-300"
                        : ""
                    }`}
                  >
                    ৳ {p.sellPrice}
                  </td>
                  <td
                    className={`border px-2 py-1 sm:px-4 sm:py-2 ${
                      idx !== sale.products.length - 1
                        ? "border-b-gray-300"
                        : ""
                    }`}
                  >
                    {p.quantity}
                  </td>
                  {idx === 0 && (
                    <>
                      <td
                        rowSpan={rowspan}
                        className="border px-2 py-1 sm:px-4 sm:py-2"
                      >
                        {sale.discount}
                      </td>
                      <td
                        rowSpan={rowspan}
                        className="border px-2 py-1 sm:px-4 sm:py-2"
                      >
                        ৳ {sale.total}
                      </td>
                      <td
                        rowSpan={rowspan}
                        className="border px-2 py-1 sm:px-4 sm:py-2"
                      >
                        ৳ {sale.paid}
                      </td>
                      <td
                        rowSpan={rowspan}
                        className="border px-2 py-1 sm:px-4 sm:py-2 text-red-600 font-semibold"
                      >
                        ৳ {sale.due}
                      </td>
                      <td
                        rowSpan={rowspan}
                        className="border px-2 py-1 sm:px-4 sm:py-2"
                      >
                        <div className="flex flex-wrap gap-1">
                          <button className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
                            Add Payment
                          </button>
                          <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
                            Print
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ));
            })()}
            <tr>
              <td colSpan={10} className="text-center text-gray-500 py-6">
                No transactions found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ---------- Summary Card ---------- */}
      <div className="flex justify-end">
        <div className="w-80 border rounded-lg p-4 bg-gray-50 text-sm space-y-2">
          <div className="flex justify-between">
            <span>Total </span>
            <span className="font-semibold">৳ 46,000</span>
          </div>
          <div className="flex justify-between">
            <span>Total Paid</span>
            <span className="font-semibold">৳ 30,000</span>
          </div>
          <div className="flex justify-between text-base font-bold border-t pt-2">
            <span>Total Due</span>
            <span className="text-red-600">৳ 16,000</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CustomerStatement;
