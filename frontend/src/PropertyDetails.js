import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './config';
import NoteForm from './NoteForm';
import SubnoteForm from './SubnoteForm';
import './Styles/buttons.css';
import './Styles/styles.css';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function PropertyDetails() {
  const [property, setProperty] = useState(null);
  const [notes, setNotes] = useState([]);
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
const [noteToDelete, setNoteToDelete] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

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

  return (
    <div>
      <h2>{property.propertyName}</h2>
      <p>{property.address}, {property.city}</p>

      <p>Total notes: {notes.length}</p>
      <p>Completed notes: {notes.filter(note => note.isTrue).length}</p>
      <p>Alert notes: {notes.filter(note => !note.isTrue).length}</p>

      <button onClick={handleBack} className='default-button'>Go Back</button>
      <button onClick={handleOpenModal} className='default-button'>Add Note</button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Note Form"
        overlayClassName="ReactModal__Overlay"
        className="ReactModal__Content"
      >
        <NoteForm propertyId={id} onNoteAdded={handleNoteAdded} />
        <button onClick={handleCloseModal} className='default-button'>Close Note</button>
      </Modal>

      {/* Display notes */}
      {notes.map(note => (
        <div key={note.id} className='note-card'>
<article className='note-info'>
  <h4>{note.content}</h4>
  <p className="note-info-row">Created at: {new Date(note.createdAt).toLocaleString()}</p>
  <p className="note-info-row">Last updated at: {new Date(note.updatedAt).toLocaleString()}</p>
  <p className="note-info-row">Status: {note.isTrue ? 'Completed' : 'Open'}</p>
  <button onClick={() => openConfirmModal(note._id)} className='delete-button'>Delete Note</button>        
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
      </tr>
    </thead>
    <tbody>
      {note.subnotes.map(subnote => (
        <tr key={subnote._id}>
          <td>{subnote.content}</td>
          <td>{new Date(subnote.createdAt).toLocaleString()}</td>
          <td>{new Date(subnote.updatedAt).toLocaleString()}</td>
          <td>{subnote.isTrue ? 'Completed' : 'Open'}</td>
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
            <h2>Poistetaanko tämä, oletko varma?</h2>
            <button onClick={handleNoteDelete} className='default-button'>Kyllä, poista</button>
            <button onClick={closeConfirmModal} className='default-button'>Ei, älä poista</button>
          </Modal>
    </div>
  );
}

export default PropertyDetails;