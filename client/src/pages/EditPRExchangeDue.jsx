import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Decimal from "decimal.js";
import {
  addPaymentByCash,
  fetchPurchaseReturnById,
} from "../features/PurchaseReturn/purchaseReturnSlice";

const EditPRExchangeDue = () => {
  const { user } = useSelector((state) => state.auth);
  const { purchaseReturnSearchById, loading } = useSelector(
    (state) => state.purchaseReturn,
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [aid, setAid] = useState(null);
  const { id } = useParams();
  const [dateRestriction, setDateRestriction] = useState("");
  

  const [date, setDate] = useState("");

  //* Add Product Section Starts
  const [products, setProducts] = useState([
    {
      id: 1,
      productName: "",
      quantity: "",
      qtyInKg: "",
      unitPrice: "",
      subTotal: "",
    },
  ]);
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
        productName: "",
        quantity: "",
        qtyInKg: "",
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
    (acc, p) => acc.plus(new Decimal(Number(p.quantity))),
    new Decimal(0),
  );
  const totalQtyInKg = products.reduce(
    (acc, p) => acc.plus(new Decimal(Number(p.qtyInKg))),
    new Decimal(0),
  );
  const returnAmount = products.reduce(
    (acc, p) => acc.plus(new Decimal(Number(p.subTotal))),
    new Decimal(0),
  );

  const totalExchangeValue = products.reduce(
    (acc, product) =>
      acc.plus(
        new Decimal(Number(product.quantity)).mul(
          new Decimal(Number(product.unitPrice)),
        ),
      ),
    new Decimal(0),
  );

  const returnValue = purchaseReturnSearchById
    ? new Decimal(purchaseReturnSearchById.due)
    : new Decimal(0);

  const adjustmentAmount = returnValue.minus(totalExchangeValue);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAid("Run");
    try {
      const newExchangeProducts = products.map((p, i) => {
        return {
          productName: p.productName,
          quantity: Number(p.quantity),
          unitPrice: Number(p.unitPrice),
          qtyInKg: Number(p.qtyInKg),
          subTotal: Number(
            new Decimal(Number(p.unitPrice)).mul(
              new Decimal(Number(p.quantity)),
            ),
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
        refMemo: "REF-" + purchaseReturnSearchById.memo,
        supplierId: purchaseReturnSearchById.supplierId,
        supplierName: purchaseReturnSearchById.supplierName,
        address: purchaseReturnSearchById.address,
        supplierEmail: purchaseReturnSearchById.supplierEmail,
        supplierPhone: purchaseReturnSearchById.supplierPhone,
        userId: user._id,
        purchaseId: purchaseReturnSearchById.purchaseId,
        returnType: "product",
        exchangeProducts: newExchangeProducts,
        totalExchangeValue: Number(totalExchangeValue.toFixed(4)),
        adjustmentAmount: Number(adjustmentAmount.toFixed(4)),
        cashRefundAmount: 0,
        paymentMethod: "",
        note: "",
        purchaseReturnId: purchaseReturnSearchById._id,
      };
      // return;
      await dispatch(
        addPaymentByCash({
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
      dispatch(fetchPurchaseReturnById(id));
    }
  }, [dispatch, user]);

  //* Due 0 redirection
  useEffect(() => {
    if(purchaseReturnSearchById) {
      const restrictionDate = new Date(purchaseReturnSearchById.createdAt)
        .toISOString()
        .split("T")[0];
      setDateRestriction(restrictionDate);
    }
    if (purchaseReturnSearchById?.due === 0) {
      navigate("/purchase-return");
    }
  }, [purchaseReturnSearchById]);

  if (user && user.role !== "admin") return null;
  return (
    <>
      <title>{`Purchase Return - Product Refund | ${import.meta.env.VITE_COMPANY_NAME}`}</title>
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
                {purchaseReturnSearchById?.supplierName}
              </p>
            </div>

            <div className="bg-red-50 rounded-md p-3">
              <p className="text-red-500 text-xs">Total Return</p>
              <p className="font-semibold text-red-600">
                ৳ {purchaseReturnSearchById?.totalReturnValue}
              </p>
            </div>

            <div className="bg-green-50 rounded-md p-3">
              <p className="text-green-500 text-xs">Refunded</p>
              <p className="font-semibold text-green-600">
                ৳ {purchaseReturnSearchById?.paid}
              </p>
            </div>

            <div className="bg-blue-50 rounded-md p-3">
              <p className="text-blue-500 text-xs">Adjustment Due</p>
              <p className="font-semibold text-blue-600">
                ৳ {purchaseReturnSearchById?.due}
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
              Take new products from supplier
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

            <button
              type="button"
              onClick={handleAddProduct}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap cursor-pointer mb-2"
            >
              + Add Product
            </button>

            {/* Products Section */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Products
              </h3>

              {/* Single Product Row */}
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3 items-end"
                >
                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={product.productName}
                      onChange={(e) =>
                        handleProductChange(
                          product.id,
                          "productName",
                          e.target.value,
                        )
                      }
                      placeholder="Product Name"
                      className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) => {
                        handleProductChange(
                          product.id,
                          "quantity",
                          e.target.value,
                        );

                        const subTotal = new Decimal(
                          Number(e.target.value),
                        ).mul(new Decimal(Number(product.unitPrice)));

                        handleProductChange(
                          product.id,
                          "subTotal",
                          Number(subTotal.toFixed(4)),
                        );
                      }}
                      placeholder="Qty"
                      className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Qty (kg)
                    </label>
                    <input
                      type="number"
                      value={product.qtyInKg}
                      onChange={(e) => {
                        handleProductChange(
                          product.id,
                          "qtyInKg",
                          e.target.value,
                        );
                      }}
                      placeholder="Qty in kg"
                      step="any"
                      className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">
                        Unit Price
                      </label>
                      <input
                        type="number"
                        value={product.unitPrice}
                        onChange={(e) => {
                          handleProductChange(
                            product.id,
                            "unitPrice",
                            e.target.value,
                          );

                          const subTotal = new Decimal(
                            Number(e.target.value),
                          ).mul(new Decimal(Number(product.quantity)));

                          handleProductChange(
                            product.id,
                            "subTotal",
                            Number(subTotal.toFixed(4)),
                          );
                        }}
                        placeholder="Unit Price"
                        step="any"
                        className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      />
                    </div>
                    {products.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(product.id)}
                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Product Total Summary */}
              <div className="border-t border-gray-400 pt-3 mt-3">
                <div className="flex justify-end gap-6 text-sm">
                  <span className="text-gray-600">
                    Total Qty: <strong>{totalQty.toFixed(0)}</strong>
                  </span>
                  <span className="text-gray-600">
                    Total Qty (kg): <strong>{totalQtyInKg.toFixed(0)}</strong>
                  </span>
                  <span className="text-gray-800 font-semibold">
                    Products Total: ৳ {returnAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

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

export default EditPRExchangeDue;
