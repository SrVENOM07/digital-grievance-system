import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { Landmark, Mail, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !EMAIL_REGEX.test(email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address' });
      return;
    }

    setIsSubmitting(true);

    try {
      await API.post('/auth/forgotpassword', { email });
      setStatus({ type: 'success', message: 'If an account exists with this email, a reset link has been sent. Please check your inbox.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Error sending reset email. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col auth-bg">
      {/* Government Header */}
      <div className="gov-header-strip"></div>
      <header className="bg-white border-b border-gray-200 py-4 px-6 md:px-12 flex items-center shadow-sm">
        <Landmark className="w-10 h-10 text-[#0F4C81] mr-3" />
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0F4C81] leading-tight">National Grievance Redressal Portal</h1>
          <p className="text-xs md:text-sm text-gray-500 font-medium">Government of India</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md gov-card p-8">
          
          <div className="text-center mb-6 border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
            <p className="text-sm text-gray-500 mt-1">Enter your email to receive a secure reset link.</p>
          </div>

          {/* Alert */}
          {status && (
            <div className={`flex items-start gap-2 p-3 text-sm rounded-sm mb-6 border ${status.type === 'error' ? 'bg-[#FDEDED] border-[#F5C2C7] text-[#842029]' : 'bg-[#E8F5E9] border-[#C8E6C9] text-[#2E7D32]'}`}>
              {status.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />}
              <span>{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full text-sm gov-input pl-10 pr-4 py-2.5"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 text-sm gov-button-primary flex items-center justify-center space-x-2 mt-4"
            >
              {isSubmitting ? (
                <span>Sending Email...</span>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 text-center mt-auto">
        <p className="text-xs text-gray-500">
          Remembered your password?{' '}
          <Link to="/login" className="font-semibold text-[#0F4C81] hover:underline">
            Back to Sign In
          </Link>
        </p>
        <p className="text-[10px] text-gray-400 mt-2">© 2026 National Grievance Redressal Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ForgotPassword;
