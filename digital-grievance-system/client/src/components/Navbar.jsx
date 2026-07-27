import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, ShieldCheck, User, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
              Grievance<span className="text-indigo-400">Redressal</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Portal</p>
          </div>
        </div>

        {/* User Info & Actions */}
        {user && (
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3 bg-slate-800/60 border border-slate-700/50 rounded-full px-3.5 py-1.5">
              {user.role === 'ADMIN' ? (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ) : (
                <User className="w-4 h-4 text-indigo-400" />
              )}
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-200 leading-tight">{user.name}</p>
                <span className={`text-[10px] uppercase font-bold tracking-wider ${user.role === 'ADMIN' ? 'text-emerald-400' : 'text-indigo-400'}`}>
                  {user.role}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-red-400 bg-slate-800/40 hover:bg-red-500/10 border border-slate-700/60 hover:border-red-500/30 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
