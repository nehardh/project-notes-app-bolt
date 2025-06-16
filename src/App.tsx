import React, { useState } from 'react';
import { ViewMode } from './types';
import { useTheme } from './hooks/useTheme';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { TodoList } from './components/TodoList';
import { StickyNotes } from './components/StickyNotes';
import { Calendar } from './components/Calendar';
import { Whiteboard } from './components/Whiteboard';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('todo');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'todo':
        return <TodoList />;
      case 'notes':
        return <StickyNotes />;
      case 'calendar':
        return <Calendar />;
      case 'whiteboard':
        return <Whiteboard />;
      default:
        return <TodoList />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        theme={theme}
        onThemeToggle={toggleTheme}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentView={currentView}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className="flex-1 overflow-auto">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
}

export default App;