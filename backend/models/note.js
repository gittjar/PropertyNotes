const mongoose = require('mongoose');

const SubnoteSchema = new mongoose.Schema({
  content: String,
  isTrue: Boolean
}, { timestamps: true });

const NoteSchema = new mongoose.Schema({
  content: String,
  isTrue: Boolean,
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  },
  subnotes: [SubnoteSchema],
  alarmTime: Date
}, { timestamps: true });

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;