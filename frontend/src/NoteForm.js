import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';
import './Styles/styles.css';
import './Styles/buttons.css';

function NoteForm({ propertyId, onNoteAdded, propertyName }) {
  const [newNote, setNewNote] = useState({ content: '', isTrue: false, subnotes: [] });

  const handleNoteChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setNewNote({
      ...newNote,
      [event.target.name]: value,
    });
  };

  const handleAddNote = (event) => {
    event.preventDefault();
    
    if (!propertyId) {
      console.error('Property ID is missing');
      return;
    }

    axios.post(`${API_BASE_URL}/api/properties/${propertyId}/notes`, newNote)
      .then(response => {
        console.log(response.data);
        onNoteAdded(response.data);
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
      <input 
        type="checkbox" 
        name="isTrue" 
        checked={newNote.isTrue} 
        onChange={handleNoteChange} 
      /> Done ?
      <hr />
      <button type="submit" className='add-button'>Add Note</button>
    </form>
  );
}

export default NoteForm;