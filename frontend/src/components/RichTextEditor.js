import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
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
    Quote,
    Heading1,
    Heading2,
    Heading3,
    Undo,
    Redo,
    Underline
} from 'lucide-react';

const RichTextEditor = ({
    value = '',
    onChange,
    placeholder = 'Start typing...',
    className = '',
    minHeight = '200px',
    maxHeight = '400px'
}) => {
    const editorRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [activeFormats, setActiveFormats] = useState({
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false,
        alignLeft: false,
        alignCenter: false,
        alignRight: false
    });

    // Initialize editor content
    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    // Update format states based on current selection
    const updateFormatStates = useCallback(() => {
        if (!editorRef.current) return;

        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const formats = {
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline'),
            strikethrough: document.queryCommandState('strikeThrough'),
            alignLeft: document.queryCommandValue('justifyLeft') === 'true',
            alignCenter: document.queryCommandValue('justifyCenter') === 'true',
            alignRight: document.queryCommandValue('justifyRight') === 'true'
        };

        setActiveFormats(formats);
    }, []);

    // Update undo/redo state
    const updateUndoRedoState = useCallback(() => {
        if (editorRef.current) {
            setCanUndo(document.queryCommandEnabled('undo'));
            setCanRedo(document.queryCommandEnabled('redo'));
        }
    }, []);

    // Focus editor and restore selection
    const focusEditor = useCallback(() => {
        if (editorRef.current) {
            editorRef.current.focus();
            // Restore selection if it was lost
            const selection = window.getSelection();
            if (selection.rangeCount === 0 && editorRef.current.childNodes.length > 0) {
                const range = document.createRange();
                range.selectNodeContents(editorRef.current);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }, []);

    // Execute command safely with proper selection handling
    const execCommand = useCallback((command, value = null) => {
        try {
            focusEditor();

            // Ensure we have a valid selection
            const selection = window.getSelection();
            if (!selection.rangeCount) {
                // If no selection, select all content
                const range = document.createRange();
                range.selectNodeContents(editorRef.current);
                selection.removeAllRanges();
                selection.addRange(range);
            }

            const success = document.execCommand(command, false, value);
            if (success) {
                updateUndoRedoState();
                updateFormatStates();
                notifyChange();
            }
        } catch (error) {
            console.error('Command execution failed:', error);
        }
    }, [focusEditor, updateUndoRedoState, updateFormatStates]);

    // Notify parent of content change
    const notifyChange = useCallback(() => {
        if (editorRef.current && onChange) {
            onChange(editorRef.current.innerHTML);
        }
    }, [onChange]);

    // Handle content changes
    const handleInput = useCallback(() => {
        notifyChange();
        updateUndoRedoState();
        updateFormatStates();
    }, [notifyChange, updateUndoRedoState, updateFormatStates]);

    // Handle selection changes
    const handleSelectionChange = useCallback(() => {
        updateFormatStates();
    }, [updateFormatStates]);

    // Handle paste to clean HTML
    const handlePaste = useCallback((e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');

        // Check if the pasted content looks like code (has multiple lines or specific patterns)
        const isCode = text.includes('\n') ||
            text.includes('function') ||
            text.includes('const ') ||
            text.includes('let ') ||
            text.includes('var ') ||
            text.includes('if (') ||
            text.includes('for (') ||
            text.includes('while (') ||
            text.includes('{') ||
            text.includes('}') ||
            text.includes(';') ||
            text.includes('//') ||
            text.includes('/*');

        if (isCode) {
            // Insert as code block
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const pre = document.createElement('pre');
                const code = document.createElement('code');

                // Handle multi-line code properly
                if (text.includes('\n')) {
                    code.innerHTML = text.split('\n').map(line =>
                        line === '' ? '<br>' : line
                    ).join('<br>');
                } else {
                    code.textContent = text;
                }

                pre.appendChild(code);
                range.deleteContents();
                range.insertNode(pre);

                // Place cursor after the code block
                const newRange = document.createRange();
                newRange.setStartAfter(pre);
                newRange.collapse(true);
                selection.removeAllRanges();
                selection.addRange(newRange);
            }
        } else {
            // Insert as regular text
            document.execCommand('insertText', false, text);
        }

        notifyChange();
    }, [notifyChange]);

    // Handle key events
    const handleKeyDown = useCallback((e) => {
        // Handle tab key
        if (e.key === 'Tab') {
            e.preventDefault();
            document.execCommand('insertText', false, '    ');
        }

        // Handle enter key for lists
        if (e.key === 'Enter') {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const parentElement = range.commonAncestorContainer.nodeType === 1
                    ? range.commonAncestorContainer
                    : range.commonAncestorContainer.parentElement;

                // If we're in a list item, create a new list item
                if (parentElement.tagName === 'LI') {
                    e.preventDefault();
                    const newLi = document.createElement('li');
                    parentElement.parentNode.insertBefore(newLi, parentElement.nextSibling);

                    const newRange = document.createRange();
                    newRange.setStart(newLi, 0);
                    newRange.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                }
            }
        }

        // Handle Ctrl+B, Ctrl+I, Ctrl+U shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'b':
                    e.preventDefault();
                    execCommand('bold');
                    break;
                case 'i':
                    e.preventDefault();
                    execCommand('italic');
                    break;
                case 'u':
                    e.preventDefault();
                    execCommand('underline');
                    break;
                case 'z':
                    if (e.shiftKey) {
                        e.preventDefault();
                        execCommand('redo');
                    } else {
                        e.preventDefault();
                        execCommand('undo');
                    }
                    break;
            }
        }
    }, [execCommand]);

    // Text formatting functions
    const formatText = useCallback((command) => {
        execCommand(command);
    }, [execCommand]);

    // Insert heading
    const insertHeading = useCallback((level) => {
        const tag = `h${level}`;
        const selection = window.getSelection();

        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const heading = document.createElement(tag);
            heading.textContent = range.toString() || `Heading ${level}`;

            range.deleteContents();
            range.insertNode(heading);

            // Place cursor at end of heading
            const newRange = document.createRange();
            newRange.setStartAfter(heading);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);

            notifyChange();
        }
    }, [notifyChange]);

    // Insert list
    const insertList = useCallback((type) => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const listType = type === 'ordered' ? 'ol' : 'ul';
            const list = document.createElement(listType);
            const listItem = document.createElement('li');

            // If there's selected text, put it in the list item
            if (range.toString().trim()) {
                listItem.textContent = range.toString();
                range.deleteContents();
            } else {
                listItem.textContent = 'List item';
            }

            list.appendChild(listItem);
            range.insertNode(list);

            // Place cursor inside the list item
            const newRange = document.createRange();
            newRange.setStart(listItem, 0);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);

            notifyChange();
        }
    }, [notifyChange]);

    // Set text alignment
    const setAlignment = useCallback((alignment) => {
        execCommand(`justify${alignment.charAt(0).toUpperCase() + alignment.slice(1)}`);
    }, [execCommand]);

    // Insert link
    const insertLink = useCallback(() => {
        if (linkText && linkUrl) {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const link = document.createElement('a');
                link.href = linkUrl;
                link.textContent = linkText || linkUrl;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';

                range.deleteContents();
                range.insertNode(link);

                setShowLinkModal(false);
                setLinkUrl('');
                setLinkText('');
                notifyChange();
            }
        }
    }, [linkText, linkUrl, notifyChange]);

    // Insert emoji
    const insertEmoji = useCallback((emoji) => {
        execCommand('insertText', emoji);
        setShowEmojiPicker(false);
    }, [execCommand]);

    // Insert image
    const insertImage = useCallback((e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = document.createElement('img');
                img.src = event.target.result;
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                img.style.borderRadius = '8px';
                img.style.margin = '8px 0';

                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(img);
                    notifyChange();
                }
            };
            reader.readAsDataURL(file);
        }
    }, [notifyChange]);

    // Insert code block
    const insertCodeBlock = useCallback(() => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const pre = document.createElement('pre');
            const code = document.createElement('code');

            // Set proper content with line breaks
            const codeText = range.toString() || 'Your code here';

            // Handle multi-line code properly
            if (codeText.includes('\n')) {
                // For multi-line code, preserve line breaks
                code.innerHTML = codeText.split('\n').map(line =>
                    line === '' ? '<br>' : line
                ).join('<br>');
            } else {
                // For single line, just set the text
                code.textContent = codeText;
            }

            pre.appendChild(code);

            range.deleteContents();
            range.insertNode(pre);

            // Place cursor inside code block at the end
            const newRange = document.createRange();
            newRange.setStart(code, code.childNodes.length);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);

            notifyChange();
        }
    }, [notifyChange]);

    // Insert quote
    const insertQuote = useCallback(() => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const blockquote = document.createElement('blockquote');
            blockquote.textContent = range.toString() || 'Your quote here';

            range.deleteContents();
            range.insertNode(blockquote);

            notifyChange();
        }
    }, [notifyChange]);

    // Undo/Redo
    const handleUndo = useCallback(() => execCommand('undo'), [execCommand]);
    const handleRedo = useCallback(() => execCommand('redo'), [execCommand]);

    // Add event listeners for selection changes
    useEffect(() => {
        document.addEventListener('selectionchange', handleSelectionChange);
        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange);
        };
    }, [handleSelectionChange]);

    // Emoji list
    const emojis = [
        '😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🔥', '💡', '✅', '❌', '⚠️',
        '📝', '🔗', '📷', '💻', '🎯', '🚀', '⭐', '💪', '🎉', '🙏', '👋', '🤝'
    ];

    return (
        <div className={`rich-text-editor ${className}`}>
            {/* Toolbar */}
            <div className="border border-secondary-300 rounded-t-lg bg-secondary-50 p-3 flex flex-wrap items-center gap-2">
                {/* Undo/Redo */}
                <div className="flex items-center gap-1 border-r border-secondary-300 pr-3">
                    <button
                        type="button"
                        onClick={handleUndo}
                        disabled={!canUndo}
                        className={`p-2 rounded-lg transition-colors ${canUndo ? 'hover:bg-secondary-200' : 'text-secondary-400 cursor-not-allowed'}`}
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={handleRedo}
                        disabled={!canRedo}
                        className={`p-2 rounded-lg transition-colors ${canRedo ? 'hover:bg-secondary-200' : 'text-secondary-400 cursor-not-allowed'}`}
                        title="Redo (Ctrl+Shift+Z)"
                    >
                        <Redo className="w-4 h-4" />
                    </button>
                </div>

                {/* Text Formatting */}
                <div className="flex items-center gap-1 border-r border-secondary-300 pr-3">
                    <button
                        type="button"
                        onClick={() => formatText('bold')}
                        className={`p-2 rounded-lg transition-colors ${activeFormats.bold ? 'bg-primary-100 text-primary-700' : 'hover:bg-secondary-200'}`}
                        title="Bold (Ctrl+B)"
                    >
                        <Bold className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => formatText('italic')}
                        className={`p-2 rounded-lg transition-colors ${activeFormats.italic ? 'bg-primary-100 text-primary-700' : 'hover:bg-secondary-200'}`}
                        title="Italic (Ctrl+I)"
                    >
                        <Italic className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => formatText('underline')}
                        className={`p-2 rounded-lg transition-colors ${activeFormats.underline ? 'bg-primary-100 text-primary-700' : 'hover:bg-secondary-200'}`}
                        title="Underline (Ctrl+U)"
                    >
                        <Underline className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => formatText('strikeThrough')}
                        className={`p-2 rounded-lg transition-colors ${activeFormats.strikethrough ? 'bg-primary-100 text-primary-700' : 'hover:bg-secondary-200'}`}
                        title="Strikethrough"
                    >
                        <Strikethrough className="w-4 h-4" />
                    </button>
                </div>

                {/* Headings */}
                <div className="flex items-center gap-1 border-r border-secondary-300 pr-3">
                    <button
                        type="button"
                        onClick={() => insertHeading(1)}
                        className="p-2 hover:bg-secondary-200 rounded-lg transition-colors"
                        title="Heading 1"
                    >
                        <Heading1 className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => insertHeading(2)}
                        className="p-2 hover:bg-secondary-200 rounded-lg transition-colors"
                        title="Heading 2"
                    >
                        <Heading2 className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => insertHeading(3)}
                        className="p-2 hover:bg-secondary-200 rounded-lg transition-colors"
                        title="Heading 3"
                    >
                        <Heading3 className="w-4 h-4" />
                    </button>
                </div>

                {/* Lists */}
                <div className="flex items-center gap-1 border-r border-secondary-300 pr-3">
                    <button
                        type="button"
                        onClick={() => insertList('unordered')}
                        className="p-2 hover:bg-secondary-200 rounded-lg transition-colors"
                        title="Bullet List"
                    >
                        <List className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => insertList('ordered')}
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
                        className={`p-2 rounded-lg transition-colors ${activeFormats.alignLeft ? 'bg-primary-100 text-primary-700' : 'hover:bg-secondary-200'}`}
                        title="Align Left"
                    >
                        <AlignLeft className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setAlignment('center')}
                        className={`p-2 rounded-lg transition-colors ${activeFormats.alignCenter ? 'bg-primary-100 text-primary-700' : 'hover:bg-secondary-200'}`}
                        title="Align Center"
                    >
                        <AlignCenter className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setAlignment('right')}
                        className={`p-2 rounded-lg transition-colors ${activeFormats.alignRight ? 'bg-primary-100 text-primary-700' : 'hover:bg-secondary-200'}`}
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
                            onChange={insertImage}
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

                {/* Code and Quote */}
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={insertCodeBlock}
                        className="p-2 hover:bg-secondary-200 rounded-lg transition-colors"
                        title="Code Block"
                    >
                        <Code className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={insertQuote}
                        className="p-2 hover:bg-secondary-200 rounded-lg transition-colors"
                        title="Quote"
                    >
                        <Quote className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
                <div className="border border-secondary-300 bg-white p-3 rounded-b-lg">
                    <div className="grid grid-cols-8 gap-2">
                        {emojis.map((emoji) => (
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

            {/* Editor */}
            <div
                ref={editorRef}
                contentEditable
                dir="ltr"
                onInput={handleInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onPaste={handlePaste}
                onKeyDown={handleKeyDown}
                className={`w-full px-4 py-3 border border-secondary-300 rounded-b-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 overflow-y-auto ${isFocused ? 'border-primary-500' : ''}`}
                style={{
                    outline: 'none',
                    lineHeight: '1.6',
                    fontFamily: 'inherit',
                    minHeight,
                    maxHeight
                }}
                data-placeholder={placeholder}
            />

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

            {/* CSS for placeholder and content styling */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    .rich-text-editor [contenteditable]:empty:before {
                        content: attr(data-placeholder);
                        color: #9ca3af;
                        pointer-events: none;
                        position: absolute;
                        font-style: italic;
                    }
                    .rich-text-editor [contenteditable]:focus:empty:before {
                        display: none;
                    }
                    .rich-text-editor [contenteditable] pre {
                        background-color: #1f2937;
                        border: 1px solid #374151;
                        border-radius: 0.375rem;
                        padding: 1rem;
                        margin: 0.5rem 0;
                        font-family: 'Courier New', 'Monaco', 'Consolas', monospace;
                        font-size: 0.875rem;
                        line-height: 1.6;
                        overflow-x: auto;
                        color: #f9fafb;
                        white-space: pre-wrap;
                        word-wrap: break-word;
                    }
                    .rich-text-editor [contenteditable] pre code {
                        background: none;
                        border: none;
                        padding: 0;
                        font-family: inherit;
                        font-size: inherit;
                        color: inherit;
                    }
                    .rich-text-editor [contenteditable] code {
                        background-color: #f3f4f6;
                        border: 1px solid #d1d5db;
                        border-radius: 0.25rem;
                        padding: 0.125rem 0.25rem;
                        font-family: 'Courier New', 'Monaco', 'Consolas', monospace;
                        font-size: 0.875rem;
                        color: #1f2937;
                    }
                    .rich-text-editor [contenteditable] blockquote {
                        border-left: 4px solid #3b82f6;
                        padding-left: 1rem;
                        margin: 0.5rem 0;
                        font-style: italic;
                        color: #6b7280;
                    }
                    .rich-text-editor [contenteditable] h1 {
                        font-size: 1.875rem;
                        font-weight: 700;
                        margin: 1rem 0 0.5rem 0;
                    }
                    .rich-text-editor [contenteditable] h2 {
                        font-size: 1.5rem;
                        font-weight: 600;
                        margin: 0.75rem 0 0.5rem 0;
                    }
                    .rich-text-editor [contenteditable] h3 {
                        font-size: 1.25rem;
                        font-weight: 600;
                        margin: 0.5rem 0;
                    }
                    .rich-text-editor [contenteditable] ul, .rich-text-editor [contenteditable] ol {
                        margin: 0.5rem 0;
                        padding-left: 1.5rem;
                        list-style-position: outside;
                    }
                    .rich-text-editor [contenteditable] ul {
                        list-style-type: disc;
                    }
                    .rich-text-editor [contenteditable] ol {
                        list-style-type: decimal;
                    }
                    .rich-text-editor [contenteditable] li {
                        margin: 0.25rem 0;
                        display: list-item;
                    }
                    .rich-text-editor [contenteditable] a {
                        color: #3b82f6;
                        text-decoration: underline;
                    }
                    .rich-text-editor [contenteditable] a:hover {
                        color: #2563eb;
                    }
                    .rich-text-editor [contenteditable] img {
                        max-width: 100%;
                        height: auto;
                        border-radius: 8px;
                        margin: 8px 0;
                    }
                    .rich-text-editor [contenteditable] *::selection {
                        background-color: #3b82f6;
                        color: white;
                    }
                    .rich-text-editor [contenteditable] *::-moz-selection {
                        background-color: #3b82f6;
                        color: white;
                    }
                `
            }} />
        </div>
    );
};

export default RichTextEditor; 