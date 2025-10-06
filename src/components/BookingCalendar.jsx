// src/components/BookingCalendar.jsx
import React, { useState, useEffect } from 'react';
import { sendNotificationToSamol, sendClientNotification } from './notificationService';
import './BookingCalendar.css';

const BookingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bookings, setBookings] = useState([]);

  // Available time slots
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', 
    '14:00', '15:00', '16:00', '17:00'
  ];

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !name || !email) {
      alert('Please fill in all required fields');
      return;
    }

    const newBooking = {
      id: Date.now(),
      date: selectedDate,
      time: selectedTime,
      name,
      email,
      phone,
      timestamp: new Date().toISOString()
    };

    // Add to bookings
    setBookings(prev => [...prev, newBooking]);
    
    try {
      // Send notifications
      await sendNotificationToSamol(`New booking from ${name} for ${selectedDate} at ${selectedTime}`);
      await sendClientNotification(`Your booking for ${selectedDate} at ${selectedTime} has been confirmed`);
      
      // Reset form
      setSelectedDate('');
      setSelectedTime('');
      setName('');
      setEmail('');
      setPhone('');
      
      alert('Booking submitted successfully!');
    } catch (error) {
      console.error('Error sending notifications:', error);
      alert('Booking submitted, but there was an error sending notifications');
    }
  };

  const deleteBooking = (id) => {
    setBookings(prev => prev.filter(booking => booking.id !== id));
  };

  return (
    <div className="booking-calendar">
      <h1>Booking Calendar</h1>
      
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label htmlFor="date">Select Date:</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={today}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Select Time:</label>
          <select
            id="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            required
          >
            <option value="">Choose a time</option>
            {timeSlots.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone (optional):</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <button type="submit" className="submit-btn">
          Book Appointment
        </button>
      </form>

      {bookings.length > 0 && (
        <div className="bookings-list">
          <h2>Upcoming Bookings</h2>
          {bookings.map(booking => (
            <div key={booking.id} className="booking-item">
              <div className="booking-info">
                <strong>{booking.name}</strong>
                <span>{booking.date} at {booking.time}</span>
                <span>{booking.email}</span>
                {booking.phone && <span>{booking.phone}</span>}
              </div>
              <button 
                onClick={() => deleteBooking(booking.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;