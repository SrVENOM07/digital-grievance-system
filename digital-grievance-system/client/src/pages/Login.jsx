import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Landmark, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend strict validations
    if (!email || !EMAIL_REGEX.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result && result.success) {
      if (result.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result?.message || 'Invalid credentials');
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
          
          <div className="text-center mb-8 border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-gray-800">Citizen Login</h2>
            <p className="text-sm text-gray-500 mt-1">Please enter your credentials to access the portal</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm bg-[#FDEDED] border border-[#F5C2C7] text-[#842029] rounded-sm mb-6">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
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

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-gray-700">Password <span className="text-red-500">*</span></label>
                <Link to="/forgot-password" className="text-xs font-semibold text-[#0F4C81] hover:underline">Forgot Password?</Link>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full text-sm gov-input pl-10 pr-4 py-2.5"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 text-sm gov-button-primary flex items-center justify-center space-x-2 mt-4"
            >
              {isSubmitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-xs text-gray-400 font-medium uppercase tracking-wider">Or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            
            <button
              type="button"
              onClick={() => alert('Google Sign-In is currently disabled for this official environment.')}
              className="w-full py-2.5 px-4 text-sm gov-button-secondary flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 text-center">
        <p className="text-xs text-gray-500">
          New to the portal?{' '}
          <Link to="/signup" className="font-semibold text-[#0F4C81] hover:underline">
            Register Here
          </Link>
        </p>
        <p className="text-[10px] text-gray-400 mt-2">© 2026 National Grievance Redressal Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;
