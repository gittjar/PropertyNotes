import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NoteForm from './NoteForm';
import { API_BASE_URL } from './config';
import { BsArrowUpRight } from "react-icons/bs";
import './Styles/styles.css';

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
  <table className='property-table'>
  <thead>
    <tr>
      <th>Property Name</th>
      <th>Notes alert</th>
      <th>Notes total</th>
      <th>Notes tehty</th>
      <th>Address</th>
      <th>City</th>
      <th>Note</th>
    </tr>
  </thead>
  <tbody>
    {properties.map(property => (
      <tr key={property._id}>
        <td>
          <Link to={`/properties/${property._id}`}>
            {property.propertyName} <BsArrowUpRight/>
          </Link>
        </td>
        <td>{Array.isArray(property.notes) ? property.notes.filter(note => !note.isTrue).length : 0}</td>
        <td>{Array.isArray(property.notes) ? property.notes.length : 0}</td>
        <td>{Array.isArray(property.notes) ? property.notes.filter(note => note.isTrue).length : 0}</td>
        <td>{property.address}</td>
        <td>{property.city}</td>
        <td>
          <NoteForm propertyId={property._id} onNoteAdded={(newNote) => handleNoteAdded(property._id, newNote)} />
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
}

export default App;