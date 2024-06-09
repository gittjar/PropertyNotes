import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './config';
import NoteForm from './NoteForm';
import './Styles/buttons.css';

function PropertyDetails() {
  const [property, setProperty] = useState(null);
  const [notes, setNotes] = useState([]);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch property details
    axios.get(`${API_BASE_URL}/api/properties/${id}`)
      .then(response => {
        setProperty(response.data);
      });

    // Fetch related notes
    axios.get(`${API_BASE_URL}/api/properties/${id}/notes`)
      .then(response => {
        setNotes(response.data);
      });
  }, [id]);

  const handleAddNote = () => {
    // Toggle the note form
    setShowNoteForm(!showNoteForm);
  };

  const handleBack = () => {
    // Navigate back to the previous page
    navigate(-1);
  };

  const handleNoteAdded = (note) => {
    // Add the new note to the notes state
    setNotes(prevNotes => [...prevNotes, note]);
    // Hide the note form
    setShowNoteForm(false);
  };

  if (!property) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{property.propertyName}</h2>
      <p>{property.address}, {property.city}</p>

      <p>Total notes: {notes.length}</p>
      <p>Completed notes: {notes.filter(note => note.isTrue).length}</p>
     <p>Alert notes: {notes.filter(note => !note.isTrue).length}</p>

      <button onClick={handleBack} className='default-button'>Go Back</button>
      <button onClick={handleAddNote} className='default-button' >{showNoteForm ? 'Close Note' : 'Add Note'}</button>


      {/* Show the note form if showNoteForm is true */}
      {showNoteForm && <NoteForm propertyId={id} onNoteAdded={handleNoteAdded} />}

      {/* Display notes */}
      {notes.map(note => (
        <div key={note.id}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
        </div>
      ))}
    </div>
  );
}

export default PropertyDetails;