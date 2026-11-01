import React from 'react';

const CheckIcon = () => <span className="success-mark" aria-hidden="true">✓</span>;

function SuccessNotification({ notification, secondsRemaining }) {
  if (!notification) return null;

  return (
    <div className="notification-success show dashboard-success-toast" role="status" aria-live="polite">
      <CheckIcon />
      <span className="dashboard-success-toast__message">
        {notification.type === 'note' ? (
          <>
            Note <strong>“{notification.noteContent}”</strong> added to <strong>{notification.propertyName}</strong>.
          </>
        ) : (
          <>
            Property <strong>{notification.propertyName}</strong> was created successfully.
          </>
        )}
      </span>
      <span className="dashboard-success-toast__countdown" aria-label={`${secondsRemaining} seconds remaining`}>
        {secondsRemaining}s
      </span>
      <span className="dashboard-success-toast__progress" style={{ width: `${secondsRemaining * 20}%` }} />
    </div>
  );
}

export default SuccessNotification;