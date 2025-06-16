import React, { useState } from 'react';
import { Check, Clock, Flag, Trash2, Edit2 } from 'lucide-react';
import { Task } from '../../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  low: 'text-green-500',
  medium: 'text-yellow-500',
  high: 'text-red-500',
};

export function TaskItem({ task, onToggle, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const handleSave = () => {
    onUpdate(task.id, {
      title: editTitle,
      description: editDescription,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div className={`
      bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700
      transition-all duration-200 hover:shadow-md
      ${task.completed ? 'opacity-60' : ''}
      ${isOverdue ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10' : ''}
    `}>
      <div className="flex items-start space-x-3">
        <button
          onClick={() => onToggle(task.id)}
          className={`
            flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5
            transition-colors duration-200
            ${task.completed 
              ? 'bg-indigo-600 border-indigo-600' 
              : 'border-gray-300 dark:border-gray-600 hover:border-indigo-600 dark:hover:border-indigo-400'
            }
          `}
        >
          {task.completed && <Check className="w-3 h-3 text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Task title..."
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                rows={2}
                placeholder="Description (optional)..."
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className={`
                font-medium text-gray-900 dark:text-white
                ${task.completed ? 'line-through' : ''}
              `}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`
                  text-sm text-gray-600 dark:text-gray-400 mt-1
                  ${task.completed ? 'line-through' : ''}
                `}>
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center space-x-4 mt-3">
                {task.dueDate && (
                  <div className={`
                    flex items-center space-x-1 text-xs
                    ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}
                  `}>
                    <Clock className="w-3 h-3" />
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
                
                <div className={`flex items-center space-x-1 text-xs ${priorityColors[task.priority]}`}>
                  <Flag className="w-3 h-3" />
                  <span className="capitalize">{task.priority}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {!isEditing && (
          <div className="flex space-x-1">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}