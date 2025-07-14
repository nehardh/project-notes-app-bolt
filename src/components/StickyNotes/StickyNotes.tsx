import React, { useState } from 'react';
import { Plus, Palette, Grid, List } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import NoteItem from './NoteItem';
import { StickyNote } from '../../types';

const StickyNotes: React.FC = () => {
  const { notes, addNote } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const noteColors = [
    '#fef08a', // yellow
    '#fed7aa', // orange  
    '#fecaca', // red
    '#f3e8ff', // purple
    '#ddd6fe', // indigo
    '#bfdbfe', // blue
    '#a7f3d0', // green
    '#fecdd3', // pink
  ];

  const handleAddNote = () => {
    const randomColor = noteColors[Math.floor(Math.random() * noteColors.length)];
    const randomPosition = {
      x: Math.random() * 200 + 50,
      y: Math.random() * 200 + 50,
    };

    addNote({
      content: 'New note...',
      color: randomColor,
      position: randomPosition,
      size: { width: 300, height: 200 },
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sticky Notes</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Add Note Button */}
          <button
            onClick={handleAddNote}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-6 h-5" />
            <span>Add Note</span>
          </button>
        </div>
      </div>

      {/* Color Palette */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Palette className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Colors</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {noteColors.map((color, index) => (
            <button
              key={index}
              onClick={() => {
                const randomPosition = {
                  x: Math.random() * 200 + 50,
                  y: Math.random() * 200 + 50,
                };
                addNote({
                  content: 'New note...',
                  color,
                  position: randomPosition,
                  size: { width: 250, height: 200 },
                });
              }}
              className="w-8 h-8 rounded-lg border-2 border-white dark:border-gray-600 shadow-sm hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={`Create note with this color`}
            />
          ))}
        </div>
      </div>

      {/* Notes */}
      {notes.length > 0 ? (
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-4'
        }`}>
          {notes.map(note => (
            <NoteItem key={note.id} note={note} viewMode={viewMode} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Plus className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            No notes yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
            Create your first sticky note to capture ideas, reminders, or anything that comes to mind.
          </p>
          <button
            onClick={handleAddNote}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
          >
            <Plus className="w-6 h-6" />
            <span className="text-lg">Create First Note</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default StickyNotes;