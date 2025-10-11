import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  searchProducts,
  searchProductsforPOS,
  setProductsBySearchToEmpty,
} from "../features/product/productSlice";
import {
  addSales,
  getTotalSaleCount,
  setCreatedSalesToNull,
} from "../features/sales/salesSlice";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import Decimal from 'decimal.js';

const PointOfSale = () => {
  const { user } = useSelector((state) => state.auth);
  const { totalSaleCount } = useSelector((state) => state.sales);
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [cid, setCid] = useState(null);

  const [searchValue, setSearchValue] = useState("");
  const orderTotal = selectedProducts.reduce(
    (acc, product) => acc.plus(new Decimal(Number(product.qty)).mul(new Decimal(Number(product.newSellPrice)))),
    new Decimal(0)
  );
  const [discount, setDiscount] = useState(0);
  const subTotal = orderTotal.minus(new Decimal(Number(discount)));
  const totalCost = selectedProducts.reduce(
    (acc, product) => acc.plus(new Decimal(Number(product.qty)).mul(new Decimal(product.costPrice))),
    new Decimal(0)
  );
  const [cashInput, setCashInput] = useState("");
  const [remarks, setRemarks] = useState("");

  const [customer, setCustomer] = useState({
    customerId: "",
    customerName: "",
    address: "",
  });

  const { productsBySearchforPOS } = useSelector((state) => state.product);
  const { createdSales, loading } = useSelector((state) => state.sales);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteProduct = (pid) => {
    setSelectedProducts((prev) => prev.filter((p, i) => p._id !== pid));
  };

  const handleSearchOnChange = (e) => {
    setSearchValue(e.target.value);

    if (e.target.value) {
      dispatch(searchProductsforPOS(e.target.value));
    } else {
      dispatch(setProductsBySearchToEmpty());
    }
  };

  const handleSearchOnClick = (pid) => {
    let productToAdd = productsBySearchforPOS.find(
      (product) => product._id === pid
    );
    // console.log(productToAdd);
    if (productToAdd) {
      const foundProduct = selectedProducts.find(
        (product) => product._id === productToAdd._id
      );
      // console.log(foundProduct);
      if (!foundProduct) {
        productToAdd = {
          ...productToAdd,
          qty: 1,
          newSellPrice: productToAdd.sellPrice,
        }; //! iMPORTANT LINE
        // setSelectedProducts(prev => [...prev, productToAdd]);
        setSelectedProducts([...selectedProducts, productToAdd]);
      }
    }

    dispatch(setProductsBySearchToEmpty());
    setSearchValue("");
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (selectedProducts.length > 0) {
        setCid("Running");
        // console.log(selectedProducts);

        const finalProducts = selectedProducts.map((p, i) => {
          return {
            productName: p.name,
            oldSellPrice: Number(p.sellPrice),
            sellPrice: Number(p.newSellPrice),
            costPrice: Number(p.costPrice),
            quantity: Number(p.qty),
            // subtotal: Number(p.sellPrice) * Number(p.qty),
            subtotal: Number(new Decimal(p.newSellPrice).mul(new Decimal(p.qty)).toFixed(4)),
          };
        });

        await dispatch(
          addSales({
            // customerId: customer.customerId,
            userId: user._id,
            invoiceNo: Number(totalSaleCount) + 1,
            remarks,
            customerName: customer.customerName,
            address: customer.address,
            products: finalProducts,
            totalWithoutDiscount: Number(orderTotal.toFixed(4)),
            total: Number(subTotal.toFixed(4)),
            discount: discount ? Number(new Decimal(discount).toFixed(4)) : 0,
            totalCost: Number(totalCost.toFixed(4)),
            due: cashInput
              ? subTotal.minus(new Decimal(cashInput)).lessThan(new Decimal(0))
                ? 0
                : Number(subTotal.minus(new Decimal(cashInput)).toFixed(4))
              : Number(subTotal.toFixed(4)),
            paid: cashInput
              ? new Decimal(cashInput).greaterThan(subTotal)
                ? Number(subTotal.toFixed(4))
                : Number(new Decimal(cashInput).toFixed(4))
              : 0,
          })
        ).unwrap();
        setCid(null);
      } else {
        alert("Please select at least one product!");
        return;
      }
    } catch (error) {
      console.log("Creating Failed!");
      setCid(null);
    }
  };

  useEffect(() => {
    if (createdSales) {
      const data = {
        ...createdSales,
        due: cashInput
          ? Number(subTotal.minus(new Decimal(cashInput)).toFixed(4))
          : Number(subTotal.toFixed(4)),
        paid: cashInput ? Number(new Decimal(cashInput).toFixed(4)) : 0,
      };
      dispatch(setCreatedSalesToNull());
      // Navigate to the page and print it
      navigate("/invoice", { state: data });
    }
  }, [createdSales]);

  useEffect(() => {
    dispatch(setProductsBySearchToEmpty());
    dispatch(getTotalSaleCount());
  }, []);

  if (!user) return null;

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
              required
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
              required
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
                productsBySearchforPOS.length > 0
                  ? "shadow-md px-4 py-2 rounded max-h-50 overflow-y-scroll"
                  : ""
              }`}
            >
              {productsBySearchforPOS.length > 0
                ? productsBySearchforPOS.map((product, index) => (
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
                Available (Quantity)
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
                    ৳{" "}
                    <input
                      type="number"
                      min={product.sellPrice}
                      value={product.newSellPrice}
                      onChange={(e) => {
                        const newSP = e.target.value;
                        setSelectedProducts((prev) =>
                          prev.map((p, i) =>
                            i === index ? { ...p, newSellPrice: newSP } : p
                          )
                        );
                      }}
                      step="any"
                      className="w-[100px] border rounded px-2"
                      required
                    />
                  </td>
                  <td className="px-3 py-1.5 text-sm text-gray-800 border-b text-center">
                    {product.quantity}
                  </td>
                  <td className="px-3 py-1.5 text-sm text-gray-800 border-b text-center">
                    <input
                      type="number"
                      min={1}
                      max={product.quantity}
                      value={product.qty}
                      onChange={(e) => {
                        const newQty = e.target.value;
                        setSelectedProducts((prev) =>
                          prev.map((p, i) =>
                            i === index ? { ...p, qty: newQty } : p
                          )
                        );
                      }}
                      className="w-[60px] border rounded px-2"
                      required
                    />
                  </td>

                  <td className="px-3 py-1.5 text-sm text-gray-800 border-b text-center">
                    {/* ৳ {(product.sellPrice * product.qty).toLocaleString()} */}
                    ৳ {new Decimal(Number(product.newSellPrice)).mul(new Decimal(Number(product.qty))).toString()}
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
                  colSpan={7}
                  className="text-center select-none text-gray-500 font-bold px-6 py-3"
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
              <span className="font-medium">{orderTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Order&nbsp;Discount</span>
              <span className="font-medium">
                <input
                  type="number"
                  min={0}
                  max={orderTotal}
                  value={discount}
                  step="any"
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-[80px] border rounded border-gray-400 px-1 py-0.5"
                />
              </span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Sub&nbsp;Total</span>
              <span>{subTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="flex flex-col gap-6 max-w-[50%] mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cash</label>
            <input
              type="number"
              value={cashInput}
              onChange={(e) => setCashInput(e.target.value)}
              step="any"
              className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm"
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="block w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm"
              rows={3}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-4">
          <div className="w-64 space-y-0.5 text-sm">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Paid</span>
              <span>{new Decimal(Number(cashInput)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Due</span>
              {/* <span>{subTotal - cashInput}</span> */}
              <span>{subTotal.minus(new Decimal(Number(cashInput))).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading && cid ? true : false}
          className={`mt-4 w-full text-white font-bold py-2 rounded-sm ${
            loading && cid
              ? "cursor-not-allowed bg-blue-500"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
          }`}
        >
          {loading && cid ? "Paying..." : `Pay`}
        </button>
      </form>
    </>
  );
};

export default PointOfSale;
