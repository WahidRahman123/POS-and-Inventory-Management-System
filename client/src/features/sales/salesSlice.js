import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  sales: [],
  totalSales: null,
  totalCosts: null,
  profit: null,
  createdSales: null,
  loading: false,
  error: null,
};

export const fetchSalesByDate = createAsyncThunk(
  "sales/fetchSalesByDate",
  async (query, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/sales/search`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          params: {
            d: query,
          },
        }
      );

      return data;
    } catch (error) {
      const message = "Sales Fetching Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

export const addSales = createAsyncThunk(
  "sales/addSales",
  async (sales, ThunkAPI) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/sales`,
        sales,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      return data;
    } catch (error) {
      const message = "Sales Adding Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    setCreatedSalesToNull: (state) => {
      state.createdSales = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesByDate.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload;
        if (state.sales.length > 0) {
          const totalSale = state.sales.reduce(
            (acc, sale) => acc + sale.paid,
            0
          );
          const totalCost = state.sales.reduce(
            (acc, sale) => acc + sale.totalCost,
            0
          );
          
          state.totalSales = totalSale;
          state.totalCosts = totalCost;
          state.profit = state.totalSales - state.totalCosts;
        } else {
          state.totalSales = null;
        }
      })
      .addCase(fetchSalesByDate.rejected, (state, action) => {
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
      .addCase(addSales.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSales.fulfilled, (state, action) => {
        state.loading = false;
        state.createdSales = action.payload;
      })
      .addCase(addSales.rejected, (state, action) => {
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

export const { setCreatedSalesToNull } = salesSlice.actions; //! Baki ase
export default salesSlice.reducer;
