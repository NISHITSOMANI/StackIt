import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowUp, 
  ArrowDown, 
  MessageCircle, 
  Share, 
  Bookmark,
  MoreHorizontal,
  User,
  Clock,
  Eye,
  Send
} from 'lucide-react';

const QuestionDetail = () => {
  const { id } = useParams();
  const [answerText, setAnswerText] = useState('');
  const [showAnswerForm, setShowAnswerForm] = useState(false);

  // Mock question data
  const question = {
    id: 1,
    title: 'How to implement authentication in React with JWT?',
    content: `I'm building a React application and need to implement user authentication using JWT tokens. I've been following some tutorials but I'm having trouble with token storage and refresh logic.

Here's what I've tried so far:

\`\`\`javascript
// Login component
const handleLogin = async (credentials) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  const data = await response.json();
  localStorage.setItem('token', data.token);
};
\`\`\`

The issue is that I'm not sure how to handle token expiration and automatic refresh. Can someone help me with a complete authentication flow?`,
    author: 'John Doe',
    authorAvatar: 'JD',
    votes: 15,
    views: 234,
    time: '2 hours ago',
    tags: ['React', 'JWT', 'Authentication'],
    answers: [
      {
        id: 1,
        content: `Here's a complete solution for JWT authentication in React:

1. **Token Storage**: Use httpOnly cookies instead of localStorage for better security
2. **Token Refresh**: Implement automatic refresh using axios interceptors
3. **Protected Routes**: Create a wrapper component for protected routes

Here's the implementation:

\`\`\`javascript
// authService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const authService = {
  login: async (credentials) => {
    const response = await axios.post(\`\${API_URL}/auth/login\`, credentials);
    return response.data;
  },
  
  refreshToken: async () => {
    const response = await axios.post(\`\${API_URL}/auth/refresh\`);
    return response.data;
  }
};

// Axios interceptor for automatic token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      try {
        await authService.refreshToken();
        return axios.request(error.config);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
\`\`\`

This approach provides better security and user experience.`,
        author: 'Jane Smith',
        authorAvatar: 'JS',
        votes: 8,
        time: '1 hour ago',
        isAccepted: true
      },
      {
        id: 2,
        content: `I'd also recommend using a state management solution like Redux or Context API to manage authentication state across your app. This makes it easier to handle user sessions and logout functionality.`,
        author: 'Mike Johnson',
        authorAvatar: 'MJ',
        votes: 3,
        time: '30 minutes ago',
        isAccepted: false
      }
    ]
  };

  const handleVote = (type, itemId) => {
    console.log(`${type} vote for item ${itemId}`);
  };

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    console.log('Submitting answer:', answerText);
    setAnswerText('');
    setShowAnswerForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Question */}
      <div className="card">
        <div className="flex gap-3 lg:gap-4">
          {/* Voting */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => handleVote('up', question.id)}
              className="p-1 lg:p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <ArrowUp className="w-4 h-4 lg:w-5 lg:h-5 text-secondary-400" />
            </button>
            <span className="text-base lg:text-lg font-semibold text-secondary-900">{question.votes}</span>
            <button
              onClick={() => handleVote('down', question.id)}
              className="p-1 lg:p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <ArrowDown className="w-4 h-4 lg:w-5 lg:h-5 text-secondary-400" />
            </button>
          </div>

          {/* Question Content */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl lg:text-2xl font-bold text-secondary-900 mb-4">{question.title}</h1>
            
            <div className="prose max-w-none mb-6">
              <p className="text-secondary-700 leading-relaxed">{question.content}</p>
            </div>

            {/* Question Meta */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-secondary-200 gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-secondary-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{question.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{question.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{question.views} views</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors">
                  <Share className="w-4 h-4" />
                </button>
                <button className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors">
                  <Bookmark className="w-4 h-4" />
                </button>
                <button className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {question.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Answers Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-secondary-900">
            {question.answers.length} Answer{question.answers.length !== 1 ? 's' : ''}
          </h2>
          <button
            onClick={() => setShowAnswerForm(true)}
            className="btn-primary w-full sm:w-auto"
          >
            Write Answer
          </button>
        </div>

        {/* Answer Form */}
        {showAnswerForm && (
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Your Answer</h3>
            <form onSubmit={handleSubmitAnswer}>
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                rows={6}
                placeholder="Write your answer here..."
                className="input-field resize-none"
                required
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAnswerForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Post Answer
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Answers List */}
        {question.answers.map((answer) => (
          <div key={answer.id} className="card">
            <div className="flex gap-3 lg:gap-4">
              {/* Voting */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => handleVote('up', answer.id)}
                  className="p-1 lg:p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                >
                  <ArrowUp className="w-4 h-4 lg:w-5 lg:h-5 text-secondary-400" />
                </button>
                <span className="text-base lg:text-lg font-semibold text-secondary-900">{answer.votes}</span>
                <button
                  onClick={() => handleVote('down', answer.id)}
                  className="p-1 lg:p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                >
                  <ArrowDown className="w-4 h-4 lg:w-5 lg:h-5 text-secondary-400" />
                </button>
                {answer.isAccepted && (
                  <div className="w-5 h-5 lg:w-6 lg:h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>

              {/* Answer Content */}
              <div className="flex-1 min-w-0">
                <div className="prose max-w-none mb-4">
                  <p className="text-secondary-700 leading-relaxed">{answer.content}</p>
                </div>

                {/* Answer Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-secondary-200 gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-secondary-600">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 lg:w-6 lg:h-6 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-700 font-semibold text-xs">{answer.authorAvatar}</span>
                      </div>
                      <span>{answer.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{answer.time}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors">
                      <Share className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionDetail; 