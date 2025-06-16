import React from 'react';
import { Menu } from 'lucide-react';
import { ViewMode } from '../../types';

interface HeaderProps {
  currentView: ViewMode;
  onMenuToggle: () => void;
}

const viewTitles: Record<ViewMode, string> = {
  todo: 'Tasks',
  notes: 'Sticky Notes',
  calendar: 'Calendar',
  whiteboard: 'Whiteboard',
};

export function Header({ currentView, onMenuToggle }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {viewTitles[currentView]}
          </h2>
        </div>
      </div>
    </header>
  );
}