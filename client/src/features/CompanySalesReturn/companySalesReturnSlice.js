import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  companySalesReturns: [],
  salesReturnReportData: null,
  companySalesReturnSearchedById: null,
  companySalesReturnSearchedByProductName: [],

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
  salesReturnDataLoading: false,
  error: null,
};

export const fetchCompanySalesReturns = createAsyncThunk(
  "companySalesReturn/fetchCompanySalesReturns",
  async (query, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/company-sales-return`,
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

export const fetchSalesReturnByProductName = createAsyncThunk(
  "companySalesReturn/fetchSalesReturnByProductName",
  async (query, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/company-sales-return/search-by-product-name`,
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

export const addCompanySalesReturn = createAsyncThunk(
  "companySalesReturn/addCompanySalesReturn",
  async (value, ThunkAPI) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/company-sales-return`,
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

export const fetchSalesReturnReportData = createAsyncThunk(
  "companySalesReturn/fetchSalesReturnReportData",
  async (_, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/company-sales-return/sales-return-report`,
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

export const fetchCompanySalesReturnById = createAsyncThunk(
  "companySalesReturn/fetchCompanySalesReturnById",
  async (id, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/company-sales-return/${id}`,
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
  "companySalesReturn/addPayment",
  async (value, ThunkAPI) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/company-sales-return/${
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

//* This is only for the Company Sales Return Statement
export const fetchCompanySalesReturnTRForSupplierName = createAsyncThunk(
  "companySalesReturn/fetchCompanySalesReturnTRForSupplierName",
  async (value, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/company-sales-return/statement-by-name`,
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

const companySalesReturnSlice = createSlice({
  name: "companySalesReturn",
  initialState,
  reducers: {
      setSalesReturnSearchByProductNameToEmpty: (state) => {
        state.companySalesReturnSearchedByProductName = [];
      },
    },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanySalesReturns.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanySalesReturns.fulfilled, (state, action) => {
        state.loading = false;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.companySalesReturns = action.payload.companySalesReturns;
      })
      .addCase(fetchCompanySalesReturns.rejected, (state, action) => {
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
      .addCase(fetchSalesReturnByProductName.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesReturnByProductName.fulfilled, (state, action) => {
        state.loading = false;
        state.companySalesReturnSearchedByProductName = action.payload;
      })
      .addCase(fetchSalesReturnByProductName.rejected, (state, action) => {
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
      .addCase(addCompanySalesReturn.pending, (state, action) => {
        state.addLoading = true;
        state.error = null;
      })
      .addCase(addCompanySalesReturn.fulfilled, (state, action) => {
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
      .addCase(addCompanySalesReturn.rejected, (state, action) => {
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
      .addCase(fetchSalesReturnReportData.pending, (state, action) => {
        state.salesReturnDataLoading = true;
        state.error = null;
      })
      .addCase(fetchSalesReturnReportData.fulfilled, (state, action) => {
        state.salesReturnDataLoading = false;
        state.salesReturnReportData = action.payload;
      })
      .addCase(fetchSalesReturnReportData.rejected, (state, action) => {
        state.salesReturnDataLoading = false;
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
      .addCase(fetchCompanySalesReturnTRForSupplierName.pending, (state, action) => {
        state.sloading = true;
        state.error = null;
      })
      .addCase(
        fetchCompanySalesReturnTRForSupplierName.fulfilled,
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
        fetchCompanySalesReturnTRForSupplierName.rejected,
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
      .addCase(fetchCompanySalesReturnById.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanySalesReturnById.fulfilled, (state, action) => {
        state.loading = false;
        state.companySalesReturnSearchedById = action.payload;
      })
      .addCase(fetchCompanySalesReturnById.rejected, (state, action) => {
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

export const { setSalesReturnSearchByProductNameToEmpty } = companySalesReturnSlice.actions;
export default companySalesReturnSlice.reducer;
