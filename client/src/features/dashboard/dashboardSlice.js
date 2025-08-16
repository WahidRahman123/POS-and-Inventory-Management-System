import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  dashboardResult: null,
  loading: false,
  error: null,
};

export const fetchDashboardResult = createAsyncThunk(
  "dashboard/fetchDashboardResult",
  async (_, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/dashboard`
      );

      return data;
    } catch (error) {
      const message = "Result Fetching Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardResult.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardResult.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardResult = action.payload;
      })
      .addCase(fetchDashboardResult.rejected, (state, action) => {
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

export const { one } = dashboardSlice.actions; //! Baki ase
export default dashboardSlice.reducer;
