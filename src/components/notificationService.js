// src/components/notificationService.js
import { sendEmailNotification, sendSMSNotification } from '../services/emailService';

// Your contact information
const YOUR_EMAIL = 'samol.oeurn@gmail.com';
const YOUR_PHONE = '+1234567890'; // Update this with your actual phone number

export const sendBookingNotificationToOwner = async (booking) => {
  const subject = `New Booking Request - ${booking.date}`;
  const message = `
New booking request received:

Client: ${booking.name}
Email: ${booking.email}
Phone: ${booking.phone || 'Not provided'}
Date: ${booking.date}
Time: ${booking.time}
Status: ${booking.status}

Please log in to manage this booking.
  `.trim();

  // Send to owner
  await sendEmailNotification(YOUR_EMAIL, subject, message);
  if (YOUR_PHONE) {
    await sendSMSNotification(YOUR_PHONE, `New booking: ${booking.name} on ${booking.date} at ${booking.time}`);
  }
};

export const sendBookingConfirmationToClient = async (booking) => {
  const subject = `Booking Confirmed - ${booking.date} at ${booking.time}`;
  const message = `
Dear ${booking.name},

Your booking has been confirmed!

Date: ${booking.date}
Time: ${booking.time}

Please arrive 10 minutes early.

If you need to cancel or modify your booking, use your email to access your bookings.

Thank you for choosing our service!
  `.trim();

  await sendEmailNotification(booking.email, subject, message);
  if (booking.phone) {
    await sendSMSNotification(booking.phone, `Booking confirmed: ${booking.date} at ${booking.time}`);
  }
};

export const sendBookingRejectionToClient = async (booking) => {
  const subject = `Booking Request - ${booking.date}`;
  const message = `
Dear ${booking.name},

Thank you for your booking request for ${booking.date} at ${booking.time}.

Unfortunately, this time slot is no longer available. You have been added to our waiting list and we will notify you if a spot opens up.

We appreciate your understanding.
  `.trim();

  await sendEmailNotification(booking.email, subject, message);
  if (booking.phone) {
    await sendSMSNotification(booking.phone, `Booking unavailable: ${booking.date}. You're on waiting list.`);
  }
};

export const sendCancellationNotification = async (booking, isOwner = false) => {
  if (isOwner) {
    // Notify owner about cancellation
    const subject = `Booking Cancelled - ${booking.date}`;
    const message = `
Booking cancelled:

Client: ${booking.name}
Date: ${booking.date}
Time: ${booking.time}
    `.trim();

    await sendEmailNotification(YOUR_EMAIL, subject, message);
    if (YOUR_PHONE) {
      await sendSMSNotification(YOUR_PHONE, `Booking cancelled: ${booking.name} - ${booking.date}`);
    }
  } else {
    // Notify client their booking was cancelled
    const subject = `Booking Cancelled - ${booking.date}`;
    const message = `
Dear ${booking.name},

Your booking for ${booking.date} at ${booking.time} has been cancelled.

If this was a mistake or you'd like to reschedule, please contact us.

Thank you.
    `.trim();

    await sendEmailNotification(booking.email, subject, message);
    if (booking.phone) {
      await sendSMSNotification(booking.phone, `Booking cancelled: ${booking.date} at ${booking.time}`);
    }
  }
};

export const sendWaitlistConfirmation = async (booking) => {
  const subject = `Booking Confirmed from Waitlist - ${booking.date}`;
  const message = `
Dear ${booking.name},

Great news! A spot has opened up and your booking has been confirmed from the waiting list!

Date: ${booking.date}
Time: ${booking.time}

Please arrive 10 minutes early.

Thank you for your patience!
  `.trim();

  await sendEmailNotification(booking.email, subject, message);
  if (booking.phone) {
    await sendSMSNotification(booking.phone, `Booking confirmed from waitlist: ${booking.date} at ${booking.time}`);
  }
};