import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addCustomer } from "../../features/customer/customerSlice";

const CustomerAddForm = () => {
  const dispatch = useDispatch();
  const { customers, loading, toggle, page, pages } = useSelector(
    (state) => state.customer,
  );

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addCustomer(customer)).unwrap();
      setCustomer({
        name: "",
        phone: "",
        email: "",
        address: "",
      });
    } catch {
      console.log("Add failed!");
    }
  };

  return (
    <form
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      onSubmit={handleAdd}
    >
      <input
        type="text"
        placeholder="Customer Name"
        name="name"
        value={customer.name}
        onChange={handleOnChange}
        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
        required
      />
      <input
        type="tel"
        placeholder="Phone"
        name="phone"
        value={customer.phone}
        minLength={11}
        maxLength={14}
        onChange={handleOnChange}
        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
        required
      />
      <input
        type="email"
        placeholder="Email"
        name="email"
        value={customer.email}
        onChange={handleOnChange}
        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
      />
      <input
        type="text"
        placeholder="Address"
        name="address"
        value={customer.address}
        onChange={handleOnChange}
        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
        required
      />
      <div className="sm:col-span-2 flex justify-end">
        <button
          disabled={loading}
          className={`text-white text-sm px-4 py-2 rounded-md ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
          }`}
        >
          {loading ? "Saving..." : "Save Customer"}
        </button>
      </div>
    </form>
  );
};

export default CustomerAddForm;
