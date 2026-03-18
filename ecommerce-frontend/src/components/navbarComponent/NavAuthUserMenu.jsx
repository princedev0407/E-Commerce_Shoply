import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLogOut, FiLogIn, FiUserPlus } from 'react-icons/fi';

const NavAuthUserMenu = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Check auth status on mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      setIsLoggedIn(!!token);
      setUserRole(role);
    };

    checkAuth();

    // Listen for storage changes --> in case of logout in another tab
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/login");
    window.location.reload(); // Refresh to clear context states
  };

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-4">
        {userRole === "ADMIN" && (
          <span className="px-2 py-1 text-xs font-bold bg-indigo-600 text-white rounded-full">
            ADMIN
          </span>
        )}
        
        <Link
          to="/profile"
          className="flex items-center gap-1 text-sm font-medium text-white hover:text-indigo-600 transition"
        >
          <FiUser size={18} />
          <span className="hidden sm:inline">Profile</span>
        </Link>

        <button 
          onClick={handleLogout} 
          className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-800 transition cursor-pointer"
        >
          <FiLogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-3'>
      <Link 
        to="/login" 
        className='flex items-center gap-1 text-sm font-medium text-white hover:text-indigo-600 transition'
      >
        <FiLogIn size={18} />
        <span className="hidden sm:inline">Login</span>
      </Link>

      <Link 
        to="/register" 
        className='flex items-center gap-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition'
      >
        <FiUserPlus size={18} />
        <span className="hidden sm:inline">Register</span>
      </Link>
    </div>
  );
}

export default NavAuthUserMenu;