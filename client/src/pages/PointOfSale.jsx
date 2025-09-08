import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  searchProducts,
  searchProductsforPOS,
  setProductsBySearchToEmpty,
} from "../features/product/productSlice";
import { addSales, setCreatedSalesToEmpty } from "../features/sales/salesSlice";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";

const PointOfSale = () => {
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }

  }, []);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [cid, setCid] = useState(null);

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
    let productToAdd = productsBySearchforPOS.find((product) => product._id === pid);
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

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (selectedProducts.length > 0) {
        setCid('Running');
        // console.log(selectedProducts);
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
        // console.log(finalProducts);
        await dispatch(addSales(finalProducts)).unwrap();
        setCid(null);
      } else {
        alert("Please select at least one product!");
        return;
      }
    } catch (error) {
      console.log('Creating Failed!');
      setCid(null);
    }
  };

  useEffect(() => {
    if (createdSales.length > 0) {
      const data = {
        sales: createdSales,
        customerName: customer.customerName,
        address: customer.address,
        total: subTotal,
        due: Number(subTotal) - Number(cashInput),
        billPaid: Number(cashInput),
      };
      dispatch(setCreatedSalesToEmpty());
      // Navigate to the page and print it
      navigate("/invoice", { state: data });
    }
  }, [createdSales]);

  useEffect(() => {
    dispatch(setProductsBySearchToEmpty());
  }, [])

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
                productsBySearchforPOS.length > 0
                  ? "shadow-md px-4 py-2 rounded "
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
                    ৳ {product.sellPrice}
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
                  colSpan={7}
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
          disabled={loading && cid ? true : false}
          className={`mt-4 w-full text-white font-bold py-2 rounded-sm ${loading && cid ? 'cursor-not-allowed bg-blue-500' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'}`}
        >
          {loading && cid ? 'Paying...' : `Pay ${subTotal}`}
        </button>
      </form>
    </>
  );
};

export default PointOfSale;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   searchProducts,
//   searchProductsforPOS,
//   setProductsBySearchToEmpty,
// } from "../features/product/productSlice";
// import { addSales, setCreatedSalesToEmpty } from "../features/sales/salesSlice";
// import { useReactToPrint } from "react-to-print";
// import { useNavigate } from "react-router-dom";

// const PointOfSale = () => {
//   const { user } = useSelector((state) => state.auth);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [cid, setCid] = useState(null);
//   const [searchValue, setSearchValue] = useState("");
//   const [cashInput, setCashInput] = useState(0);
//   const [customer, setCustomer] = useState({ customerName: "", address: "" });

//   const { productsBySearchforPOS } = useSelector((state) => state.product);
//   const { createdSales, loading } = useSelector((state) => state.sales);

//   const subTotal = selectedProducts.reduce(
//     (acc, product) => acc + product.qty * product.sellPrice,
//     0
//   );

//   useEffect(() => {
//     if (!user) navigate("/login");
//   }, [user, navigate]);

//   const handleDeleteProduct = (pid) =>
//     setSelectedProducts((prev) => prev.filter((p) => p._id !== pid));

//   const handleSearchOnChange = (e) => {
//     const val = e.target.value;
//     setSearchValue(val);
//     val
//       ? dispatch(searchProductsforPOS(val))
//       : dispatch(setProductsBySearchToEmpty());
//   };

//   const handleSearchOnClick = (pid) => {
//     const product = productsBySearchforPOS.find((p) => p._id === pid);
//     if (product && !selectedProducts.find((p) => p._id === pid)) {
//       setSelectedProducts([...selectedProducts, { ...product, qty: 1 }]);
//     }
//     dispatch(setProductsBySearchToEmpty());
//     setSearchValue("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedProducts.length) {
//       alert("Please select at least one product!");
//       return;
//     }
//     setCid("Running");
//     const finalProducts = selectedProducts.map((p) => ({
//       customerName: customer.customerName,
//       address: customer.address,
//       productName: p.name,
//       sellPrice: p.sellPrice,
//       costPrice: p.costPrice,
//       quantity: p.qty,
//       subtotal: p.sellPrice * p.qty,
//     }));
//     await dispatch(addSales(finalProducts)).unwrap();
//     setCid(null);
//   };

//   useEffect(() => {
//     if (createdSales.length > 0) {
//       navigate("/invoice", {
//         state: {
//           sales: createdSales,
//           customerName: customer.customerName,
//           total: subTotal,
//           due: subTotal - cashInput,
//           billPaid: cashInput,
//         },
//       });
//       dispatch(setCreatedSalesToEmpty());
//     }
//   }, [createdSales]);

//   useEffect(() => {
//     dispatch(setProductsBySearchToEmpty());
//   }, [dispatch]);

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="max-w-5xl mx-auto bg-white shadow-md rounded-md p-3 sm:p-4 md:p-6"
//     >
//       <h1 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4">Sale Order</h1>

//       {/* Customer */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">Customer Name</label>
//           <input
//             type="text"
//             value={customer.customerName}
//             onChange={(e) =>
//               setCustomer({ ...customer, customerName: e.target.value })
//             }
//             placeholder="Customer Name"
//             className="w-full px-3 py-1.5 border rounded-sm text-sm"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium mb-1">Address</label>
//           <input
//             type="text"
//             value={customer.address}
//             placeholder="Address"
//             onChange={(e) =>
//               setCustomer({ ...customer, address: e.target.value })
//             }
//             className="w-full px-3 py-1.5 border rounded-sm text-sm"
//           />
//         </div>
//       </div>

//       {/* Search */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-1">Search Product</label>
//         <input
//           type="search"
//           value={searchValue}
//           onChange={handleSearchOnChange}
//           placeholder="Search Products..."
//           className="w-full px-3 py-1.5 border rounded-sm text-sm"
//         />
//         {productsBySearchforPOS.length > 0 && (
//           <div className="shadow-md rounded mt-1">
//             {productsBySearchforPOS.map((p) => (
//               <div
//                 key={p._id}
//                 onClick={() => handleSearchOnClick(p._id)}
//                 className="px-3 py-1 border-b cursor-pointer hover:bg-gray-100 text-sm"
//               >
//                 {p.name}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto border rounded mb-4">
//         <table className="min-w-full text-xs sm:text-sm">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-2 py-1.5 font-semibold border-b">#</th>
//               <th className="px-2 py-1.5 font-semibold border-b">Product</th>
//               <th className="px-2 py-1.5 font-semibold border-b">Price</th>
//               <th className="px-2 py-1.5 font-semibold border-b">Stock</th>
//               <th className="px-2 py-1.5 font-semibold border-b">Qty</th>
//               <th className="px-2 py-1.5 font-semibold border-b">Total</th>
//               <th className="px-2 py-1.5 font-semibold border-b">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {selectedProducts.length ? (
//               selectedProducts.map((p, i) => (
//                 <tr key={p._id}>
//                   <td className="px-2 py-1.5 text-center border-b">{i + 1}</td>
//                   <td className="px-2 py-1.5 text-center border-b">{p.name}</td>
//                   <td className="px-2 py-1.5 text-center border-b">
//                     ৳ {p.sellPrice}
//                   </td>
//                   <td className="px-2 py-1.5 text-center border-b">
//                     {p.quantity}
//                   </td>
//                   <td className="px-2 py-1.5 text-center border-b">
//                     <input
//                       type="number"
//                       min={1}
//                       max={p.quantity}
//                       value={p.qty}
//                       onChange={(e) =>
//                         setSelectedProducts((prev) =>
//                           prev.map((item, idx) =>
//                             idx === i ? { ...item, qty: +e.target.value } : item
//                           )
//                         )
//                       }
//                       className="w-12 border rounded px-1 text-center"
//                     />
//                   </td>
//                   <td className="px-2 py-1.5 text-center border-b">
//                     ৳ {(p.sellPrice * p.qty).toLocaleString()}
//                   </td>
//                   <td className="px-2 py-1.5 text-center border-b">
//                     <button
//                       onClick={() => handleDeleteProduct(p._id)}
//                       className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan={7}
//                   className="text-center text-gray-400 py-6 font-bold"
//                 >
//                   No Orders Yet
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Totals & Payment */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
//         <div className="space-y-1 text-sm">
//           <div className="flex justify-between font-medium">
//             <span>Sub Total</span>
//             <span>৳ {subTotal.toLocaleString()}</span>
//           </div>
//           <div className="flex justify-between font-medium">
//             <span>Cash</span>
//             <input
//               type="number"
//               value={cashInput}
//               onChange={(e) => setCashInput(Number(e.target.value))}
//               className="w-20 border rounded px-1 text-right"
//             />
//           </div>
//           <div className="flex justify-between font-bold">
//             <span>Due</span>
//             <span>৳ {(subTotal - cashInput).toLocaleString()}</span>
//           </div>
//         </div>
//       </div>

//       <button
//         type="submit"
//         disabled={loading && cid}
//         className={`mt-4 w-full text-white font-bold py-2 rounded-sm ${
//           loading && cid
//             ? "cursor-not-allowed bg-blue-500"
//             : "bg-blue-600 hover:bg-blue-700"
//         }`}
//       >
//         {loading && cid ? "Paying..." : `Pay ৳${subTotal.toLocaleString()}`}
//       </button>
//     </form>
//   );
// };

// export default PointOfSale;
