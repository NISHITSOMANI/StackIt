import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  MessageSquare, 
  Plus, 
  Users, 
  Settings, 
  Bookmark,
  TrendingUp,
  Award
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Questions', href: '/questions', icon: MessageSquare },
    { name: 'Ask Question', href: '/ask', icon: Plus },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Trending', href: '/trending', icon: TrendingUp },
    { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
    { name: 'Leaderboard', href: '/leaderboard', icon: Award },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-full lg:w-64 bg-white border-b lg:border-r lg:border-b-0 border-secondary-200 lg:min-h-screen">
      {/* Logo */}
      <div className="p-4 lg:p-6 border-b border-secondary-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-secondary-900">StackIt</h1>
            <p className="text-xs text-secondary-600">Knowledge Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible space-x-4 lg:space-x-0 lg:space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name} className="flex-shrink-0 lg:flex-shrink">
                <Link
                  to={item.href}
                  className={`flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-700 lg:border-r-2 lg:border-r-primary-600'
                      : 'text-secondary-700 hover:bg-secondary-50 hover:text-secondary-900'
                  }`}
                >
                  <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Login Button - Mobile */}
      <div className="lg:hidden p-4 border-t border-secondary-200">
        <button className="w-full btn-primary">
          Login
        </button>
      </div>

      {/* Login Button - Desktop */}
      <div className="hidden lg:block absolute bottom-0 w-64 p-4 border-t border-secondary-200">
        <button className="w-full btn-primary">
          Login
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 