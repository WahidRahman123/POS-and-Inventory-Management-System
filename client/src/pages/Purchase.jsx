import { useEffect, useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as yup from "yup";
import {
  addPurchase,
  fetchPurchases,
} from "../features/purchase/purchaseSlice";
import { Link, useNavigate } from "react-router-dom";
import Decimal from "decimal.js";
import axios from "axios";

const purchaseSchema = yup.object({
  createdAt: yup.date().required("*Date is required!"),
  memo: yup.string().required("*Memo is required!"),
  // supplierName: yup.string().required("*Supplier name is required!"),
  productNames: yup.string().required("*Product Names is required!"),
  quantity: yup
    .number()
    .min(1, "*Cannot be less than 1!")
    .required("*Quantity is required!"),
  totalAmount: yup
    .number()
    .min(0, "*Cannot be less than 0!")
    .required("*Total Amount is required!"),
  paid: yup
    .number()
    .min(0, "*Cannot be less than 0!")
    .required("*This field is required!"),
});

const Purchase = () => {
  const { user } = useSelector((state) => state.auth);
  const { purchases, toggle, page, pages } = useSelector(
    (state) => state.purchase
  );
  const dispatch = useDispatch();
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const [filterToggler, setFilterToggler] = useState(true);
  const [nameSearch, setNameSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(page);
  const [sortOrder, setSortOrder] = useState(-1);

  //* Supplier Search Handling Section
  const [name, setName] = useState("");
  const [supplier, setSupplier] = useState({
    supplierId: "",
    supplierName: "",
    address: "",
    supplierEmail: "",
    supplierPhone: "",
  });
  const [data, setData] = useState(null);
  const [disable, setDisable] = useState(false);
  const supplierNameRef = useRef(null);
  const handleSupplierNameOnChange = async (e) => {
    const query = e.target.value;
    setName(query);
    if (query) {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/supplier/purchase`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          params: {
            q: query,
          },
        }
      );

      setData(data);
    } else {
      setData(null);
    }
  };
  const handleSupplierOnClick = (supplierData) => {
    setData(null);
    setName(supplierData.name);
    setSupplier({
      supplierId: supplierData._id,
      supplierName: supplierData.name,
      address: supplierData.address,
      supplierEmail: supplierData.email,
      supplierPhone: supplierData.phone,
    });
    setDisable(true);
  };
  useEffect(() => {
    if (!disable && supplierNameRef.current) {
      supplierNameRef.current.focus();
    }
  }, [disable]);

  // console.log(purchases);

  const handleSubmit = async (value, setSubmitting, resetForm) => {
    if (supplier.supplierId === "") return alert("Select a supplier!");
    const paid = new Decimal(value.paid).greaterThan(
      new Decimal(value.totalAmount)
    )
      ? new Decimal(value.totalAmount)
      : new Decimal(value.paid);

    const due = new Decimal(value.totalAmount).minus(paid);
    // console.log(supplier);

    const purchaseValue = {
      ...value,
      paid: Number(paid.toFixed(4)),
      due: Number(due.toFixed(4)),
      supplierId: supplier.supplierId,
      userId: user._id,
      supplierName: supplier.supplierName,
      address: supplier.address,
      supplierEmail: supplier.supplierEmail,
      supplierPhone: supplier.supplierPhone,
    };

    try {
      await dispatch(addPurchase(purchaseValue)).unwrap();
      resetForm();
      //* For Supplier Name only
      setDisable(false);
      setName("");
      setSupplier({
        supplierId: "",
        supplierName: "",
        address: "",
        supplierEmail: "",
        supplierPhone: "",
      });
      setData(null);
    } catch (error) {
      console.log("Failed!");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (user) {
      dispatch(
        fetchPurchases({
          dateSearch: date,
          nameSearch,
          page: currentPage,
          order: sortOrder,
        })
      );
    }
  }, [dispatch, user, toggle, filterToggler, sortOrder, currentPage]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-4 md:p-6 font-sans">
      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Purchase Entry
      </h1>
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Supplier Name
            </label>
            <div className="flex">
              <input
                type="search"
                value={name}
                onChange={handleSupplierNameOnChange}
                ref={supplierNameRef}
                placeholder="Supplier Name"
                className="block w-[85%] px-3 py-1.5 border border-gray-300 rounded-sm text-sm disabled:bg-gray-300"
                disabled={disable}
              />
              <button
                disabled={!disable}
                className="bg-red-500 hover:bg-red-600 cursor-pointer ml-2 px-2 py-1 font-bold text-white rounded disabled:bg-red-300 disabled:cursor-not-allowed "
                onClick={() => {
                  setDisable(false);
                  setName("");
                  setSupplier({
                    supplierId: "",
                    supplierName: "",
                    address: "",
                    supplierEmail: "",
                    supplierPhone: "",
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
                        onClick={() => handleSupplierOnClick(d)}
                      >
                        {/* {d.name} */}
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
              value={supplier.address}
              placeholder="Address"
              disabled
              className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm bg-gray-200 text-gray-700 select-none"
              required
            />
          </div>
        </div>

        {/* Purchase Add Form */}
        <Formik
          initialValues={{
            createdAt: "",
            memo: "",
            // supplierName: "",
            productNames: "",
            quantity: "",
            totalAmount: "",
            paid: "",
            due: "",
          }}
          validationSchema={purchaseSchema}
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

                {/* <div>
                <Field
                  type="text"
                  placeholder="Supplier Name"
                  name="supplierName"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <ErrorMessage
                  name="supplierName"
                  component="div"
                  className="text-xs text-red-600"
                />
              </div> */}

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
                {isSubmitting ? "Adding..." : "Add Purchase"}
              </button>
            </Form>
          )}
        </Formik>
      </div>

      {/* Purchase Report Table */}
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        {/* <h2 className="text-lg sm:text-xl font-semibold mb-4">Purchase Report</h2> */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg sm:text-xl font-semibold">
              Purchase Report
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
                Search by Supplier Name:
              </label>
              <input
                type="search"
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-36 sm:w-40"
              />
            </div>

            {/* Date Search — Right side top */}
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
                  Supplier
                </th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                  Products
                </th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">
                  Qty
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
              {purchases.length > 0 ? (
                purchases.map((purchase, index) => (
                  <tr key={index} className="hover:bg-gray-50 cursor-pointer" 
                    onClick={(e) => {                      
                      if(e.target.tagName !== "TD") return;
                      navigate("/purchaser-statement", { state: purchase })
                    }
                  }>
                    <td className="border px-2 py-1 sm:px-4 sm:py-2">
                      {new Date(purchase.createdAt)
                        .toLocaleDateString("en-GB", {
                          timeZone: "Asia/Dhaka",
                        })
                        .replaceAll("/", "-")}
                    </td>
                    <td className="border px-2 py-1 sm:px-4 sm:py-2">
                      {purchase.memo}
                    </td>
                    <td className="border px-2 py-1 sm:px-4 sm:py-2">
                      {purchase.supplierName}
                    </td>
                    <td className="border px-2 py-1 sm:px-4 sm:py-2 max-w-40">
                      {purchase.productNames}
                    </td>
                    <td className="border px-2 py-1 sm:px-4 sm:py-2">
                      {purchase.quantity}
                    </td>
                    <td className="border px-2 py-1 sm:px-4 sm:py-2">
                      {purchase.totalAmount}
                    </td>
                    <td className="border px-2 py-1 sm:px-4 sm:py-2">
                      {purchase.paid}
                    </td>
                    <td
                      className={`border px-2 py-1 sm:px-4 sm:py-2 ${
                        purchase.due > 0 ? "text-red-500 font-bold" : ""
                      }`}
                    >
                      {purchase.due}
                    </td>
                    <td className="border px-2 py-1 sm:px-4 sm:py-2">
                      <div className="flex flex-wrap gap-1">
                        <Link
                          onClick={(e) => e.stopPropagation()}
                          to={
                            purchase.due
                              ? `/purchase-report/${purchase._id}/edit-due`
                              : "#"
                          }
                          className={`text-xs text-white px-2 py-1 rounded ${
                            purchase.due
                              ? "bg-green-600 hover:bg-green-700"
                              : "cursor-no-drop bg-green-500"
                          }`}
                        >
                          Add Payment
                        </Link>
                        <Link
                          onClick={(e) => e.stopPropagation()}
                          to="/invoice-purchase"
                          state={purchase}
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
                    colSpan={9}
                    className="text-center text-gray-500 py-10 text-lg select-none"
                  >
                    No Purchase Available.
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
              } px-2 py-1 border rounded  disabled:opacity-50`}
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
              }  px-2 py-1 border rounded  disabled:opacity-50`}
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

export default Purchase;
