import React, { useState, useRef, useEffect } from 'react';
import { Edit3, Trash2, Palette, Move } from 'lucide-react';
import { StickyNote } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface NoteItemProps {
  note: StickyNote;
  viewMode: 'grid' | 'list';
}

const NoteItem: React.FC<NoteItemProps> = ({ note, viewMode }) => {
  const { updateNote, deleteNote } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const noteColors = [
    '#fef08a', '#fed7aa', '#fecaca', '#f3e8ff',
    '#ddd6fe', '#bfdbfe', '#a7f3d0', '#fecdd3',
  ];

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(content.length, content.length);
    }
  }, [isEditing, content.length]);

  const handleSave = () => {
    if (content.trim() !== note.content) {
      updateNote(note.id, { content: content.trim() });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setContent(note.content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleColorChange = (color: string) => {
    updateNote(note.id, { color });
    setShowColorPicker(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this note?')) {
      deleteNote(note.id);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (viewMode === 'list') {
    return (
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
        style={{ borderLeftColor: note.color, borderLeftWidth: '4px' }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            ) : (
              <p 
                onClick={() => setIsEditing(true)}
                className="text-gray-900 dark:text-white whitespace-pre-wrap cursor-text hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded transition-colors"
              >
                {note.content}
              </p>
            )}
            
            <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
              <span>Updated {formatDate(note.updatedAt)}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  <Palette className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Color Picker */}
        {showColorPicker && (
          <div className="absolute z-10 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-4 gap-2">
              {noteColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`w-6 h-6 rounded border-2 hover:scale-110 transition-transform ${
                    color === note.color ? 'border-gray-900' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        className="w-full h-64 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow transform hover:rotate-1 cursor-pointer"
        style={{ backgroundColor: note.color }}
      >
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full h-full bg-transparent resize-none border-none outline-none text-gray-900 placeholder-gray-600"
            placeholder="Write your note..."
          />
        ) : (
          <div 
            onClick={() => setIsEditing(true)}
            className="w-full h-full text-gray-900 whitespace-pre-wrap overflow-hidden cursor-text"
          >
            {note.content}
          </div>
        )}

        {/* Actions */}
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowColorPicker(!showColorPicker);
            }}
            className="p-1 bg-white/80 hover:bg-white rounded text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Palette className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="p-1 bg-white/80 hover:bg-white rounded text-gray-600 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>

        {/* Timestamp */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-600 opacity-75">
          {formatDate(note.updatedAt)}
        </div>
      </div>

      {/* Color Picker */}
      {showColorPicker && (
        <div className="absolute top-0 right-0 z-10 mt-2 mr-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-4 gap-2">
            {noteColors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`w-6 h-6 rounded border-2 hover:scale-110 transition-transform ${
                  color === note.color ? 'border-gray-900' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteItem;