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
      await API.put(\`/auth/resetpassword/\${token}\`, { password });
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-slate-800/80 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 shadow-lg shadow-indigo-500/30 mb-2">
            <Landmark className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-100">Set New Password</h2>
          <p className="text-xs text-slate-400">Please enter your new secure password.</p>
        </div>

        {status && (
          <div className={\`flex items-start gap-2 p-3 text-xs border rounded-xl animate-in fade-in \${status.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}\`}>
            {status.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> : <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />}
            <span>{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full text-xs glass-input rounded-xl pl-10 pr-3.5 py-3 text-slate-100 placeholder-slate-500 focus:outline-none" required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirm New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full text-xs glass-input rounded-xl pl-10 pr-3.5 py-3 text-slate-100 placeholder-slate-500 focus:outline-none" required />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-3.5 px-4 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 active:scale-[0.99] rounded-xl shadow-lg shadow-indigo-600/25 disabled:opacity-50 transition-all flex items-center justify-center space-x-2">
            {isSubmitting ? <span>Updating Password...</span> : <><span>Save New Password</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800/80">
          <p className="text-xs text-slate-400">
            <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline">
              Cancel and return to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
