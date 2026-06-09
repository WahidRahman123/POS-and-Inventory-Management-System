import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { customerFetch } from "../../utils/POS/customerFetch";

const CustomerSelect = ({ customer, setCustomer, triggerForClearing }) => {
  const [name, setName] = useState("");
  const customerNameRef = useRef(null);
  const [disable, setDisable] = useState(false);
  const [data, setData] = useState(null);

  const handleCustomerNameOnChange = async (e) => {
    const query = e.target.value;
    setName(query);
    if (query) {
      const data = await customerFetch(query);
      setData(data);
    } else {
      setData(null);
    }
  };

  const handleCustomerOnClick = (customerData) => {
    setData(null);
    setName(customerData.name);
    setCustomer({
      customerId: customerData._id,
      customerName: customerData.name,
      address: customerData.address,
      customerEmail: customerData.email,
      customerPhone: customerData.phone,
      currentBalance: customerData.currentBalance
    });
    setDisable(true);
  };
  useEffect(() => {
    if (!disable && customerNameRef.current) {
      customerNameRef.current.focus();
    }
  }, [disable]);

  return (
    <>
      <div className="grid grid-cols-2 gap-x-6 mb-4">
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
              className="bg-red-500 hover:bg-red-600 cursor-pointer ml-2 px-2 py-1 font-bold text-white rounded disabled:bg-red-300 disabled:cursor-not-allowed "
              onClick={() => {
                setDisable(false);
                setName("");
                setCustomer({
                  customerId: "",
                  customerName: "",
                  address: "",
                  customerEmail: "",
                  customerPhone: "",
                  currentBalance: ""
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
            value={customer.address}
            placeholder="Address"
            disabled
            className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm bg-gray-200 text-gray-700 select-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium my-1.5">Current Balance</label>
          <input
            type="text"
            value={customer.currentBalance}
            placeholder="Current Balance"
            disabled
            className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm bg-gray-200 text-gray-700 select-none"
            required
          />
        </div>
      </div>
    </>
  );
};

export default CustomerSelect;
