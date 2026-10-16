import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';

import './Styles/styles.css';
import './Styles/buttons.css';

function SubnoteEditForm({ noteId, subnoteId, onSubnoteUpdated }) {
    const [updatedSubnote, setUpdatedSubnote] = useState({});

    useEffect(() => {
        // Check if noteId and subnoteId are defined and valid
        if (!noteId || !subnoteId || noteId.length !== 24 || subnoteId.length !== 24) {
            console.error('Invalid noteId:', noteId, 'or subnoteId:', subnoteId);
            return;
        }

        // Fetch the subnote details when the component mounts
        axios.get(`${API_BASE_URL}/api/notes/${noteId}/subnotes/${subnoteId}`)
            .then(response => {
                setUpdatedSubnote(response.data);
            });
    }, [noteId, subnoteId]);

    const handleSubnoteChange = (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setUpdatedSubnote({
            ...updatedSubnote,
            [event.target.name]: value,
        });
    };

    const handleUpdateSubnote = (event) => {
        event.preventDefault();
    
        // Check if noteId and subnoteId are defined and valid
        if (!noteId || !subnoteId || noteId.length !== 24 || subnoteId.length !== 24) {
            console.error('Invalid noteId:', noteId, 'or subnoteId:', subnoteId);
            return;
        }
    
        // Convert isTrue to boolean
        const updatedData = {
            ...updatedSubnote,
            isTrue: updatedSubnote.isTrue === 'true' || updatedSubnote.isTrue === true,
        };
    
        axios.put(`${API_BASE_URL}/api/notes/${noteId}/subnotes/${subnoteId}`, updatedData)
            .then(response => {
                console.log(response.data);
                onSubnoteUpdated(noteId, subnoteId, updatedData.isTrue);
            });
    };

    return (
        <form onSubmit={handleUpdateSubnote} className="subnote-edit-form">
            <div className="subnote-edit-form__field">
                <textarea
                    name="content"
                    value={updatedSubnote.content || ''}
                    onChange={handleSubnoteChange}
                    placeholder="Subnote content"
                />
            </div>

            <div className="subnote-edit-form__row">
                <label className="subnote-edit-form__checkbox">
                    <input
                        type="checkbox"
                        name="isTrue"
                        checked={Boolean(updatedSubnote.isTrue)}
                        onChange={handleSubnoteChange}
                    />
                    <span>Completed</span>
                </label>
            </div>

            <div className="button-group form-button-group subnote-edit-form__actions">
                <button type="submit" className='add-button'>Update Subnote</button>
            </div>
        </form>
    );
}

export default SubnoteEditForm;