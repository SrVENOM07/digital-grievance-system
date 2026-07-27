import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Landmark, User, Mail, Phone, Lock, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_REGEX = /^[0-9]{10}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || name.trim() === '') return setError('Please enter your full name');
    if (!email || !EMAIL_REGEX.test(email)) return setError('Please enter a valid email address (e.g., user@domain.com)');
    if (!phone || !PHONE_REGEX.test(phone)) return setError('Phone number must be exactly 10 numerical digits');

    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{6,}$/;
    if (!password || !passRegex.test(password)) return setError('Password must be at least 6 characters, with 1 uppercase and 1 special character (!@#$&*)');

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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-slate-800/80 shadow-2xl relative z-10 space-y-5">
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 shadow-lg shadow-indigo-500/30 mb-1">
            <Landmark className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-slate-100">NIVARAN</h2>
          <p className="text-xs text-slate-400">Jan Shikayat Portal - Create Account</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-xs bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Account Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setRole('USER')} className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${role === 'USER' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm' : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
                <User className="w-3.5 h-3.5" />
                <span>Standard User</span>
              </button>
              <button type="button" onClick={() => setRole('ADMIN')} className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${role === 'ADMIN' ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-sm' : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin (Host)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full text-xs glass-input rounded-xl pl-10 pr-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none" required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@organization.com" className="w-full text-xs glass-input rounded-xl pl-10 pr-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none" required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number (10 Digits)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="tel" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} placeholder="9876543210" className="w-full text-xs glass-input rounded-xl pl-10 pr-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none" required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password (Min 6 chars, 1 Uppercase, 1 Special)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full text-xs glass-input rounded-xl pl-10 pr-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none" required />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-3 px-4 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 active:scale-[0.99] rounded-xl shadow-lg shadow-indigo-600/25 disabled:opacity-50 transition-all flex items-center justify-center space-x-2 mt-2">
            {isSubmitting ? <span>Creating Account...</span> : <><span>Register Account</span><ArrowRight className="w-4 h-4" /></>}
          </button>
          
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-700/50"></div>
            <span className="flex-shrink-0 mx-4 text-[10px] text-slate-500 font-medium uppercase tracking-wider">Or</span>
            <div className="flex-grow border-t border-slate-700/50"></div>
          </div>
          
          <button type="button" onClick={() => alert('Google Sign-In is currently disabled for this demo environment.')} className="w-full py-3 px-4 text-xs font-semibold text-slate-300 bg-slate-900/40 hover:bg-slate-800/60 border border-slate-700/50 rounded-xl transition-all flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800/80">
          <p className="text-xs text-slate-400">
            Already have an account? <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
