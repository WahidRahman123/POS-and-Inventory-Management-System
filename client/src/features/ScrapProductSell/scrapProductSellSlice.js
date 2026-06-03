import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  ScrapProductSells: [],
  ScrapProductSellSearchedById: null,

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
  error: null,
};

export const fetchScrapProductSell = createAsyncThunk(
  "ScrapProductSell/fetchScrapProductSell",
  async (query, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/scrap-product-sell`,
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

export const addScrapProductSell = createAsyncThunk(
  "ScrapProductSell/addScrapProductSell",
  async (value, ThunkAPI) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/scrap-product-sell`,
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

export const fetchCompanyProductReturnById = createAsyncThunk(
  "ScrapProductSell/fetchCompanyProductReturnById",
  async (id, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/scrap-product-sell/${id}`,
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
  "ScrapProductSell/addPayment",
  async (value, ThunkAPI) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/scrap-product-sell/${
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

//* This is only for the Scrap Product Sell Statement
export const fetchScrapProductSellTRForCustomerName = createAsyncThunk(
  "ScrapProductSell/fetchScrapProductSellTRForCustomerName",
  async (value, ThunkAPI) => {
    try {
      // console.log("entered!");
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/scrap-product-sell/statement-by-name`,
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

const scrapProductSellSlice = createSlice({
  name: "ScrapProductSell",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchScrapProductSell.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScrapProductSell.fulfilled, (state, action) => {
        state.loading = false;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.ScrapProductSells = action.payload.scrapProductSells;
      })
      .addCase(fetchScrapProductSell.rejected, (state, action) => {
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
      .addCase(addScrapProductSell.pending, (state, action) => {
        state.addLoading = true;
        state.error = null;
      })
      .addCase(addScrapProductSell.fulfilled, (state, action) => {
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
      .addCase(addScrapProductSell.rejected, (state, action) => {
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
      .addCase(fetchScrapProductSellTRForCustomerName.pending, (state, action) => {
        state.sloading = true;
        state.error = null;
      })
      .addCase(
        fetchScrapProductSellTRForCustomerName.fulfilled,
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
        fetchScrapProductSellTRForCustomerName.rejected,
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
        state.ScrapProductSellSearchedById = action.payload;
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

// export const { setSaleSearchedByInvoiceToEmpty } = scrapProductSellSlice.actions;
export default scrapProductSellSlice.reducer;
