import React from 'react';
import { Calendar, Edit2, Trash2, Clock, CheckCircle } from 'lucide-react';

const ClientBookings = ({ bookings, waitlist, onEditBooking, onDeleteBooking, currentEmail }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'waiting': return <Clock className="w-4 h-4 text-purple-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'waiting': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (bookings.length === 0 && waitlist.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">My Bookings</h3>
        <p className="text-gray-600 text-sm">No bookings or waitlist requests yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">My Bookings & Waitlist</h3>
      
      <div className="space-y-4">
        {/* Current Bookings */}
        {bookings.map(booking => (
          <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-800">{booking.startDate}</span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)} flex items-center gap-1`}>
                {getStatusIcon(booking.status)}
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </div>
            </div>
            
            <div className="text-sm text-gray-600 mb-3">
              <div>Service: Your Service Name</div>
              <div>Submitted: {new Date(booking.createdAt).toLocaleDateString()}</div>
            </div>

            <div className="flex gap-2">
              {booking.status !== 'approved' && (
                <button
                  onClick={() => onEditBooking(booking)}
                  className="flex-1 px-3 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </button>
              )}
              <button
                onClick={() => onDeleteBooking(booking)}
                className="flex-1 px-3 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50 transition-colors text-sm font-medium flex items-center justify-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Cancel
              </button>
            </div>
          </div>
        ))}

        {/* Waitlist Requests */}
        {waitlist.map(item => (
          <div key={item.id} className="border border-purple-200 rounded-lg p-4 bg-purple-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-gray-800">{item.date}</span>
              </div>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                Waitlist
              </span>
            </div>
            <div className="text-sm text-gray-600">
              You'll be notified if this date becomes available
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientBookings;