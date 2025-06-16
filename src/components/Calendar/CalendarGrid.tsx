import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Task, StickyNote } from '../../types';
import { CalendarCell } from './CalendarCell';

interface CalendarGridProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  tasks: Task[];
  notes: StickyNote[];
  view: 'month' | 'week';
}

export function CalendarGrid({ currentDate, onDateChange, tasks, notes, view }: CalendarGridProps) {
  const today = new Date();
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    onDateChange(newDate);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    onDateChange(newDate);
  };

  const navigate = view === 'month' ? navigateMonth : navigateWeek;

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: Date[] = [];
    const currentDateIter = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDateIter));
      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }
    
    return days;
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const days = view === 'month' ? getMonthDays() : getWeekDays();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const getNotesForDate = (date: Date) => {
    return notes.filter(note => {
      if (!note.date) return false;
      const noteDate = new Date(note.date);
      return noteDate.toDateString() === date.toDateString();
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => navigate('prev')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {view === 'month' 
            ? currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            : `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
          }
        </h2>
        
        <button
          onClick={() => navigate('next')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day headers */}
        <div className={`grid ${view === 'month' ? 'grid-cols-7' : 'grid-cols-7'} gap-2 mb-2`}>
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className={`grid ${view === 'month' ? 'grid-cols-7' : 'grid-cols-7'} gap-2`}>
          {days.map((day, index) => {
            const isCurrentMonth = view === 'week' || day.getMonth() === currentDate.getMonth();
            const isToday = day.toDateString() === today.toDateString();
            const dayTasks = getTasksForDate(day);
            const dayNotes = getNotesForDate(day);

            return (
              <CalendarCell
                key={index}
                date={day}
                isCurrentMonth={isCurrentMonth}
                isToday={isToday}
                tasks={dayTasks}
                notes={dayNotes}
                view={view}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}