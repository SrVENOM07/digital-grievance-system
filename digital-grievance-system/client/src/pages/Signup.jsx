import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Landmark, User, Mail, Phone, Lock, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER'); // USER or ADMIN
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_REGEX = /^[0-9]{10}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Strict Frontend Validations
    if (!name || name.trim() === '') {
      setError('Please enter your full name');
      return;
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      setError('Please enter a valid email address (e.g., user@domain.com)');
      return;
    }

    if (!phone || !PHONE_REGEX.test(phone)) {
      setError('Phone number must be exactly 10 numerical digits');
      return;
    }

    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{6,}$/;
    if (!password || !passRegex.test(password)) {
      setError('Password must be at least 6 characters, with 1 uppercase and 1 special character (!@#$&*)');
      return;
    }

    setIsSubmitting(true);

    const result = await signup({ name, email, phone, password, role });
    setIsSubmitting(false);

    if (result && result.success) {
      if (result.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result?.message || 'Registration failed');
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
            <h2 className="text-2xl font-bold text-gray-800">Citizen Registration</h2>
            <p className="text-sm text-gray-500 mt-1">Create an account to submit and track grievances</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm bg-[#FDEDED] border border-[#F5C2C7] text-[#842029] rounded-sm mb-6">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Picker */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Account Type <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('USER')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 text-sm font-semibold rounded-sm border transition-all ${
                    role === 'USER'
                      ? 'bg-[#E3F2FD] border-[#0F4C81] text-[#0F4C81]'
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Citizen</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 text-sm font-semibold rounded-sm border transition-all ${
                    role === 'ADMIN'
                      ? 'bg-[#E8F5E9] border-[#138808] text-[#138808]'
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Nodal Officer</span>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name as per Aadhaar <span className="text-red-500">*</span></label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full text-sm gov-input pl-10 pr-4 py-2.5"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
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

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
              <div className="relative">
                <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit mobile number"
                  className="w-full text-sm gov-input pl-10 pr-4 py-2.5"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
              <p className="text-[10px] text-gray-500 mb-1">(Min 6 chars, 1 Uppercase, 1 Special)</p>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
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
                <span>Registering...</span>
              ) : (
                <>
                  <span>Complete Registration</span>
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
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-[#0F4C81] hover:underline">
            Login Here
          </Link>
        </p>
        <p className="text-[10px] text-gray-400 mt-2">© 2026 National Grievance Redressal Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Signup;
