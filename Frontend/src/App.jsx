import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";

const Welcome = lazy(() => import("./pages/Welcome"));
const Login = lazy(() => import("./pages/Auth/Login"));
const AdminLogin = lazy(() => import("./pages/Auth/AdminLogin"));
const Signup = lazy(() => import("./pages/Auth/Signup"));
const ForgotPassword = lazy(() => import("./pages/Auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/Auth/ResetPassword"));
const Checkout = lazy(() => import("./pages/Shop/Checkout"));

const Dashboard = lazy(() => import("./pages/Admin/Dashboard"));
const AddProduct = lazy(() => import("./components/Admin/AddProduct"));
const ManageOrders = lazy(() => import("./pages/Admin/ManageOrders"));

const ProductList = lazy(() => import("./pages/Shop/ProductList"));
const Cart = lazy(() => import("./pages/Shop/Cart"));
const Orders = lazy(() => import("./pages/Shop/Orders"));
const Profile = lazy(() => import("./pages/Shop/Profile"));

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Footer from "./components/Footer";

const ProductPage = lazy(() => import("./pages/Shop/ProductPage"));
const VerifyOTP = lazy(() => import("./pages/Auth/VerifyOTP"));

function App() {
  const location = useLocation();

  const AdminRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    return token && role === "admin" ? children : <Navigate to="/admin/login" />;
  };

  const hideLayout = [
    "/",
    "/login",
    "/admin/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
  ].includes(location.pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-100"><p className="text-gray-600 font-medium">Loading...</p></div>}>
        <Routes>
          {/* Redirect root to login - app starts on login page */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          {/* User routes (protected) */}
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                {" "}
                <ProductList />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <ProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                {" "}
                <Cart />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                {" "}
                <Orders />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                {" "}
                <Profile />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                {" "}
                <Checkout />{" "}
              </ProtectedRoute>
            }
          />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          {/* Admin routes (admin-only) */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/add-product"
            element={
              <AdminRoute>
                {" "}
                <AddProduct />{" "}
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                {" "}
                <ManageOrders />{" "}
              </AdminRoute>
            }
          />
        </Routes>
      </Suspense>
      {!hideLayout && <Footer />}
    </>
  );
}

export default App;
