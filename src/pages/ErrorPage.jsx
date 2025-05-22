import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getIcon } from '../utils/iconUtils';

const AlertTriangleIcon = getIcon('alert-triangle');
const RefreshCwIcon = getIcon('refresh-cw');
const HomeIcon = getIcon('home');
const ArrowLeftIcon = getIcon('arrow-left');
const HelpCircleIcon = getIcon('help-circle');


const ErrorPage = () => {
  const [searchParams] = useSearchParams();
  const errorCode = searchParams.get('code') || 'unknown';
  
  const errorMessage = searchParams.get('message') || 'An error occurred';
  
  // Determine if this is an authentication error
  const isAuthError = errorCode.includes('auth') || 
                     errorMessage.toLowerCase().includes('auth') ||
                     errorMessage.toLowerCase().includes('login') ||
                     errorMessage.toLowerCase().includes('password');
  const getErrorTitle = () => {
    if (isAuthError) return 'Authentication Error';
    if (errorCode === '404') return 'Page Not Found';
    if (errorCode === '403') return 'Access Denied';
    return 'Error Occurred';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-surface-800 rounded-lg shadow-lg text-center">
        <AlertTriangleIcon className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">{getErrorTitle()}</h1>
        <p className="text-surface-700 dark:text-surface-300 mb-6">{errorMessage}</p>
        
        <div className="flex flex-col space-y-3">
          {isAuthError ? (
            <>
              <Link to="/login" className="btn-primary">
                <ArrowLeftIcon className="w-4 h-4 mr-2" /> Return to Login
              </Link>
              <Link to="/forgot-password" className="btn-outline">
                <RefreshCwIcon className="w-4 h-4 mr-2" /> Reset Password
              </Link>
            </>
          ) : (
            <Link to="/" className="btn-primary">
              <HomeIcon className="w-4 h-4 mr-2" /> Return to Home
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
export default ErrorPage;