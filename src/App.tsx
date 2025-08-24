import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { store } from './store/store';

// Import pages and components
import Homepage from './pages/Homepage';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import CleanerDashboard from './features/dashboard/CleanerDashboard';
import SupervisorDashboard from './features/dashboard/SupervisorDashboard';
import NHAIDashboard from './features/dashboard/NHAIDashboard';

// Import layout and lazy-loaded pages
import RootLayout from '@/components/layout/RootLayout';
import {
  LazyPage,
  ProfilePageLazy,
  SettingsPageLazy,
  ReportsPageLazy,
  HelpPageLazy,
  TaskDetailsPageLazy,
} from '@/components/layout/LazyPage';

// Import additional lazy-loaded pages
const SchedulePage = React.lazy(() => import('@/pages/SchedulePage'));
const TeamOverviewPage = React.lazy(() => import('@/pages/TeamOverviewPage'));
const LocationMapPage = React.lazy(() => import('@/pages/LocationMapPage'));
const DocsPage = React.lazy(() => import('@/pages/DocsPage'));

// Loading component for lazy-loaded pages
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

const AppContent: React.FC = () => {
  return (
    <TooltipProvider>
      <AnimatePresence mode="wait">
        <Routes>
          <Route element={<RootLayout />}>
            {/* Public Routes */}
            <Route index element={<Homepage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Role-based Dashboard Routes */}
            <Route
              path="/cleaner/*"
              element={
                <ProtectedRoute roles={['cleaner']}>
                  <CleanerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/supervisor/*"
              element={
                <ProtectedRoute roles={['supervisor']}>
                  <SupervisorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/nhai/*"
              element={
                <ProtectedRoute roles={['nhai']}>
                  <NHAIDashboard />
                </ProtectedRoute>
              }
            />

            {/* Common Protected Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <LazyPage component={ProfilePageLazy} />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <LazyPage component={SettingsPageLazy} />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/help"
              element={
                <ProtectedRoute>
                  <LazyPage component={HelpPageLazy} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tasks/:taskId"
              element={
                <ProtectedRoute>
                  <LazyPage component={TaskDetailsPageLazy} />
                </ProtectedRoute>
              }
            />

            {/* Cleaner-specific Routes */}
            <Route
              path="/cleaner/schedule"
              element={
                <ProtectedRoute roles={['cleaner']}>
                  <Suspense fallback={<LoadingSpinner />}>
                    <SchedulePage />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            {/* Supervisor-specific Routes */}
            <Route
              path="/supervisor/team"
              element={
                <ProtectedRoute roles={['supervisor']}>
                  <Suspense fallback={<LoadingSpinner />}>
                    <TeamOverviewPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/supervisor/map"
              element={
                <ProtectedRoute roles={['supervisor']}>
                  <Suspense fallback={<LoadingSpinner />}>
                    <LocationMapPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            {/* NHAI-specific Routes */}
            <Route
              path="/nhai/reports"
              element={
                <ProtectedRoute roles={['nhai']}>
                  <LazyPage component={ReportsPageLazy} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nhai/docs"
              element={
                <ProtectedRoute roles={['nhai']}>
                  <Suspense fallback={<LoadingSpinner />}>
                    <DocsPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            {/* Dashboard Redirect Route */}
            <Route
              path="/dashboard"
              element={<Navigate to="/login" replace />}
            />

            {/* 404 Route */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-gradient-background p-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center card-glass rounded-2xl p-8 max-w-md w-full"
                  >
                    <div className="text-6xl mb-4">404</div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                      Page Not Found
                    </h1>
                    <p className="text-muted-foreground mb-6">
                      The page you're looking for doesn't exist.
                    </p>
                    <button
                      onClick={() => window.history.back()}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      Go Back
                    </button>
                  </motion.div>
                </div>
              }
            />
          </Route>
        </Routes>
      </AnimatePresence>
      
      <Toaster />
      <Sonner />
    </TooltipProvider>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
};

export default App;