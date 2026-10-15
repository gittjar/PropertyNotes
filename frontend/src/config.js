// config.js

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const API_BASE_URL = isLocalhost
  ? 'http://localhost:3001'
  : 'https://propertynotesapp-backend.onrender.com';

// Jos haluat pakottaa paikallisen kehityksen, voit käyttää:
// export const API_BASE_URL = 'http://localhost:3001';
// Jos haluat pakottaa pilven, käytä:
// export const API_BASE_URL = 'https://propertynotesapp-backend.onrender.com';