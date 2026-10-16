import React from 'react';
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
  return (
    <div key={note.id} className='note-card'>
      <article className='subnotes'>
        <article className='subnote-head'>
          <div className='header4'>{note.content}</div>
          <span>Status:
            {note.subnotes.length === 0
              ? (note.isTrue ? ' Completed' : ' Open')
              : (note.subnotes.every(subnote => subnote.isTrue) ? ' Completed' : ' Open')
            }
          </span>
        </article>

        <section className='subnote-head'>
          <section className='subnote-times'>
            <p className='small-text note-info-row'>Created at: {new Date(note.createdAt).toLocaleString()}</p>
            <p className='small-text note-info-row'>Last updated at: {new Date(note.updatedAt).toLocaleString()}</p>
            <p className="note-info-row">
              {note.alarmTime && new Date(note.alarmTime) < new Date() && (
                <span className='text-warning'> <AlertIcon /> </span>
              )}
              Alarm Time: {note.alarmTime ? new Date(note.alarmTime).toLocaleString() : 'Not set'}
            </p>
          </section>

          <article>
            <button onClick={() => onOpenAlarmTimeModal(note._id)} className='default-button'>Set alarm</button>
            <button onClick={() => onOpenConfirmModal(note._id)} className='delete-button'>Delete note <DeleteIcon /></button>
          </article>
        </section>

        <table className='subnote-table'>
          <thead>
            <tr>
              <th>Content / {note.subnotes.length} subnotes</th>
              <th>Created At</th>
              <th>Last Updated At</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {note.subnotes.map(subnote => (
              <tr key={subnote._id}>
                <td className="truncate" title={subnote.content}>
                  {subnote.content.length > 20 ? `${subnote.content.substring(0, 20)}...` : subnote.content}
                </td>
                <td>{new Date(subnote.createdAt).toLocaleString()}</td>
                <td>{new Date(subnote.updatedAt).toLocaleString()}</td>
                <td>{subnote.isTrue ? 'Completed' : 'Open'}</td>
                <td>
                  <button onClick={() => onOpenSubnoteEditModal(note._id, subnote._id)} className='edit-link-button'><EditIcon /></button>
                  <button onClick={() => onSubnoteDelete(note._id, subnote._id)} className='delete-link-button'><DeleteIcon /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className='small-text'>When all subnotes are done, Note is completed.</p>
      </article>

      <SubnoteForm noteId={note._id} onSubnoteAdded={onSubnoteAdded} />
    </div>
  );
}

export default NoteCard;
