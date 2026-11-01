import { useEffect, useState } from 'react';

const NOTIFICATION_DURATION_MS = 5000;

function useSuccessNotification() {
  const [notification, setNotification] = useState(null);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  useEffect(() => {
    if (!notification) return undefined;

    const updateCountdown = () => {
      const remaining = Math.max(0, Math.ceil((notification.expiresAt - Date.now()) / 1000));
      setSecondsRemaining(remaining);
      if (remaining === 0) {
        setNotification(null);
      }
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 100);
    return () => clearInterval(intervalId);
  }, [notification]);

  const showSuccessNotification = (details) => {
    setSecondsRemaining(5);
    setNotification({ ...details, expiresAt: Date.now() + NOTIFICATION_DURATION_MS });
  };

  const dismissNotification = () => {
    setNotification(null);
    setSecondsRemaining(0);
  };

  return { notification, secondsRemaining, showSuccessNotification, dismissNotification };
}

export default useSuccessNotification;