import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, List } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import EventModal from './EventModal';
import { CalendarEvent } from '../../types';

const Calendar: React.FC = () => {
  const { events, addEvent } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Generate calendar days
  const calendarDays = [];
  
  // Previous month days
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    calendarDays.push({ date, isCurrentMonth: false });
  }
  
  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    calendarDays.push({ date, isCurrentMonth: true });
  }
  
  // Next month days to fill the grid
  const remainingCells = 42 - calendarDays.length;
  for (let day = 1; day <= remainingCells; day++) {
    const date = new Date(year, month + 1, day);
    calendarDays.push({ date, isCurrentMonth: false });
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setEditingEvent(null);
    setShowEventModal(true);
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingEvent(event);
    setSelectedDate(null);
    setShowEventModal(true);
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate?.toDateString() === date.toDateString();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calendar</h1>
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded transition-colors ${
                viewMode === 'month'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded transition-colors ${
                viewMode === 'week'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Week
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedDate(new Date());
            setEditingEvent(null);
            setShowEventModal(true);
          }}
          className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Event</span>
        </button>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {monthNames[month]} {year}
          </h2>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Week Days Header */}
          {weekDays.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {calendarDays.map(({ date, isCurrentMonth }, index) => {
            const dayEvents = getEventsForDate(date);
            
            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                className={`min-h-[120px] p-2 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left relative ${
                  !isCurrentMonth ? 'text-gray-400 dark:text-gray-600' : 'text-gray-900 dark:text-white'
                } ${
                  isToday(date) ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' : ''
                } ${
                  isSelected(date) ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <span className={`text-sm font-medium ${
                  isToday(date) ? 'text-blue-600 dark:text-blue-400' : ''
                }`}>
                  {date.getDate()}
                </span>
                
                {/* Events */}
                <div className="mt-1 space-y-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      onClick={(e) => handleEventClick(event, e)}
                      className="text-xs px-2 py-1 rounded truncate hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: event.color, color: '#fff' }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 px-2">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Today's Events */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5" />
          <span>Today's Events</span>
        </h3>
        
        {getEventsForDate(today).length > 0 ? (
          <div className="space-y-3">
            {getEventsForDate(today).map(event => (
              <div
                key={event.id}
                onClick={() => handleEventClick(event, {} as React.MouseEvent)}
                className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: event.color }}
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{event.title}</h4>
                  {event.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">{event.description}</p>
                  )}
                  {event.startTime && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {event.startTime} {event.endTime && `- ${event.endTime}`}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No events scheduled for today
          </p>
        )}
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <EventModal
          event={editingEvent}
          defaultDate={selectedDate}
          onClose={() => {
            setShowEventModal(false);
            setEditingEvent(null);
            setSelectedDate(null);
          }}
        />
      )}
    </div>
  );
};

export default Calendar;