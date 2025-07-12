import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Tag, 
  Image, 
  Code,
  Send
} from 'lucide-react';

const AskQuestion = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Submitting question:', formData);
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors self-start"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-secondary-900">Ask a Question</h1>
          <p className="text-secondary-600 mt-1">Share your knowledge and get help from the community</p>
        </div>
      </div>

      {/* Form */}
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
          <p className="text-sm text-secondary-600 mt-2">
            Keep it concise and descriptive. This will help others find and answer your question.
          </p>
        </div>

        {/* Category */}
        <div className="card">
          <label htmlFor="category" className="block text-sm font-medium text-secondary-900 mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="input-field"
            required
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
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={8}
            placeholder="Provide more context about your question. You can include code snippets, error messages, or any relevant details."
            className="input-field resize-none"
            required
          />
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-3">
            <button type="button" className="flex items-center gap-2 text-sm text-secondary-600 hover:text-secondary-900">
              <Image className="w-4 h-4" />
              Add Image
            </button>
            <button type="button" className="flex items-center gap-2 text-sm text-secondary-600 hover:text-secondary-900">
              <Code className="w-4 h-4" />
              Add Code Block
            </button>
          </div>
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
          <form onSubmit={handleAddTag} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add tags (e.g., react, javascript, css)"
              className="input-field flex-1"
            />
            <button
              type="submit"
              className="btn-secondary flex items-center gap-2 justify-center"
            >
              <Tag className="w-4 h-4" />
              Add
            </button>
          </form>
          <p className="text-sm text-secondary-600 mt-2">
            Add up to 5 tags to help others find your question. Use common programming terms.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-secondary order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center gap-2 order-1 sm:order-2"
          >
            <Send className="w-4 h-4" />
            Post Question
          </button>
        </div>
      </form>

      {/* Tips */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Tips for a great question:</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Be specific and provide enough context</li>
          <li>• Include code snippets if relevant</li>
          <li>• Mention what you've already tried</li>
          <li>• Use clear and descriptive language</li>
          <li>• Add relevant tags to help others find your question</li>
        </ul>
      </div>
    </div>
  );
};

export default AskQuestion; 