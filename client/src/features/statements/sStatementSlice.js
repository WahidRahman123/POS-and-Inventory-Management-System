import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  transactions: [],
  totalAmount: null,
  totalPaid: null,
  totalDue: null,
  page: 1,
  pages: null,
  loading: false,
  error: null,
};

export const fetchPurchasesForSupplierName = createAsyncThunk(
  "sstatement/fetchPurchasesForSupplierId",
  async (value, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/supplier/purchaseByName`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          params: value,
        }
      );

      return data;
    } catch (error) {
      const message = "Purchase Fetching Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

const sStatementSlice = createSlice({
  name: "sstatement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchasesForSupplierName.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchasesForSupplierName.fulfilled, (state, action) => {
        state.loading = false;
        // state.page = action.payload.page;
        // state.pages = action.payload.pages;
        state.transactions = action.payload.transactions;
        state.totalAmount = action.payload.totalAmount;
        state.totalPaid = action.payload.totalPaid;
        state.totalDue = action.payload.totalDue;
      })
      .addCase(fetchPurchasesForSupplierName.rejected, (state, action) => {
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
  },
});

// export const { one } = sStatementSlice.actions; //! Baki ase
export default sStatementSlice.reducer;
