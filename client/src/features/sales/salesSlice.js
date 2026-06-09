import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import Decimal from "decimal.js";

const initialState = {
  sales: [],
  salesOfDues: [],

  transactions: [],
  totalAmount: null,
  totalPaid: null,
  totalDue: null,
  customerDue: null,
  currentBalance: null,

  totalSales: null,
  totalCosts: null,
  profit: null,
  createdSales: null,
  saleSearchedById: null,
  // totalSaleCount: 0,
  page: 1,
  pages: null,
  customerPage: 1,
  customerPages: null,
  loading: false,
  error: null,
};

export const fetchSalesByDate = createAsyncThunk(
  "sales/fetchSalesByDate",
  async (query, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/sales/search`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          params: query,
        },
      );

      return data;
    } catch (error) {
      const message = "Sales Fetching Failed!";
      console.log(error.message);
      return ThunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchSalesByIndividualDate = createAsyncThunk(
  "sales/fetchSalesByIndividualDate",
  async (query, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/sales/searchIndividual`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          params: query,
        },
      );

      return data;
    } catch (error) {
      const message = "Sales Fetching Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchSaleById = createAsyncThunk(
  "sales/fetchSaleById",
  async (id, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/sales/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );

      return data;
    } catch (error) {
      const message = "Sales Fetching Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  },
);

export const addSales = createAsyncThunk(
  "sales/addSales",
  async (sales, ThunkAPI) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/sales`,
        sales,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );

      return data;
    } catch (error) {
      const message = "Sales Adding Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  },
);

// export const getTotalSaleCount = createAsyncThunk(
//   "sales/getTotalSaleCount",
//   async (_, ThunkAPI) => {
//     try {
//       const { data } = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URI}/api/sales/getTotalSaleCount`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("userToken")}`,
//           },
//         },
//       );

//       return data;
//     } catch (error) {
//       const message = "Something went wrong!";
//       return ThunkAPI.rejectWithValue(message);
//     }
//   },
// );

export const addPayment = createAsyncThunk(
  "sales/addPayment",
  async (sale, ThunkAPI) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/sales/payment`,
        sale.info,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );

      return { message: "Payment updated Successful!" };
    } catch (error) {
      const message = "Payment updated Failed!";
      // console.log(error);
      return ThunkAPI.rejectWithValue(message);
    }
  },
);

//* This is only for the customer statement
export const fetchSalesForCustomer = createAsyncThunk(
  "sales/fetchSalesForCustomer",
  async (value, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/sales/by-name`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          params: value,
        },
      );

      return data;
    } catch (error) {
      const message = "Fetching Failed!";
      return ThunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchSalesDueList = createAsyncThunk(
  "sales/fetchSalesDueList",
  async (query, ThunkAPI) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/sales/due-list`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          params: query,
        },
      );

      return data;
    } catch (error) {
      const message = "Sales Fetching Failed!";
      console.log(error.message);
      return ThunkAPI.rejectWithValue(message);
    }
  },
);

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    setCreatedSalesToNull: (state) => {
      state.createdSales = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesByDate.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload;
        // state.page = action.payload.page;
        // state.pages = action.payload.pages;
        if (state.sales.length > 0) {
          const totalSale = state.sales.reduce(
            (acc, sale) => acc.plus(new Decimal(sale.total)),
            new Decimal(0),
          );
          const totalCost = state.sales.reduce(
            (acc, sale) => acc.plus(new Decimal(sale.totalCost)),
            new Decimal(0),
          );
          const totalLoan = state.sales.reduce(
            (acc, sale) => acc.plus(new Decimal(sale.loan)),
            new Decimal(0),
          );
          const totalCostPlusLoan = totalCost.plus(totalLoan);

          state.totalSales = totalSale.toFixed(2);
          state.totalCosts = totalCostPlusLoan.toFixed(2);
          state.profit = totalSale.minus(totalCostPlusLoan).lessThan(new Decimal(0))
            ? 0
            : totalSale.minus(totalCostPlusLoan).toFixed(2);
        } else {
          state.totalSales = null;
        }
      })
      .addCase(fetchSalesByDate.rejected, (state, action) => {
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
      .addCase(fetchSalesByIndividualDate.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesByIndividualDate.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload;
        if (state.sales.length > 0) {
          const totalSale = state.sales.reduce(
            (acc, sale) => acc.plus(new Decimal(sale.paid)),
            new Decimal(0),
          );
          const totalCost = state.sales.reduce(
            (acc, sale) => acc.plus(new Decimal(sale.totalCost)),
            new Decimal(0),
          );

          state.totalSales = totalSale.toFixed(2);
          state.totalCosts = totalCost.toFixed(2);
          state.profit = totalSale.minus(totalCost).lessThan(new Decimal(0))
            ? 0
            : totalSale.minus(totalCost).toFixed(2);
        } else {
          state.totalSales = null;
        }
      })
      .addCase(fetchSalesByIndividualDate.rejected, (state, action) => {
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
      .addCase(fetchSaleById.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSaleById.fulfilled, (state, action) => {
        state.loading = false;
        state.saleSearchedById = action.payload;
      })
      .addCase(fetchSaleById.rejected, (state, action) => {
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
      .addCase(addSales.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSales.fulfilled, (state, action) => {
        state.loading = false;
        state.createdSales = action.payload;
      })
      .addCase(addSales.rejected, (state, action) => {
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
      })
      // .addCase(getTotalSaleCount.pending, (state, action) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(getTotalSaleCount.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.totalSaleCount = action.payload;
      // })
      // .addCase(getTotalSaleCount.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.error;
      //   toast.error(action.payload, {
      //     position: "bottom-right",
      //     autoClose: 3000,
      //     hideProgressBar: false,
      //     closeOnClick: false,
      //     pauseOnHover: true,
      //     draggable: true,
      //     progress: undefined,
      //     theme: "colored",
      //   });
      // })
      .addCase(fetchSalesForCustomer.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSalesForCustomer.fulfilled,
        (state, action) => {
          state.loading = false;
          // state.page = action.payload.page;
          // state.pages = action.payload.pages;
          state.transactions = action.payload.transactions;
          state.totalAmount = action.payload.totalAmount;
          state.totalPaid = action.payload.totalPaid;
          state.totalDue = action.payload.totalDue;
          state.currentBalance = action.payload.currentBalance;
        },
      )
      .addCase(
        fetchSalesForCustomer.rejected,
        (state, action) => {
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
        },
      )
      .addCase(fetchSalesDueList.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesDueList.fulfilled, (state, action) => {
        state.loading = false;
        state.salesOfDues = action.payload.customers;
        state.customerPage = action.payload.page;
        state.customerPages = action.payload.pages;
      })
      .addCase(fetchSalesDueList.rejected, (state, action) => {
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
  },
});

export const { setCreatedSalesToNull } = salesSlice.actions; //! Baki ase
export default salesSlice.reducer;
