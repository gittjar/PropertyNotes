import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import NoteForm from './NoteForm';
import PropertyForm from './PropertyForm';
import SuccessNotification from './components/SuccessNotification';
import useSuccessNotification from './hooks/useSuccessNotification';
import { API_BASE_URL } from './config';
import { getOpenNotesCount, getCompletedNotesCount } from './utils/propertyUtils';
import './Styles/styles.css';
import './Styles/spinner.css';
import './Styles/notification-success.css';
import './Styles/notification-warning.css';

Modal.setAppElement('#root');

const ArrowIcon = () => <span aria-hidden="true">↗</span>;
const SortIcon = () => <span aria-hidden="true">⇅</span>;
const WarningIcon = () => <span className="warning-mark" aria-hidden="true">⚠</span>;

function Properties() {
  const [properties, setProperties] = useState([]);
  const [propertyAdded, setPropertyAdded] = useState(false); 
  const [modalPropertyId, setModalPropertyId] = useState(null);
  const [quickViewPropertyId, setQuickViewPropertyId] = useState(null);
  const [isPropertyFormModalOpen, setIsPropertyFormModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true); // Add loading state
  const { notification, secondsRemaining, showSuccessNotification } = useSuccessNotification();

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
    setLoading(true); // Set loading to true when starting the fetch
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
            setLoading(false); // Set loading to false after data is fetched
            
        });
      });
    setPropertyAdded(false); // Reset the flag after fetching properties
  }, [propertyAdded]); // Re-fetch properties when propertyAdded changes
  
  const handleNoteAdded = (propertyId, noteContent) => {
    const propertyName = properties.find(property => property._id === propertyId)?.propertyName || 'Property';
    showSuccessNotification({
      type: 'note',
      propertyName,
      noteContent,
    });

    axios.get(`${API_BASE_URL}/api/properties/${propertyId}/notes`)
      .then(response => {
        setProperties(prevProperties => prevProperties.map(property => (
          property._id === propertyId
            ? { ...property, notes: response.data }
            : property
        )));
      })
      .catch(error => console.error('Could not refresh property notes:', error));

    handleCloseModal();
  };

  const handlePropertyAdded = (newProperty) => {
    setPropertyAdded(true); // Trigger useEffect to re-fetch properties
    showSuccessNotification({
      type: 'property',
      propertyName: newProperty.propertyName,
    });
    // Add the new property to the properties state
    setProperties(prevProperties => [
      ...prevProperties, 
      { ...newProperty, notes: [] }
    ]);
  };

  const handleSortByOpenNotes = () => {
    const sortedProperties = [...properties].sort((a, b) => {
      const openNotesA = a.notes.filter(note => {
        if (!note.subnotes || !Array.isArray(note.subnotes) || note.subnotes.length === 0) {
          return !note.isTrue;
        }
        return !note.subnotes.every(subnote => subnote.isTrue);
      }).length;

      const openNotesB = b.notes.filter(note => {
        if (!note.subnotes || !Array.isArray(note.subnotes) || note.subnotes.length === 0) {
          return !note.isTrue;
        }
        return !note.subnotes.every(subnote => subnote.isTrue);
      }).length;

      if (sortOrder === 'asc') {
        return openNotesA - openNotesB;
      } else {
        return openNotesB - openNotesA;
      }
    });

    setProperties(sortedProperties);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div>
      <section className='property-main'>
        <header className="page-header">
          <div>
            <p className="small-text">Property overview</p>
            <h2 className="page-header__title">Property Notes App</h2>
          </div>
          <div className="page-header__actions button-group">
            <button onClick={handleOpenPropertyFormModal} className='add-button'>Add property</button>
            <Link to="/contact">
              <button className='default-button'>Contact Us</button>
            </Link>
          </div>
        </header>

        <table className='property-table'>
          <thead>
            <tr>
              <th>Property Name</th>
              <th>Warnings</th>
              <th onClick={handleSortByOpenNotes} className="sort-header">
                <span>Notes open</span>
                <SortIcon />
              </th>
              <th className='notes-total'>Notes total</th>
              <th className='notes-done'>Notes done</th>
              <th className='address'>Address</th>
              <th className='city'>City</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="loading-cell">
                  <div className="loading-state" role="status" aria-live="polite">
                    <div className="spinner" aria-hidden="true" />
                    <span>Loading ...</span>
                    <span className="loading-state__hint">Fetching your properties and notes</span>
                  </div>
                </td>
              </tr>
            ) : (
              properties.map(property => (
                <tr key={property._id}>
                  <td>
                    <div
                      className={`property-quick-view${quickViewPropertyId === property._id ? ' property-quick-view--pinned' : ''}`}
                      onKeyDown={event => {
                        if (event.key === 'Escape') {
                          setQuickViewPropertyId(null);
                        }
                      }}
                    >
                      <Link to={`/properties/${property._id}`} className="property-link">
                        <span>{property.propertyName}</span>
                        <ArrowIcon />
                      </Link>
                      <button
                        type="button"
                        className="property-quick-view__trigger"
                        aria-label={`Quick view notes for ${property.propertyName}`}
                        aria-expanded={quickViewPropertyId === property._id}
                        onClick={() => setQuickViewPropertyId(currentId => (
                          currentId === property._id ? null : property._id
                        ))}
                      >
                        Quick view
                      </button>
                      <div className={`property-quick-view__panel${quickViewPropertyId === property._id ? ' property-quick-view__panel--pinned' : ''}`}>
                        <div className="property-quick-view__heading">
                          <div>
                            <strong>{property.propertyName}</strong>
                            <span>{getOpenNotesCount(property.notes || [])} open · {property.notes?.length || 0} total</span>
                          </div>
                          <button
                            type="button"
                            className="property-quick-view__close"
                            aria-label="Close quick view"
                            onClick={() => setQuickViewPropertyId(null)}
                          >
                            ×
                          </button>
                        </div>
                        {property.notes?.length ? (
                          <ul className="property-quick-view__notes">
                            {[...property.notes]
                              .sort((first, second) => new Date(second.updatedAt || second.createdAt || 0) - new Date(first.updatedAt || first.createdAt || 0))
                              .slice(0, 5)
                              .map(note => {
                                const isOpen = !note.subnotes?.length
                                  ? !note.isTrue
                                  : !note.subnotes.every(subnote => subnote.isTrue);
                                const alarmDate = note.alarmTime ? new Date(note.alarmTime) : null;
                                const isOverdue = isOpen && alarmDate && !Number.isNaN(alarmDate.getTime()) && alarmDate < new Date();
                                const updatedDate = note.updatedAt ? new Date(note.updatedAt) : null;

                                return (
                                  <li key={note._id}>
                                    <div className="property-quick-view__note-main">
                                      <span className="property-quick-view__note-content" title={note.content}>{note.content}</span>
                                      <span className={`property-quick-view__status property-quick-view__status--${isOverdue ? 'overdue' : isOpen ? 'open' : 'completed'}`}>
                                        {isOverdue ? 'Overdue' : isOpen ? 'Open' : 'Completed'}
                                      </span>
                                    </div>
                                    <span className="property-quick-view__note-details">
                                      {updatedDate && !Number.isNaN(updatedDate.getTime()) && `Updated ${updatedDate.toLocaleDateString()}`}
                                      {alarmDate && !Number.isNaN(alarmDate.getTime()) && ` · Alarm ${alarmDate.toLocaleDateString()}`}
                                    </span>
                                  </li>
                                );
                              })}
                          </ul>
                        ) : (
                          <p className="property-quick-view__empty">No notes yet. Add one to get started.</p>
                        )}
                        {property.notes?.length > 5 && (
                          <span className="property-quick-view__more">Showing 5 most recently updated notes</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    {property.alarm && <span className="text-warning"><WarningIcon /> {property.pastAlarmsCount}</span>}
                  </td>
                  <td>
                    {Array.isArray(property.notes) ? getOpenNotesCount(property.notes) : 0}
                  </td>
                  <td>
                    {Array.isArray(property.notes) ? property.notes.length : 0}
                  </td>
                  <td className='notes-done'>
                    {Array.isArray(property.notes) ? getCompletedNotesCount(property.notes) : 0}
                  </td>
                  <td className='address'>{property.address}</td>
                  <td className='city'>{property.city}</td>
                  <td>
                    <button onClick={() => handleOpenModal(property._id)} className='add-button'>
                      Add Note
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <SuccessNotification notification={notification} secondsRemaining={secondsRemaining} />

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
            onNoteAdded={(noteContent) => handleNoteAdded(modalPropertyId, noteContent)}
            showInlineSuccess={false}
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
          <PropertyForm
            onPropertyAdded={(newProperty) => {
              handlePropertyAdded(newProperty);
              handleClosePropertyFormModal();
            }}
            onClose={handleClosePropertyFormModal}
          />
        </Modal>
      </section>
    </div>
  );
}

export default Properties;