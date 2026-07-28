import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, ShieldCheck, User, Landmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0F4C81] border-b border-[#0a355c] px-4 lg:px-8 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center shadow-sm">
            <Landmark className="w-6 h-6 text-[#0F4C81]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-wide">
              NIVARAN
            </h1>
            <p className="text-[10px] text-gray-200 font-medium uppercase tracking-wider">Jan Shikayat Portal</p>
          </div>
        </div>

        {/* User Info & Actions */}
        {user && (
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3 bg-[#0a355c] border border-blue-800 rounded-sm px-3 py-1.5">
              {user.role === 'ADMIN' ? (
                <ShieldCheck className="w-4 h-4 text-[#FF9933]" />
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
              <div className="text-left">
                <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                <span className={`text-[10px] uppercase font-bold tracking-wider ${user.role === 'ADMIN' ? 'text-[#FF9933]' : 'text-gray-300'}`}>
                  {user.role === 'ADMIN' ? 'Nodal Officer' : 'Citizen'}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-white hover:bg-[#D32F2F] border border-transparent hover:border-[#b71c1c] rounded-sm transition-colors"
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
