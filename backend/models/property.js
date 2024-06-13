const mongoose = require('mongoose');

// Define the property schema
const PropertySchema = new mongoose.Schema({
  propertyName: String,
  address: String,
  city: String,
  notes: [{
    note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: false } 
  }]
});

// Create the property model
const Property = mongoose.model('Property', PropertySchema);

module.exports = Property;