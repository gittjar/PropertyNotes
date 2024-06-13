import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';
import './Styles/styles.css';
import './Styles/buttons.css'

function PropertyForm({ onPropertyAdded }) {
  const [propertyName, setPropertyName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const newProperty = {
      propertyName,
      address,
      city
    };

    axios.post(`${API_BASE_URL}/api/properties`, newProperty)
    .then(response => {
      onPropertyAdded(response.data);
    })
    .catch(error => {
      console.error("Error adding property: ", error);
    });

    setPropertyName('');
    setAddress('');
    setCity('');
    };

  return (
    <form onSubmit={handleSubmit}>
      
        <h3>Lisää uusi kohde</h3>
        <input type="text" value={propertyName} onChange={e => setPropertyName(e.target.value)} placeholder='Kohteen nimi' />
        <br></br>
        <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder='Osoite' />
        <br></br>
        <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder='Kaupunki' />
      <br></br>
      <button type="submit" className='add-button'>Add Property</button>
    </form>
  );
}

export default PropertyForm;