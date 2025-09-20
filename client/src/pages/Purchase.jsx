import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as yup from "yup";
import {
  addPurchase,
  fetchPurchases,
} from "../features/purchase/purchaseSlice";
import { Link, useNavigate } from "react-router-dom";

const purchaseSchema = yup.object({
  createdAt: yup.date().required("*Date is required!"),
  memo: yup.string().required("*Memo is required!"),
  supplierName: yup.string().required("*Supplier name is required!"),
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
  const { purchases, toggle } = useSelector((state) => state.purchase);
  const dispatch = useDispatch();
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  // console.log(purchases);

  const handleSubmit = async (value, setSubmitting, resetForm) => {
    const paid =
      Number(value.paid) > Number(value.totalAmount)
        ? Number(value.totalAmount)
        : Number(value.paid);
    const due = Number(value.totalAmount) - paid;

    const purchaseValue = { ...value, paid, due };

    try {
      await dispatch(addPurchase(purchaseValue)).unwrap();
      resetForm();
    } catch (error) {
      console.log("Failed!");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (user) {
      dispatch(fetchPurchases(date));
    }
  }, [dispatch, user, toggle, date]);

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

      {/* Purchase Add Form */}
      <Formik
        initialValues={{
          createdAt: "",
          memo: "",
          supplierName: "",
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
          <Form className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
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
                  placeholder="Supplier Name"
                  name="supplierName"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <ErrorMessage
                  name="supplierName"
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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

              <div>
                <Field
                  name="totalAmount"
                  type="number"
                  placeholder="Total Amount"
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

      {/* Purchase Report Table */}
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        {/* <h2 className="text-lg sm:text-xl font-semibold mb-4">Purchase Report</h2> */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h2
            className="text-lg sm:text-xl font-semibold cursor-pointer"
            onClick={() => date !== "" && setDate("")}
          >
            Purchase Report
          </h2>

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
                  <tr key={index}>
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
      </div>
    </div>
  );
};

export default Purchase;
