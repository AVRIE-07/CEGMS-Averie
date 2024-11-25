import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "../node_modules/bootstrap-icons/font/bootstrap-icons.css";

// Default imports
import Login from "./components/Login";
import Sidebar from "./components/SidebarNav/SidebarNav.jsx";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Profile from "./components/Profile/Profile.jsx";
import Sales from "./components/Sales/Sales.jsx";
import Purchase from "./components/Purchase/Purchase.jsx";
import PaymentHistory from "./components/Purchase/PaymentHistory.jsx";
import Storage from "./components/Storage/Storage.jsx";
import Settings from "./components/Settings/Settings.jsx";
import Password from "./components/Password/Profile.jsx";
import Email from "./components/Email/Profile.jsx";
import Refunded from "./components/Sales/Refunded.jsx";
import Analysis from "./components/Sales/Analysis.jsx";
import CreateTransaction from "./components/Sales/CreateTransaction.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import CreateProducts from "./components/Storage/CreateProducts/CreateProducts.jsx";
import CreateCategory from "./components/Storage/CreateProducts/CreateCategory.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import StockMovement from "./components/Storage/StockMovement.jsx";
import Reports from "./components/Storage/Reports.jsx";

// Employee imports (replacing paths for employee components)
import EmployeeSidebar from "./components/employee/SidebarNav/SidebarNav.jsx";
import EmployeeDashboard from "./components/employee/Dashboard/Dashboard.jsx";
import EmployeeProfile from "./components/employee/Profile/Profile.jsx";
import EmployeeSales from "./components/employee/Sales/Sales.jsx";
import EmployeePurchase from "./components/employee/Purchase/Purchase.jsx";
import EmployeePaymentHistory from "./components/employee/Purchase/PaymentHistory.jsx";
import EmployeeStorage from "./components/employee/Storage/Storage.jsx";
import EmployeeSettings from "./components/employee/Settings/Settings.jsx";
import EmployeePassword from "./components/employee/Password/Profile.jsx";
import EmployeeEmail from "./components/employee/Email/Profile.jsx";
import EmployeeRefunded from "./components/employee/Sales/Refunded.jsx";
import EmployeeAnalysis from "./components/employee/Sales/Analysis.jsx";
import EmployeeCreateTransaction from "./components/employee/Sales/CreateTransaction.jsx";
import EmployeeCreateProducts from "./components/employee/Storage/CreateProducts/CreateProducts.jsx";
import EmployeeCreateCategory from "./components/employee/Storage/CreateProducts/CreateCategory.jsx";
import EmployeeStockMovement from "./components/employee/Storage/StockMovement.jsx";
import EmployeeReports from "./components/employee/Storage/Reports.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Default Routes */}
          <Route path="/sidebar" element={<Sidebar />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/forgotPassword" element={<ForgotPassword />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/email"
            element={
              <ProtectedRoute>
                <Email />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/profile/password" element={<Password />} />
          <Route
            path="/purchase"
            element={
              <ProtectedRoute>
                <Purchase />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-history"
            element={
              <ProtectedRoute>
                <PaymentHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <ProtectedRoute>
                <Sales />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/storage"
            element={
              <ProtectedRoute>
                <Storage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/storage/createProducts"
            element={
              <ProtectedRoute>
                <CreateProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/storage/create-category"
            element={
              <ProtectedRoute>
                <CreateCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales/refunded"
            element={
              <ProtectedRoute>
                <Refunded />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales/analysis"
            element={
              <ProtectedRoute>
                <Analysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales/create-transaction"
            element={
              <ProtectedRoute>
                <CreateTransaction />
              </ProtectedRoute>
            }
          />
          <Route
            path="/storage/stockmovement"
            element={
              <ProtectedRoute>
                <StockMovement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/storage/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* Employee Routes */}
          <Route path="/employee/sidebar" element={<EmployeeSidebar />}></Route>
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/profile/email"
            element={
              <ProtectedRoute>
                <EmployeeEmail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/profile"
            element={
              <ProtectedRoute>
                <EmployeeProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/profile/password"
            element={<EmployeePassword />}
          />
          <Route
            path="/employee/Purchase"
            element={
              <ProtectedRoute>
                <EmployeePurchase />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/payment-history"
            element={
              <ProtectedRoute>
                <EmployeePaymentHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/sales"
            element={
              <ProtectedRoute>
                <EmployeeSales />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/settings"
            element={
              <ProtectedRoute>
                <EmployeeSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/storage"
            element={
              <ProtectedRoute>
                <EmployeeStorage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/storage/createProducts"
            element={
              <ProtectedRoute>
                <EmployeeCreateProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/storage/createCategory"
            element={
              <ProtectedRoute>
                <EmployeeCreateCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/sales/refunded"
            element={
              <ProtectedRoute>
                <EmployeeRefunded />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/sales/analysis"
            element={
              <ProtectedRoute>
                <EmployeeAnalysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/sales/create-transaction"
            element={
              <ProtectedRoute>
                <EmployeeCreateTransaction />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/storage/stockmovement"
            element={
              <ProtectedRoute>
                <EmployeeStockMovement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/storage/reports"
            element={
              <ProtectedRoute>
                <EmployeeReports />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
