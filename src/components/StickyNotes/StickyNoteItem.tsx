import React, { useState, useRef, useEffect } from 'react';
import { X, Move } from 'lucide-react';
import { StickyNote } from '../../types';

interface StickyNoteItemProps {
  note: StickyNote;
  onUpdate: (id: string, updates: Partial<StickyNote>) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

const noteColors = [
  '#FEF3C7', // Yellow
  '#DBEAFE', // Blue
  '#D1FAE5', // Green
  '#FDE2E7', // Pink
  '#E0E7FF', // Indigo
  '#F3E8FF', // Purple
];

export function StickyNoteItem({ 
  note, 
  onUpdate, 
  onDelete, 
  isDragging = false,
  onDragStart,
  onDragEnd
}: StickyNoteItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const noteRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (content.trim() !== note.content) {
      onUpdate(note.id, { content: content.trim() });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setContent(note.content);
    setIsEditing(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('drag-handle')) {
      setDragStart({ x: e.clientX - note.position.x, y: e.clientY - note.position.y });
      onDragStart?.();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragStart) {
      const newX = Math.max(0, e.clientX - dragStart.x);
      const newY = Math.max(0, e.clientY - dragStart.y);
      onUpdate(note.id, {
        position: { x: newX, y: newY }
      });
    }
  };

  const handleMouseUp = () => {
    if (dragStart) {
      setDragStart(null);
      onDragEnd?.();
    }
  };

  useEffect(() => {
    if (dragStart) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragStart]);

  return (
    <div
      ref={noteRef}
      className={`
        absolute cursor-move select-none transition-shadow duration-200
        ${isDragging ? 'shadow-xl z-50' : 'shadow-lg hover:shadow-xl'}
      `}
      style={{
        left: note.position.x,
        top: note.position.y,
        width: note.size.width,
        height: note.size.height,
        backgroundColor: note.color,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="h-full flex flex-col rounded-lg overflow-hidden border-2 border-yellow-300">
        {/* Header */}
        <div className="flex items-center justify-between p-2 bg-black bg-opacity-5 drag-handle">
          <Move className="w-4 h-4 text-gray-600 drag-handle" />
          <div className="flex items-center space-x-1">
            {/* Color picker */}
            <div className="flex space-x-1">
              {noteColors.map((color) => (
                <button
                  key={color}
                  onClick={() => onUpdate(note.id, { color })}
                  className={`w-3 h-3 rounded-full border border-gray-400 ${note.color === color ? 'ring-2 ring-gray-600' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <button
              onClick={() => onDelete(note.id)}
              className="p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors"
            >
              <X className="w-3 h-3 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-3">
          {isEditing ? (
            <div className="h-full flex flex-col">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 w-full bg-transparent border-none outline-none resize-none text-sm text-gray-800 placeholder-gray-500"
                placeholder="Type your note..."
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.shiftKey) {
                    return;
                  } else if (e.key === 'Enter') {
                    handleSave();
                  } else if (e.key === 'Escape') {
                    handleCancel();
                  }
                }}
              />
            </div>
          ) : (
            <div
              onClick={() => setIsEditing(true)}
              className="h-full w-full text-sm text-gray-800 whitespace-pre-wrap break-words cursor-text"
            >
              {note.content || 'Click to edit...'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}