import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Product from "./pages/Product";
import AddItem from "./pages/AddItem";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Category from "./pages/Category";
import AddStock from "./pages/AddStock";
import SalesReport from "./pages/SalesReport";
import UserManagement from "./pages/UserManagement";
import EditProductPage from "./pages/EditProductPage";
import EditCategoryPage from "./pages/EditCategoryPage";
import PointOfSale from "./pages/PointOfSale";
import Home from "./pages/Home";
import ChangePassword from "./pages/ChangePassword";
import InvoicePage from "./pages/InvoicePage";
import LowQuantityProductsPage from "./pages/LowQuantityProductsPage";
import EditDue from "./pages/EditDue";
import Purchase from "./pages/Purchase";
import EditPurchaseDue from "./pages/EditPurchaseDue";
import InvoiceForPurchase from "./pages/invoiceForPurchase";
import Customer from "./pages/Customer";
import Purchaser from "./pages/Purchaser";
import CustomerStatement from "./pages/CustomerStatement";
import PurchaserStatement from "./pages/PurchaserStatement";
import ExpenseManagement from "./pages/ExpenseManagement";
import ProductExchange from "./pages/ProductExchange";
import PurchaseReturn from "./pages/PurchaseReturn";
import PurchaseReturnStatement from "./pages/PurchaseReturnStatement";
import SalesReturn from "./pages/SalesReturn";
import SalesReturnStatement from "./pages/SalesReturnStatement";
import InvoiceForExchange from "./pages/InvoiceForExchange";
import EditPurchaseReturnDue from "./pages/EditPurchaseReturnDue";
import InvoiceForPurchaseReturn from "./pages/InvoiceForPurchaseReturn";
import SalesDueList from "./pages/SalesDueList";
import ProductExchangeStatement from "./pages/ProductExchangeStatement";
import EditSRExchangeDue from "./pages/EditSRExchangeDue";
import EditSRCashDue from "./pages/EditSRCashDue";
import EditPRExchangeDue from "./pages/EditPRExchangeDue";
import EditPRCashDue from "./pages/EditPRCashDue";
import CompanyReturn from "./pages/CompanyReturn";
import CompanyStatement from "./pages/CompanyStatement";
import EditCompanyReturnDue from "./pages/EditCompanyReturnDue";
import CompanySalesReturn from "./pages/CompanySalesReturn";
import CompanySalesReturnStatement from "./pages/CompanySalesReturnStatement";
import EditCompanySalesReturnDue from "./pages/EditCompanySalesReturnDue";
import PurchaseAdvanceSettlement from "./pages/PurchaseAdvanceSettlement";


function App() {
  const { value } = useSelector((state) => state.counter);
  const dispatch = useDispatch();

  return (
      <Routes>
        {/* Login page without layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/invoice" element={<InvoicePage />} />
        <Route path="/invoice-exchange" element={<InvoiceForExchange />} />
        <Route path="/invoice-purchase" element={<InvoiceForPurchase />} />
        <Route path="/invoice-purchase-return" element={<InvoiceForPurchaseReturn />} />


        {/* All other pages with Layout */}
        <Route path="/" element={<Home />}>
          <Route path="/" element={<Dashboard />} />

          <Route path="/category" element={<Category />} />
          <Route path="/category/:id/edit" element={<EditCategoryPage />} />

          <Route path="/product" element={<Product />} />
          <Route path="/product/add" element={<AddItem />} />
          <Route path="/product/:id/edit" element={<EditProductPage />} />
          <Route path="/product/:id/add-stock" element={<AddStock />} />
          <Route path="/product/low-stock" element={<LowQuantityProductsPage />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/purchase-report/:id/edit-due" element={<EditPurchaseDue />} />
          <Route path="/purchase-report/due-payment" element={<EditPurchaseDue />} />
          <Route path="/purchase/:id/adjust-advance-payment" element={<PurchaseAdvanceSettlement />} />
          <Route path="/point-of-sale" element={<PointOfSale />} />
          {/* for admin */}
          <Route path="/sales-report" element={<SalesReport />} />
          <Route path="/sales-report/due-list" element={<SalesDueList />} />
          <Route path="/sales-report/:id/edit-due" element={<EditDue />} />
          {/* for admin */}
          <Route path="/users" element={<UserManagement />} />
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/purchaser" element={<Purchaser />} />
          <Route path="/customer-statement" element={<CustomerStatement />} />
          <Route path="/purchaser-statement" element={<PurchaserStatement />} />
          <Route path="/expense-management" element={<ExpenseManagement />} /> 
          
          <Route path="/product-exchange" element={<ProductExchange />} />
          <Route path="/company-return" element={<CompanyReturn />} />
          <Route path="/company-statement" element={<CompanyStatement />} />
          <Route path="/company-product-return/:id/edit-due" element={<EditCompanyReturnDue />} />

          <Route path="/company-sales-return" element={<CompanySalesReturn />} />
          <Route path="/company-sales-return-statement" element={<CompanySalesReturnStatement />} />
          <Route path="/company-sales-return/:id/edit-due" element={<EditCompanySalesReturnDue />} />


          <Route path="/purchase-return" element={<PurchaseReturn />} />
          <Route path="/purchase-return-statement" element={<PurchaseReturnStatement />} />
          <Route path="/purchase-return/:id/exchange-due" element={<EditPRExchangeDue />} />
          <Route path="/purchase-return/:id/edit-due" element={<EditPRCashDue />} />

          <Route path="/sales-return" element={<SalesReturn />} />
          <Route path="/sales-return-statement" element={<SalesReturnStatement />} />
          <Route path="/sales-return/:id/exchange-due" element={<EditSRExchangeDue />}/>
          <Route path="/sales-return/:id/edit-due" element={<EditSRCashDue />}/>

          <Route path="/product-exchange-statement" element={<ProductExchangeStatement />} />
                   
        </Route>
      </Routes>
  );
}

export default App;
