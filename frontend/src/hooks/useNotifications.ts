import { useEffect, useState } from 'react';

export const useNotifications = () => {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Initialize FCM or push notifications
    // Implement notification setup
  }, []);

  return { notificationCount };
};
