import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  productExchangeStockSearchedByProductName: [],
  
  page: 1,
  pages: null,
  toggle: false,
  loading: false, 
  error: null,
};


export const fetchProductExchangeStockByProductName = createAsyncThunk(
  "productExchangeStock/fetchProductExchangeStockByProductName",
  async (query, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/product-exchange/search-by-product-name`,
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

const productExchangeStockSlice = createSlice({
  name: "productExchangeStock",
  initialState,
  reducers: {
      setProductExchangeStockByProductNameToEmpty: (state) => {
        state.productExchangeStockSearchedByProductName = [];
      },
    },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductExchangeStockByProductName.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductExchangeStockByProductName.fulfilled, (state, action) => {
        state.loading = false;
        state.productExchangeStockSearchedByProductName = action.payload;
      })
      .addCase(fetchProductExchangeStockByProductName.rejected, (state, action) => {
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

export const { setProductExchangeStockByProductNameToEmpty } = productExchangeStockSlice.actions;
export default productExchangeStockSlice.reducer;
