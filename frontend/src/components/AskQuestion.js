import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, handleApiError } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import RichTextEditor from './RichTextEditor';
import {
  ArrowLeft,
  Tag,
  Send
} from 'lucide-react';

const AskQuestion = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);

  const categories = [
    { id: 'technology', name: 'Technology' },
    { id: 'programming', name: 'Programming' },
    { id: 'design', name: 'Design' },
    { id: 'business', name: 'Business' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'productivity', name: 'Productivity' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Fetch available tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await api.getTags();
        setAvailableTags(tags);
      } catch (err) {
        console.error('Failed to fetch tags:', err);
      }
    };
    fetchTags();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.createQuestion({
        title: formData.title,
        description: formData.content,
        tags: formData.tags
      });

      navigate(`/question/${response.questionId}`);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="card">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-secondary-900 mb-2">Login Required</h2>
            <p className="text-secondary-600 mb-4">You need to be logged in to ask a question.</p>
            <button
              onClick={() => navigate('/login')}
              className="btn-primary"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-secondary-900">Ask a Question</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="card">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="card">
          <label htmlFor="title" className="block text-sm font-medium text-secondary-900 mb-2">
            Question Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="What's your question? Be specific."
            className="input-field"
            required
          />
        </div>

        {/* Category */}
        <div className="card">
          <label htmlFor="category" className="block text-sm font-medium text-secondary-900 mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="input-field"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div className="card">
          <label htmlFor="content" className="block text-sm font-medium text-secondary-900 mb-2">
            Question Details *
          </label>
          <RichTextEditor
            value={formData.content}
            onChange={(content) => setFormData(prev => ({ ...prev, content }))}
            placeholder="Provide details about your question. You can include code snippets, error messages, or any explanation."
          />
        </div>

        {/* Tags */}
        <div className="card">
          <label className="block text-sm font-medium text-secondary-900 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="tag flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:text-red-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag"
              className="flex-1 input-field"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="btn-secondary flex items-center gap-2"
            >
              <Tag className="w-4 h-4" />
              Add
            </button>
          </div>

          {/* Available Tags */}
          {availableTags.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-secondary-600 mb-2">Popular tags:</p>
              <div className="flex flex-wrap gap-2">
                {availableTags.slice(0, 10).map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => {
                      if (!formData.tags.includes(tag.name)) {
                        setFormData(prev => ({
                          ...prev,
                          tags: [...prev.tags, tag.name]
                        }));
                      }
                    }}
                    className="tag hover:bg-primary-200 transition-colors cursor-pointer"
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Posting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Post Question
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AskQuestion; 