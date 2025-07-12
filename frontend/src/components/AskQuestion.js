import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Tag, 
  Image, 
  Code,
  Send,
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Smile
} from 'lucide-react';

const AskQuestion = () => {
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

  // Rich text editor functions
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    contentRef.current.focus();
  };

  const formatText = (command) => {
    execCommand(command);
    // Update the content state with the formatted HTML
    setFormData(prev => ({ ...prev, content: contentRef.current.innerHTML }));
  };

  const insertList = (type) => {
    if (type === 'bullet') {
      execCommand('insertUnorderedList');
    } else {
      execCommand('insertOrderedList');
    }
    setFormData(prev => ({ ...prev, content: contentRef.current.innerHTML }));
  };

  const setAlignment = (alignment) => {
    execCommand('justify' + alignment.charAt(0).toUpperCase() + alignment.slice(1));
    setFormData(prev => ({ ...prev, content: contentRef.current.innerHTML }));
  };

  const insertLink = () => {
    if (linkText && linkUrl) {
      execCommand('createLink', linkUrl);
      setShowLinkModal(false);
      setLinkUrl('');
      setLinkText('');
      setFormData(prev => ({ ...prev, content: contentRef.current.innerHTML }));
    }
  };

  const insertEmoji = (emoji) => {
    execCommand('insertText', emoji);
    setShowEmojiPicker(false);
    setFormData(prev => ({ ...prev, content: contentRef.current.innerHTML }));
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
        
        // Insert the image at cursor position
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(img);
        }
        
        setFormData(prev => ({ ...prev, content: contentRef.current.innerHTML }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContentChange = () => {
    setFormData(prev => ({ ...prev, content: contentRef.current.innerHTML }));
  };

  // Add placeholder functionality
  React.useEffect(() => {
    const editor = contentRef.current;
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

      editor.addEventListener('focus', handleFocus);
      editor.addEventListener('blur', handleBlur);
      
      return () => {
        editor.removeEventListener('focus', handleFocus);
        editor.removeEventListener('blur', handleBlur);
      };
    }
  }, []);

  // Initialize content if needed
  React.useEffect(() => {
    if (contentRef.current && formData.content) {
      contentRef.current.innerHTML = formData.content;
    }
  }, []);

  // Add CSS for placeholder
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
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

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
          
          {/* Rich Text Editor Toolbar */}
          <div className="border border-secondary-300 rounded-t-lg bg-secondary-50 p-3 flex flex-wrap items-center gap-2">
            {/* Text Formatting */}
            <div className="flex items-center gap-1 border-r border-secondary-300 pr-3">
              <button
                type="button"
                onClick={() => formatText('bold')}
                className="p-2 hover:bg-secondary-200 rounded-lg transition-colors"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => formatText('italic')}
                className="p-2 hover:bg-secondary-200 rounded-lg transition-colors"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => formatText('strikeThrough')}
                className="p-2 hover:bg-secondary-200 rounded-lg transition-colors"
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
                className="p-2 hover:bg-secondary-200 rounded-lg transition-colors"
                title="Align Left"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setAlignment('center')}
                className="p-2 hover:bg-secondary-200 rounded-lg transition-colors"
                title="Align Center"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setAlignment('right')}
                className="p-2 hover:bg-secondary-200 rounded-lg transition-colors"
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
                <Link className="w-4 h-4" />
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
                  
                  setFormData(prev => ({ ...prev, content: contentRef.current.innerHTML }));
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
            ref={contentRef}
            contentEditable
            onInput={handleContentChange}
            onBlur={handleContentChange}
            className="w-full px-4 py-3 border border-secondary-300 rounded-b-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 min-h-[200px] max-h-[400px] overflow-y-auto"
            style={{ 
              outline: 'none',
              lineHeight: '1.6',
              fontFamily: 'inherit'
            }}
            data-placeholder="Provide details about your question.You can include code snippets,error messages, or any explanation."
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

export default AskQuestion; 