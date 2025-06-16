import React from 'react';
import { CheckSquare, StickyNote, Calendar, PenTool, Clock, TrendingUp } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const Dashboard: React.FC = () => {
  const { tasks, notes, events, setCurrentView } = useApp();

  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const todayEvents = events.filter(event => {
    const today = new Date();
    return event.date.toDateString() === today.toDateString();
  }).length;

  const stats = [
    {
      title: 'Pending Tasks',
      value: pendingTasks,
      icon: CheckSquare,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
      onClick: () => setCurrentView('todos'),
    },
    {
      title: 'Active Notes',
      value: notes.length,
      icon: StickyNote,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/30',
      onClick: () => setCurrentView('notes'),
    },
    {
      title: 'Today\'s Events',
      value: todayEvents,
      icon: Calendar,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/30',
      onClick: () => setCurrentView('calendar'),
    },
    {
      title: 'Completed Tasks',
      value: completedTasks,
      icon: TrendingUp,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/30',
      onClick: () => setCurrentView('todos'),
    },
  ];

  const recentTasks = tasks.slice(-3).reverse();
  const recentNotes = notes.slice(-2).reverse();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Welcome to your ProductiveSpace
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Stay organized, capture ideas, and manage your time all in one beautiful workspace.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.title}
              onClick={stat.onClick}
              className={`${stat.bgColor} p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 hover:scale-105 text-left`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${stat.color}`} />
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {stat.title}
              </h3>
            </button>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Recent Tasks</span>
            </h2>
            <button
              onClick={() => setCurrentView('todos')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all
            </button>
          </div>
          
          {recentTasks.length > 0 ? (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                    {task.title}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {task.category}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No tasks yet. Create your first task to get started!
            </p>
          )}
        </div>

        {/* Recent Notes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <StickyNote className="w-5 h-5" />
              <span>Recent Notes</span>
            </h2>
            <button
              onClick={() => setCurrentView('notes')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all
            </button>
          </div>
          
          {recentNotes.length > 0 ? (
            <div className="space-y-3">
              {recentNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 rounded-lg border-l-4 bg-gray-50 dark:bg-gray-700/50"
                  style={{ borderLeftColor: note.color }}
                >
                  <p className="text-gray-900 dark:text-white line-clamp-3">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No notes yet. Create your first note to capture ideas!
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          What would you like to do today?
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setCurrentView('todos')}
            className="bg-white dark:bg-gray-800 px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 flex items-center space-x-2"
          >
            <CheckSquare className="w-5 h-5 text-blue-600" />
            <span className="text-gray-900 dark:text-white">Manage Tasks</span>
          </button>
          <button
            onClick={() => setCurrentView('notes')}
            className="bg-white dark:bg-gray-800 px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 flex items-center space-x-2"
          >
            <StickyNote className="w-5 h-5 text-yellow-600" />
            <span className="text-gray-900 dark:text-white">Create Notes</span>
          </button>
          <button
            onClick={() => setCurrentView('calendar')}
            className="bg-white dark:bg-gray-800 px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 flex items-center space-x-2"
          >
            <Calendar className="w-5 h-5 text-green-600" />
            <span className="text-gray-900 dark:text-white">Plan Events</span>
          </button>
          <button
            onClick={() => setCurrentView('whiteboard')}
            className="bg-white dark:bg-gray-800 px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 flex items-center space-x-2"
          >
            <PenTool className="w-5 h-5 text-purple-600" />
            <span className="text-gray-900 dark:text-white">Open Whiteboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;