import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NoteForm from './NoteForm';
import { API_BASE_URL } from './config';
import { BsArrowUpRight } from "react-icons/bs";
import './Styles/styles.css';
import Modal from 'react-modal';

Modal.setAppElement('#root');


function App() {
  const [properties, setProperties] = useState([]);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [modalPropertyId, setModalPropertyId] = useState(null); // Add this line


  const handleOpenModal = (id) => {
    setModalPropertyId(id);
  };

  const handleCloseModal = () => {
    setModalPropertyId(null);
  };


  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/properties`)
      .then(response => {
        const properties = response.data;
        const promises = properties.map(property =>
          axios.get(`${API_BASE_URL}/api/properties/${property._id}/notes`)
        );
        Promise.all(promises)
          .then(noteResponses => {
            const propertiesWithNotes = properties.map((property, index) => ({
              ...property,
              notes: noteResponses[index].data,
              showNoteForm: false, // Add this line
            }));
            setProperties(propertiesWithNotes);
          });
      });
  }, []);

  const handleToggleNoteForm = (id) => {
    setProperties(prevProperties =>
      prevProperties.map(property =>
        property._id === id
          ? { ...property, showNoteForm: !property.showNoteForm }
          : property
      )
    );
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
              <button onClick={() => handleOpenModal(property._id)}>
                Add Note
              </button>
              <Modal
                isOpen={modalPropertyId === property._id}
                onRequestClose={handleCloseModal}
                contentLabel="Note Form"
              >
                <NoteForm propertyId={property._id} onNoteAdded={(newNote) => handleNoteAdded(property._id, newNote)} />
                <button onClick={handleCloseModal}>Close Note</button>
              </Modal>
            </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
}

export default App;