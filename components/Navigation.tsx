import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert, Menu, X, Activity, Radio, LayoutDashboard, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Button } from './ui/Button';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <ShieldAlert className="w-4 h-4 mr-2" />, show: true },
    { name: 'Live Feed', path: '/feed', icon: <Activity className="w-4 h-4 mr-2" />, show: true },
    { name: 'Report', path: '/report', icon: <Radio className="w-4 h-4 mr-2" />, show: true },
    { 
      name: 'Dashboard', 
      path: '/admin', 
      icon: <LayoutDashboard className="w-4 h-4 mr-2" />, 
      show: isAuthenticated && user?.role === UserRole.RESPONDER 
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <ShieldAlert className="h-8 w-8 text-emergency-red" />
              <span className="text-xl font-bold tracking-wider text-slate-100">PROMETEO <span className="text-slate-500 text-sm font-normal">2026</span></span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navLinks.filter(l => l.show).map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-slate-800 text-electric-blue border border-slate-700'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                 <div className="flex items-center text-sm text-slate-300">
                    <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 mr-2 overflow-hidden">
                      {user.avatar ? <img src={user.avatar} alt="Avatar" /> : <UserIcon className="h-4 w-4" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-white leading-none">{user.name}</span>
                      <span className="text-xs text-slate-500 mt-0.5">{user.role}</span>
                    </div>
                 </div>
                 <Button variant="ghost" size="sm" onClick={handleLogout}>
                   <LogOut className="h-4 w-4 mr-2" /> Logout
                 </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="primary" size="sm" className="shadow-lg shadow-blue-900/20">
                  <LogIn className="h-4 w-4 mr-2" /> Sign In
                </Button>
              </Link>
            )}
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.filter(l => l.show).map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-slate-800 text-electric-blue'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            
            <div className="border-t border-slate-800 pt-3 mt-2">
              {isAuthenticated && user ? (
                <>
                  <div className="px-3 py-2 flex items-center">
                    <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 mr-3">
                      {user.avatar ? <img src={user.avatar} alt="Avatar" className="rounded-full" /> : <UserIcon className="h-4 w-4" />}
                    </div>
                    <div>
                      <div className="text-base font-medium text-white">{user.name}</div>
                      <div className="text-sm font-medium text-slate-500">{user.email}</div>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full mt-2 flex items-center px-3 py-2 rounded-md text-base font-medium text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-electric-blue hover:text-blue-400 hover:bg-slate-800"
                >
                  <LogIn className="h-4 w-4 mr-2" /> Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
