import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  purchaseReturns: [],
  purchaseReturnSearchById: null,
  page: 1,
  pages: null,
  toggle: false,
  loading: false,
  error: null,
};

export const fetchPurchaseReturn = createAsyncThunk(
  "purchaseReturn/fetchPurchaseReturn",
  async (query, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/purchase-return`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          params: query,
        },
      );

      return data;
    } catch (error) {
      const message = "Purchase Return Fetching Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  },
);

export const addPurchaseReturn = createAsyncThunk(
  "purchaseReturn/addPurchaseReturn",
  async (value, ThunkAPI) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/purchase-return`,
        value,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );

      return { message: "Purchase Return Added Successfully!" };
    } catch (error) {
      let message = "Purchase Return Adding Failed!";
      if (error.status === 409) message = "Memo Already Existed!";
      return ThunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchPurchaseReturnById = createAsyncThunk(
  "purchaseReturn/fetchPurchaseReturnById",
  async (id, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/purchase-return/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );

      return data;
    } catch (error) {
      let message = "Purchase Return Fetching Failed!";
      if (error.status === 409) message = "Invalid Id!";
      return ThunkAPI.rejectWithValue(message);
    }
  },
);

export const addPayment = createAsyncThunk(
  "purchaseReturn/addPayment",
  async (value, ThunkAPI) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/purchase-return/${
          value.id
        }/payment`,
        value.info,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );

      return { message: "Payment updated Successful!" };
    } catch (error) {
      const message = "Payment updated Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  },
);

const purchaseReturnSlice = createSlice({
  name: "purchaseReturn",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseReturn.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseReturn.fulfilled, (state, action) => {
        state.loading = false;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.purchaseReturns = action.payload.purchaseReturns;
      })
      .addCase(fetchPurchaseReturn.rejected, (state, action) => {
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
      .addCase(addPurchaseReturn.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPurchaseReturn.fulfilled, (state, action) => {
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
      .addCase(addPurchaseReturn.rejected, (state, action) => {
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
      .addCase(fetchPurchaseReturnById.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseReturnById.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseReturnSearchById = action.payload;
      })
      .addCase(fetchPurchaseReturnById.rejected, (state, action) => {
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
      });
  },
});

// export const { setCreatedSalesToNull } = purchaseReturnSlice.actions; //! Baki ase
export default purchaseReturnSlice.reducer;
