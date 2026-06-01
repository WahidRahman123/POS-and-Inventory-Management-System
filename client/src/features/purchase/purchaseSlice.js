// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
// import { toast } from "react-toastify";

// const initialState = {
//   purchases: [],
//   supplierBalances: [], // <--- নাম পরিবর্তন করে সার্বিক ব্যালেন্স ট্র্যাকিংয়ের জন্য রেডি করা হলো
//   purchaseSearchedById: null,
//   page: 1,
//   pages: null,
//   toggle: false,
//   loading: false,
//   error: null,
// };


// export const fetchPurchases = createAsyncThunk(
//   "purchase/fetchPurchases",
//   async (query, ThunkAPI) => {
//     try {
//       const { data } = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URI}/api/purchase`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("userToken")}`,
//           },
//           params: query,
//         }
//       );

//       return data;
//     } catch (error) {
//       const message = "Purchase Fetching Failed!";
//       return ThunkAPI.rejectWithValue(message);
//     }
//   }
// );

// export const fetchPurchaseById = createAsyncThunk(
//   "purchase/fetchPurchaseById",
//   async (id, ThunkAPI) => {
//     try {
//       const { data } = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URI}/api/purchase/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("userToken")}`,
//           },
//         }
//       );

//       return data;
//     } catch (error) {
//       const message = "Purchase Fetching Failed!";
//       return ThunkAPI.rejectWithValue(message);
//     }
//   }
// );

// export const addPurchase = createAsyncThunk(
//   "purchase/addPurchase",
//   async (value, ThunkAPI) => {
//     try {
//       const { data } = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URI}/api/purchase`,
//         value,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("userToken")}`,
//           },
//         }
//       );

//       return { message: "Purchase Added Successfully!" };
//     } catch (error) {
//       let message = "Purchase Adding Failed!";
//       if(error.status) message = "Memo already exists!";
//       return ThunkAPI.rejectWithValue(message);
//     }
//   }
// );

// // export const addPayment = createAsyncThunk(
// //   "purchase/addPayment",
// //   async (purchase, ThunkAPI) => {
// //     try {
// //       const { data } = await axios.post(
// //         `${import.meta.env.VITE_BACKEND_URI}/api/purchase/${
// //           purchase.id
// //         }/payment`,
// //         purchase.info,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${localStorage.getItem("userToken")}`,
// //           },
// //         }
// //       );

// //       return { message: "Payment Successful!" };
// //     } catch (error) {
// //       const message = "Payment Failed!";
// //       return ThunkAPI.rejectWithValue(message);
// //     }
// //   }
// // );
// export const addPayment = createAsyncThunk(
//   "purchase/addPayment",
//   async (payload, ThunkAPI) => {
//     try {
//       let url;

//       if (payload.isSupplierLevel) {
//         // Supplier Level Due Payment
//         url = `${import.meta.env.VITE_BACKEND_URI}/api/purchase/supplier-payment`;
//       } else {
//         // Individual Purchase Due Payment
//         url = `${import.meta.env.VITE_BACKEND_URI}/api/purchase/${payload.id}/payment`;
//       }

//       const { data } = await axios.post(url, payload, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("userToken")}`,
//         },
//       });

//       return { message: "Payment Successful!" };
//     } catch (error) {
//       const message = error.response?.data?.message || "Payment Failed!";
//       return ThunkAPI.rejectWithValue(message);
//     }
//   }
// );
// export const addPaymentForAdvance = createAsyncThunk(
//   "purchase/addPaymentForAdvance",
//   async (purchase, ThunkAPI) => {
//     try {
//       const { data } = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URI}/api/purchase/${
//           purchase.id
//         }/paymentforadvance`,
//         purchase.info,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("userToken")}`,
//           },
//         }
//       );

//       return { message: "Adjustment Successful!" };
//     } catch (error) {
//       const message = "Adjustment Failed!";
//       return ThunkAPI.rejectWithValue(message);
//     }
//   }
// );

// const purchaseSlice = createSlice({
//   name: "purchase",
//   initialState,
//   reducers: {
//       setPurchaseSearchedByIdToNull: (state) => {
//         state.purchaseSearchedById = null;
//       },
//     },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchPurchases.pending, (state, action) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchPurchases.fulfilled, (state, action) => {
//         state.loading = false;
//         state.page = action.payload.page;
//         state.pages = action.payload.pages;
//         state.purchases = action.payload.purchases;
//       })
//       .addCase(fetchPurchases.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error;
//         toast.error(action.payload, {
//           position: "bottom-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: false,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "colored",
//         });
//       })
//       .addCase(addPurchase.pending, (state, action) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(addPurchase.fulfilled, (state, action) => {
//         state.loading = false;
//         state.toggle = !state.toggle;
//         toast.success(action.payload.message, {
//           position: "bottom-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: false,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "colored",
//         });
//       })
//       .addCase(addPurchase.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error;
//         toast.error(action.payload, {
//           position: "bottom-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: false,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "colored",
//         });
//       })
//       .addCase(fetchPurchaseById.pending, (state, action) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchPurchaseById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.purchaseSearchedById = action.payload;
//       })
//       .addCase(fetchPurchaseById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error;
//         toast.error(action.payload, {
//           position: "bottom-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: false,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "colored",
//         });
//       })
//       .addCase(addPayment.pending, (state, action) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(addPayment.fulfilled, (state, action) => {
//         state.loading = false;
//         toast.success(action.payload.message, {
//           position: "bottom-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: false,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "colored",
//         });
//       })
//       .addCase(addPayment.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error;
//         toast.error(action.payload, {
//           position: "bottom-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: false,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "colored",
//         });
//       })
//       .addCase(addPaymentForAdvance.pending, (state, action) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(addPaymentForAdvance.fulfilled, (state, action) => {
//         state.loading = false;
//         toast.success(action.payload.message, {
//           position: "bottom-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: false,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "colored",
//         });
//       })
//       .addCase(addPaymentForAdvance.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error;
//         toast.error(action.payload, {
//           position: "bottom-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: false,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "colored",
//         });
//       })
//   },
// });
// export const fetchSupplierDueList = createAsyncThunk(
//   "purchase/fetchSupplierDueList",
//   async (query, ThunkAPI) => {
//     try {
//       const { data } = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URI}/api/purchase/supplier-due-list`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("userToken")}`,
//           },
//           params: query,
//         }
//       );
//       return data; // ব্যাকএন্ড থেকে supplierBalances রিটার্ন আসবে
//     } catch (error) {
//       const message = error.response?.data?.message || "Supplier Balance Fetching Failed!";
//       return ThunkAPI.rejectWithValue(message);
//     }
//   }
// );

// export const { setPurchaseSearchedByIdToNull } = purchaseSlice.actions; //! Baki ase
// export default purchaseSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  purchases: [],
  supplierBalances: [], // সার্বিক ব্যালেন্স ট্র্যাকিংয়ের ডেটা এখানে জমা হবে
  purchaseSearchedById: null,
  page: 1,
  pages: null,
  toggle: false,
  loading: false,
  error: null,
};

// ==================== Thunk Methods ====================

export const fetchSupplierDueList = createAsyncThunk(
  "purchase/fetchSupplierDueList",
  async (query, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/purchase/supplier-due-list`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          params: query,
        }
      );
      return data; // ব্যাকএন্ড থেকে { success: true, supplierBalances: [...] } আসবে
    } catch (error) {
      const message = error.response?.data?.message || "Supplier Balance Fetching Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchPurchases = createAsyncThunk(
  "purchase/fetchPurchases",
  async (query, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/purchase`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          params: query,
        }
      );
      return data;
    } catch (error) {
      const message = "Purchase Fetching Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchPurchaseById = createAsyncThunk(
  "purchase/fetchPurchaseById",
  async (id, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/purchase/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return data;
    } catch (error) {
      const message = "Purchase Fetching Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

export const addPurchase = createAsyncThunk(
  "purchase/addPurchase",
  async (value, ThunkAPI) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/purchase`,
        value,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return { message: "Purchase Added Successfully!" };
    } catch (error) {
      let message = "Purchase Adding Failed!";
      if(error.status) message = "Memo already exists!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

export const addPayment = createAsyncThunk(
  "purchase/addPayment",
  async (payload, ThunkAPI) => {
    try {
      let url;
      if (payload.isSupplierLevel) {
        url = `${import.meta.env.VITE_BACKEND_URI}/api/purchase/supplier-payment`;
      } else {
        url = `${import.meta.env.VITE_BACKEND_URI}/api/purchase/${payload.id}/payment`;
      }

      const { data } = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });

      return { message: "Payment Successful!" };
    } catch (error) {
      const message = error.response?.data?.message || "Payment Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

export const addPaymentForAdvance = createAsyncThunk(
  "purchase/addPaymentForAdvance",
  async (purchase, ThunkAPI) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/purchase/${purchase.id}/paymentforadvance`,
        purchase.info,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return { message: "Adjustment Successful!" };
    } catch (error) {
      const message = "Adjustment Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

// ==================== Slice Definition ====================

const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    setPurchaseSearchedByIdToNull: (state) => {
      state.purchaseSearchedById = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 💡 ১. fetchSupplierDueList এর অ্যাকশন মেথডগুলো যোগ করা হলো (যা মিসিং ছিল)
      .addCase(fetchSupplierDueList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupplierDueList.fulfilled, (state, action) => {
        state.loading = false;
        state.supplierBalances = action.payload.supplierBalances || []; // স্টেট এ ডেটা সেভ হলো
      })
      .addCase(fetchSupplierDueList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload, {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
        });
      })

      // fetchPurchases
      .addCase(fetchPurchases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.loading = false;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.purchases = action.payload.purchases;
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        toast.error(action.payload, {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
        });
      })

      // addPurchase
      .addCase(addPurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPurchase.fulfilled, (state, action) => {
        state.loading = false;
        state.toggle = !state.toggle;
        toast.success(action.payload.message, {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
        });
      })
      .addCase(addPurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        toast.error(action.payload, {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
        });
      })

      // fetchPurchaseById
      .addCase(fetchPurchaseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseById.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseSearchedById = action.payload;
      })
      .addCase(fetchPurchaseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        toast.error(action.payload, {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
        });
      })

      // addPayment
      .addCase(addPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.toggle = !state.toggle; // 💡 পেমেন্ট কমপ্লিট হলে লাইভ ডাটা রি-ফ্রেস করার জন্য টগল চেঞ্জ করা হলো
        toast.success(action.payload.message, {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
        });
      })
      .addCase(addPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        toast.error(action.payload, {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
        });
      })

      // addPaymentForAdvance
      .addCase(addPaymentForAdvance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPaymentForAdvance.fulfilled, (state, action) => {
        state.loading = false;
        state.toggle = !state.toggle; // 💡 অ্যাডভান্স অ্যাডজাস্ট হলেও রিয়েলটাইম রিফ্রেস হবে
        toast.success(action.payload.message, {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
        });
      })
      .addCase(addPaymentForAdvance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        toast.error(action.payload, {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
        });
      })
  },
});

export const { setPurchaseSearchedByIdToNull } = purchaseSlice.actions;
export default purchaseSlice.reducer;