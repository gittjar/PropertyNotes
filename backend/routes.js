const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Property = require('./models/property');
const Note = require('./models/note');
const { ObjectId } = require('mongodb');

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

router.post('/api/properties/', (req, res) => {
  const newProperty = new Property(req.body);

  newProperty.save()
    .then(() => res.json('Property added: ' + newProperty))
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
  const propertyId = req.params.id;
  const alarmDays = req.body.alarmDays || 7; // Default to 7 if not provided

  // Validate that 'propertyId' is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(400).json({ error: 'Invalid property ID' });
  }

  const newNote = new Note({
    content: req.body.content,
    isTrue: req.body.isTrue,
    property: propertyId,
    alarmTime: new Date(Date.now() + alarmDays * 24 * 60 * 60 * 1000) // Current time + alarmDays days
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
  console.log('Params:', req.params);
  console.log('Body:', req.body);
  
  Note.findById(req.params.id)
    .then(note => {
      if (req.body.content !== undefined) {
        note.content = req.body.content;
      }
      if (req.body.isTrue !== undefined) {
        note.isTrue = req.body.isTrue;
      }
      if (req.body.alarmTime !== undefined) {
        note.alarmTime = req.body.alarmTime;
      }
      return note.save();
    })
    .then(() => res.json('Note updated!'))
    .catch(err => {
      console.error(err);
      res.status(400).json('Error: ' + err);
    });
});

router.delete('/api/notes/:id', async (req, res) => {
  const noteId = req.params.id;

  try {
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).send('Note not found');
    }

    console.log('Deleting note:', note);
    // Delete all subnotes of the note
    note.subnotes = [];
    await note.save();

    // Now delete the note itself
    await Note.findByIdAndDelete(noteId);

    res.status(200).send('Note and its subnotes deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

/*SUBNOTES*/

// Get all subnotes of a note
router.get('/api/notes/:id/subnotes', (req, res) => {
  Note.findById(req.params.id)
    .then(note => res.json(note.subnotes))
    .catch(err => {
      console.error(err);
      res.status(400).json('Error: ' + err);
    });
});

// Get a specific subnote of a note
router.get('/api/notes/:noteId/subnotes/:subnoteId', (req, res) => {
  Note.findById(req.params.noteId)
    .then(note => {
      const subnote = note.subnotes.id(req.params.subnoteId);
      if (subnote) {
        res.json(subnote);
      } else {
        res.status(404).json('Error: Subnote not found');
      }
    })
    .catch(err => {
      console.error(err);
      res.status(400).json('Error: ' + err);
    });
});

// Add a subnote to a note
router.post('/api/notes/:id/subnotes', (req, res) => {
  Note.findById(req.params.id)
    .then(note => {
      note.subnotes.push({
        content: req.body.content,
        isTrue: req.body.isTrue,
        timestamp: new Date(),
        // Add any other fields you want for your subnotes
      });
      return note.save();
    })
    .then(() => res.json('Subnote added!'))
    .catch(err => {
      console.error(err);
      res.status(400).json('Error: ' + err);
    });
});

// Update a subnote of a note
router.put('/api/notes/:noteId/subnotes/:subnoteId', (req, res) => {
  Note.findById(req.params.noteId)
    .then(note => {
      const subnote = note.subnotes.id(req.params.subnoteId);
      subnote.content = req.body.content;
      subnote.isTrue = req.body.isTrue;
      timestamp: new Date();
      // Update any other fields you want for your subnotes
      return note.save();
    })
    .then(() => res.json('Subnote updated!'))
    .catch(err => {
      console.error(err);
      res.status(400).json('Error: ' + err);
    });
});

// Delete a subnote of a note
router.delete('/api/notes/:noteId/subnotes/:subnoteId', (req, res) => {
  const { noteId, subnoteId } = req.params;

  Note.findById(noteId)
    .then(note => {
      const subnote = note.subnotes.id(subnoteId);
      if (!subnote) {
        return res.status(404).send('Subnote not found');
      }
      note.subnotes.pull(subnoteId); // Use the pull function to remove the subnote
      return note.save();
    })
    .then(() => res.status(200).send('Subnote deleted'))
    .catch(err => {
      console.error(err); // Log the error details
      res.status(500).send(err);
    });
});

module.exports = router;