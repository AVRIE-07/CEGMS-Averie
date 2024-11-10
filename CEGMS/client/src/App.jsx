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
import ConfirmationPage from "./components/Storage/ConfirmationPage.jsx";
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
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Profile/Email" element={<Email />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Profile/Password" element={<Password />} />
          <Route path="/Purchase" element={<Purchase />} />
          <Route path="/Purchase/Cancelled" element={<Cancelled />} />
          <Route path="/Purchase/Purchase-Order" element={<PurchaseOrder />} />
          <Route path="/Purchase/GRN" element={<GRN />} />
          <Route path="/Purchase/RMA" element={<RMA />} />
          <Route path="/Purchase/Backorder" element={<Backorder />} />
          <Route path="/Payment-History" element={<PaymentHistory />} />
          <Route path="/Sales" element={<Sales />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/Storage" element={<Storage />} />
          <Route path="/Sales/Refunded" element={<Refunded />} />
          <Route path="/Sales/Analysis" element={<Analysis />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route
            path="/Sales/CreateTransaction"
            element={<CreateTransaction />}
          />
          <Route path="/Storage" element={<Storage />} />

          <Route path="/Storage/StockMovement" element={<StockMovement />} />
          <Route path="/Storage/Reports" element={<Reports />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
