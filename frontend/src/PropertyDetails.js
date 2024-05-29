import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from './config';

function PropertyDetails() {
  const [property, setProperty] = useState(null);
  const [notes, setNotes] = useState([]);
  const { id } = useParams();

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

  if (!property) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{property.propertyName}</h2>
      <p>{property.address}, {property.city}</p>
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