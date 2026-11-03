import React, { useId, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';
import './Styles/styles.css';
import './Styles/buttons.css';
import './Styles/notification-success.css';

const CheckIcon = () => <span className="success-mark" aria-hidden="true">✓</span>;

function SubnoteForm({ noteId, onSubnoteAdded }) {
  const fieldId = useId();
  const contentId = `${fieldId}-content`;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;
  const [newSubnote, setNewSubnote] = useState({ content: '' });
  const [showNotification, setShowNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubnoteChange = (event) => {
    setErrorMessage('');
    setNewSubnote({
      ...newSubnote,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddSubnote = (event) => {
    event.preventDefault();
    const content = newSubnote.content.trim();

    if (!content) {
      setErrorMessage('Add a detail or next step before saving.');
      return;
    }
    if (content.length < 5 || content.length > 1000) {
      setErrorMessage('Please use 5–1000 characters for this detail.');
      return;
    }

    axios.post(`${API_BASE_URL}/api/notes/${noteId}/subnotes`, { ...newSubnote, content })
      .then(response => {
        onSubnoteAdded(response.data);

        setNewSubnote({ content: '' });
        setErrorMessage('');

        // Show notification
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 3000); // Hide after 3 seconds
      })
      .catch(error => {
        setErrorMessage(error.response?.data?.error || 'Subnote could not be added. Please try again.');
      });
  };

  return (
    <div>
      <form onSubmit={handleAddSubnote} noValidate>
        <label className="form-hint" htmlFor={contentId}>Add a detail, update, or next step</label>
        <textarea
          id={contentId}
          name="content"
          value={newSubnote.content}
          onChange={handleSubnoteChange}
          placeholder="For example: Call the plumber to book a visit"
          minLength={5}
          maxLength={1000}
          aria-describedby={`${hintId} ${errorId}`}
        />
        <div className="subnote-form__meta">
          <span id={hintId}>5–1000 characters</span>
          <span>{newSubnote.content.length}/1000</span>
        </div>
        {errorMessage && <p id={errorId} className="form-error" role="alert">{errorMessage}</p>}
        <div className="button-group form-button-group">
          <button type="submit" className='add-button'>Add Subnote</button>
        </div>
      </form>
      {showNotification && (
        <div className="notification-success show" style={{ position: 'relative', bottom: 'auto', left: 'auto', transform: 'none', marginTop: '12px' }}>
          <CheckIcon />
          <span>New subnote was created successfully.</span>
        </div>
      )}
    </div>
  );
}

export default SubnoteForm;