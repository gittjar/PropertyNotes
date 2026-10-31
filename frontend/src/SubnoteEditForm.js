import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';

import './Styles/styles.css';
import './Styles/buttons.css';

function SubnoteEditForm({ noteId, subnoteId, onSubnoteUpdated }) {
    const [updatedSubnote, setUpdatedSubnote] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

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
        if (event.target.name === 'content') {
            setErrorMessage('');
        }
        setUpdatedSubnote({
            ...updatedSubnote,
            [event.target.name]: value,
        });
    };

    const handleUpdateSubnote = (event) => {
        event.preventDefault();

        const content = (updatedSubnote.content || '').trim();
        if (content.length < 5 || content.length > 1000) {
            setErrorMessage('Subnote must be between 5 and 1000 characters.');
            return;
        }
    
        // Check if noteId and subnoteId are defined and valid
        if (!noteId || !subnoteId || noteId.length !== 24 || subnoteId.length !== 24) {
            console.error('Invalid noteId:', noteId, 'or subnoteId:', subnoteId);
            return;
        }
    
        // Convert isTrue to boolean
        const updatedData = {
            ...updatedSubnote,
            content,
            isTrue: updatedSubnote.isTrue === 'true' || updatedSubnote.isTrue === true,
        };
    
        axios.put(`${API_BASE_URL}/api/notes/${noteId}/subnotes/${subnoteId}`, updatedData)
            .then(response => {
                onSubnoteUpdated(noteId, subnoteId, updatedData.isTrue);
            })
            .catch(error => {
                setErrorMessage(error.response?.data?.error || 'Subnote could not be updated. Please try again.');
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
                    minLength={5}
                    maxLength={1000}
                    required
                    aria-describedby="subnote-edit-hint subnote-edit-error"
                />
                <div className="subnote-form__meta">
                    <span id="subnote-edit-hint">5–1000 characters</span>
                    <span>{(updatedSubnote.content || '').length}/1000</span>
                </div>
                {errorMessage && <p id="subnote-edit-error" className="form-error" role="alert">{errorMessage}</p>}
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