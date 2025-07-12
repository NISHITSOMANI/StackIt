import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import {
  Search,
  User,
  LogOut,
  Bell,
  Menu,
  X
} from 'lucide-react';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to dashboard with search query
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowUserMenu(false);
  };

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu')) {
        setShowUserMenu(false);
      }
      if (showNotificationMenu && !event.target.closest('.notification-menu')) {
        setShowNotificationMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu, showNotificationMenu]);

  return (
    <header className="bg-white border-b border-secondary-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Logo and Navigation */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
            StackIt
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-secondary-700 hover:text-primary-600 transition-colors">
              Questions
            </Link>
            <Link to="/ask" className="text-secondary-700 hover:text-primary-600 transition-colors">
              Ask Question
            </Link>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4 lg:w-5 lg:h-5" />
              <input
                type="text"
                placeholder="Search questions or use #tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-8 lg:pl-10 pr-4 py-2 lg:py-2 border border-secondary-300 border-r-0 rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm lg:text-base"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 lg:px-6 py-2 lg:py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-r-lg transition-colors duration-200 text-sm lg:text-base flex items-center gap-2"
            >
              <Search className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <div className="relative notification-menu">
                <button
                  onClick={() => setShowNotificationMenu(!showNotificationMenu)}
                  className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                </button>
                <NotificationDropdown
                  isOpen={showNotificationMenu}
                  onClose={() => setShowNotificationMenu(false)}
                />
              </div>

              {/* User Menu */}
              <div className="relative user-menu">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-bold text-sm">
                      {user?.username ? user.username.substring(0, 2).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <span className="hidden lg:block text-sm font-medium text-secondary-900">
                    {user?.username}
                  </span>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 py-2 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 text-secondary-700 hover:bg-secondary-50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 text-secondary-700 hover:bg-secondary-50 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Auth Buttons */}
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm lg:text-base px-3 lg:px-4 py-2">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm lg:text-base px-3 lg:px-4 py-2">
                  Register
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && !isAuthenticated && (
        <div className="md:hidden mt-4 pt-4 border-t border-secondary-200">
          <nav className="flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setShowMobileMenu(false)}
              className="px-4 py-2 text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setShowMobileMenu(false)}
              className="px-4 py-2 text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors"
            >
              Register
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header; 