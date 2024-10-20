import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NoteForm from './NoteForm';
import { API_BASE_URL } from './config';
import { BsArrowUpRight, BsArrowDownUp, BsExclamationTriangleFill } from "react-icons/bs";
import './Styles/styles.css';
import Modal from 'react-modal';
import PropertyForm from './PropertyForm';

Modal.setAppElement('#root');

function App() {
  const [properties, setProperties] = useState([]);
  const [propertyAdded, setPropertyAdded] = useState(false); 
  const [modalPropertyId, setModalPropertyId] = useState(null);
  const [isPropertyFormModalOpen, setIsPropertyFormModalOpen] = useState(false);
  const [alarm, setAlarm] = useState(false);
  const [pastAlarms, setPastAlarms] = useState([]);

  const handleOpenModal = (id) => {
    setModalPropertyId(id);
  };

  const handleCloseModal = () => {
    setModalPropertyId(null);
  };

  const handleOpenPropertyFormModal = () => {
    setIsPropertyFormModalOpen(true);
  };

  const handleClosePropertyFormModal = () => {
    setIsPropertyFormModalOpen(false);
  }

  useEffect(() => {
    const currentDate = new Date();
    axios.get(`${API_BASE_URL}/api/properties`)
      .then(response => {
        const properties = response.data;
        const promises = properties.map(property =>
          axios.get(`${API_BASE_URL}/api/properties/${property._id}/notes`)
        );
        Promise.all(promises)
          .then(noteResponses => {
            const propertiesWithNotes = properties.map((property, index) => {
              let pastAlarmsCount = 0;
              const propertyWithNotes = {
                ...property,
                notes: noteResponses[index].data,
                showNoteForm: false,
                alarm: false,
              };
              propertyWithNotes.notes.forEach(note => {
                const alarmTime = new Date(note.alarmTime);
                if (currentDate > alarmTime) {
                  propertyWithNotes.alarm = true;
                  pastAlarmsCount++;
                }
              });
              propertyWithNotes.pastAlarmsCount = pastAlarmsCount;
              return propertyWithNotes;
            });
            setProperties(propertiesWithNotes);
        });
      });
    setPropertyAdded(false); // Reset the flag after fetching properties
  }, [propertyAdded]); // Re-fetch properties when propertyAdded changes
  
  const handleNoteAdded = (propertyId, newNote) => {
    setProperties(prevProperties => {
      return prevProperties.map(property => {
        if (property._id === propertyId) {
          return {
            ...property,
            notes: [...property.notes, newNote]
          };
        } else {
          return property;
        }
      });
    });
    handleCloseModal();
  };

  const handlePropertyAdded = (newProperty) => {
    setPropertyAdded(true); // Trigger useEffect to re-fetch properties
    setProperties(prevProperties => [
      ...prevProperties, 
      { ...newProperty, notes: [] }
    ]);
  };

  return (
    <div>
      <section className='property-main'>
        <h2>Property Notes App</h2>
        <button onClick={handleOpenPropertyFormModal} className='add-button'>Add property</button>
        <table className='property-table'>
          <thead>
            <tr>
              <th>Property Name</th>
              <th>Warnings</th>
              <th>Notes open <BsArrowDownUp /></th>
              <th>Notes total</th>
              <th>Notes done</th>
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
                <td>
                  {property.alarm && <span className="text-warning"> <BsExclamationTriangleFill /> {property.pastAlarmsCount}</span>} 
                </td>
                <td>{Array.isArray(property.notes) ? property.notes.length - property.notes.filter(note => note.subnotes && Array.isArray(note.subnotes) && note.subnotes.every(subnote => subnote.isTrue)).length : 0}</td>
                <td>{Array.isArray(property.notes) ? property.notes.length : 0}</td>
                <td>{Array.isArray(property.notes) ? property.notes.filter(note => note.subnotes && Array.isArray(note.subnotes) && note.subnotes.every(subnote => subnote.isTrue)).length : 0}</td>
                <td>{property.address}</td>
                <td>{property.city}</td>
                <td>
                  <button onClick={() => handleOpenModal(property._id)} className='add-button'>
                    Add Note / Todo
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal
          isOpen={modalPropertyId !== null}
          onRequestClose={handleCloseModal}
          contentLabel="Note Form"
          overlayClassName="ReactModal__Overlay"
          className="ReactModal__Content"
        >
          <NoteForm 
            propertyId={modalPropertyId} 
            propertyName={properties.find(property => property._id === modalPropertyId)?.propertyName} 
            onNoteAdded={(newNote) => handleNoteAdded(modalPropertyId, newNote)} 
          />
          <button onClick={handleCloseModal} className='default-button'>Close Note</button>
        </Modal>

        <Modal
          isOpen={isPropertyFormModalOpen}
          onRequestClose={handleClosePropertyFormModal}
          contentLabel="Property Form"
          overlayClassName="ReactModal__Overlay"
          className="ReactModal__Content"
        >
          <PropertyForm onPropertyAdded={(newProperty) => {
            handlePropertyAdded(newProperty);
            handleClosePropertyFormModal();
          }} />
          <button onClick={handleClosePropertyFormModal} className='default-button'>Close Form</button>
        </Modal>
      </section>
    </div>
  );
}

export default App;