import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';
import './Styles/styles.css';
import './Styles/buttons.css';
import './Styles/notification-success.css';

const CheckIcon = () => <span className="success-mark" aria-hidden="true">✓</span>;

function SubnoteForm({ noteId, onSubnoteAdded }) {
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

    if (content.length < 5 || content.length > 1000) {
      setErrorMessage('Subnote must be between 5 and 1000 characters.');
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
      <form onSubmit={handleAddSubnote}>
        <textarea
          name="content"
          value={newSubnote.content}
          onChange={handleSubnoteChange}
          placeholder="Subnote content"
          minLength={5}
          maxLength={1000}
          required
          aria-describedby="subnote-content-hint subnote-content-error"
        />
        <div className="subnote-form__meta">
          <span id="subnote-content-hint">5–1000 characters</span>
          <span>{newSubnote.content.length}/1000</span>
        </div>
        {errorMessage && <p id="subnote-content-error" className="form-error" role="alert">{errorMessage}</p>}
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