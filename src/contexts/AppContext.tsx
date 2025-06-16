import React, { createContext, useContext, useState, useCallback } from 'react';
import { Task, StickyNote, CalendarEvent, ViewMode } from '../types';

interface AppContextType {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  notes: StickyNote[];
  addNote: (note: Omit<StickyNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<StickyNote>) => void;
  deleteNote: (id: string) => void;
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
    ));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const addNote = useCallback((noteData: Omit<StickyNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: StickyNote = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes(prev => [...prev, newNote]);
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<StickyNote>) => {
    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note
    ));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  }, []);

  const addEvent = useCallback((eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: Date.now().toString(),
    };
    setEvents(prev => [...prev, newEvent]);
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(event =>
      event.id === id ? { ...event, ...updates } : event
    ));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{
      currentView,
      setCurrentView,
      tasks,
      addTask,
      updateTask,
      deleteTask,
      notes,
      addNote,
      updateNote,
      deleteNote,
      events,
      addEvent,
      updateEvent,
      deleteEvent,
    }}>
      {children}
    </AppContext.Provider>
  );
};