const express = require('express');
const router = express.Router();
const Property = require('./models/property');
const Note = require('./models/note');


router.get('/', (req, res) => {
  res.send('Hello from the backend server!');
});

router.post('/api/properties', (req, res) => {
  const newProperty = new Property(req.body);

  newProperty.save()
    .then(() => res.json('Property added!'))
    .catch(err => {
      console.error(err);
      res.status(400).json('Error: ' + err);
    });
});

router.get('/api/properties', (req, res) => {
  Property.find()
    .populate('notes')
    .then(properties => res.json(properties))
    .catch(err => {
      console.error(err);
      res.status(400).json('Error: ' + err);
    });
});

router.get('/api/properties/:id', (req, res) => {
  Property.findById(req.params.id)
    .populate('notes')
    .then(property => res.json(property))
    .catch(err => {
      console.error(err);
      res.status(400).json('Error: ' + err);
    });
});


router.delete('/api/properties/:id', (req, res) => {
  Property.findByIdAndDelete(req.params.id)
    .then(() => res.json('Property deleted!'))
    .catch(err => {
      console.error(err);
      res.status(400).json('Error: ' + err);
    });
});


router.post('/api/properties/:id/notes', (req, res) => {
  const newNote = new Note({
    content: req.body.content,
    isTrue: req.body.isTrue,
    property: req.params.id
  });

  newNote.save()
    .then(() => res.json('Note added!'))
    .catch(err => {
      console.error(err);
      res.status(400).json('Error: ' + err);
    });
});

router.get('/api/properties/:id/notes', (req, res) => {
  Note.find({ property: req.params.id })
    .then(notes => res.json(notes))
    .catch(err => {
      console.error(err);
      res.status(400).json('Error: ' + err);
    });
});

router.put('/api/notes/:id', (req, res) => {
  Note.findById(req.params.id)
    .then(note => {
      note.content = req.body.content;
      note.isTrue = req.body.isTrue;
      return note.save();
    })
    .then(() => res.json('Note updated!'))
    .catch(err => {
      console.error(err);
      res.status(400).json('Error: ' + err);
    });
});

module.exports = router;