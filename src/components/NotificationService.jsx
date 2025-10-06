// notificationService.js

// Send notifications to Samol (admin)
export const sendNotificationToSamol = async (type, booking) => {
  const dateDisplay = booking.startDate === booking.endDate 
    ? booking.startDate 
    : `From ${booking.startDate} To ${booking.endDate}`;
  
  const notifications = {
    'BOOKING_REQUESTED': {
      subject: `📅 New Booking Request - ${dateDisplay}`,
      message: `You have a new booking request!

Booking Details:
📅 Date: ${dateDisplay}
👤 Client: ${booking.name}
📧 Email: ${booking.email}
📞 Phone: ${booking.phone}
${booking.notes ? `📝 Notes: ${booking.notes}` : ''}

Please review and approve this booking in your admin dashboard.`
    },
    'BOOKING_CANCELLED': {
      subject: `❌ Booking Cancelled - ${dateDisplay}`,
      message: `A booking has been cancelled.

Booking Details:
📅 Date: ${dateDisplay}
👤 Client: ${booking.name}
📧 Email: ${booking.email}
📞 Phone: ${booking.phone}

The date is now available for new bookings.`
    },
    'BOOKING_UPDATED': {
      subject: `✏️ Booking Updated - ${dateDisplay}`,
      message: `A booking has been updated.

Booking Details:
📅 Date: ${dateDisplay}
👤 Client: ${booking.name}
📧 Email: ${booking.email}
📞 Phone: ${booking.phone}
${booking.notes ? `📝 Notes: ${booking.notes}` : ''}

Please review the updated details.`
    },
    'WAITLIST_REQUESTED': {
      subject: `⏳ New Waitlist Request - ${dateDisplay}`,
      message: `You have a new waitlist request!

Request Details:
📅 Date: ${dateDisplay}
👤 Client: ${booking.name}
📧 Email: ${booking.email}
📞 Phone: ${booking.phone}
${booking.notes ? `📝 Notes: ${booking.notes}` : ''}

The client will be automatically notified if this date becomes available.`
    }
  };

  const notification = notifications[type];
  if (notification) {
    // Log to console (replace with real email service)
    console.log('📧 EMAIL TO SAMOL 📧');
    console.log(`To: samol.oeurn@gmail.com`);
    console.log(`Subject: ${notification.subject}`);
    console.log(`Message: ${notification.message}`);
    console.log('---');
    
    // In production, replace with:
    // await sendRealEmail('samol.oeurn@gmail.com', notification.subject, notification.message);
  }
};

// Send confirmation/approval notifications to clients
export const sendClientNotification = async (booking, type) => {
  const dateDisplay = booking.startDate === booking.endDate 
    ? booking.startDate 
    : `From ${booking.startDate} To ${booking.endDate}`;
  
  const notifications = {
    'BOOKING_APPROVED': {
      subject: `✅ Booking Confirmed - ${dateDisplay}`,
      message: `Your booking has been confirmed! 🎉

Confirmation Details:
📅 Date: ${dateDisplay}
👤 Name: ${booking.name}
📞 Phone: ${booking.phone}

We look forward to serving you! Please arrive on time for your appointment.

If you need to reschedule or cancel, please contact us at least 24 hours in advance.

Thank you for choosing our service!`
    },
    'BOOKING_REJECTED': {
      subject: `❌ Booking Request Update - ${dateDisplay}`,
      message: `Regarding your booking request:

We're sorry, but we are unable to accommodate your booking request for ${dateDisplay} as the date is no longer available.

You can view other available dates in our booking calendar and submit a new request for a different date.

We appreciate your understanding and hope to serve you another time.`
    }
  };

  const notification = notifications[type];
  if (notification && booking.email) {
    // Log to console (replace with real email service)
    console.log('📧 EMAIL TO CLIENT 📧');
    console.log(`To: ${booking.email}`);
    console.log(`Subject: ${notification.subject}`);
    console.log(`Message: ${notification.message}`);
    console.log('---');
    
    // In production, replace with:
    // await sendRealEmail(booking.email, notification.subject, notification.message);
    
    // Also send SMS notification to client
    const smsMessage = type === 'BOOKING_APPROVED' 
      ? `✅ Booking confirmed for ${dateDisplay}. Check your email for details.`
      : `❌ Your booking request for ${dateDisplay} was not approved. Check email for details.`;
    
    console.log('📱 SMS TO CLIENT 📱');
    console.log(`To: ${booking.phone}`);
    console.log(`Message: ${smsMessage}`);
    console.log('---');
  }
};

// Demo email function (replace with real service)
const sendRealEmail = async (to, subject, message) => {
  // Integration with:
  // - EmailJS, SendGrid, AWS SES, Nodemailer, etc.
  console.log(`[REAL EMAIL] To: ${to}, Subject: ${subject}`);
  return Promise.resolve();
};