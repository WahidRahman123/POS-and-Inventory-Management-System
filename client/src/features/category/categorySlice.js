import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  categories: [],
  categoryById: {},
  toggle: false,
  loading: false,
  error: null,
};

export const fetchAllCategories = createAsyncThunk(
  "category/fetchAllCategories",
  async (_, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/categories`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      return data;
    } catch (error) {
      const message = "Category Fetching Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchCategoriesWithLimit = createAsyncThunk(
  "category/fetchCategoriesWithLimit",
  async (limit, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/categories/limit`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          params: {
            l: limit,
          },
        }
      );

      return data;
    } catch (error) {
      const message = "Category Fetching Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

export const addCategory = createAsyncThunk(
  "category/addCategory",
  async (category, ThunkAPI) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/categories`,
        category,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      return { message: "Category Added Successfully!" };
    } catch (error) {
      const message = "Category Adding Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async (category, ThunkAPI) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URI}/api/categories/${category.id}`,
        category.info,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      return { message: "Category Updated Successfully!" };
    } catch (error) {
      const message = "Category Updating Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (categoryId, ThunkAPI) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URI}/api/categories/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      return { message: "Category deleted Successfully!" };
    } catch (error) {
      const message = "Category deleted Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchSpecificCategory = createAsyncThunk(
  "category/fetchSpecificCategory",
  async (categoryId, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/categories/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      return data;
    } catch (error) {
      const message = "Category Fetching Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategories.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
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
      .addCase(fetchCategoriesWithLimit.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesWithLimit.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategoriesWithLimit.rejected, (state, action) => {
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
      .addCase(addCategory.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
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
      .addCase(addCategory.rejected, (state, action) => {
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
      .addCase(deleteCategory.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
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
      .addCase(deleteCategory.rejected, (state, action) => {
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
      .addCase(fetchSpecificCategory.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpecificCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryById = action.payload;
      })
      .addCase(fetchSpecificCategory.rejected, (state, action) => {
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
      .addCase(updateCategory.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
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
      .addCase(updateCategory.rejected, (state, action) => {
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

// export const { one } = categorySlice.actions; //! Baki ase
export default categorySlice.reducer;
