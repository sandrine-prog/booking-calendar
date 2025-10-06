import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Phone, Mail, FileText } from 'lucide-react';

const BookingForm = ({ 
  formData, 
  setFormData, 
  selectedDate, 
  editingBooking, 
  contacts, 
  onSubmit, 
  onCancel, 
  isWaitlist 
}) => {
  const [showContactSuggestions, setShowContactSuggestions] = useState(false);

  useEffect(() => {
    if (formData.email && contacts.length > 0) {
      const contact = contacts.find(c => c.email === formData.email);
      if (contact) {
        setFormData(prev => ({
          ...prev,
          name: contact.name,
          phone: contact.phone
        }));
      }
    }
  }, [formData.email, contacts]);

  const filteredContacts = formData.email ? 
    contacts.filter(contact => 
      contact.email.toLowerCase().includes(formData.email.toLowerCase()) ||
      contact.name.toLowerCase().includes(formData.email.toLowerCase())
    ) : [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {editingBooking ? 'Edit Booking' : isWaitlist ? 'Join Waitlist' : 'New Booking'}
        </h3>
        <button
          onClick={onCancel}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-800 font-medium text-sm">
          Selected Date: <span className="font-bold">{selectedDate}</span>
        </p>
        {isWaitlist && (
          <p className="text-orange-600 text-sm mt-1">
            This date is currently booked. You'll be added to the waitlist.
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div className="relative">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <Mail className="w-4 h-4" />
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            onFocus={() => setShowContactSuggestions(true)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
            required
          />
          {showContactSuggestions && filteredContacts.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
              {filteredContacts.map(contact => (
                <button
                  key={contact.email}
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      email: contact.email,
                      name: contact.name,
                      phone: contact.phone
                    }));
                    setShowContactSuggestions(false);
                  }}
                  className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-800">{contact.name}</div>
                  <div className="text-sm text-gray-600">{contact.email}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <User className="w-4 h-4" />
            Full Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <Phone className="w-4 h-4" />
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <FileText className="w-4 h-4" />
            Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Any special requirements or notes..."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(isWaitlist)}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {editingBooking ? 'Update Booking' : isWaitlist ? 'Join Waitlist' : 'Submit Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;