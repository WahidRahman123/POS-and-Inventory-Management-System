import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counter';
import productReducer from '../features/product/productSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import categoryReducer from '../features/category/categorySlice';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        product: productReducer,
        dashboard: dashboardReducer,
        category: categoryReducer
    }
})