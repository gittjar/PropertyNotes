import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './config';
import NoteForm from './NoteForm';
import SubnoteEditForm from './SubnoteEditForm';
import PropertySummaryCard from './components/PropertySummaryCard';
import NoteCard from './components/NoteCard';
import NoteSorter from './NoteSorter';
import { getOpenNotesCount, getCompletedNotesCount, getAlertNotesCount, isValidDate, formatDateForInput } from './utils/propertyUtils';
import './Styles/buttons.css';
import './Styles/styles.css';
import './Styles/notification-warning.css';
import Modal from 'react-modal';

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

  const fetchNotesWithSubnotes = () => {
    return axios.get(`${API_BASE_URL}/api/properties/${id}/notes`)
      .then(response => {
        const fetchedNotes = response.data || [];

        return Promise.all(fetchedNotes.map(note =>
          axios.get(`${API_BASE_URL}/api/notes/${note._id}/subnotes`)
            .then(subnoteResponse => ({
              ...note,
              subnotes: subnoteResponse.data || []
            }))
        ));
      });
  };
  const [subnoteToEdit, setSubnoteToEdit] = useState(null);
  const [subnoteToDelete, setSubnoteToDelete] = useState(null);
  const [confirmSubnoteModalIsOpen, setConfirmSubnoteModalIsOpen] = useState(false);
  const [showPropertyDeleteModal, setShowPropertyDeleteModal] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null); 
  const [alarmTime, setAlarmTime] = useState(new Date());
  const [showAlarmTimeModal, setShowAlarmTimeModal] = useState(false);
  const [modalPropertyId, setModalPropertyId] = useState(null);
  const [showNotificationWarning, setShowNotificationWarning] = useState(false);
  const [originalNotes, setOriginalNotes] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/properties/${id}`)
      .then(response => {
        setProperty(response.data);
      });

    fetchNotesWithSubnotes()
      .then(notesWithSubnotes => {
        setNotes(notesWithSubnotes);
        setOriginalNotes(notesWithSubnotes);
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
    fetchNotesWithSubnotes().then(notesWithSubnotes => {
      setNotes(notesWithSubnotes);
      setOriginalNotes(notesWithSubnotes);
    });
    handleCloseModal();
  };

  const handleNoteDelete = () => {
    if (noteToDelete) {
      axios.delete(`${API_BASE_URL}/api/notes/${noteToDelete}`)
        .then(() => fetchNotesWithSubnotes())
        .then(notesWithSubnotes => {
          setNotes(notesWithSubnotes);
          setOriginalNotes(notesWithSubnotes);
        });
    }
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
    fetchNotesWithSubnotes().then(notesWithSubnotes => {
      setNotes(notesWithSubnotes);
      setOriginalNotes(notesWithSubnotes);
    });
  };

  const handleSubnoteUpdated = (noteId, subnoteId, isTrue) => {
    setNotes(prevNotes => prevNotes.map(note => 
      note._id === noteId ? {...note, subnotes: note.subnotes.map(subnote => 
        subnote._id === subnoteId ? {...subnote, isTrue} : subnote)} : note));

    fetchNotesWithSubnotes().then(notesWithSubnotes => {
      setNotes(notesWithSubnotes);
      setOriginalNotes(notesWithSubnotes);
    });

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
      .then(() => fetchNotesWithSubnotes())
      .then(notesWithSubnotes => {
        setNotes(notesWithSubnotes);
        setOriginalNotes(notesWithSubnotes);
      })
      .then(() => {
        setShowNotificationWarning(true);
        setTimeout(() => {
          setShowNotificationWarning(false);
        }, 3000);
      })
      .catch(err => {
        console.error(err);
      });

    setConfirmSubnoteModalIsOpen(false);
  }
};

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
    .then(() => fetchNotesWithSubnotes())
    .then(notesWithSubnotes => {
      setNotes(notesWithSubnotes);
      setOriginalNotes(notesWithSubnotes);
      setShowAlarmTimeModal(false);
    })
    .catch(err => {
      console.error(err);
    });
};

const handleFocus = (e) => {
  e.target.readOnly = false;
};

const handleBlur = (e) => {
  e.target.readOnly = true;
};

const handleInput = (e) => {
  setAlarmTime(new Date(e.target.value));
};


  const openNoteModal = (propertyId) => {
    setModalPropertyId(propertyId);
    handleOpenModal(propertyId);
  };

  const totalNotes = notes.length;

  const openNotes = getOpenNotesCount(notes);
  const completedNotes = getCompletedNotesCount(notes);
  const alertNotes = getAlertNotesCount(notes);

  return (
    <div>
      <section className='property-details-main'>
        <PropertySummaryCard
          property={property}
          totalNotes={totalNotes}
          openNotes={openNotes}
          completedNotes={completedNotes}
          alertNotes={alertNotes}
          onBack={handleBack}
          onAddNote={openNoteModal}
          onDeleteProperty={setShowPropertyDeleteModal}
          showNotificationWarning={showNotificationWarning}
        />

        <section className='notes-sort-section'>
          <NoteSorter originalNotes={originalNotes} setNotes={setNotes} />
        </section>

        {notes.map(note => (
          <NoteCard
            key={note._id}
            note={note}
            onOpenAlarmTimeModal={openAlarmTimeModal}
            onOpenConfirmModal={openConfirmModal}
            onOpenSubnoteEditModal={handleOpenSubnoteEditModal}
            onSubnoteDelete={handleSubnoteDelete}
            onSubnoteAdded={handleSubnoteAdded}
          />
        ))}

        <Modal
          isOpen={confirmModalIsOpen}
          onRequestClose={closeConfirmModal}
          contentLabel="Confirm Deletion"
          overlayClassName="ReactModal__Overlay"
          className="ReactModal__Content"
        >
          <h2>Delete this note?</h2>
          <p className='text-warning'>This will delete all information about this note permanently.</p>
          <div className="modal-actions">
            <button onClick={handleNoteDelete} className='delete-button'>Delete</button>
            <button onClick={closeConfirmModal} className='default-button'>Cancel</button>
          </div>
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
          <h2>Delete this subnote?</h2>
          <p className='text-warning'>This action cannot be undone.</p>
          <div className="modal-actions">
            <button onClick={confirmSubnoteDelete} className='delete-button'>Yes, delete</button>
            <button onClick={() => setConfirmSubnoteModalIsOpen(false)} className='default-button'>No, keep it</button>
          </div>
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
        value={formatDateForInput(alarmTime)}
        onChange={(e) => setAlarmTime(new Date(e.target.value))}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onInput={handleInput}
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
          <h2>Delete {property.propertyName}?</h2>
          <p className='text-warning'>This will delete all information about {property.propertyName} permanently.</p>
          <p>Are you sure you want to delete {property.propertyName}?</p>
          <div className="modal-actions">
            <button onClick={handleDeletePropertyConfirmation} className='delete-button'>Delete {property.propertyName}</button>
            <button onClick={handlePropertyDeleteCancel} className='default-button'>Cancel</button>
          </div>
        </Modal>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={handleCloseModal}
          contentLabel="Note Form"
          overlayClassName="ReactModal__Overlay"
          className="ReactModal__Content"
        >
          <NoteForm propertyId={modalPropertyId} onNoteAdded={handleNoteAdded} />
          <button onClick={handleCloseModal} className='default-button'>Close Note</button>
        </Modal>
      </section>
    </div>
  );
}

export default PropertyDetails;