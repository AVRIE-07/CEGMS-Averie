import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "../node_modules/bootstrap-icons/font/bootstrap-icons.css";
import Login from "./components/Login";
import Sidebar from "./components/SidebarNav/SidebarNav.jsx";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Profile from "./components/Profile/Profile.jsx";
import Sales from "./components/Sales/Sales.jsx";
import Purchase from "./components/Purchase/Purchase.jsx";
import Cancelled from "./components/Purchase/Cancelled.jsx";
import PurchaseOrder from "./components/Purchase/PurchasOrder.jsx";
import GRN from "./components/Purchase/GRN.jsx";
import RMA from "./components/Purchase/RMA.jsx";
import Backorder from "./components/Purchase/Backorder.jsx";
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

import StockMovement from "./components/Storage/StockMovement.jsx"; // Adjust the path if needed
import Reports from "./components/Storage/Reports.jsx"; // Adjust the path if needed

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/sidebar" element={<Sidebar />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/ForgotPassword" element={<ForgotPassword />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/" element={<Login />} />
          <Route
            path="/Dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Profile/Email"
            element={
              <ProtectedRoute>
                <Email />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/Profile/Password" element={<Password />} />
          <Route
            path="/Purchase"
            element={
              <ProtectedRoute>
                <Purchase />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Purchase/Cancelled"
            element={
              <ProtectedRoute>
                <Cancelled />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Purchase/Purchase-Order"
            element={
              <ProtectedRoute>
                <PurchaseOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Purchase/GRN"
            element={
              <ProtectedRoute>
                <GRN />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Purchase/RMA"
            element={
              <ProtectedRoute>
                <RMA />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Purchase/Backorder"
            element={
              <ProtectedRoute>
                <Backorder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Payment-History"
            element={
              <ProtectedRoute>
                <PaymentHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Sales"
            element={
              <ProtectedRoute>
                <Sales />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Storage"
            element={
              <ProtectedRoute>
                <Storage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Storage/CreateProducts"
            element={
              <ProtectedRoute>
                <CreateProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Storage/CreateCategory"
            element={
              <ProtectedRoute>
                <CreateCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Sales/Refunded"
            element={
              <ProtectedRoute>
                <Refunded />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Sales/Analysis"
            element={
              <ProtectedRoute>
                <Analysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Sales/CreateTransaction"
            element={
              <ProtectedRoute>
                <CreateTransaction />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Storage"
            element={
              <ProtectedRoute>
                <Storage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/Storage/StockMovement"
            element={
              <ProtectedRoute>
                <StockMovement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Storage/Reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
