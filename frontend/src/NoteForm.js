import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';
import './Styles/styles.css';
import './Styles/buttons.css';

const CheckIcon = () => <span className="success-mark" aria-hidden="true">✓</span>;

function NoteForm({ propertyId, onNoteAdded, propertyName, showInlineSuccess = true }) {
  const [newNote, setNewNote] = useState({ content: '', isTrue: false, subnotes: [] });
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleNoteChange = (event) => {
    const { name, value } = event.target;
    setErrorMessage('');
    setNewNote({
      ...newNote,
      [name]: value,
    });
  };

  const handleAddNote = (event) => {
    event.preventDefault();

    const content = newNote.content.trim();
    if (content.length < 5 || content.length > 100) {
      setErrorMessage('Note must be between 5 and 100 characters.');
      return;
    }

    if (!propertyId) {
      console.error('Property ID is missing');
      return;
    }

    // Ensure isTrue is always false when adding a new note
    const noteToAdd = { ...newNote, content, isTrue: false };

    axios.post(`${API_BASE_URL}/api/properties/${propertyId}/notes`, noteToAdd)
      .then(() => {
        onNoteAdded(noteToAdd.content);
        if (showInlineSuccess) {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2500);
        }
        // Reset the form state after successful submission
        setNewNote({ content: '', isTrue: false, subnotes: [] });
      })
      .catch(error => {
        console.error('Error adding note:', error);
        setErrorMessage(error.response?.data?.error || 'Note could not be added. Please try again.');
      });
  };

  return (
    <form onSubmit={handleAddNote}>
      <h3>Add todo, task or note</h3>
      <p>{propertyName}</p>
      <textarea 
        name="content" 
        value={newNote.content} 
        onChange={handleNoteChange} 
        placeholder="Note content" 
        className='input-addnote' 
        minLength={5}
        maxLength={100}
        required
        aria-describedby="note-content-hint note-content-error"
      />
      <div className="subnote-form__meta">
        <span id="note-content-hint">5–100 characters</span>
        <span>{newNote.content.length}/100</span>
      </div>
      {errorMessage && <p id="note-content-error" className="form-error" role="alert">{errorMessage}</p>}
      <br />
      <p className='small-text'>This creates open Note and alarm is automatic to set 7d from this moment.</p>
      <button type="submit" className='add-button'>Add Note</button>
      {showInlineSuccess && showSuccess && (
        <div className="notification-success show" style={{ position: 'relative', bottom: 'auto', left: 'auto', transform: 'none', marginTop: '12px' }}>
          <CheckIcon />
          <span>New note was created successfully.</span>
        </div>
      )}
    </form>
  );
}

export default NoteForm;