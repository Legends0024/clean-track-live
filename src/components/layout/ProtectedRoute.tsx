import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roles = [],
  redirectTo = '/login',
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </motion.div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location }}
        replace
      />
    );
  }

  // Check role permissions if roles are specified
  if (roles.length > 0 && !roles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    const roleDashboards = {
      cleaner: '/cleaner',
      supervisor: '/supervisor',
      nhai: '/nhai',
    };

    const userDashboard = roleDashboards[user.role];
    
    if (userDashboard && location.pathname !== userDashboard) {
      return <Navigate to={userDashboard} replace />;
    }

    // If no appropriate dashboard found, show access denied
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-background p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center card-glass rounded-2xl p-8 max-w-md w-full"
        >
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Access Denied
          </h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="text-primary hover:text-primary/80 font-medium"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  // Render children if all checks pass
  return <>{children}</>;
};

export default ProtectedRoute;