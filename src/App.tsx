import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { store } from './store/store';
import { useAuth } from './hooks/useAuth';

// Import pages and components
import LoginPage from './features/auth/LoginPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import CleanerDashboard from './features/dashboard/CleanerDashboard';
import SupervisorDashboard from './features/dashboard/SupervisorDashboard';
import NHAIDashboard from './features/dashboard/NHAIDashboard';

// App Content Component (needs to be inside Provider)
const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <TooltipProvider>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          
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

          {/* Root Route - Redirect to appropriate dashboard */}
          <Route
            path="/"
            element={
              isAuthenticated && user ? (
                <Navigate to={`/${user.role}`} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
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