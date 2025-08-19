import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  users: [],
  toggle: false,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (_, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      return data;
    } catch (error) {
      const message = "User Fetching Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

export const addUser = createAsyncThunk(
  "user/addUser",
  async (userInfo, ThunkAPI) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/users`,
        userInfo,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      return { message: "User Added Successfully!" };
    } catch (error) {
      const message = "User Adding Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId, ThunkAPI) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URI}/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      return { message: "User Deleted Successfully!" };
    } catch (error) {
      const message = "User Deleting Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  "user/changeUserPassword",
  async (user, ThunkAPI) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/users/${
          user.id
        }/changepassword`,
        user.info,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      return data;
    } catch (error) {
      if (error.response) {
        return ThunkAPI.rejectWithValue(error.response.data);
      }
      return ThunkAPI.rejectWithValue({ message: "Something Went Wrong!" });
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
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
      .addCase(deleteUser.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
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
      .addCase(deleteUser.rejected, (state, action) => {
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
      .addCase(addUser.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
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
      .addCase(addUser.rejected, (state, action) => {
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
      .addCase(changeUserPassword.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeUserPassword.fulfilled, (state, action) => {
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
      .addCase(changeUserPassword.rejected, (state, action) => {
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

// export const { one } = userSlice.actions;
export default userSlice.reducer;
