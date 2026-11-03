import React from 'react';

const CheckIcon = () => <span className="success-mark" aria-hidden="true">✓</span>;

function SuccessNotification({ notification, secondsRemaining }) {
  if (!notification) return null;
  const isPendingDelete = notification.type === 'delete-pending';
  const isDeleteError = notification.type === 'delete-error';
  const notificationClass = isPendingDelete || isDeleteError ? 'notification-warning' : 'notification-success';
  const progress = Math.max(0, (secondsRemaining / notification.durationSeconds) * 100);

  return (
    <div className={`${notificationClass} show dashboard-success-toast ${isPendingDelete ? 'dashboard-success-toast--pending' : ''}`} role="status" aria-live="polite">
      {isPendingDelete || isDeleteError ? <span className="warning-mark" aria-hidden="true">!</span> : <CheckIcon />}
      <span className="dashboard-success-toast__message">
        {notification.type === 'note' ? (
          <>
            Note <strong>“{notification.noteContent}”</strong> added to <strong>{notification.propertyName}</strong>.
          </>
        ) : isPendingDelete ? (
          <>
            Delete note <strong>“{notification.noteContent}”</strong> from <strong>{notification.propertyName}</strong>?
          </>
        ) : notification.type === 'note-deleted' ? (
          <>
            Note <strong>“{notification.noteContent}”</strong> deleted from <strong>{notification.propertyName}</strong>.
          </>
        ) : notification.type === 'delete-undone' ? (
          <>Deletion cancelled for note <strong>“{notification.noteContent}”</strong>.</>
        ) : isDeleteError ? (
          <>Could not delete note <strong>“{notification.noteContent}”</strong>. Please try again.</>
        ) : (
          <>
            Property <strong>{notification.propertyName}</strong> was created successfully.
          </>
        )}
      </span>
      <span className="dashboard-success-toast__countdown" aria-label={`${secondsRemaining} seconds remaining`}>
        {secondsRemaining}s
      </span>
      {isPendingDelete && (
        <button
          type="button"
          className="dashboard-success-toast__undo"
          onClick={() => {
            notification.onDismiss?.();
            notification.onUndo?.();
          }}
        >
          Undo
        </button>
      )}
      <span className="dashboard-success-toast__progress" style={{ width: `${progress}%` }} />
    </div>
  );
}

export default SuccessNotification;