import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URI;

const initialState = {
  expenses: [],
  totalExpense: 0,
  loading: false,
  error: null,
  page: 1,
  pages: 1,
};

export const fetchExpenses = createAsyncThunk(
  'expense/fetchExpenses',
  async ({ page = 1, dateSearch = "" }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/expense`, {
        params: { page, dateSearch },
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch");
    }
  }
);

export const addMultipleExpenses = createAsyncThunk(
  'expense/addMultipleExpenses',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/expense/multiple`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      
      // ✅ Important: Refresh list and total after successful add
      dispatch(fetchExpenses({ page: 1, dateSearch: "" }));
      dispatch(getTotalExpense());
      
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add");
    }
  }
);

export const getTotalExpense = createAsyncThunk(
  'expense/getTotalExpense',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/expense/total`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      return data.totalExpense;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch total");
    }
  }
);

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => { state.loading = true; })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload.expenses || [];
        state.page = action.payload.page || 1;
        state.pages = action.payload.pages || 1;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addMultipleExpenses.pending, (state) => { state.loading = true; })
      .addCase(addMultipleExpenses.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addMultipleExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getTotalExpense.fulfilled, (state, action) => {
        state.totalExpense = action.payload;
      });
  },
});

export default expenseSlice.reducer;