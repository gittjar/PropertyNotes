import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';
import './Styles/styles.css';
import './Styles/buttons.css'

function PropertyForm({ onPropertyAdded }) {
  const [propertyName, setPropertyName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedPropertyName = propertyName.trim();
    if (!trimmedPropertyName) {
      setErrorMessage('Give this property a name so you can find it later.');
      return;
    }

    const newProperty = {
      propertyName: trimmedPropertyName,
      address: address.trim(),
      city: city.trim()
    };

    axios.post(`${API_BASE_URL}/api/properties`, newProperty)
    .then(response => {
      onPropertyAdded(response.data);
      setPropertyName('');
      setAddress('');
      setCity('');
      setErrorMessage('');
    })
    .catch(error => {
      console.error("Error adding property: ", error);
      setErrorMessage(error.response?.data?.error || 'The property could not be added. Please try again.');
    });
    };

  return (
    <form onSubmit={handleSubmit} noValidate>
      
        <h3>Create new property</h3>
        <label className="form-hint" htmlFor="property-name">Start with a name you will recognize</label>
        <input id="property-name" type="text" value={propertyName} onChange={e => { setPropertyName(e.target.value); setErrorMessage(''); }} placeholder='For example: Summer cottage' aria-describedby="property-form-error" />
        <br></br>
        <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder='Street address (optional)' aria-label="Street address (optional)" />
        <br></br>
        <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder='City (optional)' aria-label="City (optional)" />
      <br></br>
      {errorMessage && <p id="property-form-error" className="form-error" role="alert">{errorMessage}</p>}
      <button type="submit" className='add-button'>Add Property</button>
    </form>
  );
}

export default PropertyForm;