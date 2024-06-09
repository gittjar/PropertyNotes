import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';
import './Styles/styles.css';
import './Styles/buttons.css';

function SubnoteForm({ noteId, onSubnoteAdded }) {
  const [newSubnote, setNewSubnote] = useState({ content: '' });

  const handleSubnoteChange = (event) => {
    setNewSubnote({
      ...newSubnote,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddSubnote = (event) => {
    event.preventDefault();
    axios.post(`${API_BASE_URL}/api/notes/${noteId}/subnotes`, newSubnote)
      .then(response => {
        console.log(response.data);
        onSubnoteAdded(response.data);

        setNewSubnote({ content: '' });
      });
  };

  return (
    <form onSubmit={handleAddSubnote}>
      <textarea name="content" value={newSubnote.content} onChange={handleSubnoteChange} placeholder="Subnote content" />
      <br></br>
      <button type="submit" className='add-button'>Add Subnote</button>
    </form>
  );
}

export default SubnoteForm;