import React, { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";

const SalesReturn = () => {
  const navigate = useNavigate();
  const customerNameRef = useRef(null);
  
  // States
  const [name, setName] = useState("");
  const [disable, setDisable] = useState(false);
  const [data, setData] = useState(null);
  const [date, setDate] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("-1");
  const [filterToggler, setFilterToggler] = useState(false);
  const [page, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(1);
  
  const [customer, setCustomer] = useState({
    customerId: "",
    customerName: "",
    address: "",
    customerEmail: "",
    customerPhone: "",
  });

  // Dummy data for sales returns
  const [returns, setReturns] = useState([
    {
      _id: "1",
      createdAt: "2026-02-15",
      memo: "SR-1290",
      customerName: "XYZ Traders",
      productNames: "LED Bulb 12W",
      quantity: 10,
      qtyInKg: 0,
      totalAmount: 15000,
      paid: 15000,
      due: 0,
    },
    {
      _id: "2",
      createdAt: "2026-01-20",
      memo: "SR-1291",
      customerName: "ABC Electronics",
      productNames: "Battery 12V",
      quantity: 5,
      qtyInKg: 25,
      totalAmount: 25000,
      paid: 10000,
      due: 15000,
    },
  ]);

  // Validation Schema
  const returnSchema = Yup.object().shape({
    createdAt: Yup.date().required("Date is required"),
    memo: Yup.string().required("Memo is required"),
    productNames: Yup.string().required("Product names are required"),
    quantity: Yup.number().required("Quantity is required").min(1),
    qtyInKg: Yup.number().required("Qty in kg is required").min(0),
    totalAmount: Yup.number().required("Total amount is required").min(0),
    paid: Yup.number().required("Paid amount is required").min(0),
  });

  // Handlers
  const handleCustomerNameOnChange = (e) => {
    const value = e.target.value;
    setName(value);
    // Simulate search
    if (value.length > 0) {
      setData([
        { name: "XYZ Traders", address: "Dhaka" },
        { name: "ABC Electronics", address: "Chittagong" },
      ]);
    } else {
      setData(null);
    }
  };

  const handleCustomerOnClick = (d) => {
    setCustomer({
      customerId: d.name,
      customerName: d.name,
      address: d.address,
      customerEmail: "",
      customerPhone: "",
    });
    setName(d.name);
    setDisable(true);
    setData(null);
  };

  const handleSubmit = (values, setSubmitting, resetForm) => {
    const due = parseFloat(values.totalAmount) - parseFloat(values.paid);
    const newReturn = {
      _id: Date.now().toString(),
      createdAt: values.createdAt,
      memo: values.memo,
      customerName: customer.customerName || name,
      productNames: values.productNames,
      quantity: values.quantity,
      qtyInKg: values.qtyInKg,
      totalAmount: parseFloat(values.totalAmount),
      paid: parseFloat(values.paid),
      due: due,
    };
    
    setReturns([newReturn, ...returns]);
    resetForm();
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-4 md:p-6 font-sans">
      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Sales Return Entry
      </h1>
      
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Customer Name
            </label>
            <div className="flex">
              <input
                type="search"
                value={name}
                onChange={handleCustomerNameOnChange}
                ref={customerNameRef}
                placeholder="Customer Name"
                className="block w-[85%] px-3 py-1.5 border border-gray-300 rounded-sm text-sm disabled:bg-gray-300"
                disabled={disable}
              />
              <button
                disabled={!disable}
                className="bg-red-500 hover:bg-red-600 cursor-pointer ml-2 px-2 py-1 font-bold text-white rounded disabled:bg-red-300 disabled:cursor-not-allowed"
                onClick={() => {
                  setDisable(false);
                  setName("");
                  setCustomer({
                    customerId: "",
                    customerName: "",
                    address: "",
                    customerEmail: "",
                    customerPhone: "",
                  });
                  setData(null);
                }}
              >
                Change
              </button>
            </div>

            <div
              className={`w-[85%] max-h-50 ${
                data ? "shadow-md overflow-y-scroll" : ""
              }`}
            >
              {data ? (
                <table className="w-full">
                  <tbody>
                    {data.map((d, i) => (
                      <tr
                        key={i}
                        className="p-2 cursor-pointer border-b border-gray-300 hover:bg-gray-100 text-gray-800"
                        onClick={() => handleCustomerOnClick(d)}
                      >
                        <td className="p-2">{d.name}</td>
                        <td className="text-center">{d.address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                ""
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              value={customer.address}
              placeholder="Address"
              disabled
              className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm bg-gray-200 text-gray-700 select-none"
              required
            />
          </div>
        </div>

        {/* Sales Return Add Form */}
        <Formik
          initialValues={{
            createdAt: "",
            memo: "",
            productNames: "",
            quantity: "",
            qtyInKg: "",
            totalAmount: "",
            paid: "",
            due: "",
          }}
          validationSchema={returnSchema}
          onSubmit={(value, { setSubmitting, resetForm }) =>
            handleSubmit(value, setSubmitting, resetForm)
          }
        >
          {({ isSubmitting, dirty, isValid }) => (
            <Form>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex flex-col">
                  <Field
                    type="date"
                    placeholder="Date"
                    name="createdAt"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                  <ErrorMessage
                    name="createdAt"
                    component="div"
                    className="text-xs text-red-600"
                  />
                </div>

                <div>
                  <Field
                    type="text"
                    placeholder="Memo"
                    name="memo"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                  <ErrorMessage
                    name="memo"
                    component="div"
                    className="text-xs text-red-600"
                  />
                </div>

                <div>
                  <Field
                    type="text"
                    name="productNames"
                    placeholder="Products Name (comma separated)"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                  <ErrorMessage
                    name="productNames"
                    component="div"
                    className="text-xs text-red-600"
                  />
                </div>
                <div>
                  <Field
                    type="number"
                    placeholder="Quantity"
                    name="quantity"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                  <ErrorMessage
                    name="quantity"
                    component="div"
                    className="text-xs text-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <Field
                    name="qtyInKg"
                    type="number"
                    placeholder="Qty in kg"
                    step="any"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                  <ErrorMessage
                    name="qtyInKg"
                    component="div"
                    className="text-xs text-red-600"
                  />
                </div>

                <div>
                  <Field
                    name="totalAmount"
                    type="number"
                    placeholder="Total Amount"
                    step="any"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                  <ErrorMessage
                    name="totalAmount"
                    component="div"
                    className="text-xs text-red-600"
                  />
                </div>

                <div>
                  <Field
                    name="paid"
                    type="number"
                    placeholder="Paid"
                    step="any"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                  <ErrorMessage
                    name="paid"
                    component="div"
                    className="text-xs text-red-600"
                  />
                </div>
              </div>

              <button
                disabled={isSubmitting || !dirty || !isValid}
                type="submit"
                className="w-full sm:w-auto bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Adding..." : "Add Return"}
              </button>
            </Form>
          )}
        </Formik>
      </div>

      {/* Sales Return Report Table */}
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg sm:text-xl font-semibold">
              Sales Return Report
            </h2>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="1">Oldest First</option>
              <option value="-1">Newest First</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 ml-auto">
              <label className="text-xs sm:text-sm text-gray-600">
                Search by Customer Name:
              </label>
              <input
                type="search"
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-36 sm:w-40"
              />
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <label className="text-xs sm:text-sm text-gray-600">
                Search by Date:
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-36 sm:w-40"
              />
            </div>

            <div className="text-right">
              <button
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 cursor-pointer"
                onClick={() => setFilterToggler(!filterToggler)}
              >
                Filter
              </button>
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 cursor-pointer ml-2"
                onClick={() => {
                  if (date !== "" || nameSearch !== "") {
                    date !== "" && setDate("");
                    nameSearch !== "" && setNameSearch("");
                    setFilterToggler(!filterToggler);
                  }
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs sm:text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                  Date
                </th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                  Memo
                </th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                  Customer
                </th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                  Products
                </th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                  Qty
                </th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                  Qty (kg)
                </th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                  Total
                </th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                  Paid
                </th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                  Due
                </th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {returns.length > 0 ? (
                returns.map((returnItem, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={(e) => {
                      if (e.target.tagName !== "TD") return;
                      navigate("/sales-return-statement", {
                        state: returnItem,
                      });
                    }}
                  >
                    <td className="border px-2 py-1 sm:px-4 sm:py-2">
                      {new Date(returnItem.createdAt)
                        .toLocaleDateString("en-GB", {
                          timeZone: "Asia/Dhaka",
                        })
                        .replaceAll("/", "-")}
                    </td>
                    <td className="border px-2 py-1 sm:px-4 sm:py-2">
                      {returnItem.memo}
                    </td>
                    <td className="border px-2 py-1 sm:px-4 sm:py-2">
                      {returnItem.customerName}
                    </td>
                    <td className="border px-2 py-1 sm:px-4 sm:py-2 max-w-40">
                      {returnItem.productNames}
                    </td>
                    <td className="border px-2 py-1 sm:px-4 sm:py-2">
                      {returnItem.quantity}
                    </td>
                    <td className="border px-2 py-1 sm:px-4 sm:py-2">
                      {returnItem.qtyInKg}
                    </td>
                    <td className="border px-2 py-1 sm:px-4 sm:py-2">
                      {returnItem.totalAmount}
                    </td>
                    <td className="border px-2 py-1 sm:px-4 sm:py-2">
                      {returnItem.paid}
                    </td>
                    <td
                      className={`border px-2 py-1 sm:px-4 sm:py-2 ${
                        returnItem.due > 0 ? "text-red-500 font-bold" : ""
                      }`}
                    >
                      {returnItem.due}
                    </td>
                    <td className="border px-2 py-1 sm:px-4 sm:py-2">
                      <div className="flex flex-wrap gap-1">
                        <Link
                          onClick={(e) => e.stopPropagation()}
                          to={
                            returnItem.due
                              ? `/sales-return-report/${returnItem._id}/edit-due`
                              : "#"
                          }
                          className={`text-xs text-white px-2 py-1 rounded ${
                            returnItem.due
                              ? "bg-green-600 hover:bg-green-700"
                              : "cursor-no-drop bg-green-500"
                          }`}
                        >
                          Add Payment
                        </Link>
                        <Link
                          onClick={(e) => e.stopPropagation()}
                          to="/invoice-sales-return"
                          state={returnItem}
                          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 cursor-pointer"
                        >
                          Print
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center text-gray-500 py-10 text-lg select-none"
                  >
                    No Return Available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages ? (
          <div className="flex justify-center items-center mt-4 gap-2 text-sm">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`${
                page === 1
                  ? ""
                  : "cursor-pointer hover:bg-black hover:text-white"
              } px-2 py-1 border rounded disabled:opacity-50`}
            >
              Prev
            </button>
            <span>
              Page {page} of {pages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, pages))}
              disabled={page === pages}
              className={`${
                page === pages
                  ? ""
                  : "cursor-pointer hover:bg-black hover:text-white"
              } px-2 py-1 border rounded disabled:opacity-50`}
            >
              Next
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default SalesReturn;