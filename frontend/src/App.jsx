import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import AppLayout from './layouts/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BooksPage from './pages/BooksPage';
import ReportsPage from './pages/ReportsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ReservationsPage from './pages/ReservationsPage';
import NotificationsPage from './pages/NotificationsPage';
import ChatbotPage from './pages/ChatbotPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function HomeRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />;
}

function AppShell({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login/admin" element={<LoginPage expectedRole="ADMIN" />} />
      <Route path="/login/librarian" element={<LoginPage expectedRole="LIBRARIAN" />} />
      <Route path="/login/student" element={<LoginPage expectedRole="STUDENT" />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<AppShell><DashboardPage /></AppShell>} />
      <Route path="/books" element={<AppShell><BooksPage /></AppShell>} />
      <Route path="/reports" element={<AppShell><ReportsPage /></AppShell>} />
      <Route path="/analytics" element={<AppShell><AnalyticsPage /></AppShell>} />
      <Route path="/reservations" element={<AppShell><ReservationsPage /></AppShell>} />
      <Route path="/notifications" element={<AppShell><NotificationsPage /></AppShell>} />
      <Route path="/chatbot" element={<AppShell><ChatbotPage /></AppShell>} />
      <Route path="/profile" element={<AppShell><ProfilePage /></AppShell>} />
      <Route path="/settings" element={<AppShell><SettingsPage /></AppShell>} />
      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/'} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}
