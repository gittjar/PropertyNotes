import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';
import './Styles/styles.css';
import './Styles/buttons.css';

function NoteForm({ propertyId, onNoteAdded, propertyName }) {
  const [newNote, setNewNote] = useState({ content: '', isTrue: false, subnotes: [] });

  const handleNoteChange = (event) => {
    const { name, value } = event.target;
    setNewNote({
      ...newNote,
      [name]: value,
    });
  };

  const handleAddNote = (event) => {
    event.preventDefault();
    
    if (!propertyId) {
      console.error('Property ID is missing');
      return;
    }

    // Ensure isTrue is always false when adding a new note
    const noteToAdd = { ...newNote, isTrue: false };

    axios.post(`${API_BASE_URL}/api/properties/${propertyId}/notes`, noteToAdd)
      .then(response => {
        console.log(response.data);
        onNoteAdded(response.data);
        // Reset the form state after successful submission
        setNewNote({ content: '', isTrue: false, subnotes: [] });
      })
      .catch(error => {
        console.error('Error adding note:', error);
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
      />
      <br />
      <p className='small-text'>This creates open Note and alarm is automatic to set 7d from this moment.</p>
      <button type="submit" className='add-button'>Add Note</button>
    </form>
  );
}

export default NoteForm;