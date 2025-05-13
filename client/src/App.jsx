import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "./App.css";
import "./responsive.css";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import { createContext, useEffect, useState } from "react";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";

import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import ProductUpload from "./pages/ProductUpload";
import Users from "./pages/Users";
import { useAuthStore } from "./store/authStore";
import EmailVerification from "./pages/Auth/EmailVerification";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

//Purchase
import ViewSupplier from "./pages/Supplier/ViewSupplier";
import CreateSupplier from "./pages/Supplier/CreateSupplier";
import PurchaseOrder from "./pages/PurchaseOrder/index";
import GeneratedPO from "./pages/PurchaseOrder/GeneratedPO";
import EditGeneratedPurchaseOrder from "./pages/PurchaseOrder/EditGeneratedPO";
import GeneratePurchaseOrder from "./pages/PurchaseOrder/GeneratePO";
import ArchivedPO from "./pages/PurchaseOrder/ArchivedPO";
import GRN from "./pages/GRN";
import EditGRN from "./pages/GRN/EditGRN";
import ArchivedGRN from "./pages/GRN/ArchivedGRN";
import BackOrder from "./pages/BackOrder";
import EditBackOrder from "./pages/BackOrder/EditBackOrder";
import ArchivedBackOrder from "./pages/BackOrder/ArchivedBackOrder";
import RMA from "./pages/RMA";
import EditRMA from "./pages/RMA/EditRMA";
import ArchivedRMA from "./pages/RMA/ArchivedRMA";
import Reports from "./pages/PurchaseReport";

//Storage Imports
import StockMovement from "./pages/Storage/StockMovement.jsx";
import CreateProducts from "./pages/Storage/CreateProducts/CreateProducts.jsx";
import CreateCategory from "./pages/Storage/CreateProducts/CreateCategory.jsx";
import AddSupplier from "./pages/Storage/CreateProducts/AddSupplier.jsx";
import Storage from "./pages/Storage/Storage.jsx";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  if (!user.isApproved) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated && user.isVerified && user.isApproved) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const MyContext = createContext();

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [isHideSidebarAndHeader, setisHideSidebarAndHeader] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isOpenNav, setIsOpenNav] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const openNav = () => {
    setIsOpenNav(true);
  };

  const values = {
    isToggleSidebar,
    setIsToggleSidebar,
    isHideSidebarAndHeader,
    setisHideSidebarAndHeader,
    theme,
    setTheme,
    windowWidth,
    openNav,
    isOpenNav,
    setIsOpenNav,
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return;

  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={values}>
          {isHideSidebarAndHeader !== true && <Header />}
          <div className="main d-flex">
            {isHideSidebarAndHeader !== true && (
              <>
                <div
                  className={`sidebarOverlay d-none ${
                    isOpenNav === true ? "show" : ""
                  }`}
                  onClick={() => setIsOpenNav(false)}
                ></div>
                <div
                  className={`sidebarWrapper ${
                    isToggleSidebar === true ? "toggle" : ""
                  } ${isOpenNav === true ? "open" : ""}`}
                >
                  <Sidebar />
                </div>
              </>
            )}

            <div
              className={`content ${
                isHideSidebarAndHeader === true ? "full" : ""
              } ${isToggleSidebar === true ? "toggle" : ""}`}
            >
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route
                  path="/login"
                  element={
                    <RedirectAuthenticatedUser>
                      <Login />
                    </RedirectAuthenticatedUser>
                  }
                />
                <Route
                  path="/signUp"
                  element={
                    <RedirectAuthenticatedUser>
                      <SignUp />
                    </RedirectAuthenticatedUser>
                  }
                />
                <Route
                  path="/verify-email"
                  element={
                    <RedirectAuthenticatedUser>
                      <EmailVerification />
                    </RedirectAuthenticatedUser>
                  }
                />
                <Route
                  path="/forgot-password"
                  element={
                    <RedirectAuthenticatedUser>
                      <ForgotPassword />
                    </RedirectAuthenticatedUser>
                  }
                />
                <Route
                  path="/reset-password/:token"
                  element={
                    <RedirectAuthenticatedUser>
                      <ResetPassword />
                    </RedirectAuthenticatedUser>
                  }
                />

                <Route
                  path="*"
                  element={
                    <ProtectedRoute>
                      <Navigate to="/" replace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <ProtectedRoute>
                      <Products />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute>
                      <Users />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/product/details"
                  element={
                    <ProtectedRoute>
                      <ProductDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/product/upload"
                  element={
                    <ProtectedRoute>
                      <ProductUpload />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/supplier/view"
                  element={
                    <ProtectedRoute>
                      <ViewSupplier />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/supplier/create"
                  element={
                    <ProtectedRoute>
                      <CreateSupplier />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/low-stock-products"
                  element={
                    <ProtectedRoute>
                      <PurchaseOrder />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/generated-purchase-orders"
                  element={
                    <ProtectedRoute>
                      <GeneratedPO />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/edit-generated-purchase-order"
                  element={
                    <ProtectedRoute>
                      <EditGeneratedPurchaseOrder />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/generate-purchase-order"
                  element={
                    <ProtectedRoute>
                      <GeneratePurchaseOrder />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/archived-purchase-orders"
                  element={
                    <ProtectedRoute>
                      <ArchivedPO />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/grn"
                  element={
                    <ProtectedRoute>
                      <GRN />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/edit-generated-grn"
                  element={
                    <ProtectedRoute>
                      <EditGRN />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/archived-grn"
                  element={
                    <ProtectedRoute>
                      <ArchivedGRN />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/back-order"
                  element={
                    <ProtectedRoute>
                      <BackOrder />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/edit-generated-back-order"
                  element={
                    <ProtectedRoute>
                      <EditBackOrder />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/archived-back-order"
                  element={
                    <ProtectedRoute>
                      <ArchivedBackOrder />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/rma"
                  element={
                    <ProtectedRoute>
                      <RMA />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/edit-generated-rma"
                  element={
                    <ProtectedRoute>
                      <EditRMA />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/archived-rma"
                  element={
                    <ProtectedRoute>
                      <ArchivedRMA />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <Reports />
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
                  path="/storage/createCategory"
                  element={
                    <ProtectedRoute>
                      <CreateCategory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/storage/addSupplier"
                  element={
                    <ProtectedRoute>
                      <AddSupplier />
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
              </Routes>
            </div>
          </div>
        </MyContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
export { MyContext };
