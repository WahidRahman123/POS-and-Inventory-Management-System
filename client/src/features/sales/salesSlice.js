import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  sales: [],
  totalSales: null,
  totalCosts: null,
  profit: null,
  createdSales: null,
  saleSearchedById: null,
  totalSaleCount: 0,
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

export const fetchSalesByIndividualDate = createAsyncThunk(
  "sales/fetchSalesByIndividualDate",
  async (query, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/sales/searchIndividual`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          params: {
            searchDate: query,
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

export const fetchSaleById = createAsyncThunk(
  "sales/fetchSaleById",
  async (id, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/sales/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
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

export const getTotalSaleCount = createAsyncThunk(
  "sales/getTotalSaleCount",
  async (_, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/sales/getTotalSaleCount`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      return data;
    } catch (error) {
      const message = "Something went wrong!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

export const addPayment = createAsyncThunk(
  "sales/addPayment",
  async (sale, ThunkAPI) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/sales/${sale.id}/payment`,
        sale.info,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      return { message: "Payment updated Successful!" };
    } catch (error) {
      const message = "Payment updated Failed!";
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
          state.profit =
            state.totalSales - state.totalCosts < 0
              ? 0
              : state.totalSales - state.totalCosts;
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
      .addCase(fetchSalesByIndividualDate.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesByIndividualDate.fulfilled, (state, action) => {
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
          state.profit =
            state.totalSales - state.totalCosts < 0
              ? 0
              : state.totalSales - state.totalCosts;
        } else {
          state.totalSales = null;
        }
      })
      .addCase(fetchSalesByIndividualDate.rejected, (state, action) => {
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
      .addCase(fetchSaleById.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSaleById.fulfilled, (state, action) => {
        state.loading = false;
        state.saleSearchedById = action.payload;
      })
      .addCase(fetchSaleById.rejected, (state, action) => {
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
      })
      .addCase(addPayment.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPayment.fulfilled, (state, action) => {
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
      .addCase(addPayment.rejected, (state, action) => {
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
      }).addCase(getTotalSaleCount.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTotalSaleCount.fulfilled, (state, action) => {
        state.loading = false;
        state.totalSaleCount = action.payload;
      })
      .addCase(getTotalSaleCount.rejected, (state, action) => {
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

export const { setCreatedSalesToNull } = salesSlice.actions; //! Baki ase
export default salesSlice.reducer;
