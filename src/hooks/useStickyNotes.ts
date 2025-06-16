import { StickyNote } from '../types';
import { useLocalStorage } from './useLocalStorage';

export function useStickyNotes() {
  const [notes, setNotes] = useLocalStorage<StickyNote[]>('stickyNotes', []);

  const addNote = (noteData: Omit<StickyNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: StickyNote = {
      ...noteData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes(prev => [...prev, newNote]);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<StickyNote>) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
  };
}