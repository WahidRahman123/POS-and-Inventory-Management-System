import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  scrapProducts: [],

  toggle: true,
  createLoading: false,
  loading: false,
  error: null,
};

export const searchForScrapProducts = createAsyncThunk(
  "scrapproduct/searchForScrapProducts",
  async (value, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/scrap-product`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          params: { productName: value },
        },
      );

      return data;
    } catch (error) {
      const message = "Product Fetching Failed!";
      console.log(error);
      return ThunkAPI.rejectWithValue(message);
    }
  },
);

export const createScrapProduct = createAsyncThunk(
  "scrapproduct/createScrapProduct",
  async (product, ThunkAPI) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/scrap-product`,
        product,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );

      return { message: "Item Added Successfully!" };
    } catch (error) {
      const message = "Item Adding Failed!";
      // console.log(error);
      return ThunkAPI.rejectWithValue(message);
    }
  },
);

const scrapProductSlice = createSlice({
  name: "scrapproduct",
  initialState,
  reducers: {
    setScrapProductsBySearchToEmpty: (state) => {
      state.scrapProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchForScrapProducts.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchForScrapProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.scrapProducts = action.payload;
      })
      .addCase(searchForScrapProducts.rejected, (state, action) => {
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

      .addCase(createScrapProduct.pending, (state, action) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createScrapProduct.fulfilled, (state, action) => {
        state.createLoading = false;
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
      .addCase(createScrapProduct.rejected, (state, action) => {
        state.createLoading = false;
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

export const { setScrapProductsBySearchToEmpty } = scrapProductSlice.actions;
export default scrapProductSlice.reducer;
