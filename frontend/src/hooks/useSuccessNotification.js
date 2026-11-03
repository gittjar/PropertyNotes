import { useEffect, useState } from 'react';

const NOTIFICATION_DURATION_MS = 5000;

function useSuccessNotification() {
  const [notification, setNotification] = useState(null);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  useEffect(() => {
    if (!notification) return undefined;
    let hasExpired = false;

    const updateCountdown = () => {
      const remaining = Math.max(0, Math.ceil((notification.expiresAt - Date.now()) / 1000));
      setSecondsRemaining(remaining);
      if (remaining === 0 && !hasExpired) {
        hasExpired = true;
        setNotification(current => current === notification ? null : current);
        notification.onExpire?.();
      }
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 100);
    return () => clearInterval(intervalId);
  }, [notification]);

  const showSuccessNotification = (details) => {
    const durationMs = details.durationMs || NOTIFICATION_DURATION_MS;
    const durationSeconds = Math.ceil(durationMs / 1000);
    setSecondsRemaining(durationSeconds);
    setNotification({ ...details, durationSeconds, expiresAt: Date.now() + durationMs });
  };

  const dismissNotification = () => {
    setNotification(null);
    setSecondsRemaining(0);
  };

  return { notification, secondsRemaining, showSuccessNotification, dismissNotification };
}

export default useSuccessNotification;