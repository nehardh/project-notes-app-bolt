import React, { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { TaskItem } from './TaskItem';
import { TaskForm } from './TaskForm';
import { Modal } from '../UI/Modal';
import { FloatingActionButton } from '../UI/FloatingActionButton';

export function TodoList() {
  const { tasks, addTask, updateTask, deleteTask, toggleTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Filter buttons */}
      <div className="flex space-x-2 mb-6">
        {(['all', 'active', 'completed'] as const).map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-colors capitalize
              ${filter === filterType
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `}
          >
            {filterType} ({filterType === 'all' ? tasks.length : filterType === 'active' ? tasks.filter(t => !t.completed).length : tasks.filter(t => t.completed).length})
          </button>
        ))}
      </div>

      {/* Tasks list */}
      <div className="space-y-3">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 text-lg mb-2">
              {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
            </div>
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              {filter === 'all' ? 'Create your first task to get started' : `Switch to "All" to see other tasks`}
            </p>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onUpdate={updateTask}
              onDelete={deleteTask}
            />
          ))
        )}
      </div>

      {/* Add task modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Task"
      >
        <TaskForm
          onSubmit={addTask}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <FloatingActionButton onClick={() => setIsModalOpen(true)} />
    </div>
  );
}