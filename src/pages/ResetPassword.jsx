import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassword } from '../services/userService';
import { getIcon } from '../utils/iconUtils';

const ArrowLeftIcon = getIcon('arrow-left');
const CheckCircleIcon = getIcon('check-circle');
const AlertCircleIcon = getIcon('alert-circle');
const EyeIcon = getIcon('eye');
const EyeOffIcon = getIcon('eye-off');

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  useEffect(() => {
    if (!token) {
      setTokenError(true);
      setError('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, [token]);

  const validatePassword = (pass) => {
    // At least 8 characters, containing at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(pass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long and contain at least one letter and one number');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await resetPassword(token, password);
      setIsCompleted(true);
      toast.success('Your password has been reset successfully');
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Password reset error:', error);
      setError(error.message || 'Failed to reset password. The link may have expired or is invalid.');
      toast.error('Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-900">
      <div className="w-full max-w-md space-y-8 p-6 bg-white dark:bg-surface-800 rounded-lg shadow-md">
        {tokenError ? (
          <div className="text-center space-y-4">
            <AlertCircleIcon className="w-16 h-16 mx-auto text-red-500" />
            <h2 className="text-2xl font-bold text-surface-800 dark:text-surface-100">Invalid Reset Link</h2>
            <p className="text-surface-600 dark:text-surface-400">{error}</p>
            <Link to="/forgot-password" className="btn-primary inline-block mt-4">Request New Reset Link</Link>
          </div>
        ) : !isCompleted ? (
          <>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-surface-800 dark:text-surface-100">Create New Password</h1>
              <p className="mt-2 text-surface-600 dark:text-surface-400">
                Your new password must be different from previous passwords
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="input-group">
                <label htmlFor="password" className="input-label">New Password</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="input pr-10"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div className="input-group">
                <label htmlFor="confirmPassword" className="input-label">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  className="input"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {error && <p className="input-error">{error}</p>}
              </div>
              
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4">
            <CheckCircleIcon className="w-16 h-16 mx-auto text-secondary" />
            <h2 className="text-2xl font-bold text-surface-800 dark:text-surface-100">Password Reset Complete</h2>
            <p className="text-surface-600 dark:text-surface-400">
              Your password has been reset successfully. You will be redirected to the login page.
            </p>
            <Link to="/login" className="btn-primary inline-block mt-4">Go to Login</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;