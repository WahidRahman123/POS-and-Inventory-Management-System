import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Retrive user info and token from localStorage if available
const userFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  user: userFromStorage,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (userInfo, ThunkAPI) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/users/login`,
        userInfo
      );

      localStorage.setItem("userInfo", JSON.stringify(data.user));
      localStorage.setItem("userToken", data.token);

      return data;
    } catch (error) {
      return ThunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("userToken");
        state.user = null;
    },
    setUserToNull: (state) => {
        state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        toast.error(action.payload.message, {
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

export const { logout, setUserToNull } = authSlice.actions;
export default authSlice.reducer;
