import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  exchanges: [], // এটি আপনার আগের করা টেবিল/লিস্ট এবং কাস্টমার স্টেটমেন্টের জন্য
  exchangesSearchedByMemo: [], // এটি শুধুমাত্র POS ড্রপডাউন সার্চের জন্য
  page: 1,
  pages: null,
  toggle: false,
  loading: false,
  error: null,
};

// ১. আগের ফাংশনালিটি: টেবিলের জন্য এক্সচেঞ্জ লিস্ট আনা
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
      return ThunkAPI.rejectWithValue("Exchange Fetching Failed!");
    }
  }
);

// ২. নতুন ফাংশনালিটি: POS ড্রপডাউনের জন্য মেমো সার্চ
// export const fetchExchangeByMemo = createAsyncThunk(
//   "exchange/fetchExchangeByMemo",
//   async (query, ThunkAPI) => {
//     try {
//       const { data } = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URI}/api/product-exchange/memo`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("userToken")}`,
//           },
//           params: query, // এটি আপনার কন্ট্রোলারের req.query.search এ যাবে
//         }
//       );
//       return data; // এটি অ্যারে রিটার্ন করবে
//     } catch (error) {
//       return ThunkAPI.rejectWithValue("Memo Search Failed!");
//     }
//   }
// );
export const fetchExchangeByMemo = createAsyncThunk(
  "exchange/fetchExchangeByMemo",
  async (inputValue, ThunkAPI) => {
    try {
      // ১. টোকেনটি চেক করুন (নিশ্চিত হয়ে নিন আপনার localStorage এ কি নামে টোকেন আছে)
      const token = localStorage.getItem("userToken"); 

      if (!token) {
        console.error("Token missing in LocalStorage!");
        return ThunkAPI.rejectWithValue("Session expired. Please login again.");
      }

      const backendUrl = import.meta.env.VITE_BACKEND_URI || "http://localhost:4000";
      
      const { data } = await axios.get(
        `${backendUrl}/api/product-exchange/search/memo`,
        {
          headers: { 
            // ২. নিশ্চিত করুন Bearer এবং token এর মাঝে একটি স্পেস আছে
            Authorization: `Bearer ${token}` 
          },
          params: { search: inputValue },
        }
      );
      
      console.log("Memo Response:", data); // ডাটা আসলে কনসোলে দেখাবে
      return data;
    } catch (error) {
      // যদি ৪০১ এরর আসে (Unauthorized), তার মানে টোকেন এক্সপায়ার হয়েছে
      if (error.response && error.response.status === 401) {
        return ThunkAPI.rejectWithValue("Not authorized, please login again.");
      }
      return ThunkAPI.rejectWithValue("Memo Search Failed!");
    }
  }
);
// ৩. এক্সচেঞ্জ ক্রিয়েট করা
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
      if (error.response?.status === 409) {
        message = "Memo Already Existed!";
      }
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

const exchangeSlice = createSlice({
  name: "exchange",
  initialState,
  reducers: {
    setExchangesToEmpty: (state) => {
      state.exchanges = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchExchanges (টেবিল লজিক ঠিক রাখার জন্য)
      .addCase(fetchExchanges.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExchanges.fulfilled, (state, action) => {
        state.loading = false;
        state.exchanges = action.payload.exchanges; // আপনার টেবিল ডেটা
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      
      // fetchExchangeByMemo (POS ড্রপডাউন সার্চের জন্য আলাদা স্টেট)
      .addCase(fetchExchangeByMemo.fulfilled, (state, action) => {
        state.loading = false;
        state.exchangesSearchedByMemo = action.payload; // ডাটা আলাদা থাকলো, টেবিল হারাবে না
      })

      .addCase(addExchange.fulfilled, (state, action) => {
        state.loading = false;
        state.toggle = !state.toggle;
        toast.success(action.payload.message);
      })
      
      // কমন রিজেক্টেড হ্যান্ডলার
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
          if (action.payload) {
            toast.error(action.payload);
          }
        }
      );
  },
});

export const { setExchangesToEmpty } = exchangeSlice.actions;
export default exchangeSlice.reducer;