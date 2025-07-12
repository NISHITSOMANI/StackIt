import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Clock, 
  Search,
  Filter,
  ArrowUp,
  Eye,
  MessageCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  // Mock data
  const stats = [
    { title: 'Total Questions', value: '1,234', icon: MessageSquare, color: 'text-blue-600' },
    { title: 'Active Users', value: '567', icon: Users, color: 'text-green-600' },
    { title: 'Answers Today', value: '89', icon: TrendingUp, color: 'text-purple-600' },
    { title: 'Response Time', value: '2.3h', icon: Clock, color: 'text-orange-600' },
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'technology', name: 'Technology' },
    { id: 'programming', name: 'Programming' },
    { id: 'design', name: 'Design' },
    { id: 'business', name: 'Business' },
  ];

  const allQuestions = [
    {
      id: 1,
      title: 'How to implement authentication in React with JWT?',
      author: 'John Doe',
      category: 'Programming',
      votes: 15,
      answers: 3,
      views: 234,
      time: '2 hours ago',
      tags: ['React', 'JWT', 'Authentication']
    },
    {
      id: 2,
      title: 'Best practices for responsive design in 2024',
      author: 'Jane Smith',
      category: 'Design',
      votes: 8,
      answers: 1,
      views: 156,
      time: '4 hours ago',
      tags: ['CSS', 'Responsive', 'Design']
    },
    {
      id: 3,
      title: 'Understanding async/await in JavaScript',
      author: 'Mike Johnson',
      category: 'Programming',
      votes: 22,
      answers: 5,
      views: 445,
      time: '6 hours ago',
      tags: ['JavaScript', 'Async', 'ES6']
    },
    {
      id: 4,
      title: 'How to optimize database queries for better performance?',
      author: 'Sarah Wilson',
      category: 'Technology',
      votes: 12,
      answers: 2,
      views: 189,
      time: '8 hours ago',
      tags: ['Database', 'Performance', 'SQL']
    },
    {
      id: 5,
      title: 'What are the best practices for API design in 2024?',
      author: 'Alex Chen',
      category: 'Technology',
      votes: 18,
      answers: 4,
      views: 312,
      time: '1 day ago',
      tags: ['API', 'REST', 'Design']
    },
    {
      id: 6,
      title: 'How to implement dark mode in React applications?',
      author: 'Emily Davis',
      category: 'Programming',
      votes: 14,
      answers: 2,
      views: 267,
      time: '1 day ago',
      tags: ['React', 'Dark Mode', 'CSS']
    },
    {
      id: 7,
      title: 'Best tools for code review and collaboration',
      author: 'David Brown',
      category: 'Business',
      votes: 9,
      answers: 3,
      views: 178,
      time: '2 days ago',
      tags: ['Code Review', 'Collaboration', 'Tools']
    },
    {
      id: 8,
      title: 'How to handle state management in large React apps?',
      author: 'Lisa Wang',
      category: 'Programming',
      votes: 25,
      answers: 6,
      views: 523,
      time: '2 days ago',
      tags: ['React', 'State Management', 'Redux']
    },
    {
      id: 9,
      title: 'What are the latest trends in UI/UX design?',
      author: 'Mark Taylor',
      category: 'Design',
      votes: 11,
      answers: 2,
      views: 198,
      time: '3 days ago',
      tags: ['UI/UX', 'Design Trends', '2024']
    },
    {
      id: 10,
      title: 'How to implement real-time features with WebSockets?',
      author: 'Rachel Green',
      category: 'Technology',
      votes: 16,
      answers: 3,
      views: 289,
      time: '3 days ago',
      tags: ['WebSockets', 'Real-time', 'JavaScript']
    }
  ];

  const trendingTopics = [
    { name: 'React Hooks', count: 45 },
    { name: 'TypeScript', count: 38 },
    { name: 'Tailwind CSS', count: 32 },
    { name: 'Node.js', count: 28 },
    { name: 'GraphQL', count: 25 },
  ];

  // Filter questions based on search and category
  const filteredQuestions = allQuestions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || question.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
  }, [searchQuery, selectedCategory]);

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
        {stats.map((stat, index) => (
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-secondary-200 gap-4">
              <div className="text-sm text-secondary-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-2 sm:px-3 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>
                
                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const shouldShow = 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    if (shouldShow) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-2 sm:px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            currentPage === page
                              ? 'bg-primary-600 text-white'
                              : 'text-secondary-700 bg-white border border-secondary-300 hover:bg-secondary-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      (page === currentPage - 2 && currentPage > 3) ||
                      (page === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <span key={page} className="px-1 sm:px-2 text-secondary-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-2 sm:px-3 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4 lg:w-5 lg:h-5" />
            <input
              type="text"
              placeholder="Search questions..."
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
            <div key={question.id} className="card hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start gap-3 lg:gap-4">
                <div className="flex flex-col items-center gap-1 min-w-[50px] lg:min-w-[60px]">
                  <button className="flex flex-col items-center p-1 lg:p-2 hover:bg-secondary-100 rounded-lg transition-colors">
                    <ArrowUp className="w-4 h-4 lg:w-5 lg:h-5 text-secondary-400" />
                    <span className="text-xs lg:text-sm font-medium text-secondary-900">{question.votes}</span>
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/question/${question.id}`}
                    className="text-base lg:text-lg font-semibold text-secondary-900 hover:text-primary-600 transition-colors line-clamp-2"
                  >
                    {question.title}
                  </Link>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 text-xs lg:text-sm text-secondary-600">
                    <span>by {question.author}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{question.time}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="tag text-xs">{question.category}</span>
                  </div>
                  <div className="flex items-center gap-3 lg:gap-4 mt-3">
                    <div className="flex items-center gap-1 text-secondary-600">
                      <MessageCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span className="text-xs lg:text-sm">{question.answers} answers</span>
                    </div>
                    <div className="flex items-center gap-1 text-secondary-600">
                      <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span className="text-xs lg:text-sm">{question.views} views</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 lg:gap-2 mt-3">
                    {question.tags.map((tag, index) => (
                      <span key={index} className="tag text-xs">
                        {tag}
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
    </div>
  );
};

export default Dashboard; 