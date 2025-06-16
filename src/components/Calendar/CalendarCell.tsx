import React, { useState } from 'react';
import { CheckSquare, StickyNote as StickyNoteIcon } from 'lucide-react';
import { Task, StickyNote } from '../../types';

interface CalendarCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
  notes: StickyNote[];
  view: 'month' | 'week';
}

export function CalendarCell({ 
  date, 
  isCurrentMonth, 
  isToday, 
  tasks, 
  notes, 
  view 
}: CalendarCellProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const hasContent = tasks.length > 0 || notes.length > 0;
  
  return (
    <div
      className={`
        relative p-2 min-h-[80px] border border-gray-200 dark:border-gray-700 rounded-lg
        transition-all duration-200 cursor-pointer
        ${isCurrentMonth 
          ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750' 
          : 'bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-600'
        }
        ${isToday ? 'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : ''}
        ${hasContent ? 'shadow-sm' : ''}
      `}
      onClick={() => setShowDetails(!showDetails)}
    >
      {/* Date number */}
      <div className={`
        text-sm font-medium mb-1
        ${isToday ? 'text-indigo-600 dark:text-indigo-400' : ''}
      `}>
        {date.getDate()}
      </div>

      {/* Content indicators */}
      {hasContent && (
        <div className="space-y-1">
          {/* Tasks */}
          {tasks.slice(0, view === 'month' ? 2 : 5).map((task) => (
            <div
              key={task.id}
              className={`
                text-xs px-2 py-1 rounded truncate flex items-center space-x-1
                ${task.completed 
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                  : task.priority === 'high'
                  ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                  : task.priority === 'medium'
                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                  : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                }
              `}
            >
              <CheckSquare className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{task.title}</span>
            </div>
          ))}
          
          {/* Notes */}
          {notes.slice(0, view === 'month' ? 1 : 3).map((note) => (
            <div
              key={note.id}
              className="text-xs px-2 py-1 rounded truncate flex items-center space-x-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
            >
              <StickyNoteIcon className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{note.content}</span>
            </div>
          ))}
          
          {/* Show more indicator */}
          {(tasks.length + notes.length) > (view === 'month' ? 3 : 8) && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              +{(tasks.length + notes.length) - (view === 'month' ? 3 : 8)} more
            </div>
          )}
        </div>
      )}

      {/* Detailed view */}
      {showDetails && hasContent && (
        <div className="absolute top-full left-0 right-0 z-10 mt-1 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {tasks.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Tasks</h4>
              <div className="space-y-1">
                {tasks.map((task) => (
                  <div key={task.id} className="text-xs text-gray-600 dark:text-gray-400">
                    <span className={task.completed ? 'line-through' : ''}>{task.title}</span>
                    {task.description && (
                      <div className="text-gray-500 dark:text-gray-500 mt-1">{task.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {notes.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Notes</h4>
              <div className="space-y-1">
                {notes.map((note) => (
                  <div key={note.id} className="text-xs text-gray-600 dark:text-gray-400">
                    {note.content}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}