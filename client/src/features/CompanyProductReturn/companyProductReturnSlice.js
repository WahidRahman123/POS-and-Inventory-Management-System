import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  companyProductReturns: [],
  productExchangeReportData: null,
  companyProductReturnSearchedById: null,

  transactions: [],
  totalAmount: null,
  totalPaid: null,
  totalDue: null,
  
  page: 1,
  pages: null,
  toggle: false,
  loading: false, 
  sloading: false, 
  addLoading: false,
  paymentLoading: false,
  productExchangeDataLoading: false,
  error: null,
};

export const fetchCompanyProductReturns = createAsyncThunk(
  "companyProductReturn/fetchCompanyProductReturns",
  async (query, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/company-product-return`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          params: query,
        },
      );

      return data;
    } catch (error) {
      const message = "Return Fetching Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  },
);

export const addCompanyProductReturn = createAsyncThunk(
  "companyProductReturn/addCompanyProductReturn",
  async (value, ThunkAPI) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/company-product-return`,
        value,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );

      return { message: "Return Added Successfully!" };
    } catch (error) {
      let message = "Return Adding Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchProductExchangeReportData = createAsyncThunk(
  "companyProductReturn/fetchProductExchangeReportData",
  async (_, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/company-product-return/product-exchange-report`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          }
        },
      );

      return data;
    } catch (error) {
      let message = "Fetching Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchCompanyProductReturnById = createAsyncThunk(
  "companyProductReturn/fetchCompanyProductReturnById",
  async (id, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/company-product-return/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );

      return data;
    } catch (error) {
      let message = "Return Fetching Failed!";
      if (error.status === 409) message = "Invalid ID!";
      return ThunkAPI.rejectWithValue(message);
    }
  },
);

export const addPayment = createAsyncThunk(
  "companyProductReturn/addPayment",
  async (value, ThunkAPI) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/company-product-return/${
          value.id
        }/payment`,
        value.info,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      return { message: "Payment Successful!" };
    } catch (error) {
      const message = "Payment Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

//* This is only for the Company Product Return Statement
export const fetchCompanyProductReturnTRForSupplierName = createAsyncThunk(
  "companyProductReturn/fetchCompanyProductReturnTRForSupplierName",
  async (value, ThunkAPI) => {
    try {
      // console.log("entered!");
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/company-product-return/statement-by-name`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          params: value,
        },
      );

      // console.log(data);
      return data;
    } catch (error) {
      const message = "Fetching Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  },
);

const companyProductReturnSlice = createSlice({
  name: "companyProductReturn",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyProductReturns.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyProductReturns.fulfilled, (state, action) => {
        state.loading = false;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.companyProductReturns = action.payload.companyProductReturns;
      })
      .addCase(fetchCompanyProductReturns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        toast.error(action.payload, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .addCase(addCompanyProductReturn.pending, (state, action) => {
        state.addLoading = true;
        state.error = null;
      })
      .addCase(addCompanyProductReturn.fulfilled, (state, action) => {
        state.addLoading = false;
        state.toggle = !state.toggle;
        toast.success(action.payload.message, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .addCase(addCompanyProductReturn.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.error;
        toast.error(action.payload, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .addCase(fetchProductExchangeReportData.pending, (state, action) => {
        state.productExchangeDataLoading = true;
        state.error = null;
      })
      .addCase(fetchProductExchangeReportData.fulfilled, (state, action) => {
        state.productExchangeDataLoading = false;
        state.productExchangeReportData = action.payload;
      })
      .addCase(fetchProductExchangeReportData.rejected, (state, action) => {
        state.productExchangeDataLoading = false;
        state.error = action.error;
        toast.error(action.payload, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .addCase(addPayment.pending, (state, action) => {
        state.paymentLoading = true;
        state.error = null;
      })
      .addCase(addPayment.fulfilled, (state, action) => {
        state.paymentLoading = false;
        toast.success(action.payload.message, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .addCase(addPayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.error = action.error;
        toast.error(action.payload, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .addCase(fetchCompanyProductReturnTRForSupplierName.pending, (state, action) => {
        state.sloading = true;
        state.error = null;
      })
      .addCase(
        fetchCompanyProductReturnTRForSupplierName.fulfilled,
        (state, action) => {
          state.sloading = false;
          // state.page = action.payload.page;
          // state.pages = action.payload.pages;
          state.transactions = action.payload.transactions;
          state.totalAmount = action.payload.totalAmount;
          state.totalPaid = action.payload.totalPaid;
          state.totalDue = action.payload.totalDue;
        },
      )
      .addCase(
        fetchCompanyProductReturnTRForSupplierName.rejected,
        (state, action) => {
          state.sloading = false;
          state.error = action.error;
          toast.error(action.payload, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        },
      )
      .addCase(fetchCompanyProductReturnById.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyProductReturnById.fulfilled, (state, action) => {
        state.loading = false;
        state.companyProductReturnSearchedById = action.payload;
      })
      .addCase(fetchCompanyProductReturnById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        toast.error(action.payload, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  },
});

// export const { setSaleSearchedByInvoiceToEmpty } = companyProductReturnSlice.actions;
export default companyProductReturnSlice.reducer;
