import React, { useState } from 'react';
import { useStickyNotes } from '../../hooks/useStickyNotes';
import { StickyNoteItem } from './StickyNoteItem';
import { FloatingActionButton } from '../UI/FloatingActionButton';

export function StickyNotes() {
  const { notes, addNote, updateNote, deleteNote } = useStickyNotes();
  const [draggingNoteId, setDraggingNoteId] = useState<string | null>(null);

  const noteColors = [
    '#FEF3C7', // Yellow
    '#DBEAFE', // Blue
    '#D1FAE5', // Green
    '#FDE2E7', // Pink
    '#E0E7FF', // Indigo
    '#F3E8FF', // Purple
  ];

  const handleAddNote = () => {
    const newNote = {
      content: '',
      color: noteColors[Math.floor(Math.random() * noteColors.length)],
      position: { 
        x: Math.random() * (window.innerWidth - 300), 
        y: Math.random() * (window.innerHeight - 200) + 100
      },
      size: { width: 250, height: 200 },
    };
    addNote(newNote);
  };

  return (
    <div className="relative h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Notes */}
      {notes.map((note) => (
        <StickyNoteItem
          key={note.id}
          note={note}
          onUpdate={updateNote}
          onDelete={deleteNote}
          isDragging={draggingNoteId === note.id}
          onDragStart={() => setDraggingNoteId(note.id)}
          onDragEnd={() => setDraggingNoteId(null)}
        />
      ))}

      {/* Empty state */}
      {notes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 dark:text-gray-600 text-lg mb-2">
              No sticky notes yet
            </div>
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              Click the + button to create your first note
            </p>
          </div>
        </div>
      )}

      <FloatingActionButton onClick={handleAddNote} />
    </div>
  );
}