import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarGrid = ({ currentDate, bookings, waitlist, setCurrentDate, onDateSelect }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getDateStatus = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const booking = bookings.find(b => b.startDate === dateStr);
    const waitlistItem = waitlist.find(w => w.date === dateStr);

    if (booking) {
      return {
        status: booking.status,
        isWaitlist: false,
        isPast: date < today
      };
    }

    if (waitlistItem) {
      return {
        status: 'waiting',
        isWaitlist: true,
        isPast: date < today
      };
    }

    return {
      status: 'available',
      isWaitlist: false,
      isPast: date < today
    };
  };

  const getStatusColor = (status, isPast) => {
    if (isPast) return 'bg-gray-100 text-gray-400 cursor-not-allowed';
    
    const colors = {
      available: 'bg-green-100 hover:bg-green-200 border-2 border-green-400 text-green-800',
      pending: 'bg-yellow-100 hover:bg-yellow-200 border-2 border-yellow-400 text-yellow-800',
      approved: 'bg-red-100 hover:bg-red-200 border-2 border-red-400 text-red-800 cursor-not-allowed',
      waiting: 'bg-pink-100 hover:bg-pink-200 border-2 border-pink-400 text-pink-800'
    };
    return colors[status] || colors.available;
  };

  const renderCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Previous month days
    for (let i = 0; i < firstDay; i++) {
      const date = new Date(year, month - 1, getDaysInMonth(new Date(year, month - 1, 1)) - firstDay + i + 1);
      days.push(
        <div key={`prev-${i}`} className="p-2 text-gray-400 bg-gray-50 rounded-lg">
          {date.getDate()}
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const { status, isWaitlist, isPast } = getDateStatus(date);
      const isToday = date.toDateString() === today.toDateString();

      days.push(
        <div
          key={day}
          onClick={() => !isPast && status !== 'approved' && onDateSelect(date)}
          className={`p-2 rounded-lg transition-all cursor-pointer text-center font-medium ${
            getStatusColor(status, isPast)
          } ${isToday ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
        >
          <div className="flex flex-col items-center">
            <span>{day}</span>
            {isWaitlist && (
              <div className="w-2 h-2 bg-pink-500 rounded-full mt-1"></div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekdays.map(day => (
            <div key={day} className="p-2 text-center font-semibold text-gray-600 text-sm">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {renderCalendarDays()}
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;