import React, { useId, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';
import './Styles/styles.css';
import './Styles/buttons.css';

const CheckIcon = () => <span className="success-mark" aria-hidden="true">✓</span>;

function NoteForm({ propertyId, onNoteAdded, propertyName, showInlineSuccess = true }) {
  const fieldId = useId();
  const contentId = `${fieldId}-content`;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;
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
    if (!content) {
      setErrorMessage('Add a short note before saving. What needs your attention?');
      return;
    }
    if (content.length < 5 || content.length > 100) {
      setErrorMessage('Please use 5–100 characters so your note is clear and easy to scan.');
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
    <form onSubmit={handleAddNote} noValidate>
      <h3>Add todo, task or note</h3>
      <p>{propertyName}</p>
      <label className="form-hint" htmlFor={contentId}>What needs to be done or remembered?</label>
      <textarea 
        id={contentId}
        name="content" 
        value={newNote.content} 
        onChange={handleNoteChange} 
        placeholder="For example: Check the kitchen tap for leaks"
        className='input-addnote' 
        minLength={5}
        maxLength={100}
        aria-describedby={`${hintId} ${errorId}`}
      />
      <div className="subnote-form__meta">
        <span id={hintId}>5–100 characters</span>
        <span>{newNote.content.length}/100</span>
      </div>
      {errorMessage && <p id={errorId} className="form-error" role="alert">{errorMessage}</p>}
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