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

  const handleSubnoteChange = (event) => {
    setNewSubnote({
      ...newSubnote,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddSubnote = (event) => {
    event.preventDefault();
    axios.post(`${API_BASE_URL}/api/notes/${noteId}/subnotes`, newSubnote)
      .then(response => {
        console.log(response.data);
        onSubnoteAdded(response.data);

        setNewSubnote({ content: '' });

        // Show notification
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 3000); // Hide after 3 seconds
      });
  };

  return (
    <div>
      <form onSubmit={handleAddSubnote}>
        <textarea name="content" value={newSubnote.content} onChange={handleSubnoteChange} placeholder="Subnote content" />
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