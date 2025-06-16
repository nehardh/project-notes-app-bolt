import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, Flag } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import TaskItem from './TaskItem';
import TaskModal from './TaskModal';
import { Task } from '../../types';

const TodoList: React.FC = () => {
  const { tasks, addTask } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const categories = ['all', ...Array.from(new Set(tasks.map(task => task.category)))];
  const priorities = ['all', 'high', 'medium', 'low'];

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  const handleAddTask = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Tasks</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {pendingTasks.length} pending, {completedTasks.length} completed
          </p>
        </div>
        <button
          onClick={handleAddTask}
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>
                  {priority === 'all' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-8">
        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Pending Tasks ({pendingTasks.length})</span>
            </h2>
            <div className="space-y-3">
              {pendingTasks.map(task => (
                <TaskItem key={task.id} task={task} onEdit={handleEditTask} />
              ))}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Flag className="w-5 h-5" />
              <span>Completed Tasks ({completedTasks.length})</span>
            </h2>
            <div className="space-y-3">
              {completedTasks.map(task => (
                <TaskItem key={task.id} task={task} onEdit={handleEditTask} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm || filterCategory !== 'all' || filterPriority !== 'all' 
                ? 'No tasks match your filters' 
                : 'No tasks yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {searchTerm || filterCategory !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first task to get started with productivity'}
            </p>
            {(!searchTerm && filterCategory === 'all' && filterPriority === 'all') && (
              <button
                onClick={handleAddTask}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Create First Task</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Task Modal */}
      {showModal && (
        <TaskModal
          task={editingTask}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default TodoList;