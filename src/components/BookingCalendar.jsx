import React, { useState, useEffect } from 'react';
import {
  Calendar, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import CalendarGrid from './CalendarGrid';
import BookingForm from './BookingForm';
import ClientBookings from './ClientBookings';
import AdminDashboard from './AdminDashboard';
import Legend from './Legend';
import { sendNotificationToSamol, sendClientNotification } from './notificationService';

const BookingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('client');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);

  // Load data from localStorage
  const loadFromStorage = (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const saveToStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const [bookings, setBookings] = useState(() => 
    loadFromStorage('bookings', [
      { 
        id: 1, 
        startDate: '2024-12-08', 
        endDate: '2024-12-08', 
        name: 'John Doe', 
        phone: '555-0101', 
        email: 'john@email.com',
        status: 'approved',
        createdAt: new Date().toISOString()
      },
      { 
        id: 2, 
        startDate: '2024-12-15', 
        endDate: '2024-12-17', 
        name: 'Jane Smith', 
        phone: '555-0102', 
        email: 'jane@email.com',
        status: 'approved',
        createdAt: new Date().toISOString()
      }
    ])
  );

  const [waitlist, setWaitlist] = useState(() => 
    loadFromStorage('waitlist', [])
  );

  const [contacts, setContacts] = useState(() => 
    loadFromStorage('contacts', [
      { name: 'John Doe', phone: '555-0101', email: 'john@email.com' },
      { name: 'Jane Smith', phone: '555-0102', email: 'jane@email.com' }
    ])
  );

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', notes: ''
  });

  // Save to localStorage when data changes
  useEffect(() => {
    saveToStorage('bookings', bookings);
  }, [bookings]);

  useEffect(() => {
    saveToStorage('waitlist', waitlist);
  }, [waitlist]);

  useEffect(() => {
    saveToStorage('contacts', contacts);
  }, [contacts]);

  // Notification function
  const sendNotification = async (type, booking, additionalData = {}) => {
    console.log(`[NOTIFICATION] ${type}:`, booking);
    
    // Send notifications to Samol (admin)
    if (['BOOKING_REQUESTED', 'BOOKING_CANCELLED', 'BOOKING_UPDATED', 'WAITLIST_REQUESTED'].includes(type)) {
      await sendNotificationToSamol(type, booking);
    }

    // Send notifications to client (approvals/rejections)
    if (['BOOKING_APPROVED', 'BOOKING_REJECTED'].includes(type)) {
      await sendClientNotification(booking, type);
    }
  };

  const addToContacts = (contact) => {
    if (!contacts.find(c => c.email === contact.email)) {
      setContacts(prev => [...prev, contact]);
    }
  };

  const handleDateSelect = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const existingBooking = bookings.find(b => 
      b.startDate === dateStr && ['approved', 'pending'].includes(b.status)
    );

    if (existingBooking) {
      setNotification({ 
        type: 'error', 
        message: 'This date is already booked. Would you like to join the waitlist?' 
      });
      setSelectedDate(dateStr);
      setTimeout(() => {
        setShowBookingForm(true);
      }, 2000);
      return;
    }

    setSelectedDate(dateStr);
    setShowBookingForm(true);
    setEditingBooking(null);
  };

  const handleSubmitBooking = (isWaitlist = false) => {
    if (!formData.name || !formData.phone || !formData.email) {
      setNotification({ type: 'error', message: 'Please fill in all required fields.' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    addToContacts(formData);

    if (isWaitlist) {
      const waitlistItem = {
        id: Date.now(),
        date: selectedDate,
        startDate: selectedDate,
        endDate: selectedDate,
        ...formData,
        status: 'waiting',
        createdAt: new Date().toISOString()
      };
      setWaitlist(prev => [...prev, waitlistItem]);
      sendNotification('WAITLIST_REQUESTED', waitlistItem);
      setNotification({ type: 'info', message: 'Added to waitlist! We will notify you if the date becomes available.' });
    } else {
      const newBooking = {
        id: Date.now(),
        startDate: selectedDate,
        endDate: selectedDate,
        ...formData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      setBookings(prev => [...prev, newBooking]);
      sendNotification('BOOKING_REQUESTED', newBooking);
      setNotification({ type: 'success', message: 'Booking request submitted! You will be notified once approved.' });
    }

    setShowBookingForm(false);
    setFormData({ name: '', phone: '', email: '', notes: '' });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleEditBooking = (booking) => {
    if (booking.status === 'approved') {
      setNotification({ type: 'error', message: 'Cannot edit approved bookings. Please contact admin to make changes.' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setEditingBooking(booking);
    setFormData({
      name: booking.name,
      phone: booking.phone,
      email: booking.email,
      notes: booking.notes || ''
    });
    setSelectedDate(booking.startDate);
    setShowBookingForm(true);
  };

  const handleUpdateBooking = () => {
    if (!formData.name || !formData.phone || !formData.email) {
      setNotification({ type: 'error', message: 'Please fill in all required fields.' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const updatedBooking = {
      ...editingBooking,
      ...formData,
      status: 'pending'
    };

    setBookings(prev => prev.map(b => b.id === editingBooking.id ? updatedBooking : b));
    sendNotification('BOOKING_UPDATED', updatedBooking);

    setNotification({ type: 'success', message: 'Booking updated!' });
    setEditingBooking(null);
    setShowBookingForm(false);
    setFormData({ name: '', phone: '', email: '', notes: '' });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleDeleteBooking = (booking) => {
    const userEmail = prompt('Please confirm your email to cancel this booking:');
    
    if (userEmail !== booking.email) {
      setNotification({ type: 'error', message: 'Email does not match. You can only cancel your own bookings.' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setBookings(prev => prev.filter(b => b.id !== booking.id));
    sendNotification('BOOKING_CANCELLED', booking);
    setNotification({ type: 'info', message: 'Booking cancelled.' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleApproveBooking = (id) => {
    const booking = bookings.find(b => b.id === id);
    const updatedBooking = { ...booking, status: 'approved' };
    
    setBookings(prev => prev.map(b => b.id === id ? updatedBooking : b));
    sendNotification('BOOKING_APPROVED', updatedBooking);
    
    // Remove from waitlist if exists
    setWaitlist(prev => prev.filter(w => !(w.date === booking.startDate && w.email === booking.email)));
    
    setNotification({ type: 'success', message: 'Booking approved! Client has been notified.' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRejectBooking = (id) => {
    const booking = bookings.find(b => b.id === id);
    setBookings(prev => prev.filter(b => b.id !== id));
    sendNotification('BOOKING_REJECTED', booking);
    setNotification({ type: 'info', message: 'Booking rejected. Client has been notified.' });
    setTimeout(() => setNotification(null), 3000);
  };

  const getClientBookings = () => {
    if (!formData.email) return [];
    return bookings.filter(b => b.email === formData.email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-10">My Calendar - Samol</h1>
              </div>
            </div>
            <button
              onClick={() => setView(view === 'client' ? 'admin' : 'client')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              {view === 'client' ? 'Admin View' : 'Client View'}
            </button>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
            notification.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
            'bg-blue-100 text-blue-800 border border-blue-200'
          }`}>
            {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {notification.type === 'error' && <XCircle className="w-5 h-5" />}
            {notification.type === 'info' && <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <CalendarGrid
                currentDate={currentDate}
                bookings={bookings}
                waitlist={waitlist}
                setCurrentDate={setCurrentDate}
                onDateSelect={handleDateSelect}
              />
              <Legend />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Form */}
            {showBookingForm && (
              <BookingForm
                formData={formData}
                setFormData={setFormData}
                selectedDate={selectedDate}
                editingBooking={editingBooking}
                contacts={contacts}
                onSubmit={editingBooking ? handleUpdateBooking : handleSubmitBooking}
                onCancel={() => {
                  setShowBookingForm(false);
                  setEditingBooking(null);
                  setFormData({ name: '', phone: '', email: '', notes: '' });
                }}
                isWaitlist={bookings.some(b => 
                  b.startDate === selectedDate && ['approved', 'pending'].includes(b.status)
                )}
              />
            )}

            {/* Client Bookings */}
            {view === 'client' && !showBookingForm && (
              <ClientBookings
                bookings={getClientBookings()}
                waitlist={waitlist.filter(w => w.email === formData.email)}
                onEditBooking={handleEditBooking}
                onDeleteBooking={handleDeleteBooking}
                currentEmail={formData.email}
              />
            )}

            {/* Admin Dashboard */}
            {view === 'admin' && (
              <AdminDashboard
                bookings={bookings}
                waitlist={waitlist}
                contacts={contacts}
                onApproveBooking={handleApproveBooking}
                onRejectBooking={handleRejectBooking}
                onDeleteBooking={handleDeleteBooking}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;