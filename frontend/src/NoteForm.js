import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';

function NoteForm({ propertyId, onNoteAdded }) {
  const [newNote, setNewNote] = useState({ content: '', isTrue: false });

  const handleNoteChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setNewNote({
      ...newNote,
      [event.target.name]: value,
    });
  };

  const handleAddNote = (event) => {
    event.preventDefault();
    axios.post(`${API_BASE_URL}/api/properties/${propertyId}/notes`, newNote)
      .then(response => {
        console.log(response.data);
        onNoteAdded(response.data);
        setNewNote({ content: '', isTrue: false });
      });
  };

  return (
    <form onSubmit={handleAddNote}>
      <input name="content" value={newNote.content} onChange={handleNoteChange} placeholder="Note content" />
      <input type="checkbox" name="isTrue" checked={newNote.isTrue} onChange={handleNoteChange} /> Tehty?
      <button type="submit">Add Note</button>
    </form>
  );
}

export default NoteForm;