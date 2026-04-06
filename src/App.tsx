import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";

const MenuPage = lazy(() => import("./pages/MenuPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const EventDetailPage = lazy(() => import("./pages/EventDetailPage"));
const CateringPage = lazy(() => import("./pages/CateringPage"));
const CareersPage = lazy(() => import("./pages/CareersPage"));
const ReservationPage = lazy(() => import("./pages/ReservationPage"));
const OrderPage = lazy(() => import("./pages/OrderPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const AdminSignupPage = lazy(() => import("./pages/AdminSignupPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminMenuPage = lazy(() => import("./pages/admin/AdminMenuPage"));
const AdminBlogPage = lazy(() => import("./pages/admin/AdminBlogPage"));
const AdminEventsPage = lazy(() => import("./pages/admin/AdminEventsPage"));
const AdminReservationsPage = lazy(() => import("./pages/admin/AdminReservationsPage"));
const AdminReservationsPrintPage = lazy(() => import("./pages/admin/AdminReservationsPrintPage"));

const queryClient = new QueryClient();

const loadingFallback = (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const Loading = () => loadingFallback;

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading, session } = useAuth();
  if (loading) return loadingFallback;
  if (!session) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={loadingFallback}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:slug" element={<EventDetailPage />} />
              <Route path="/catering" element={<CateringPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/reservation" element={<ReservationPage />} />
              <Route path="/order" element={<OrderPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/signup" element={<AdminSignupPage />} />
              <Route path="/admin/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/menu" element={<AdminRoute><AdminMenuPage /></AdminRoute>} />
              <Route path="/admin/blog" element={<AdminRoute><AdminBlogPage /></AdminRoute>} />
              <Route path="/admin/events" element={<AdminRoute><AdminEventsPage /></AdminRoute>} />
              <Route path="/admin/reservations" element={<AdminRoute><AdminReservationsPage /></AdminRoute>} />
              <Route path="/admin/reservations/print" element={<AdminRoute><AdminReservationsPrintPage /></AdminRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
