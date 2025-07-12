import React, { useState, useRef } from 'react';
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
  Send,
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Smile,
  Image,
  Code,
  Trash2
} from 'lucide-react';

const QuestionDetail = () => {
  const { id } = useParams();
  const [answerText, setAnswerText] = useState('');
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const answerContentRef = useRef(null);
  const [formattingState, setFormattingState] = useState({
    bold: false,
    italic: false,
    strikethrough: false,
    alignment: 'left'
  });
  const [answers, setAnswers] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

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

  const handleDeleteAnswer = (answerId) => {
    if (window.confirm('Are you sure you want to delete this answer?')) {
      setAnswers(prevAnswers => prevAnswers.filter(answer => answer.id !== answerId));
    }
  };

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    
    if (answerText.trim()) {
      const newAnswer = {
        id: Date.now(), // Generate a unique ID
        content: answerText,
        author: 'Current User', // This would come from user authentication
        authorAvatar: 'CU',
        votes: 0,
        time: 'Just now',
        isAccepted: false
      };
      
      setAnswers(prevAnswers => [newAnswer, ...prevAnswers]);
      setAnswerText('');
      setShowAnswerForm(false);
      
      // Clear the rich text editor
      if (answerContentRef.current) {
        answerContentRef.current.innerHTML = '';
      }
    }
  };

  // Rich text editor functions
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    answerContentRef.current.focus();
  };

  const checkFormattingState = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const parentElement = range.commonAncestorContainer.nodeType === 1 
        ? range.commonAncestorContainer 
        : range.commonAncestorContainer.parentElement;
      
      // Check if we're inside a formatted element
      const isBold = document.queryCommandState('bold') || 
                    parentElement?.closest('b, strong') !== null;
      const isItalic = document.queryCommandState('italic') || 
                      parentElement?.closest('i, em') !== null;
      const isStrikethrough = document.queryCommandState('strikeThrough') || 
                             parentElement?.closest('s, strike, del') !== null;
      
      // Check alignment
      let alignment = 'left';
      const alignElement = parentElement?.closest('[style*="text-align"]');
      if (alignElement) {
        const style = window.getComputedStyle(alignElement);
        alignment = style.textAlign || 'left';
      }
      
      setFormattingState({
        bold: isBold,
        italic: isItalic,
        strikethrough: isStrikethrough,
        alignment: alignment
      });
    }
  };

  const formatText = (command) => {
    execCommand(command);
    setAnswerText(answerContentRef.current.innerHTML);
    setTimeout(checkFormattingState, 10);
  };

  const insertList = (type) => {
    if (type === 'bullet') {
      execCommand('insertUnorderedList');
    } else {
      execCommand('insertOrderedList');
    }
    setAnswerText(answerContentRef.current.innerHTML);
    setTimeout(checkFormattingState, 10);
  };

  const setAlignment = (alignment) => {
    execCommand('justify' + alignment.charAt(0).toUpperCase() + alignment.slice(1));
    setAnswerText(answerContentRef.current.innerHTML);
    setTimeout(checkFormattingState, 10);
  };

  const insertLink = () => {
    if (linkText && linkUrl) {
      execCommand('createLink', linkUrl);
      setShowLinkModal(false);
      setLinkUrl('');
      setLinkText('');
      setAnswerText(answerContentRef.current.innerHTML);
    }
  };

  const insertEmoji = (emoji) => {
    execCommand('insertText', emoji);
    setShowEmojiPicker(false);
    setAnswerText(answerContentRef.current.innerHTML);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target.result;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(img);
        }
        
        setAnswerText(answerContentRef.current.innerHTML);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnswerContentChange = () => {
    setAnswerText(answerContentRef.current.innerHTML);
  };

  const handleKeyDown = (e) => {
    // Check for markdown code block syntax
    if (e.key === '`') {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const text = range.toString();
        
        // Check if we have three backticks
        const node = range.startContainer;
        if (node.nodeType === Node.TEXT_NODE) {
          const textContent = node.textContent;
          const cursorPosition = range.startOffset;
          
          // Look for ``` before cursor
          const beforeCursor = textContent.substring(0, cursorPosition);
          const afterCursor = textContent.substring(cursorPosition);
          
          // Check for ``` at the end of beforeCursor
          if (beforeCursor.endsWith('```')) {
            e.preventDefault();
            
            // Remove the ``` from the text
            const newText = beforeCursor.slice(0, -3);
            node.textContent = newText + afterCursor;
            
            // Create code block
            const pre = document.createElement('pre');
            const code = document.createElement('code');
            code.textContent = 'Your code here';
            pre.appendChild(code);
            
            // Insert the code block
            const newRange = document.createRange();
            newRange.setStart(node, newText.length);
            newRange.setEnd(node, newText.length);
            newRange.deleteContents();
            newRange.insertNode(pre);
            
            // Set cursor inside the code block
            const codeRange = document.createRange();
            codeRange.setStart(code, 0);
            codeRange.setEnd(code, 0);
            selection.removeAllRanges();
            selection.addRange(codeRange);
            
            setAnswerText(answerContentRef.current.innerHTML);
            return;
          }
        }
      }
    }
  };

  // Add placeholder functionality and formatting state tracking
  React.useEffect(() => {
    const editor = answerContentRef.current;
    if (editor) {
      const handleFocus = () => {
        if (editor.innerHTML === '' || editor.innerHTML === '<br>') {
          editor.innerHTML = '';
        }
      };
      
      const handleBlur = () => {
        if (editor.innerHTML === '' || editor.innerHTML === '<br>') {
          editor.innerHTML = '';
        }
      };

      const handleSelectionChange = () => {
        checkFormattingState();
      };

      const handleKeyUp = () => {
        checkFormattingState();
      };

      const handleMouseUp = () => {
        checkFormattingState();
      };

      editor.addEventListener('focus', handleFocus);
      editor.addEventListener('blur', handleBlur);
      editor.addEventListener('keyup', handleKeyUp);
      editor.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('selectionchange', handleSelectionChange);
      
      return () => {
        editor.removeEventListener('focus', handleFocus);
        editor.removeEventListener('blur', handleBlur);
        editor.removeEventListener('keyup', handleKeyUp);
        editor.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('selectionchange', handleSelectionChange);
      };
    }
  }, []);

  // Initialize content if needed
  React.useEffect(() => {
    if (answerContentRef.current && answerText) {
      answerContentRef.current.innerHTML = answerText;
    }
  }, []);

  // Initialize answers with mock data
  React.useEffect(() => {
    setAnswers(question.answers);
  }, []);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  // Add CSS for placeholder and code blocks
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      [contenteditable]:empty:before {
        content: attr(data-placeholder);
        color: #9ca3af;
        pointer-events: none;
        position: absolute;
      }
      [contenteditable]:focus:empty:before {
        display: none;
      }
      [contenteditable] pre {
        background-color: #f3f4f6;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        padding: 1rem;
        margin: 0.5rem 0;
        font-family: 'Courier New', monospace;
        font-size: 0.875rem;
        line-height: 1.5;
        overflow-x: auto;
      }
      [contenteditable] code {
        background-color: #f3f4f6;
        border: 1px solid #d1d5db;
        border-radius: 0.25rem;
        padding: 0.125rem 0.25rem;
        font-family: 'Courier New', monospace;
        font-size: 0.875rem;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

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
            {answers.length} Answer{answers.length !== 1 ? 's' : ''}
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
              {/* Rich Text Editor Toolbar */}
              <div className="border border-secondary-300 rounded-t-lg bg-secondary-50 p-3 flex flex-wrap items-center gap-2">
                {/* Text Formatting */}
                <div className="flex items-center gap-1 border-r border-secondary-300 pr-3">
                  <button
                    type="button"
                    onClick={() => formatText('bold')}
                    className={`p-2 rounded-lg transition-colors ${
                      formattingState.bold 
                        ? 'bg-primary-100 text-primary-700 border border-primary-300' 
                        : 'hover:bg-secondary-200'
                    }`}
                    title="Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText('italic')}
                    className={`p-2 rounded-lg transition-colors ${
                      formattingState.italic 
                        ? 'bg-primary-100 text-primary-700 border border-primary-300' 
                        : 'hover:bg-secondary-200'
                    }`}
                    title="Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText('strikeThrough')}
                    className={`p-2 rounded-lg transition-colors ${
                      formattingState.strikethrough 
                        ? 'bg-primary-100 text-primary-700 border border-primary-300' 
                        : 'hover:bg-secondary-200'
                    }`}
                    title="Strikethrough"
                  >
                    <Strikethrough className="w-4 h-4" />
                  </button>
                </div>

                {/* Lists */}
                <div className="flex items-center gap-1 border-r border-secondary-300 pr-3">
                  <button
                    type="button"
                    onClick={() => insertList('bullet')}
                    className="p-2 hover:bg-secondary-200 rounded-lg transition-colors"
                    title="Bullet List"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertList('numbered')}
                    className="p-2 hover:bg-secondary-200 rounded-lg transition-colors"
                    title="Numbered List"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>
                </div>

                {/* Alignment */}
                <div className="flex items-center gap-1 border-r border-secondary-300 pr-3">
                  <button
                    type="button"
                    onClick={() => setAlignment('left')}
                    className={`p-2 rounded-lg transition-colors ${
                      formattingState.alignment === 'left' 
                        ? 'bg-primary-100 text-primary-700 border border-primary-300' 
                        : 'hover:bg-secondary-200'
                    }`}
                    title="Align Left"
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlignment('center')}
                    className={`p-2 rounded-lg transition-colors ${
                      formattingState.alignment === 'center' 
                        ? 'bg-primary-100 text-primary-700 border border-primary-300' 
                        : 'hover:bg-secondary-200'
                    }`}
                    title="Align Center"
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlignment('right')}
                    className={`p-2 rounded-lg transition-colors ${
                      formattingState.alignment === 'right' 
                        ? 'bg-primary-100 text-primary-700 border border-primary-300' 
                        : 'hover:bg-secondary-200'
                    }`}
                    title="Align Right"
                  >
                    <AlignRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Media */}
                <div className="flex items-center gap-1 border-r border-secondary-300 pr-3">
                  <label className="p-2 hover:bg-secondary-200 rounded-lg transition-colors cursor-pointer">
                    <Image className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowLinkModal(true)}
                    className="p-2 hover:bg-secondary-200 rounded-lg transition-colors"
                    title="Insert Link"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 hover:bg-secondary-200 rounded-lg transition-colors"
                    title="Insert Emoji"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                </div>

                {/* Code */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      const pre = document.createElement('pre');
                      const code = document.createElement('code');
                      code.textContent = 'Your code here';
                      pre.appendChild(code);
                      
                      const selection = window.getSelection();
                      if (selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0);
                        range.deleteContents();
                        range.insertNode(pre);
                      }
                      
                      setAnswerText(answerContentRef.current.innerHTML);
                    }}
                    className="p-2 hover:bg-secondary-200 rounded-lg transition-colors"
                    title="Code Block"
                  >
                    <Code className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="border border-secondary-300 bg-white p-3 rounded-b-lg">
                  <div className="grid grid-cols-8 gap-2">
                    {['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🔥', '💡', '✅', '❌', '⚠️', '📝', '🔗', '📷', '💻', '🎯', '🚀', '⭐', '💪', '🎉', '🙏', '👋', '🤝'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => insertEmoji(emoji)}
                        className="p-2 hover:bg-secondary-100 rounded-lg transition-colors text-lg"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Rich Text Editor */}
              <div
                ref={answerContentRef}
                contentEditable
                onInput={handleAnswerContentChange}
                onBlur={handleAnswerContentChange}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 border border-secondary-300 rounded-b-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 min-h-[200px] max-h-[400px] overflow-y-auto"
                style={{ 
                  outline: 'none',
                  lineHeight: '1.6',
                  fontFamily: 'inherit'
                }}
                data-placeholder="Write your answer here. You can include code snippets, explanations, or any relevant details."
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
        {answers.map((answer) => (
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
                  <div 
                    className="text-secondary-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: answer.content }}
                  />
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
                    <button 
                      onClick={() => handleDeleteAnswer(answer.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Answer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  Link Text
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Link text to display"
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowLinkModal(false);
                  setLinkUrl('');
                  setLinkText('');
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertLink}
                className="btn-primary"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionDetail;