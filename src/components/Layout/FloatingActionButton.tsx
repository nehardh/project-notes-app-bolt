import React, { useState } from 'react';
import { Plus, CheckSquare, StickyNote, Calendar, X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setCurrentView, addTask, addNote, addEvent } = useApp();

  const quickActions = [
    {
      id: 'task',
      label: 'Add Task',
      icon: CheckSquare,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => {
        addTask({
          title: 'New Task',
          completed: false,
          priority: 'medium',
          category: 'General',
        });
        setCurrentView('todos');
        setIsOpen(false);
      },
    },
    {
      id: 'note',
      label: 'Add Note',
      icon: StickyNote,
      color: 'bg-yellow-500 hover:bg-yellow-600',
      action: () => {
        addNote({
          content: 'New note...',
          color: '#fef08a',
          position: { x: 100, y: 100 },
          size: { width: 200, height: 200 },
        });
        setCurrentView('notes');
        setIsOpen(false);
      },
    },
    {
      id: 'event',
      label: 'Add Event',
      icon: Calendar,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => {
        addEvent({
          title: 'New Event',
          date: new Date(),
          category: 'General',
          color: '#10b981',
        });
        setCurrentView('calendar');
        setIsOpen(false);
      },
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="flex flex-col space-y-3 mb-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={action.action}
                className={`w-12 h-12 rounded-full ${action.color} text-white shadow-lg transform transition-all duration-200 hover:scale-110 flex items-center justify-center animate-in slide-in-from-bottom-2`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform transition-all duration-200 hover:scale-110 flex items-center justify-center ${
          isOpen ? 'rotate-45' : ''
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default FloatingActionButton;