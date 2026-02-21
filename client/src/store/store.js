import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counter';
import productReducer from '../features/product/productSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import categoryReducer from '../features/category/categorySlice';
import salesReducer from '../features/sales/salesSlice';
import userReducer from '../features/user/userSlice';
import authReducer from '../features/user/authSlice';
import purchaseReducer from '../features/purchase/purchaseSlice';
import customerReducer from '../features/customer/customerSlice';
import supplierReducer from '../features/supplier/supplierSlice';
import sStatementReducer from '../features/statements/sStatementSlice';
import exchangeReducer from '../features/Exchange/exchangeSlice';
import purchaseReturnReducer from '../features/PurchaseReturn/purchaseReturnSlice';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        product: productReducer,
        dashboard: dashboardReducer,
        category: categoryReducer,
        sales: salesReducer,
        user: userReducer,
        auth: authReducer,
        purchase: purchaseReducer,
        customer: customerReducer,
        supplier: supplierReducer,
        sstatement: sStatementReducer,
        exchange: exchangeReducer,
        purchaseReturn: purchaseReturnReducer
    }
})