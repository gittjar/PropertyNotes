const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes'); 

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/propertynotes')
  .then(() => console.log('MongoDB connection established'))
  .catch(err => console.log('MongoDB connection error: ', err));

// Use routes
app.use('/', routes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});