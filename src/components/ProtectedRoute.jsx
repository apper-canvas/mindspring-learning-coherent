import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useSelector(state => state.user);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  // User is authenticated, render the protected component
  return element;
};

export default ProtectedRoute;
