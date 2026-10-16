import React from 'react';

const AlertIcon = () => <span className="warning-mark" aria-hidden="true">⚠</span>;
const DeleteIcon = () => <span aria-hidden="true">🗑</span>;
const WarningBadge = () => <span className="warning-mark" aria-hidden="true">⚠</span>;

function PropertySummaryCard({
  property,
  totalNotes,
  openNotes,
  completedNotes,
  alertNotes,
  onBack,
  onAddNote,
  onDeleteProperty,
  showNotificationWarning,
}) {
  return (
    <article className="property-card">
      <h2>{property.propertyName}</h2>
      <hr />
      <p>{property.address}, {property.city}</p>

      <table className='subnote-table'>
        <thead>
          <tr>
            <th>Note Status</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total notes</td>
            <td>{totalNotes}</td>
          </tr>
          <tr>
            <td>Open notes</td>
            <td>{openNotes}</td>
          </tr>
          <tr>
            <td>Completed notes</td>
            <td>{completedNotes}</td>
          </tr>
          <tr>
            <td>Alert notes</td>
            <td>{alertNotes}</td>
          </tr>
        </tbody>
      </table>

      <div className="detail-actions button-group">
        <button onClick={onBack} className='default-button'>Back to Properties list</button>
        <button onClick={() => onAddNote(property._id)} className='add-button'>Add Note</button>
      </div>

      <hr />
      <button onClick={() => onDeleteProperty(true)} className='delete-link-button'>
        <DeleteIcon /> Delete property
      </button>

      {showNotificationWarning && (
        <div className="notification-warning show">
          <WarningBadge />
          <span>Subnote has been deleted successfully.</span>
        </div>
      )}

      <div className="property-status-inline">
        <span>{alertNotes > 0 ? <AlertIcon /> : null}</span>
      </div>
    </article>
  );
}

export default PropertySummaryCard;
