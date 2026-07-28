import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { Landmark, Lock, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState(null); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (password !== confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match' });
      return;
    }

    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{6,}$/;
    if (!password || !passRegex.test(password)) {
      setStatus({ type: 'error', message: 'Password must be at least 6 characters, with 1 uppercase and 1 special character (!@#$&*)' });
      return;
    }

    setIsSubmitting(true);

    try {
      await API.put(`/auth/resetpassword/${token}`, { password });
      setStatus({ type: 'success', message: 'Password updated successfully! Redirecting to login...' });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Error updating password. The link might be expired.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
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
            <h2 className="text-2xl font-bold text-gray-800">Set New Password</h2>
            <p className="text-sm text-gray-500 mt-1">Please enter your new secure password.</p>
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
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full text-sm gov-input pl-10 pr-4 py-2.5"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm New Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
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
                <span>Updating Password...</span>
              ) : (
                <>
                  <span>Save New Password</span>
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
          <Link to="/login" className="font-semibold text-[#0F4C81] hover:underline">
            Cancel and return to Sign In
          </Link>
        </p>
        <p className="text-[10px] text-gray-400 mt-2">© 2026 National Grievance Redressal Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ResetPassword;
