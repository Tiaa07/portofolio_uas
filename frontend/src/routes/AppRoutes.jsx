import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import PublicLayout from "../components/layouts/PublicLayout";
import UserLayout from "../components/layouts/UserLayout";
import AdminLayout from "../components/layouts/AdminLayout";

import HomePage from "../pages/public/HomePage";
import AboutPage from "../pages/public/AboutPage";
import ContactPage from "../pages/public/ContactPage";
import TemplatesPage from "../pages/public/TemplatesPage";
import TemplateDetailPage from "../pages/public/TemplateDetailPage";
import PortfolioPublicPage from "../pages/public/PortfolioPublicPage";
import ScrollToTop from "../components/ScrollToTop";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import VerifyOtpPage from "../pages/auth/VerifyOtpPage";

import UserDashboardPage from "../pages/user/UserDashboardPage";
import OrderCreatePage from "../pages/user/OrderCreatePage";
import UserOrdersPage from "../pages/user/UserOrdersPage";
import UserOrderDetailPage from "../pages/user/UserOrderDetailPage";
import UploadPaymentProofPage from "../pages/user/UploadPaymentProofPage";
import UserPortfolioPreviewPage from "../pages/user/UserPortfolioPreviewPage";

import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import AdminOrderDetailPage from "../pages/admin/AdminOrderDetailPage";
import AdminPortfolioEditPage from "../pages/admin/AdminPortfolioEditPage";
import AdminPortfolioPreviewPage from "../pages/admin/AdminPortfolioPreviewPage";

import { getAuthRole, isLoggedIn } from "../utils/auth";

const ProtectedRoute = ({ children, allowedRole }) => {
  const loggedIn = isLoggedIn();
  const role = getAuthRole();

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    if (role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (role === "user") {
      return <Navigate to="/user/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/templates/:id" element={<TemplateDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
        </Route>

        <Route path="/portfolio/:slug" element={<PortfolioPublicPage />} />

        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRole="user">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<UserDashboardPage />} />

          <Route path="templates" element={<TemplatesPage />} />
          <Route path="templates/:id" element={<TemplateDetailPage />} />
          <Route
            path="templates/:id/order/:paket"
            element={<OrderCreatePage />}
          />

          <Route path="orders" element={<UserOrdersPage />} />
          <Route path="orders/:id" element={<UserOrderDetailPage />} />
          <Route
            path="orders/:id/upload-payment-proof"
            element={<UploadPaymentProofPage />}
          />
          <Route
            path="orders/:id/preview-portfolio"
            element={<UserPortfolioPreviewPage />}
          />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders/:id" element={<AdminOrderDetailPage />} />
          <Route
            path="orders/:id/edit-portfolio"
            element={<AdminPortfolioEditPage />}
          />
          <Route
            path="orders/:id/preview-portfolio"
            element={<AdminPortfolioPreviewPage />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
