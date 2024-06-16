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

  const handleSubnoteUpdated = () => {
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
    
  return (
    <div>
     <article className="property-card">
        <button onClick={() => setShowPropertyDeleteModal(true)} className='delete-link-button'> <FiTrash/> </button>      

        <h2>{property.propertyName}</h2>
        <p>{property.address}, {property.city}</p>

        <p>Total notes: {notes.length}</p>
        <p>Completed notes: {notes.filter(note => note.isTrue).length}</p>
        <p>Alert notes: {notes.filter(note => !note.isTrue).length}</p>

        <button onClick={handleBack} className='default-button'>Go Back</button>
        <button onClick={handleOpenModal} className='default-button'>Add Note</button>
      </article>

      <Modal
        isOpen={showPropertyDeleteModal}
        onRequestClose={handlePropertyDeleteCancel}
        contentLabel="Confirm Propert Deletion"
        overlayClassName="ReactModal__Overlay"
        className="ReactModal__Content"
      >
        <h2>Poista kohdetiedot kohteesta {property.propertyName} ?</h2>
       
        <p className='text-warning'>Tämä poistaa kaikki tiedot pysyvästi</p>
        <button onClick={handleDeletePropertyConfirmation} className='delete-button'>Poista</button>
        <button onClick={handlePropertyDeleteCancel} className='default-button'>Älä poista</button>
      </Modal>

      

 

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
  <button onClick={() => openConfirmModal(note._id)} className='delete-button'>Delete Note <FiTrash/></button>        
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
            <h2>Poistetaanko tämä, oletko varma? </h2>
            <p className='text-warning'>Tämä poistaa tietueen kaikki tiedot pysyvästi</p>
           
            <button onClick={handleNoteDelete} className='delete-button'>Poista</button>
            <button onClick={closeConfirmModal} className='default-button'>Älä poista</button>
          </Modal>

          <Modal
            isOpen={subnoteEditModalIsOpen}
            onRequestClose={handleCloseSubnoteEditModal}
            contentLabel="Subnote Edit Form"
            overlayClassName="ReactModal__Overlay"
            className="ReactModal__Content"
          >
            {noteIdToEdit && subnoteToEdit && <SubnoteEditForm noteId={noteIdToEdit} subnoteId={subnoteToEdit} onSubnoteUpdated={handleSubnoteUpdated} />}
            <button onClick={handleCloseSubnoteEditModal} className='default-button'>Sulje</button>
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

    </div>
  );
}

export default PropertyDetails;