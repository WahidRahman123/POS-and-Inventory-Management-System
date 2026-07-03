import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Decimal from "decimal.js";
import { addPaymentByExchange, fetchSalesReturnById } from "../features/SalesReturn/salesReturnSlice";
import {
  searchProductsforPOS,
  setProductsBySearchToEmpty,
} from "../features/product/productSlice";

const EditSRExchangeDue = () => {
  const { user } = useSelector((state) => state.auth);
  const { salesReturnSearchedById, loading } = useSelector(
    (state) => state.salesReturn,
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [aid, setAid] = useState(null);
  const { id } = useParams();
  const [dateRestriction, setDateRestriction] = useState("");
  

  const [date, setDate] = useState("");

  //* For Product Exchange - starts
  const [selectedProducts, setSelectedProducts] = useState([]);
  const { productsBySearchforPOS } = useSelector((state) => state.product);
  const [searchValue, setSearchValue] = useState("");
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
      (product) => product._id === pid,
    );
    // console.log(productToAdd);
    if (productToAdd) {
      const foundProduct = selectedProducts.find(
        (product) => product._id === productToAdd._id,
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
  const handleDeleteProduct = (pid) => {
    setSelectedProducts((prev) => prev.filter((p, i) => p._id !== pid));
  };
  const totalExchangeValue =
    selectedProducts.length > 0
      ? selectedProducts.reduce(
          (acc, product) =>
            acc.plus(
              new Decimal(Number(product.qty)).mul(
                new Decimal(Number(product.newSellPrice)),
              ),
            ),
          new Decimal(0),
        )
      : new Decimal(0);

  useEffect(() => {
    dispatch(setProductsBySearchToEmpty());
  }, []);
  //* For Product Exchange - ends

  const returnValue = salesReturnSearchedById ? new Decimal(salesReturnSearchedById.due) : new Decimal(0);

  const adjustmentAmount = returnValue.minus(totalExchangeValue);

  // console.log(salesReturnSearchedById);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(selectedProducts.length === 0) return alert("Select at least one exchange product!");
    setAid("Run");
    try {
      const newExchangeProducts = selectedProducts.map((p, i) => {
        return {
          productId: p._id,
          productName: p.name,
          quantity: Number(p.qty),
          unitPrice: Number(p.newSellPrice),
          // subtotal: Number(p.sellPrice) * Number(p.qty),
          subTotal: Number(
            new Decimal(Number(p.newSellPrice)).mul(new Decimal(Number(p.qty))),
          ),
        };
      });

      //* Amount Calculation
      const amount = totalExchangeValue.greaterThan(returnValue)
        ? Number(returnValue.toFixed(4))
        : Number(totalExchangeValue.toFixed(4));

      const transactionData = {
        amount,

        date,
        refMemo: "REF-" + salesReturnSearchedById.memo,
        customerId: salesReturnSearchedById.customerId,
        customerName: salesReturnSearchedById.customerName,
        address: salesReturnSearchedById.address,
        customerEmail: salesReturnSearchedById.customerEmail,
        customerPhone: salesReturnSearchedById.customerPhone,
        userId: user._id,
        salesId: salesReturnSearchedById.salesId,
        returnType: "product",
        exchangeProducts: newExchangeProducts,
        totalExchangeValue: Number(totalExchangeValue.toFixed(4)),
        adjustmentAmount: Number(adjustmentAmount.toFixed(4)),
        cashRefundAmount: 0,
        paymentMethod: "",
        note: "",
        salesReturnId: salesReturnSearchedById._id
      };
      // return;
      await dispatch(
        addPaymentByExchange({
          id,
          info: transactionData,
        }),
      ).unwrap();
      navigate(-1);
    } catch {
      console.log("Payment Failed!");
    } finally {
      setAid(null);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.role === "admin") {
      dispatch(fetchSalesReturnById(id));
    }
  }, [dispatch, user]);

  //* Due 0 redirection
  useEffect(() => {
    if(salesReturnSearchedById) {
      const restrictionDate = new Date(salesReturnSearchedById.createdAt)
        .toISOString()
        .split("T")[0];
      setDateRestriction(restrictionDate);
    }
    if(salesReturnSearchedById?.due === 0) {
      navigate("/sales-return");
    }
  }, [salesReturnSearchedById])

  if (user && user.role !== "admin") return null;
  return (
    <>
      <title>{`Sales Return - Product Refund | ${import.meta.env.VITE_COMPANY_NAME}`}</title>

      <div className="bg-white shadow-md rounded-lg p-3 sm:p-4 md:p-6 space-y-6">
        {/* Return Summary Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-sm font-semibold text-gray-600 mb-3">
            Return Summary
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-50 rounded-md p-3">
              <p className="text-gray-500 text-xs">Customer</p>
              <p className="font-semibold text-gray-800">
                {salesReturnSearchedById?.customerName}
              </p>
            </div>

            <div className="bg-red-50 rounded-md p-3">
              <p className="text-red-500 text-xs">Total Return</p>
              <p className="font-semibold text-red-600">
                ৳ {salesReturnSearchedById?.totalReturnValue}
              </p>
            </div>

            <div className="bg-green-50 rounded-md p-3">
              <p className="text-green-500 text-xs">Refunded</p>
              <p className="font-semibold text-green-600">
                ৳ {salesReturnSearchedById?.paid}
              </p>
            </div>

            <div className="bg-blue-50 rounded-md p-3">
              <p className="text-blue-500 text-xs">Adjustment Due</p>
              <p className="font-semibold text-blue-600">
                ৳ {salesReturnSearchedById?.due}
              </p>
            </div>
          </div>
        </div>

        {/* Left: Stock Form */}
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">
              Refund by Product (Exchange)
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Give new products to customer
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Pick A Date
            </label>
            <input
              type="date"
              value={date}
              min={dateRestriction}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-green-800">
                New Exchange Products
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-x-6 mb-4">
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1">
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

            {selectedProducts.length > 0 ? (
              selectedProducts.map((product, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-3 md:mb-0 pb-3 items-end border-b md:border-none"
                >
                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">
                      Product Name
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800">
                      {product.name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Available (Quantity)
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 text-sm">
                      {product.quantity}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={product.quantity}
                      value={product.qty}
                      onChange={(e) => {
                        const newQty = e.target.value;
                        setSelectedProducts((prev) =>
                          prev.map((p, i) =>
                            i === index ? { ...p, qty: newQty } : p,
                          ),
                        );
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Unit Price
                    </label>
                    <input
                      type="number"
                      placeholder="Price"
                      min={product.costPrice}
                      value={product.newSellPrice}
                      onChange={(e) => {
                        const newSP = e.target.value;
                        setSelectedProducts((prev) =>
                          prev.map((p, i) =>
                            i === index ? { ...p, newSellPrice: newSP } : p,
                          ),
                        );
                      }}
                      step="any"
                      className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">
                        Total
                      </label>
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-green-100 text-green-700 font-semibold text-sm">
                        ৳{" "}
                        {new Decimal(Number(product.newSellPrice))
                          .mul(new Decimal(Number(product.qty)))
                          .toString()}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(product._id)}
                      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm h-fit mt-5 cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-3 items-end">
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="Product Name"
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Available Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="Available"
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="Qty"
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Unit Price
                  </label>
                  <input
                    type="number"
                    placeholder="Price"
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">
                      Total
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-green-100 text-green-700 font-semibold text-sm">
                      ৳ 0
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Exchange Summary */}
            <div className="border-t border-green-200 pt-3 mt-3">
              <div className="flex justify-end">
                <span className="text-green-800 font-semibold text-lg">
                  Total Exchange Value: ৳ {totalExchangeValue.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Final Summary */}
          <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-200">
            <h3 className="text-sm font-semibold text-yellow-800 mb-3">
              Summary
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white rounded border border-red-200">
                <div className="text-xs text-gray-600 mb-1">Return Value</div>
                <div className="text-xl font-bold text-red-600">
                  ৳ {returnValue.toFixed(2)}
                </div>
              </div>
              <div className="text-center p-3 bg-white rounded border border-green-200">
                <div className="text-xs text-gray-600 mb-1">Exchange Value</div>
                <div className="text-xl font-bold text-green-600">
                  ৳ {totalExchangeValue.toFixed(2)}
                </div>
              </div>
              <div className="text-center p-3 bg-white rounded border border-blue-200">
                <div className="text-xs text-gray-600 mb-1">Adjustment</div>
                <div className="text-xl font-bold text-blue-600">
                  ৳ {adjustmentAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading && aid}
            className={`text-white px-4 py-2 rounded text-sm ${
              loading && aid
                ? "cursor-not-allowed bg-green-400"
                : "bg-green-500 hover:bg-green-600 cursor-pointer"
            }`}
          >
            {loading && aid ? "Adding..." : "Add Return"}
          </button>
        </form>
      </div>

      {/* Back Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm sm:text-base font-medium text-green-600 hover:text-blue-800 cursor-pointer"
        >
          <FaArrowLeft className="mr-1 sm:mr-2" /> Go Back
        </button>
      </div>
    </>
  );
};

export default EditSRExchangeDue;
