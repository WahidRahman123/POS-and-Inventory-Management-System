import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  suppliers: [],
  suppliersForPurchase: [],
  page: 1,
  pages: null,
  toggle: false,
  loading: false,
  error: null,
};

export const fetchAllSuppliers = createAsyncThunk(
  "supplier/fetchAllSuppliers",
  async (value, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/supplier`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          params: value,
        }
      );

      return data;
    } catch (error) {
      const message = "Supplier Fetching Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

export const addSupplier = createAsyncThunk(
  "supplier/addSupplier",
  async (customer, ThunkAPI) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/supplier`,
        customer,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      return { message: "Supplier Added Successfully!" };
    } catch (error) {
      const message = "Supplier Adding Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSuppliers.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.suppliers = action.payload.suppliers;
      })
      .addCase(fetchAllSuppliers.rejected, (state, action) => {
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
      .addCase(addSupplier.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSupplier.fulfilled, (state, action) => {
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
      .addCase(addSupplier.rejected, (state, action) => {
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

// export const { one } = supplierSlice.actions; //! Baki ase
export default supplierSlice.reducer;
