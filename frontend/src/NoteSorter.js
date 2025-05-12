import React, { useEffect, useState } from 'react';

function NoteSorter({ originalNotes, setNotes }) {
  const [notes, setLocalNotes] = useState(originalNotes);

  useEffect(() => {
    setLocalNotes(originalNotes);
  }, [originalNotes]);

  const sortNotes = (criteria) => {
    let sortedNotes = [...originalNotes];
    if (criteria === 'newest') {
      sortedNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (criteria === 'oldest') {
      sortedNotes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (criteria === 'open') {
      sortedNotes = sortedNotes.filter(note => {
        if (!note.subnotes || note.subnotes.length === 0) {
          return !note.isTrue;
        }
        return !note.subnotes.every(subnote => subnote.isTrue);
      });
    } else if (criteria === 'completed') {
      sortedNotes = sortedNotes.filter(note => {
        if (!note.subnotes || note.subnotes.length === 0) {
          return note.isTrue;
        }
        return note.subnotes.every(subnote => subnote.isTrue);
      });
    }
    setNotes(sortedNotes);
  };

  return (
    <div className='sort-button-group'>
      <button className='default-button' onClick={() => sortNotes('newest')}>Newest creation time</button>
      <button className='default-button' onClick={() => sortNotes('oldest')}>Oldest creation time</button>
      <button className='default-button' onClick={() => sortNotes('open')}>Show all Open Notes</button>
      <button className='default-button' onClick={() => sortNotes('completed')}>Show all Completed Notes</button>
    </div>
  );
}

export default NoteSorter;