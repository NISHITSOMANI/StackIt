import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import RichTextEditor from './RichTextEditor';
import {
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Share,
  Bookmark,
  MoreHorizontal,
  User,
  Clock,
  Send,
  Trash2,
  Edit,
  Check,
  X
} from 'lucide-react';

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [answerText, setAnswerText] = useState('');
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Editing states
  const [editingQuestion, setEditingQuestion] = useState(false);
  const [editingAnswer, setEditingAnswer] = useState(null);
  const [editQuestionTitle, setEditQuestionTitle] = useState('');
  const [editQuestionContent, setEditQuestionContent] = useState('');
  const [editAnswerContent, setEditAnswerContent] = useState('');

  // Vote tracking states
  const [questionUserVote, setQuestionUserVote] = useState(null);
  const [answerUserVotes, setAnswerUserVotes] = useState({});

  // Fetch question data from API
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const questionData = await api.getQuestionById(id);
        console.log('Question data:', questionData);
        console.log('Answers:', questionData.answers);
        setQuestion(questionData);
        setAnswers(questionData.answers || []);

        // Set user vote states from API response
        if (questionData.userVotes) {
          setQuestionUserVote(questionData.userVotes.question || null);

          const answerVotes = {};
          Object.keys(questionData.userVotes).forEach(key => {
            if (key.startsWith('answer_')) {
              const answerId = key.replace('answer_', '');
              answerVotes[answerId] = questionData.userVotes[key];
            }
          });
          setAnswerUserVotes(answerVotes);
        } else {
          setQuestionUserVote(null);
          setAnswerUserVotes({});
        }
      } catch (err) {
        setError('Failed to load question');
        console.error('Error fetching question:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuestion();
    }
  }, [id]);

  const handleVote = async (type, itemId, itemType = 'answer') => {
    try {
      console.log(`Voting ${type} on ${itemType} with ID: ${itemId}`);
      const vote = type === 'up' ? 1 : -1;
      let response;

      if (itemType === 'question') {
        console.log('Voting on question...');
        response = await api.voteQuestion(itemId, vote);
        console.log('Question vote response:', response);
        // Update question votes and user vote state
        setQuestion(prev => ({
          ...prev,
          upvotes: response.upvotes,
          downvotes: response.downvotes
        }));
        setQuestionUserVote(response.userVote);
      } else {
        console.log('Voting on answer...');
        response = await api.voteAnswer(itemId, vote);
        console.log('Answer vote response:', response);
        // Update answer votes and user vote state
        setAnswers(prev => prev.map(answer =>
          answer._id === itemId
            ? { ...answer, upvotes: response.upvotes, downvotes: response.downvotes }
            : answer
        ));
        setAnswerUserVotes(prev => ({
          ...prev,
          [itemId]: response.userVote
        }));
      }
    } catch (err) {
      console.error('Vote failed:', err);
      console.error('Error details:', err.message);
      if (err.message.includes('cannot vote on your own')) {
        alert('You cannot vote on your own content.');
      } else {
        alert('Failed to register vote. Please try again.');
      }
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (window.confirm('Are you sure you want to delete this answer?')) {
      try {
        await api.deleteAnswer(answerId);
        setAnswers(prevAnswers => prevAnswers.filter(answer => answer._id !== answerId));
      } catch (err) {
        console.error('Failed to delete answer:', err);
        alert('Failed to delete answer. Please try again.');
      }
    }
  };

  const handleDeleteQuestion = async () => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await api.deleteQuestion(id);
        navigate('/');
      } catch (err) {
        console.error('Failed to delete question:', err);
        alert('Failed to delete question. Please try again.');
      }
    }
  };

  const handleEditQuestion = () => {
    setEditQuestionTitle(question.title);
    setEditQuestionContent(question.description);
    setEditingQuestion(true);
  };

  const handleSaveQuestion = async () => {
    try {
      await api.updateQuestion(id, {
        title: editQuestionTitle,
        description: editQuestionContent
      });

      setQuestion(prev => ({
        ...prev,
        title: editQuestionTitle,
        description: editQuestionContent
      }));
      setEditingQuestion(false);
    } catch (err) {
      console.error('Failed to update question:', err);
      alert('Failed to update question. Please try again.');
    }
  };

  const handleEditAnswer = (answer) => {
    setEditAnswerContent(answer.content);
    setEditingAnswer(answer._id);
  };

  const handleSaveAnswer = async (answerId) => {
    try {
      await api.updateAnswer(answerId, {
        content: editAnswerContent
      });

      setAnswers(prev => prev.map(answer =>
        answer._id === answerId
          ? { ...answer, content: editAnswerContent }
          : answer
      ));
      setEditingAnswer(null);
    } catch (err) {
      console.error('Failed to update answer:', err);
      alert('Failed to update answer. Please try again.');
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();

    console.log('Submitting answer with text:', answerText);
    console.log('Answer text length:', answerText ? answerText.length : 0);
    console.log('Answer text trimmed length:', answerText ? answerText.trim().length : 0);

    if (answerText.trim()) {
      try {
        console.log('Sending to API:', { content: answerText });
        await api.submitAnswer(id, { content: answerText });

        // Refresh the question to get updated answers
        const updatedQuestion = await api.getQuestionById(id);
        setQuestion(updatedQuestion);
        setAnswers(updatedQuestion.answers || []);

        setAnswerText('');
        setShowAnswerForm(false);
      } catch (err) {
        console.error('Failed to submit answer:', err);
        alert('Failed to submit answer. Please try again.');
      }
    } else {
      console.log('Answer text is empty or too short');
      alert('Please enter an answer with at least 10 characters.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="card">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-secondary-600">Loading question...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="card">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error || 'Question not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Question */}
      <div className="card">
        <div className="flex gap-3 lg:gap-4">
          {/* Voting */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => handleVote('up', question._id, 'question')}
              className={`p-1 lg:p-2 rounded-lg transition-colors ${questionUserVote === 1
                ? 'bg-primary-100 text-primary-600'
                : 'hover:bg-secondary-100 text-secondary-400'
                }`}
              disabled={user && question.user && user.id === question.user._id}
              title={user && question.user && user.id === question.user._id ? "You cannot vote on your own question" : "Upvote"}
            >
              <ArrowUp className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
            <span className="text-base lg:text-lg font-semibold text-secondary-900">
              {(question.upvotes || 0) - (question.downvotes || 0)}
            </span>
            <button
              onClick={() => handleVote('down', question._id, 'question')}
              className={`p-1 lg:p-2 rounded-lg transition-colors ${questionUserVote === -1
                ? 'bg-red-100 text-red-600'
                : 'hover:bg-secondary-100 text-secondary-400'
                }`}
              disabled={user && question.user && user.id === question.user._id}
              title={user && question.user && user.id === question.user._id ? "You cannot vote on your own question" : "Downvote"}
            >
              <ArrowDown className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
          </div>

          {/* Question Content */}
          <div className="flex-1 min-w-0">
            {editingQuestion ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editQuestionTitle}
                    onChange={(e) => setEditQuestionTitle(e.target.value)}
                    className="flex-1 px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSaveQuestion}
                    className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                    title="Save"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingQuestion(false)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <RichTextEditor
                  value={editQuestionContent}
                  onChange={setEditQuestionContent}
                  placeholder="Edit your question content..."
                />
              </div>
            ) : (
              <>
                <h1 className="text-xl lg:text-2xl font-bold text-secondary-900 mb-4">{question.title}</h1>
                {user && question.user && user.id === question.user._id && (
                  <button
                    onClick={handleEditQuestion}
                    className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors"
                    title="Edit Question"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}

                <div className="prose max-w-none mb-6">
                  <div
                    className="rich-text-content"
                    dangerouslySetInnerHTML={{ __html: question.description }}
                  />
                </div>
              </>
            )}

            {/* Question Meta */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-secondary-200 gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-secondary-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{question.user ? question.user.username : 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{question.createdAt ? new Date(question.createdAt).toLocaleDateString() : 'Unknown'}</span>
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
                {user && question.user && user.id === question.user._id && (
                  <button
                    onClick={handleDeleteQuestion}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {question.tags && question.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag.name}
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
              <RichTextEditor
                value={answerText}
                onChange={setAnswerText}
                placeholder="Write your answer here. You can include code snippets, explanations, or any relevant details."
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
        {answers.map((answer) => {
          console.log('Rendering answer:', answer);
          return (
            <div key={answer._id} className="card">
              <div className="flex gap-3 lg:gap-4">
                {/* Voting */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => handleVote('up', answer._id, 'answer')}
                    className={`p-1 lg:p-2 rounded-lg transition-colors ${answerUserVotes[answer._id] === 1
                      ? 'bg-primary-100 text-primary-600'
                      : 'hover:bg-secondary-100 text-secondary-400'
                      }`}
                    disabled={user && answer.user && user.id === answer.user._id}
                    title={user && answer.user && user.id === answer.user._id ? "You cannot vote on your own answer" : "Upvote"}
                  >
                    <ArrowUp className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>
                  <span className="text-base lg:text-lg font-semibold text-secondary-900">
                    {(answer.upvotes || 0) - (answer.downvotes || 0)}
                  </span>
                  <button
                    onClick={() => handleVote('down', answer._id, 'answer')}
                    className={`p-1 lg:p-2 rounded-lg transition-colors ${answerUserVotes[answer._id] === -1
                      ? 'bg-red-100 text-red-600'
                      : 'hover:bg-secondary-100 text-secondary-400'
                      }`}
                    disabled={user && answer.user && user.id === answer.user._id}
                    title={user && answer.user && user.id === answer.user._id ? "You cannot vote on your own answer" : "Downvote"}
                  >
                    <ArrowDown className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>
                  {answer.isAccepted && (
                    <div className="w-5 h-5 lg:w-6 lg:h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>

                {/* Answer Content */}
                <div className="flex-1 min-w-0">
                  {editingAnswer === answer._id ? (
                    <div className="space-y-4">
                      <RichTextEditor
                        value={editAnswerContent}
                        onChange={setEditAnswerContent}
                        placeholder="Edit your answer..."
                      />
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setEditingAnswer(null)}
                          className="btn-secondary"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveAnswer(answer._id)}
                          className="btn-primary"
                        >
                          Save Answer
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="prose max-w-none mb-4">
                        <div
                          className="rich-text-content"
                          dangerouslySetInnerHTML={{ __html: answer.content }}
                        />
                      </div>

                      {user && answer.user && user.id === answer.user._id && (
                        <div className="flex items-center gap-2 mb-4">
                          <button
                            onClick={() => handleEditAnswer(answer)}
                            className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors"
                            title="Edit Answer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAnswer(answer._id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Answer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </>
                  )}

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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionDetail;