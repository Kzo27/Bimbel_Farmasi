// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar({ isOpen, onClose, onLogout }) {
  
  const handleLogout = () => {
    onClose(); 
    onLogout();
  };

  const getNavLinkClass = ({ isActive }) => {
    const baseClasses = "flex items-center p-2 rounded-md transition duration-200";
    const activeClasses = "bg-blue-50 text-blue-600 font-semibold";
    const inactiveClasses = "text-gray-600 hover:text-gray-900 hover:bg-gray-100";
    
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <>
      {/* Container utama Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col`}
      >
        <div className="flex items-center justify-center h-16 text-xl font-bold text-gray-800 border-b border-gray-200">
          Tryout App
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLink end to="/" onClick={onClose} className={getNavLinkClass}>
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Dashboard
          </NavLink>
          <NavLink to="/tryouts" onClick={onClose} className={getNavLinkClass}>
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            Manajemen Tryout
          </NavLink>
          <NavLink to="/users" onClick={onClose} className={getNavLinkClass}>
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 016-5.197M15 21a6 6 0 00-9-5.197"></path></svg>
            Manajemen Pengguna
          </NavLink>
          {/* === PENAMBAHAN MENU BARU DI SINI === */}
          <NavLink to="/info" onClick={onClose} className={getNavLinkClass}>
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Manajemen Info
          </NavLink>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-2 text-red-600 hover:bg-red-50 rounded-md transition duration-200"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Logout
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black opacity-50 md:hidden" 
          onClick={onClose}
        ></div>
      )}
    </>
  );
}

Sidebar.defaultProps = {
  isOpen: false,
  onClose: () => {},
  onLogout: () => {},
};

export default Sidebar;