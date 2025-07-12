import React, { useState } from 'react';
import { 
  Search
} from 'lucide-react';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Here you would implement the actual search functionality
      // For now, we'll just log the search query
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="bg-white border-b border-secondary-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4 lg:w-5 lg:h-5" />
              <input
                type="text"
                placeholder="Search questions, topics, or users..."
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
          {/* Login Button */}
          <button className="btn-primary text-sm lg:text-base px-3 lg:px-4 py-2">
            Login
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 