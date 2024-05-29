const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  content: String,
  isTrue: Boolean,
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }
});

module.exports = mongoose.model('Note', NoteSchema);