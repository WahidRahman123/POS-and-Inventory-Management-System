import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  searchProducts,
  setProductsBySearchToEmpty,
} from "../features/product/productSlice";
import { addSales, setCreatedSalesToEmpty } from "../features/sales/salesSlice";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";

const PointOfSale = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const subTotal = selectedProducts.reduce(
    (acc, product) => acc + product.qty * product.sellPrice,
    0
  );
  const [cashInput, setCashInput] = useState(0);
  // const [discount, setDiscount] = useState(0);
  // const total = subTotal - discount;
  // const total = subTotal;
  const [customer, setCustomer] = useState({
    customerName: "",
    address: "",
  });

  const { productsBySearch } = useSelector((state) => state.product);
  const { createdSales } = useSelector((state) => state.sales);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteProduct = (pid) => {
    setSelectedProducts((prev) => prev.filter((p, i) => p._id !== pid));
  };

  const handleSearchOnChange = (e) => {
    setSearchValue(e.target.value);

    if (e.target.value) {
      dispatch(searchProducts(e.target.value));
    } else {
      dispatch(setProductsBySearchToEmpty());
    }
  };

  const handleSearchOnClick = (pid) => {
    let productToAdd = productsBySearch.find((product) => product._id === pid);
    // console.log(productToAdd);
    if (productToAdd) {
      const foundProduct = selectedProducts.find(
        (product) => product._id === productToAdd._id
      );
      // console.log(foundProduct);
      if (!foundProduct) {
        productToAdd = { ...productToAdd, qty: 1 }; //! iMPORTANT LINE
        // setSelectedProducts(prev => [...prev, productToAdd]);
        setSelectedProducts([...selectedProducts, productToAdd]);
      }
    }

    dispatch(setProductsBySearchToEmpty());
    setSearchValue("");
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedProducts.length > 0) {
      console.log(selectedProducts);
      const finalProducts = selectedProducts.map((p, i) => {
        return {
          customerName: customer.customerName,
          address: customer.address,
          productName: p.name,
          sellPrice: p.sellPrice,
          costPrice: p.costPrice,
          quantity: p.qty,
          subtotal: Number(p.sellPrice) * Number(p.qty),
        };
      });
      console.log(finalProducts);
      dispatch(addSales(finalProducts));
    } else {
      alert("Please select at least one product!");
      return;
    }
  };

  useEffect(() => {
    if (createdSales.length > 0) {
      const data = {sales: createdSales, customerName: customer.customerName, total: subTotal, due: Number(subTotal) - Number(cashInput), billPaid: Number(cashInput)};
      dispatch(setCreatedSalesToEmpty());
      // Navigate to the page and print it
      navigate('/invoice', { state: data });
    }
  }, [createdSales]);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto bg-white shadow-md rounded-md p-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Sale Order</h1>

        {/* Customer */}
        <div className="grid grid-cols-2 gap-x-6 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              CustomerName
            </label>
            <input
              type="text"
              value={customer.customerName}
              onChange={(e) =>
                setCustomer({ ...customer, customerName: e.target.value })
              }
              placeholder="Customer Name"
              className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              value={customer.address}
              placeholder="Address"
              onChange={(e) =>
                setCustomer({ ...customer, address: e.target.value })
              }
              className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-6 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Search Product
            </label>
            <input
              type="search"
              value={searchValue}
              onChange={handleSearchOnChange}
              placeholder="Search Products..."
              className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm"
            />
            <div
              className={`${
                productsBySearch.length > 0
                  ? "shadow-md px-4 py-2 rounded "
                  : ""
              }`}
            >
              {productsBySearch.length > 0
                ? productsBySearch.map((product, index) => (
                    <div
                      onClick={() => handleSearchOnClick(product._id)}
                      key={index}
                      className="px-2 py-1 border-b border-gray-300 cursor-pointer hover:bg-gray-100 text-gray-800"
                    >
                      {product.name}
                    </div>
                  ))
                : ""}
            </div>
          </div>
        </div>

        {/* Table */}
        <table className="min-w-full border border-gray-300 mb-4">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-1.5 text-xs font-semibold text-gray-700 border-b">
                #
              </th>
              <th className="px-3 py-1.5 text-xs font-semibold text-gray-700 border-b">
                Product Name
              </th>
              <th className="px-3 py-1.5 text-xs font-semibold text-gray-700 border-b">
                Sale Price
              </th>
              <th className="px-3 py-1.5 text-xs font-semibold text-gray-700 border-b">
                Quantity
              </th>

              <th className="px-3 py-1.5 text-xs font-semibold text-gray-700 border-b">
                ItemTotal
              </th>
              <th className="px-3 py-1.5 text-xs font-semibold text-gray-700 border-b">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {selectedProducts.length > 0 ? (
              selectedProducts.map((product, index) => (
                <tr key={index}>
                  <td className="px-3 py-1.5 text-sm text-gray-800 border-b text-center">
                    {index + 1}
                  </td>
                  <td className="px-3 py-1.5 text-sm text-gray-800 border-b text-center">
                    {product.name}
                  </td>
                  <td className="px-3 py-1.5 text-sm text-gray-800 border-b text-center">
                    ৳ {product.sellPrice}
                  </td>
                  <td className="px-3 py-1.5 text-sm text-gray-800 border-b text-center">
                    <input
                      type="number"
                      min={1}
                      value={product.qty}
                      onChange={(e) => {
                        const newQty = Number(e.target.value);
                        setSelectedProducts((prev) =>
                          prev.map((p, i) =>
                            i === index ? { ...p, qty: newQty } : p
                          )
                        );
                      }}
                      className="w-[60px] border rounded px-2"
                    />
                  </td>

                  <td className="px-3 py-1.5 text-sm text-gray-800 border-b text-center">
                    ৳ {(product.sellPrice * product.qty).toLocaleString()}
                  </td>
                  <td className="p-2 text-center border-b">
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="cursor-pointer text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center select-none text-gray-400 font-bold"
                >
                  No Orders Yet
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-4">
          <div className="w-64 space-y-0.5 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">OrderTotal(1pack,piece)</span>
              <span className="font-medium">{subTotal}</span>
            </div>
            {/* <div className="flex justify-between">
              <span className="font-medium">Order&nbsp;Discount</span>
              <span className="font-medium">
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  min={0}
                  className="w-[80px] text-right border rounded border-gray-400"
                />
              </span>
            </div> */}
            <div className="flex justify-between font-bold">
              <span>Sub&nbsp;Total</span>
              <span>{subTotal}</span>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="grid grid-cols-2 gap-x-6 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cash</label>
            <input
              type="number"
              value={cashInput}
              onChange={(e) => setCashInput(Number(e.target.value))}
              className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-4">
          <div className="w-64 space-y-0.5 text-sm">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{subTotal}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Paid</span>
              <span>{cashInput}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Due</span>
              <span>{subTotal - cashInput}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="hover:bg-blue-700 cursor-pointer mt-4 w-full bg-blue-600 text-white font-bold py-2 rounded-sm"
        >
          Pay&nbsp;{subTotal}
        </button>
      </form>
    </>
  );
};

export default PointOfSale;
