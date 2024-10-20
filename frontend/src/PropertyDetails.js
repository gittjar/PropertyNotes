import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './config';
import NoteForm from './NoteForm';
import SubnoteForm from './SubnoteForm';
import SubnoteEditForm from './SubnoteEditForm';
import './Styles/buttons.css';
import './Styles/styles.css';
import Modal from 'react-modal';
import { FiEdit, FiTrash } from "react-icons/fi";
import { FiAlertCircle } from "react-icons/fi";


Modal.setAppElement('#root');

function PropertyDetails(){
  const [property, setProperty] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteIdToEdit, setNoteIdToEdit] = useState(null);
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [subnoteEditModalIsOpen, setSubnoteEditModalIsOpen] = useState(false);
  const [subnoteToEdit, setSubnoteToEdit] = useState(null);
  const [subnoteToDelete, setSubnoteToDelete] = useState(null);
  const [confirmSubnoteModalIsOpen, setConfirmSubnoteModalIsOpen] = useState(false);
  const [showPropertyDeleteModal, setShowPropertyDeleteModal] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null); 
  const [alarmTime, setAlarmTime] = useState(new Date());
  const [showAlarmTimeModal, setShowAlarmTimeModal] = useState(false);

  useEffect(() => {

    
    // Fetch property details
    axios.get(`${API_BASE_URL}/api/properties/${id}`)
      .then(response => {
        setProperty(response.data);
      });

    // Fetch related notes
  // Fetch related notes
  axios.get(`${API_BASE_URL}/api/properties/${id}/notes`)
    .then(response => {
      const fetchedNotes = response.data;

      // Fetch subnotes for each note
      const promises = fetchedNotes.map(note =>
        axios.get(`${API_BASE_URL}/api/notes/${note._id}/subnotes`)
      );

      Promise.all(promises)
        .then(subnoteResponses => {
          const notesWithSubnotes = fetchedNotes.map((note, index) => ({
            ...note,
            subnotes: subnoteResponses[index].data
          }));

          setNotes(notesWithSubnotes);
        });
    });
}, [id]);


  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleBack = () => {
    // Navigate back to the previous page
    navigate(-1);
  };

  const handleNoteAdded = () => {
    // Fetch related notes
    axios.get(`${API_BASE_URL}/api/properties/${id}/notes`)
      .then(response => {
        setNotes(response.data);
      });
    // Close the modal
    handleCloseModal();
  };

  const handleNoteDelete = () => {
    if (noteToDelete) {
      axios.delete(`${API_BASE_URL}/api/notes/${noteToDelete}`)
        .then(() => {
          // Fetch related notes
          axios.get(`${API_BASE_URL}/api/properties/${id}/notes`)
            .then(response => {
              setNotes(response.data);
            });
        });
    }
    // Close the confirmation modal
    setConfirmModalIsOpen(false);
  };
  
  const openConfirmModal = (noteId) => {
    setNoteToDelete(noteId);
    setConfirmModalIsOpen(true);
  };
  
  const closeConfirmModal = () => {
    setConfirmModalIsOpen(false);
  };

  if (!property) {
    return <div>Loading...</div>;
  }

  const handleSubnoteAdded = () => {
    // Fetch related notes
    axios.get(`${API_BASE_URL}/api/properties/${id}/notes`)
      .then(response => {
        setNotes(response.data);
      });
  };

  const handleSubnoteUpdated = (noteId, subnoteId, isTrue) => {
    // Update the state of the notes and subnotes
    setNotes(prevNotes => prevNotes.map(note => 
      note._id === noteId ? {...note, subnotes: note.subnotes.map(subnote => 
        subnote._id === subnoteId ? {...subnote, isTrue} : subnote)} : note));
  
    // Fetch related notes
    axios.get(`${API_BASE_URL}/api/properties/${id}/notes`)
      .then(response => {
        const fetchedNotes = response.data;
  
        // Fetch subnotes for each note
        const promises = fetchedNotes.map(note =>
          axios.get(`${API_BASE_URL}/api/notes/${note._id}/subnotes`)
        );
  
        Promise.all(promises)
          .then(subnoteResponses => {
            const notesWithSubnotes = fetchedNotes.map((note, index) => ({
              ...note,
              subnotes: subnoteResponses[index].data
            }));
  
            setNotes(notesWithSubnotes);
          });
      });
  
    // Close the subnote edit modal
    handleCloseSubnoteEditModal();
  };


const handleOpenSubnoteEditModal = (noteId, subnoteId) => {
  console.log('Opening subnote edit modal with noteId:', noteId, 'and subnoteId:', subnoteId);
  setNoteIdToEdit(noteId);
  setSubnoteToEdit(subnoteId);
  setSubnoteEditModalIsOpen(true);
};

  const handleCloseSubnoteEditModal = () => {
    setSubnoteEditModalIsOpen(false);
  };

// Modify this function to just open the confirmation modal
const handleSubnoteDelete = (noteId, subnoteId) => {
  setNoteIdToEdit(noteId);
  setSubnoteToDelete(subnoteId);
  setConfirmSubnoteModalIsOpen(true); // Use the new state variable here

};

// Perform the deletion in this function
const confirmSubnoteDelete = () => {
  if (noteIdToEdit && subnoteToDelete) {
    axios.delete(`${API_BASE_URL}/api/notes/${noteIdToEdit}/subnotes/${subnoteToDelete}`)
      .then(() => {
        // Fetch related notes
        axios.get(`${API_BASE_URL}/api/properties/${id}/notes`)
          .then(response => {
            const fetchedNotes = response.data;

            // Fetch subnotes for each note
            const promises = fetchedNotes.map(note =>
              axios.get(`${API_BASE_URL}/api/notes/${note._id}/subnotes`)
            );

            Promise.all(promises)
              .then(subnoteResponses => {
                const notesWithSubnotes = fetchedNotes.map((note, index) => ({
                  ...note,
                  subnotes: subnoteResponses[index].data
                }));

                setNotes(notesWithSubnotes);
              });
          });
      });
      setConfirmSubnoteModalIsOpen(false); // Use the new state variable here
    }
};

// Add this function inside the PropertyDetails component
const handleDeletePropertyConfirmation = () => {
  axios.delete(`${API_BASE_URL}/api/properties/${id}`)
    .then(() => {
      navigate(-1);
    })
    .catch(err => {
      console.error(err);
    });
};

const handlePropertyDeleteCancel = () => {
  setShowPropertyDeleteModal(false);
};

const openAlarmTimeModal = (noteId) => {
  setEditingNoteId(noteId);
  setShowAlarmTimeModal(true);
};



const handleAlarmTimeConfirm = () => {
  axios.put(`${API_BASE_URL}/api/notes/${editingNoteId}`, { alarmTime: alarmTime.toISOString() })
    .then(() => {
      setShowAlarmTimeModal(false);
      // Fetch related notes
      axios.get(`${API_BASE_URL}/api/properties/${id}/notes`)
        .then(response => {
          setNotes(response.data);
        });
    })
    .catch(err => {
      console.error(err);
    });
};

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};


const handleFocus = (e) => {
  e.target.readOnly = false;
};

const handleBlur = (e) => {
  e.target.readOnly = true;
};

const handleInput = (e) => {
  e.target.value = alarmTime.toISOString().substring(0, 16);
};

  return (
    <div>
      <section className='property-details-main'>
      <article className="property-card">

        <h2>{property.propertyName}</h2>
        <hr></hr>
        <p>{property.address}, {property.city}</p>

        <table className='subnote-table'>
          <thead>
            <tr>
              <th>Note Status</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total notes</td>
              <td>{notes.length}</td>
            </tr>
            <tr>
              <td>Open notes</td>
              <td>{notes.filter(note => note.subnotes.length === 0 || !note.subnotes.every(subnote => subnote.isTrue)).length}</td>
            </tr>
            <tr>
              <td>Completed notes</td>
              <td>{notes.filter(note => note.subnotes.length === 0 || note.subnotes.every(subnote => subnote.isTrue)).length}</td>
            </tr>
            <tr>
              <td>Alert notes</td>
              <td>{notes.filter(note => (note.subnotes.length === 0 || !note.subnotes.every(subnote => subnote.isTrue)) && isValidDate(note.alarmTime) && new Date(note.alarmTime) < new Date()).length}</td>
            </tr>
          </tbody>
        </table>
        <button onClick={handleBack} className='default-button'>Go Back</button>
        <button onClick={handleOpenModal} className='add-button'>Add Note</button>
        <hr></hr>
        <button onClick={() => setShowPropertyDeleteModal(true)} className='delete-link-button'> <FiTrash/> Delete property </button>      

      </article>

      {/* Display notes */}
      {notes.map(note => (
        <div key={note.id} className='note-card'>
          <article className='note-info'>
            <h4>{note.content}</h4>
            <p className="note-info-row">Created at: {new Date(note.createdAt).toLocaleString()}</p>
            <p className="note-info-row">Last updated at: {new Date(note.updatedAt).toLocaleString()}</p>
            <p className="note-info-row">
              {note.alarmTime && isValidDate(note.alarmTime) && new Date(note.alarmTime) < new Date() && (
                <span className='text-warning'> <FiAlertCircle/> </span>
              )}
              Alarm Time: {note.alarmTime ? new Date(note.alarmTime).toLocaleString() : 'Not set'}
            </p>
            <p className="note-info-row">
              Status: 
              {note.subnotes.length === 0 
                ? (note.isTrue ? 'Completed' : 'Open') 
                : (note.subnotes.every(subnote => subnote.isTrue) ? 'Completed' : 'Open')
              }
            </p>
            <p className="note-info-row">Subnotes: {note.subnotes.length}</p>
            <article className='note-button-group'>
              <button onClick={() => openAlarmTimeModal(note._id)} className='default-button'>Set alarm</button>
              <button onClick={() => openConfirmModal(note._id)} className='delete-button'>Delete note <FiTrash/></button> 
            </article>      
          </article>

          {/* Display subnotes */}
          <article className='subnotes'>
            <h4>Subnotes</h4>
            <table className='subnote-table'>
              <thead>
                <tr>
                  <th>Content</th>
                  <th>Created At</th>
                  <th>Last Updated At</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {note.subnotes.map(subnote => (
                  <tr key={subnote._id}>
                    <td className="truncate" title={subnote.content}>
                      {subnote.content.length > 20 ? `${subnote.content.substring(0, 20)}...` : subnote.content}
                    </td>          
                    <td>{new Date(subnote.createdAt).toLocaleString()}</td>
                    <td>{new Date(subnote.updatedAt).toLocaleString()}</td>
                    <td>{subnote.isTrue ? 'Completed' : 'Open'}</td>
                    <td>
                      <button onClick={() => handleOpenSubnoteEditModal(note._id, subnote._id)} className='edit-link-button'><FiEdit/></button>   
                      <button onClick={() => handleSubnoteDelete(note._id, subnote._id)} className='delete-link-button'><FiTrash/></button>          
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>

          {/* Add SubnoteForm for each note */}
          <SubnoteForm noteId={note._id} onSubnoteAdded={handleSubnoteAdded} />       
        </div>
      ))}

      <Modal
        isOpen={confirmModalIsOpen}
        onRequestClose={closeConfirmModal}
        contentLabel="Confirm Deletion"
        overlayClassName="ReactModal__Overlay"
        className="ReactModal__Content"
      >
        <h2>Delete this, are you sure?</h2>
        <p className='text-warning'>This will delete all information about this note permanently.</p>
        <button onClick={handleNoteDelete} className='delete-button'>Delete</button>
        <button onClick={closeConfirmModal} className='default-button'>Cancel</button>
      </Modal>

      <Modal
        isOpen={subnoteEditModalIsOpen}
        onRequestClose={handleCloseSubnoteEditModal}
        contentLabel="Subnote Edit Form"
        overlayClassName="ReactModal__Overlay"
        className="ReactModal__Content"
      >
        {noteIdToEdit && subnoteToEdit && <SubnoteEditForm noteId={noteIdToEdit} subnoteId={subnoteToEdit} onSubnoteUpdated={handleSubnoteUpdated} />}
        <button onClick={handleCloseSubnoteEditModal} className='default-button'>Close</button>
      </Modal>

      <Modal
        isOpen={confirmSubnoteModalIsOpen}
        onRequestClose={() => setConfirmSubnoteModalIsOpen(false)} 
        contentLabel="Confirm Deletion"
        overlayClassName="ReactModal__Overlay"
        className="ReactModal__Content"
      >
        <h2>Are you sure you want to delete this?</h2>
        <button onClick={confirmSubnoteDelete} className='default-button'>Yes, delete</button>
        <button onClick={() => setConfirmSubnoteModalIsOpen(false)} className='default-button'>No, don't delete</button>
      </Modal>

      <Modal
      isOpen={showAlarmTimeModal}
      onRequestClose={() => setShowAlarmTimeModal(false)}
      contentLabel="Alarm Time"
      overlayClassName="ReactModal__Overlay"
      className="ReactModal__Content"
    >
      <h2>Set alarm time</h2>
      <input 
        type="datetime-local" 
        value={alarmTime.toISOString().substring(0, 16)} 
        onChange={(e) => setAlarmTime(new Date(e.target.value))} 
        onFocus={handleFocus}
        onBlur={handleBlur}
        onInput={handleInput}
        readOnly
      />
      <button onClick={handleAlarmTimeConfirm} className='default-button'>Confirm</button>
      <button onClick={() => setShowAlarmTimeModal(false)} className='default-button'>Cancel</button>
    </Modal>

      <Modal
        isOpen={showPropertyDeleteModal}
        onRequestClose={handlePropertyDeleteCancel}
        contentLabel="Confirm Property Deletion"
        overlayClassName="ReactModal__Overlay"
        className="ReactModal__Content"
      >
        <h2>Delete {property.propertyName} and all its information.</h2>
        <p className='text-warning'>This will delete all information about {property.propertyName} permanently.</p>
        <p>Are you sure you want to delete {property.propertyName}?</p>
        <button onClick={handleDeletePropertyConfirmation} className='delete-button'>Delete {property.propertyName}</button>
        <button onClick={handlePropertyDeleteCancel} className='default-button'>Cancel</button>
      </Modal>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Note Form"
        overlayClassName="ReactModal__Overlay"
        className="ReactModal__Content"
      >
        <NoteForm propertyId={property.id} onNoteAdded={handleNoteAdded} />
        <button onClick={handleCloseModal} className='default-button'>Close Note</button>
      </Modal>
      </section>
    </div>
  );
}

export default PropertyDetails;