import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  salesReturns: [],
  saleSearchedByInvoice: null,
  salesReturnSearchedById: null,
  invoiceLoading: false,

  transactions: [],
  totalAmount: null,
  totalPaid: null,
  totalDue: null,
  totalReturnQuantity: null,
  totalReturnQuantityInKg: null,
  totalExchangeQuantity: null,
  remainingQuantity: null,

  page: 1,
  pages: null,
  toggle: false,
  loading: false,
  error: null,
};

export const fetchSalesReturns = createAsyncThunk(
  "salesReturn/fetchSalesReturns",
  async (query, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/sales-return`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          params: query,
        },
      );

      return data;
    } catch (error) {
      const message = "Sales Return Fetching Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  },
);

export const addSalesReturn = createAsyncThunk(
  "salesReturn/addSalesReturn",
  async (value, ThunkAPI) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/sales-return`,
        value,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );

      return { message: "Sales Return Added Successfully!" };
    } catch (error) {
      let message = "Sales Return Adding Failed!";
      if (error.status === 409) message = "Memo Already Existed!";
      return ThunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchSaleByInvoice = createAsyncThunk(
  "salesReturn/fetchSaleByInvoice",
  async (query, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/sales-return/sales-by-invoice`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          params: query,
        },
      );

      return data;
    } catch (error) {
      let message = "Sale Loading Failed!";
      if (error.status === 409) message = error.response.data.message;
      return ThunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchSalesReturnById = createAsyncThunk(
  "salesReturn/fetchSalesReturnById",
  async (id, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/sales-return/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );

      return data;
    } catch (error) {
      let message = "Sales Return Fetching Failed!";
      if (error.status === 409) message = "Invalid ID!";
      return ThunkAPI.rejectWithValue(message);
    }
  },
);

export const addPaymentByExchange = createAsyncThunk(
  "salesReturn/addPaymentByExchange",
  async (value, ThunkAPI) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/sales-return/${
          value.id
        }/exchange-payment`,
        value.info,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );

      return { message: "Payment updated Successful!" };
    } catch (error) {
      const message = "Payment updated Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  },
);

export const addPaymentByCash = createAsyncThunk(
  "salesReturn/addPaymentByCash",
  async (value, ThunkAPI) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/sales-return/${
          value.id
        }/cash-payment`,
        value.info,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );

      return { message: "Payment updated Successful!" };
    } catch (error) {
      const message = "Payment updated Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  },
);

//* This is only for the Sales Return Statement
export const fetchSalesReturnsForCustomerName = createAsyncThunk(
  "salesReturn/fetchSalesReturnsForCustomerName",
  async (value, ThunkAPI) => {
    try {
      // console.log("entered!");
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/sales-return/by-name`,
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

const salesReturnSlice = createSlice({
  name: "salesReturn",
  initialState,
  reducers: {
    setSaleSearchedByInvoiceToEmpty: (state) => {
      state.saleSearchedByInvoice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesReturns.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesReturns.fulfilled, (state, action) => {
        state.loading = false;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.salesReturns = action.payload.salesReturns;
      })
      .addCase(fetchSalesReturns.rejected, (state, action) => {
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
      .addCase(addSalesReturn.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSalesReturn.fulfilled, (state, action) => {
        state.loading = false;
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
      .addCase(addSalesReturn.rejected, (state, action) => {
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
      .addCase(fetchSaleByInvoice.pending, (state, action) => {
        state.invoiceLoading = true;
        state.error = null;
      })
      .addCase(fetchSaleByInvoice.fulfilled, (state, action) => {
        state.invoiceLoading = false;
        state.saleSearchedByInvoice = action.payload;
      })
      .addCase(fetchSaleByInvoice.rejected, (state, action) => {
        state.invoiceLoading = false;
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
      .addCase(addPaymentByExchange.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPaymentByExchange.fulfilled, (state, action) => {
        state.loading = false;
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
      .addCase(addPaymentByExchange.rejected, (state, action) => {
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
      .addCase(addPaymentByCash.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPaymentByCash.fulfilled, (state, action) => {
        state.loading = false;
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
      .addCase(addPaymentByCash.rejected, (state, action) => {
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
      .addCase(fetchSalesReturnsForCustomerName.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesReturnsForCustomerName.fulfilled, (state, action) => {
        state.loading = false;
        // state.page = action.payload.page;
        // state.pages = action.payload.pages;
        state.transactions = action.payload.transactions;
        state.totalAmount = action.payload.totalAmount;
        state.totalPaid = action.payload.totalPaid;
        state.totalDue = action.payload.totalDue;

        state.totalReturnQuantity = action.payload.totalReturnQuantity;
        state.totalReturnQuantityInKg = action.payload.totalReturnQuantityInKg;
        state.totalExchangeQuantity = action.payload.totalExchangeQuantity;
        state.remainingQuantity = action.payload.remainingQuantity;
      })
      .addCase(fetchSalesReturnsForCustomerName.rejected, (state, action) => {
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
      .addCase(fetchSalesReturnById.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesReturnById.fulfilled, (state, action) => {
        state.loading = false;
        state.salesReturnSearchedById = action.payload;
      })
      .addCase(fetchSalesReturnById.rejected, (state, action) => {
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

export const { setSaleSearchedByInvoiceToEmpty } = salesReturnSlice.actions;
export default salesReturnSlice.reducer;
