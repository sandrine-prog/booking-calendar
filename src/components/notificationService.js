// src/components/notificationService.js
export const sendNotificationToSamol = (message) => {
  console.log('Notification to Samol:', message);
  // Add your actual notification logic here (API calls, emails, etc.)
  return Promise.resolve(); // Return a promise for async operations
};

export const sendClientNotification = (message) => {
  console.log('Client notification:', message);
  // Add your actual client notification logic here
  return Promise.resolve(); // Return a promise for async operations
};