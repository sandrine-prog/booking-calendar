import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Mail, 
  Phone,
  Download
} from 'lucide-react';

const AdminDashboard = ({ 
  bookings, 
  waitlist, 
  contacts, 
  onApproveBooking, 
  onRejectBooking, 
  onDeleteBooking 
}) => {
  const [activeTab, setActiveTab] = useState('pending');

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => {
    switch (activeTab) {
      case 'pending': return booking.status === 'pending';
      case 'approved': return booking.status === 'approved';
      case 'all': return true;
      default: return true;
    }
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    approved: bookings.filter(b => b.status === 'approved').length,
    waitlist: waitlist.length,
    contacts: contacts.length
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const exportData = () => {
    const data = {
      bookings,
      waitlist,
      contacts,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-600" />
          Admin Dashboard
        </h2>
        <button
          onClick={exportData}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-800">{stats.total}</div>
          <div className="text-sm text-blue-600">Total Bookings</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-800">{stats.pending}</div>
          <div className="text-sm text-yellow-600">Pending</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-800">{stats.approved}</div>
          <div className="text-sm text-green-600">Approved</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-800">{stats.waitlist}</div>
          <div className="text-sm text-purple-600">Waitlist</div>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
          <div className="text-2xl font-bold text-indigo-800">{stats.contacts}</div>
          <div className="text-sm text-indigo-600">Contacts</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {[
          { key: 'pending', label: `Pending (${stats.pending})` },
          { key: 'approved', label: `Approved (${stats.approved})` },
          { key: 'waitlist', label: `Waitlist (${stats.waitlist})` },
          { key: 'contacts', label: `Contacts (${stats.contacts})` },
          { key: 'all', label: `All Bookings (${stats.total})` }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activeTab === 'contacts' ? (
          /* Contacts List */
          <div className="space-y-3">
            {contacts.map((contact, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-800">{contact.name}</div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {contact.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {contact.phone}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Bookings: {bookings.filter(b => b.email === contact.email).length}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'waitlist' ? (
          /* Waitlist */
          <div className="space-y-3">
            {waitlist.map(item => (
              <div key={item.id} className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span className="font-semibold text-gray-800">{item.date}</span>
                  </div>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                    Waitlist
                  </span>
                </div>
                <div className="text-sm text-gray-700">
                  <div><strong>Name:</strong> {item.name}</div>
                  <div><strong>Email:</strong> {item.email}</div>
                  <div><strong>Phone:</strong> {item.phone}</div>
                  {item.notes && <div><strong>Notes:</strong> {item.notes}</div>}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Requested: {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Bookings List */
          <div className="space-y-3">
            {(activeTab === 'all' ? bookings : filteredBookings).map(booking => (
              <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="font-semibold text-gray-800">{booking.startDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    {booking.status === 'pending' && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => onApproveBooking(booking.id)}
                          className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onRejectBooking(booking.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => onDeleteBooking(booking)}
                      className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-700">Client Information</div>
                    <div className="text-gray-600 mt-1">
                      <div><strong>Name:</strong> {booking.name}</div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <strong>Email:</strong> {booking.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <strong>Phone:</strong> {booking.phone}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-700">Booking Details</div>
                    <div className="text-gray-600 mt-1">
                      <div><strong>Status:</strong> {booking.status}</div>
                      <div><strong>Submitted:</strong> {new Date(booking.createdAt).toLocaleDateString()}</div>
                      {booking.notes && (
                        <div><strong>Notes:</strong> {booking.notes}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                {booking.status === 'pending' && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => onApproveBooking(booking.id)}
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Approve
                    </button>
                    <button
                      onClick={() => onRejectBooking(booking.id)}
                      className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-3 h-3" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty States */}
        {((activeTab === 'pending' && stats.pending === 0) ||
          (activeTab === 'approved' && stats.approved === 0) ||
          (activeTab === 'waitlist' && stats.waitlist === 0) ||
          (activeTab === 'contacts' && stats.contacts === 0) ||
          (activeTab === 'all' && stats.total === 0)) && (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No {activeTab} items found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;