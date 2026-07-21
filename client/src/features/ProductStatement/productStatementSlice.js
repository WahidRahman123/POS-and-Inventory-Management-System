import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
	productStatementReport: [],
	page: 1,
	pages: null,
	toggle: false,
	loading: false,
	error: null,
};

export const fetchProductStatementReport = createAsyncThunk(
	"productStatement/fetchProductStatementReport",
	async (query, ThunkAPI) => {
		try {
			const { data } = await axios.get(
				`${import.meta.env.VITE_BACKEND_URI}/api/product-statement`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("userToken")}`,
					},
					params: query,
				}
			);
			return data;
		} catch (error) {
			const message = "Fetching Failed!";
			return ThunkAPI.rejectWithValue(message);
		}
	}
);

const productStatementSlice = createSlice({
	name: "productStatement",
	initialState,
	reducers: {
		setProductStatementReportToNull: (state) => {
			state.productStatementReport = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchProductStatementReport.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchProductStatementReport.fulfilled, (state, action) => {
				state.loading = false;
				state.page = action.payload.page;
				state.pages = action.payload.pages;
				state.productStatementReport = action.payload.productStatements;
			})
			.addCase(fetchProductStatementReport.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error;
				toast.error(action.payload, {
					position: "bottom-right",
					autoClose: 3000,
					theme: "colored",
				});
			})
	},
});

export const { setProductStatementReportToNull } = productStatementSlice.actions;
export default productStatementSlice.reducer;