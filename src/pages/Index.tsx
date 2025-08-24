import React from 'react';
import { Navigate } from 'react-router-dom';

const Index: React.FC = () => {
  // Redirect to login page - main routing is handled in App.tsx
  return <Navigate to="/login" replace />;
};

export default Index;