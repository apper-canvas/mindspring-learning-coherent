import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { requestPasswordReset } from '../services/userService';
import { getIcon } from '../utils/iconUtils';

const ArrowLeftIcon = getIcon('arrow-left');
const SendIcon = getIcon('send');
const CheckCircleIcon = getIcon('check-circle');

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await requestPasswordReset(email);
      setIsSubmitted(true);
      toast.success('Password reset instructions have been sent to your email');
    } catch (error) {
      console.error('Password reset error:', error);
      setError(error.message || 'Failed to send password reset email. Please try again.');
      toast.error('Failed to send password reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-900">
      <div className="w-full max-w-md space-y-8 p-6 bg-white dark:bg-surface-800 rounded-lg shadow-md">
        {!isSubmitted ? (
          <>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-surface-800 dark:text-surface-100">Reset Password</h1>
              <p className="mt-2 text-surface-600 dark:text-surface-400">
                Enter your email and we'll send you instructions to reset your password
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="input-group">
                <label htmlFor="email" className="input-label">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error && <p className="input-error">{error}</p>}
              </div>
              
              <button
                type="submit"
                className="btn-primary w-full flex justify-center items-center"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : (
                  <>Send Reset Link <SendIcon className="ml-2 w-4 h-4" /></>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4">
            <CheckCircleIcon className="w-16 h-16 mx-auto text-secondary" />
            <h2 className="text-2xl font-bold text-surface-800 dark:text-surface-100">Check Your Email</h2>
            <p className="text-surface-600 dark:text-surface-400">
              We've sent password reset instructions to <span className="font-medium">{email}</span>
            </p>
          </div>
        )}
        
        <Link to="/login" className="block text-center mt-4 text-primary hover:text-primary-dark"><ArrowLeftIcon className="w-4 h-4 inline mr-1" /> Back to Login</Link>
      </div>
    </div>
  );
}

export default ForgotPassword;