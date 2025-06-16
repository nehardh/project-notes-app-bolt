import React, { useState } from 'react';
import { Calendar as CalendarIcon, Grid, List } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { useStickyNotes } from '../../hooks/useStickyNotes';
import { CalendarGrid } from './CalendarGrid';
import { CalendarView } from '../../types';

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');
  const { tasks } = useTasks();
  const { notes } = useStickyNotes();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <CalendarIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar Overview</h1>
        </div>
        
        {/* View toggle */}
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setView('month')}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
              ${view === 'month'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            <Grid className="w-4 h-4" />
            <span>Month</span>
          </button>
          <button
            onClick={() => setView('week')}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
              ${view === 'week'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            <List className="w-4 h-4" />
            <span>Week</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {tasks.filter(t => !t.completed).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active Tasks</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {tasks.filter(t => t.completed).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completed Tasks</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {notes.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Sticky Notes</div>
        </div>
      </div>

      {/* Calendar */}
      <CalendarGrid
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        tasks={tasks}
        notes={notes}
        view={view}
      />
    </div>
  );
}