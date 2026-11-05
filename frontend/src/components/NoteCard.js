import React, { useState } from 'react';
import SubnoteForm from '../SubnoteForm';

const EditIcon = () => <span aria-hidden="true">✎</span>;
const DeleteIcon = () => <span aria-hidden="true">🗑</span>;
const AlertIcon = () => <span className="warning-mark" aria-hidden="true">⚠</span>;

function NoteCard({
  note,
  onOpenAlarmTimeModal,
  onOpenConfirmModal,
  onOpenSubnoteEditModal,
  onSubnoteDelete,
  onSubnoteAdded,
}) {
  const [subnoteSort, setSubnoteSort] = useState({ key: 'createdAt', direction: 'desc' });
  const subnotes = Array.isArray(note.subnotes) ? note.subnotes : [];
  const sortedSubnotes = [...subnotes].sort((first, second) => {
    let comparison = 0;
    if (subnoteSort.key === 'content') {
      comparison = (first.content || '').localeCompare(second.content || '', undefined, {
        numeric: true,
        sensitivity: 'base',
      });
    } else if (subnoteSort.key === 'isTrue') {
      comparison = Number(Boolean(first.isTrue)) - Number(Boolean(second.isTrue));
    } else {
      const firstDate = new Date(first[subnoteSort.key]).getTime();
      const secondDate = new Date(second[subnoteSort.key]).getTime();
      comparison = (Number.isNaN(firstDate) ? 0 : firstDate) - (Number.isNaN(secondDate) ? 0 : secondDate);
    }

    return subnoteSort.direction === 'asc' ? comparison : -comparison;
  });
  const handleSubnoteSort = (key) => {
    setSubnoteSort(current => ({
      key,
      direction: current.key === key
        ? current.direction === 'asc' ? 'desc' : 'asc'
        : key === 'createdAt' || key === 'updatedAt' ? 'desc' : 'asc',
    }));
  };
  const renderSubnoteSortHeader = (key, label) => {
    const isActive = subnoteSort.key === key;
    const ariaSort = isActive
      ? subnoteSort.direction === 'asc' ? 'ascending' : 'descending'
      : 'none';

    return (
      <th aria-sort={ariaSort}>
        <button
          type="button"
          className={`subnote-sort-button${isActive ? ' subnote-sort-button--active' : ''}`}
          onClick={() => handleSubnoteSort(key)}
          aria-label={`Sort by ${label}${isActive ? `, ${subnoteSort.direction === 'asc' ? 'ascending' : 'descending'}` : ''}`}
        >
          {label}
          <span aria-hidden="true">{isActive ? subnoteSort.direction === 'asc' ? '↑' : '↓' : '↕'}</span>
        </button>
      </th>
    );
  };
  const isCompleted = subnotes.length === 0
    ? note.isTrue
    : subnotes.every(subnote => subnote.isTrue);
  const shortDateTime = (value) => value
    ? new Date(value).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })
    : 'Not set';
  const alarmIsOverdue = note.alarmTime && new Date(note.alarmTime) < new Date() && !isCompleted;

  return (
    <details className='note-accordion'>
      <summary className='note-accordion__summary'>
        <span className='note-accordion__heading'>
          <span className='note-accordion__title'>{note.content}</span>
          <span className={`note-status ${isCompleted ? 'note-status--completed' : 'note-status--open'}`}>
            {isCompleted ? 'Completed' : 'Open'}
          </span>
          <span className='note-accordion__count' aria-label={`${subnotes.length} subnotes`}>
            {subnotes.length} subnotes
          </span>
          <span className='note-accordion__chevron' aria-hidden='true'>⌄</span>
        </span>
        <span className='note-accordion__metadata'>
          <span title={note.createdAt ? new Date(note.createdAt).toLocaleString() : ''}>
            <span className='note-accordion__metadata-label'>Created</span>
            {shortDateTime(note.createdAt)}
          </span>
          <span title={note.updatedAt ? new Date(note.updatedAt).toLocaleString() : ''}>
            <span className='note-accordion__metadata-label'>Updated</span>
            {shortDateTime(note.updatedAt)}
          </span>
          {note.alarmTime && (
            <span className={alarmIsOverdue ? 'note-accordion__alarm note-accordion__alarm--overdue' : 'note-accordion__alarm'}
              title={`Alarm: ${new Date(note.alarmTime).toLocaleString()}`}>
              {alarmIsOverdue && <AlertIcon />}
              <span className='note-accordion__metadata-label'>Alarm</span>
              {shortDateTime(note.alarmTime)}
            </span>
          )}
        </span>
      </summary>

      <div className='note-accordion__content'>
        <div className='note-card__toolbar'>
          <div className='note-card__metadata'>
            <span>Created {new Date(note.createdAt).toLocaleString()}</span>
            <span>Updated {new Date(note.updatedAt).toLocaleString()}</span>
            <span className={note.alarmTime && new Date(note.alarmTime) < new Date() && !isCompleted ? 'note-card__alarm note-card__alarm--overdue' : 'note-card__alarm'}>
              Alarm {note.alarmTime ? new Date(note.alarmTime).toLocaleString() : 'not set'}
            </span>
          </div>
          <div className='button-group note-action-group'>
            <button onClick={() => onOpenAlarmTimeModal(note._id)} className='default-button'>Set alarm</button>
            <button onClick={() => onOpenConfirmModal(note._id)} className='delete-button'>Delete note <DeleteIcon /></button>
          </div>
        </div>

        <section className='note-card__subnotes' aria-label='Subnotes'>
        <div className='note-card__section-heading'>
          <h4>Subnotes</h4>
          <span>{note.subnotes.length}</span>
        </div>
        {subnotes.length > 0 ? (
          <div className='note-card__table-wrap'>
            <table className='subnote-table'>
              <thead>
                <tr>
                  {renderSubnoteSortHeader('content', 'Name')}
                  {renderSubnoteSortHeader('createdAt', 'Time')}
                  {renderSubnoteSortHeader('updatedAt', 'Updated')}
                  {renderSubnoteSortHeader('isTrue', 'Status')}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedSubnotes.map(subnote => (
                  <tr key={subnote._id}>
                    <td className="truncate" title={subnote.content}>{subnote.content}</td>
                    <td>{new Date(subnote.createdAt).toLocaleString()}</td>
                    <td>{new Date(subnote.updatedAt).toLocaleString()}</td>
                    <td>
                      <span className={`note-status ${subnote.isTrue ? 'note-status--completed' : 'note-status--open'}`}>
                        {subnote.isTrue ? 'Completed' : 'Open'}
                      </span>
                    </td>
                    <td className="table-action-cell">
                      <div className='button-group table-action-group'>
                        <button aria-label='Edit subnote' onClick={() => onOpenSubnoteEditModal(note._id, subnote._id)} className='edit-link-button'><EditIcon /></button>
                        <button aria-label='Delete subnote' onClick={() => onSubnoteDelete(note._id, subnote._id)} className='delete-link-button'><DeleteIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className='note-card__empty'>No subnotes yet.</p>
        )}
        <p className='small-text'>The note is completed when all its subnotes are completed.</p>
        </section>

        <SubnoteForm noteId={note._id} onSubnoteAdded={onSubnoteAdded} />
      </div>
    </details>
  );
}

export default NoteCard;
