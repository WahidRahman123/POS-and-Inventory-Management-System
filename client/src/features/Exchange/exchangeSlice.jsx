import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  exchanges: [],
  exchangesSearchedByMemo: null,
  page: 1,
  pages: null,
  toggle: false,
  loading: false,
  error: null,
};

export const fetchExchanges = createAsyncThunk(
  "exchange/fetchExchanges",
  async (query, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/product-exchange`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          params: query,
        }
      );

      return data;
    } catch (error) {
      const message = "Exchange Fetching Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

export const addExchange = createAsyncThunk(
  "exchange/addExchange",
  async (value, ThunkAPI) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/product-exchange`,
        value,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      return { message: "Exchange Added Successfully!" };
    } catch (error) {
      let message = "Exchange Adding Failed!";
      if(error.status === 409) message = "Memo Already Existed!"
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchExchangeByMemo = createAsyncThunk(
  "purchase/fetchExchangeByMemo",
  async (query, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/product-exchange/memo`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          params: query,
        }
      );

      return data;
    } catch (error) {
      const message = "Exchange Fetching Failed!";
      console.log(message);
      
      return ThunkAPI.rejectWithValue(message);
    }
  }
);


const exchangeSlice = createSlice({
  name: "exchange",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchExchanges.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExchanges.fulfilled, (state, action) => {
        state.loading = false;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.exchanges = action.payload.exchanges;
      })
      .addCase(fetchExchanges.rejected, (state, action) => {
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
      .addCase(addExchange.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExchange.fulfilled, (state, action) => {
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
      .addCase(addExchange.rejected, (state, action) => {
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
      .addCase(fetchExchangeByMemo.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExchangeByMemo.fulfilled, (state, action) => {
        state.loading = false;
        state.exchangesSearchedByMemo = action.payload;
      })
      .addCase(fetchExchangeByMemo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
  },
});

// export const { setCreatedSalesToNull } = exchangeSlices.actions; //! Baki ase
export default exchangeSlice.reducer;
