import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NoteForm from './NoteForm';
import { API_BASE_URL } from './config';

function App() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/properties`)
      .then(response => {
        setProperties(response.data);
      });
  }, []);

  const handleNoteAdded = (propertyId, newNote) => {
    setProperties(properties.map(property =>
      property._id === propertyId
        ? { 
            ...property, 
            notes: Array.isArray(property.notes) ? [...property.notes, newNote] : [newNote]
          }
        : property
    ));
  };

  return (
    <div>
      {properties.map(property => (
        <div key={property._id}>
          <h2><Link to={`/properties/${property._id}`}>{property.propertyName}</Link></h2>
          <p>{property.address}, {property.city}</p>
          <NoteForm propertyId={property._id} onNoteAdded={(newNote) => handleNoteAdded(property._id, newNote)} />
        </div>
      ))}
    </div>
  );
}

export default App;