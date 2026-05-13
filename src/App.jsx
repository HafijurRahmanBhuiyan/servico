import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Pages
import HomePage from "@/pages/HomePage";
import ServicesPage from "@/pages/ServicesPage";
import ServiceDetailPage from "@/pages/ServiceDetailPage";
import CategoryPage from "@/pages/CategoryPage";
import BookingPage from "@/pages/BookingPage";
import BecomeProviderPage from "@/pages/BecomeProviderPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import DashboardBookingsPage from "@/pages/dashboard/BookingsPage";

// Admin pages
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboardHome from "@/pages/admin/AdminDashboardHome";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminProvidersPage from "@/pages/admin/AdminProvidersPage";
import AdminServicesPage from "@/pages/admin/AdminServicesPage";
import AdminCategoriesPage from "@/pages/admin/AdminCategoriesPage";
import AdminBookingsPage from "@/pages/admin/AdminBookingsPage";
import AdminReviewsPage from "@/pages/admin/AdminReviewsPage";
import AdminPaymentsPage from "@/pages/admin/AdminPaymentsPage";
import AdminPromosPage from "@/pages/admin/AdminPromosPage";
import AdminSettingsPage from "@/pages/admin/AdminSettingsPage";

// Provider pages
import ProviderLayout from "@/pages/provider/ProviderLayout";
import ProviderDashboardHome from "@/pages/provider/ProviderDashboardHome";
import ProviderJobsPage from "@/pages/provider/ProviderJobsPage";
import ProviderSchedulePage from "@/pages/provider/ProviderSchedulePage";
import ProviderEarningsPage from "@/pages/provider/ProviderEarningsPage";
import ProviderReviewsPage from "@/pages/provider/ProviderReviewsPage";
import ProviderProfilePage from "@/pages/provider/ProviderProfilePage";
import ProviderSettingsPage from "@/pages/provider/ProviderSettingsPage";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center px-4">
      <div className="text-8xl">🤷</div>
      <h1 className="mt-6 text-4xl font-black">404</h1>
      <p className="mt-2 text-gray-500">This page doesn't exist.</p>
      <a href="/" className="mt-6 btn-primary px-8 py-3">Go home</a>
    </div>
  );
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}

function AdminProtectedRoute({ children }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) {
    try {
      const stored = JSON.parse(localStorage.getItem("servico_user") || "null");
      if (stored?.role === "admin") return children;
    } catch {}
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

function ProviderProtectedRoute({ children }) {
  const { user, isProvider, providerApplication } = useAuth();
  const hasApplication = !!providerApplication;
  if (!user) {
    try {
      const stored = JSON.parse(localStorage.getItem("servico_user") || "null");
      if (stored?.role === "provider") return children;
    } catch {}
    return <Navigate to="/login?redirect=/provider/dashboard" replace />;
  }
  if (isProvider || hasApplication) return children;
  try {
    const stored = JSON.parse(localStorage.getItem("servico_user") || "null");
    if (stored?.role === "provider") return children;
  } catch {}
  return <Navigate to="/become-provider" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes with Navbar/Footer */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
          <Route path="/service/:id" element={<Layout><ServiceDetailPage /></Layout>} />
          <Route path="/category/:slug" element={<Layout><CategoryPage /></Layout>} />
          <Route path="/booking/:id" element={<Layout><BookingPage /></Layout>} />
          <Route path="/become-provider" element={<Layout><BecomeProviderPage /></Layout>} />
          <Route path="/login" element={<Layout><LoginPage /></Layout>} />
          <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
          <Route path="/forgot-password" element={<Layout><ForgotPasswordPage /></Layout>} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
          <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
          <Route path="/dashboard/bookings" element={<Layout><DashboardBookingsPage /></Layout>} />

          {/* Admin routes - no Navbar/Footer */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
            <Route index element={<AdminDashboardHome />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="providers" element={<AdminProvidersPage />} />
            <Route path="services" element={<AdminServicesPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="reviews" element={<AdminReviewsPage />} />
            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="promos" element={<AdminPromosPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Provider routes - no Navbar/Footer */}
          <Route path="/provider" element={<ProviderProtectedRoute><ProviderLayout /></ProviderProtectedRoute>}>
            <Route path="dashboard" element={<ProviderDashboardHome />} />
            <Route path="jobs" element={<ProviderJobsPage />} />
            <Route path="schedule" element={<ProviderSchedulePage />} />
            <Route path="earnings" element={<ProviderEarningsPage />} />
            <Route path="reviews" element={<ProviderReviewsPage />} />
            <Route path="profile" element={<ProviderProfilePage />} />
            <Route path="settings" element={<ProviderSettingsPage />} />
          </Route>

          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
