import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import {
  addPayment,
  addPaymentForAdvance,
  fetchPurchaseById,
  setPurchaseSearchedByIdToNull,
} from "../features/purchase/purchaseSlice";
import Decimal from "decimal.js";
import {
  searchProductsforPurchase,
  setProductsBySearchToEmpty,
} from "../features/product/productSlice";

const PurchaseAdvanceSettlement = () => {
  const { user } = useSelector((state) => state.auth);
  const { purchaseSearchedById, loading } = useSelector(
    (state) => state.purchase,
  );
  const { productsBySearchforPurchase } = useSelector((state) => state.product);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [due, setDue] = useState(0);
  const [aid, setAid] = useState(null);
  const [date, setDate] = useState("");
  const [dateRestriction, setDateRestriction] = useState("");
  const { id } = useParams();


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(productTotal) === 0)
      return alert("Please select products with valid inputs!");
    setAid("Run");

    const newProducts = products.map(({ id, ...rest }) => ({
      ...rest,
      quantity: Number(rest.quantity),
      unitPrice: Number(rest.unitPrice),
    }));

    try {
      await dispatch(
        addPaymentForAdvance({
          id,
          info: {
            date,
            productDetails: newProducts,
            productTotal: Number(productTotal.toFixed(4))
          },
        }),
      ).unwrap();
      navigate("/purchase");
    } catch {
      console.log("Payment Failed!");
    } finally {
      setAid(null);
    }
  };

  //* Add Product Section Starts
  const [activeSearchRow, setActiveSearchRow] = useState(null);

  const [products, setProducts] = useState([
    {
      id: 1,
      productId: "",
      productName: "",
      quantity: "",
      unitPrice: "",
      subTotal: "",
    },
  ]);

  const handleProductSearchChange = (id, value) => {
    handleProductChange(id, "productName", value);
    if (value) {
      setActiveSearchRow(id);
      dispatch(searchProductsforPurchase(value));
    } else {
      setActiveSearchRow(null);
      dispatch(setProductsBySearchToEmpty());
    }
  };

  const handleSelectProductFromSearch = (id, product) => {
    handleProductChange(id, "productName", product.productName);
    handleProductChange(id, "productId", product.productId);
    dispatch(setProductsBySearchToEmpty());
    setActiveSearchRow(null);
  };

  const handleProductChange = (id, field, value) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, [field]: value } : product,
      ),
    );
  };

  const handleAddProduct = () => {
    const newId =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    setProducts([
      ...products,
      {
        id: newId,
        productId: "",
        productName: "",
        quantity: "",
        unitPrice: "",
        subTotal: "",
      },
    ]);
  };

  const handleRemoveProduct = (id) => {
    if (products.length > 1) {
      setProducts(products.filter((product) => product.id !== id));
    }
  };
  //* Add Product Section Ends
  const totalQty = products.reduce(
    (acc, p) => acc.plus(new Decimal(Number(p.quantity || 0))),
    new Decimal(0),
  );
  const productTotal = products.reduce(
    (acc, p) => acc.plus(new Decimal(Number(p.subTotal || 0))),
    new Decimal(0),
  );
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      dispatch(fetchPurchaseById(id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (purchaseSearchedById) {
      // setDue(purchaseSearchedById.due);
      const restrictionDate = new Date(purchaseSearchedById.createdAt)
        .toISOString()
        .split("T")[0];
      setDateRestriction(restrictionDate);
    }
  }, [purchaseSearchedById]);

  //* Due 0 redirection
  useEffect(() => {
    if (purchaseSearchedById?.due === 0) {
      navigate("/purchase");
    }
    // if (purchaseSearchedById?.purchaseType === "normal") {
    //     dispatch(setPurchaseSearchedByIdToNull()); //? Ekhane next time page visit e first value auto normal theke remove kore nicchi zate next e glitch na hoi
    //   navigate("/purchase");
    // }
  }, [purchaseSearchedById]);

  if (!user) return null;
  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-3 sm:p-4 md:p-6">
        {/* Purchase Summary */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-sm font-semibold text-gray-600 mb-3">
            Purchase Summary
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-50 rounded-md p-3">
              <p className="text-gray-500 text-xs">Supplier</p>

              <p className="font-semibold text-gray-800">
                {purchaseSearchedById?.supplierName}
              </p>
            </div>

            <div
              className={`rounded-md p-3 ${
                purchaseSearchedById?.purchaseType === "advance"
                  ? "bg-orange-50"
                  : "bg-blue-50"
              }`}
            >
              <p
                className={`text-xs ${
                  purchaseSearchedById?.purchaseType === "advance"
                    ? "text-orange-500"
                    : "text-blue-500"
                }`}
              >
                Purchase Type
              </p>

              <p
                className={`font-semibold ${
                  purchaseSearchedById?.purchaseType === "advance"
                    ? "text-orange-600"
                    : "text-blue-600"
                }`}
              >
                {purchaseSearchedById?.purchaseType === "advance"
                  ? "Advance Purchase"
                  : "Normal Purchase"}
              </p>
            </div>

            <div className="bg-green-50 rounded-md p-3">
              <p className="text-green-500 text-xs">Paid</p>

              <p className="font-semibold text-green-600">
                ৳ {purchaseSearchedById?.paid}
              </p>
            </div>

            <div className="bg-red-50 rounded-md p-3">
              <p className="text-red-500 text-xs">Due</p>

              <p className="font-semibold text-red-600">
                ৳ {purchaseSearchedById?.due}
              </p>
            </div>
          </div>
        </div>

        {/* Add Payment Form */}
        <form onSubmit={handleSubmit}>
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Add Payment</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Date</label>

            <input
              type="date"
              value={date}
              min={dateRestriction}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="button"
            onClick={handleAddProduct}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium mb-2 cursor-pointer"
          >
            + Add Product
          </button>

          {/* Products Section */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Products
            </h3>

            {products.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 items-end"
              >
                <div className="md:col-span-2 relative">
                  <label className="block text-xs text-gray-600 mb-1">
                    Product Name
                  </label>

                  <input
                    type="text"
                    value={product.productName}
                    onChange={(e) =>
                      handleProductSearchChange(product.id, e.target.value)
                    }
                    placeholder="Product Name"
                    className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm"
                    required
                  />

                  {activeSearchRow === product.id &&
                    productsBySearchforPurchase.length > 0 && (
                      <div className="absolute z-50 w-full bg-white shadow-xl border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto">
                        {productsBySearchforPurchase.map((p, i) => (
                          <div
                            key={i}
                            onClick={() =>
                              handleSelectProductFromSearch(product.id, {
                                productName: p.name,
                                productId: p._id,
                              })
                            }
                            className="px-3 py-2 border-b border-gray-100 cursor-pointer hover:bg-blue-50 text-gray-800 text-sm"
                          >
                            {p.name}
                          </div>
                        ))}
                      </div>
                    )}
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Quantity
                  </label>

                  <input
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    value={product.quantity}
                    onChange={(e) => {
                      const qty = e.target.value;

                      handleProductChange(product.id, "quantity", qty);

                      const sub = new Decimal(Number(qty || 0)).mul(
                        new Decimal(Number(product.unitPrice || 0)),
                      );

                      handleProductChange(
                        product.id,
                        "subTotal",
                        Number(sub.toFixed(4)),
                      );
                    }}
                    placeholder="Qty"
                    min={0}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">
                      Unit Price
                    </label>

                    <input
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      value={product.unitPrice}
                      onChange={(e) => {
                        const price = e.target.value;

                        handleProductChange(product.id, "unitPrice", price);

                        const sub = new Decimal(Number(price || 0)).mul(
                          new Decimal(Number(product.quantity || 0)),
                        );

                        handleProductChange(
                          product.id,
                          "subTotal",
                          Number(sub.toFixed(4)),
                        );
                      }}
                      placeholder="Unit Price"
                      step="any"
                      min={0}
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm"
                      required
                    />
                  </div>

                  {products.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(product.id)}
                      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="border-t border-gray-400 pt-3 mt-3">
              <div className="flex justify-end gap-6 text-sm">
                <span className="text-gray-600">
                  Total Qty: <strong>{totalQty.toFixed(0)}</strong>
                </span>

                <span className="text-gray-800 font-semibold">
                  Products Total: ৳ {productTotal.toFixed(2)}
                </span>
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
            {loading && aid ? "Paying..." : "Pay"}
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

export default PurchaseAdvanceSettlement;
