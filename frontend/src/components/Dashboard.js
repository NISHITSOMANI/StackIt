import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api, handleApiError } from '../services/api';
import {
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  Search,
  Filter,
  ArrowUp,
  MessageCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Dashboard = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage, setQuestionsPerPage] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    activeUsers: 0,
    answersToday: 0,
    responseTime: '0h'
  });

  // Stats data
  const statsData = [
    { title: 'Total Questions', value: (stats.totalQuestions || 0).toString(), icon: MessageSquare, color: 'text-blue-600' },
    { title: 'Active Users', value: (stats.activeUsers || 0).toString(), icon: Users, color: 'text-green-600' },
    { title: 'Answers Today', value: (stats.answersToday || 0).toString(), icon: TrendingUp, color: 'text-purple-600' },
    { title: 'Response Time', value: stats.responseTime || '0h', icon: Clock, color: 'text-orange-600' },
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'technology', name: 'Technology' },
    { id: 'programming', name: 'Programming' },
    { id: 'design', name: 'Design' },
    { id: 'business', name: 'Business' },
  ];

  // Handle search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);

        // Check if search query contains hashtags
        const hashtagMatches = searchQuery.match(/#(\w+)/g);
        let questionsData;

        if (hashtagMatches && hashtagMatches.length > 0) {
          // Extract tag names from hashtags and clean them
          const tagNames = hashtagMatches.map(tag => tag.substring(1).toLowerCase().trim()); // Remove # symbol and normalize
          console.log('Searching by tags:', tagNames);
          questionsData = await api.getQuestionsByTags(tagNames);
        } else {
          questionsData = await api.getQuestions();
        }

        // Handle the response format from backend
        const questionsArray = questionsData.questions || questionsData || [];
        setQuestions(questionsArray);

        // Update stats based on questions data
        const questionsCount = questionsArray.length;
        setStats({
          totalQuestions: questionsCount,
          activeUsers: Math.floor(questionsCount * 0.3), // Mock calculation
          answersToday: Math.floor(questionsCount * 0.1), // Mock calculation
          responseTime: '2.3h' // Mock data
        });
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [searchQuery]); // Re-fetch when search query changes

  const trendingTopics = [
    { name: 'React Hooks', count: 45 },
    { name: 'TypeScript', count: 38 },
    { name: 'Tailwind CSS', count: 32 },
    { name: 'Node.js', count: 28 },
    { name: 'GraphQL', count: 25 },
  ];

  // Filter questions based on search and category
  const filteredQuestions = Array.isArray(questions) ? questions.filter(question => {
    // If search query contains hashtags, don't do local filtering (already filtered by backend)
    const hashtagMatches = searchQuery.match(/#(\w+)/g);
    if (hashtagMatches && hashtagMatches.length > 0) {
      return true; // Show all questions returned by backend tag search
    }

    // Regular text search
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (question.tags && question.tags.some(tag => tag.name && tag.name.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesSearch;
  }) : [];

  // Calculate pagination
  const totalQuestions = filteredQuestions.length;
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = filteredQuestions.slice(startIndex, endIndex);

  // Handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to first page when search or filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, questionsPerPage]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-secondary-900">Dashboard</h1>
          <p className="text-secondary-600 mt-1">Welcome to StackIt</p>
        </div>
        <Link to="/ask" className="btn-primary w-full sm:w-auto">
          Ask a Question
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statsData.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-secondary-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-secondary-100 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="card">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-secondary-600">Loading questions...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="card">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4 lg:w-5 lg:h-5" />
            <input
              type="text"
              placeholder="Search questions or use #tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-8 lg:pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 lg:w-5 lg:h-5 text-secondary-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field w-full sm:w-auto"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Questions List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-secondary-900">Questions</h2>
            <p className="text-sm text-secondary-600">
              Showing {startIndex + 1}-{Math.min(endIndex, totalQuestions)} of {totalQuestions} questions
            </p>
          </div>
          {currentQuestions.map((question) => (
            <div key={question._id || question.id} className="card hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start gap-3 lg:gap-4">
                <div className="flex flex-col items-center gap-1 min-w-[50px] lg:min-w-[60px]">
                  <button className="flex flex-col items-center p-1 lg:p-2 hover:bg-secondary-100 rounded-lg transition-colors">
                    <ArrowUp className="w-4 h-4 lg:w-5 lg:h-5 text-secondary-400" />
                    <span className="text-xs lg:text-sm font-medium text-secondary-900">0</span>
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/question/${question._id || question.id}`}
                    className="text-base lg:text-lg font-semibold text-secondary-900 hover:text-primary-600 transition-colors line-clamp-2"
                  >
                    {question.title}
                  </Link>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 text-xs lg:text-sm text-secondary-600">
                    <span>by {question.user ? question.user.username : 'Unknown'}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{question.createdAt ? new Date(question.createdAt).toLocaleDateString() : 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-3 lg:gap-4 mt-3">
                    <div className="flex items-center gap-1 text-secondary-600">
                      <MessageCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span className="text-xs lg:text-sm">{question.answers ? question.answers.length : 0} answers</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 lg:gap-2 mt-3">
                    {question.tags && question.tags.map((tag, index) => (
                      <span key={index} className="tag text-xs">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:space-y-6">
          {/* Trending Topics */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Trending Topics</h3>
            <div className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-secondary-50 rounded-lg transition-colors">
                  <span className="font-medium text-secondary-900">{topic.name}</span>
                  <span className="text-sm text-secondary-600">{topic.count} questions</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/ask" className="block w-full btn-primary text-center">
                Ask a Question
              </Link>
              <button className="w-full btn-secondary">
                Browse Categories
              </button>
              <button className="w-full btn-secondary">
                View My Questions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Pagination - Bottom of Page */}
      {totalQuestions > 0 && (
        <div className="mt-8 w-full">
          <div className="bg-white rounded-xl border border-secondary-200 p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Left Side - Info and Page Size */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="text-sm text-secondary-600">
                  Showing <span className="font-semibold text-secondary-900">{startIndex + 1}</span> to{' '}
                  <span className="font-semibold text-secondary-900">{Math.min(endIndex, totalQuestions)}</span> of{' '}
                  <span className="font-semibold text-secondary-900">{totalQuestions}</span> questions
                </div>

                {/* Page Size Selector */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-secondary-600">Show:</label>
                  <select
                    value={questionsPerPage}
                    onChange={(e) => setQuestionsPerPage(Number(e.target.value))}
                    className="px-3 py-1 text-sm border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-secondary-600">per page</span>
                </div>
              </div>

              {/* Right Side - Navigation */}
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  {/* First Page */}
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-10 h-10 text-sm font-medium text-secondary-700 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 hover:border-secondary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    title="First page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <ChevronLeft className="w-4 h-4 -ml-2" />
                  </button>

                  {/* Previous Page */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-10 h-10 text-sm font-medium text-secondary-700 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 hover:border-secondary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    title="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {(() => {
                      const pages = [];
                      const maxVisiblePages = 7;

                      if (totalPages <= maxVisiblePages) {
                        // Show all pages if total is small
                        for (let i = 1; i <= totalPages; i++) {
                          pages.push(i);
                        }
                      } else {
                        // Show first page
                        pages.push(1);

                        if (currentPage > 4) {
                          pages.push('...');
                        }

                        // Show pages around current
                        const start = Math.max(2, currentPage - 1);
                        const end = Math.min(totalPages - 1, currentPage + 1);

                        for (let i = start; i <= end; i++) {
                          if (!pages.includes(i)) {
                            pages.push(i);
                          }
                        }

                        if (currentPage < totalPages - 3) {
                          pages.push('...');
                        }

                        // Show last page
                        if (totalPages > 1) {
                          pages.push(totalPages);
                        }
                      }

                      return pages.map((page, index) => {
                        if (page === '...') {
                          return (
                            <span key={`ellipsis-${index}`} className="px-2 text-secondary-500">
                              ...
                            </span>
                          );
                        }

                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`flex items-center justify-center w-10 h-10 text-sm font-medium rounded-lg transition-all duration-200 ${currentPage === page
                              ? 'bg-primary-600 text-white shadow-md'
                              : 'text-secondary-700 bg-white border border-secondary-300 hover:bg-secondary-50 hover:border-secondary-400'
                              }`}
                          >
                            {page}
                          </button>
                        );
                      });
                    })()}
                  </div>

                  {/* Next Page */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-10 h-10 text-sm font-medium text-secondary-700 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 hover:border-secondary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    title="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Last Page */}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-10 h-10 text-sm font-medium text-secondary-700 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 hover:border-secondary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    title="Last page"
                  >
                    <ChevronRight className="w-4 h-4" />
                    <ChevronRight className="w-4 h-4 -ml-2" />
                  </button>
                </div>
              )}
            </div>

            {/* Quick Jump */}
            {totalPages > 10 && (
              <div className="mt-4 pt-4 border-t border-secondary-200">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-secondary-600">Go to page:</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        handlePageChange(page);
                      }
                    }}
                    className="w-16 px-2 py-1 text-sm border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                  <span className="text-sm text-secondary-600">of {totalPages}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 