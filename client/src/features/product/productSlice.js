import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  products: [],
  productSearchedById: {
    name: "",
    sellPrice: 0,
    costPrice: 0,
    quantity: 1,
    category: "",
  },
  deleteToggle: true,
  loading: false,
  error: null,
};

export const fetchAllProducts = createAsyncThunk(
  "product/fetchAllProducts",
  async (limit, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/products`,
        {
          params: {
            l: limit,
          },
        }
      );

      return data;
    } catch (error) {
      const message = "Product Fetching Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

export const searchProducts = createAsyncThunk(
  "product/searchProducts",
  async (query, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/products/search`,
        {
          params: {
            q: query,
          },
        }
      );

      return data;
    } catch (error) {
      const message = "Product Fetching Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (product, ThunkAPI) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/products`,
        product
      );

      return data;
    } catch (error) {
      const message = "Item Adding Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (productId, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/products/${productId}`
      );

      return data;
    } catch (error) {
      const message = "Product Fetching Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async (product, ThunkAPI) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URI}/api/products/${product.id}`,
        product.item
      );

      return { message: "Item Updated Successfully!" };
    } catch (error) {
      const message = "Item Update Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (productId, ThunkAPI) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URI}/api/products/${productId}`
      );

      return { message: "Item deleted Successfully!" };
    } catch (error) {
      const message = "Item delete Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

export const addStock = createAsyncThunk(
  "product/addStock",
  async (product, ThunkAPI) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/products/addstock/${product.id}`,
        product.info
      );

      return { message: "Add Stock Successful!" };
    } catch (error) {
      const message = "Add Stock Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
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
      .addCase(searchProducts.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
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
      .addCase(addProduct.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
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
      .addCase(addProduct.rejected, (state, action) => {
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
      .addCase(fetchProductById.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.productSearchedById = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
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
      .addCase(updateProduct.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
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
      .addCase(updateProduct.rejected, (state, action) => {
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
      .addCase(deleteProduct.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteToggle = !state.deleteToggle;
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
      .addCase(deleteProduct.rejected, (state, action) => {
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
      .addCase(addStock.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStock.fulfilled, (state, action) => {
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
      .addCase(addStock.rejected, (state, action) => {
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

export const { setProductSearchedById } = productSlice.actions; //! Baki ase
export default productSlice.reducer;
