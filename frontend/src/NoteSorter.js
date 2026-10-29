import React, { useEffect, useState } from 'react';

function NoteSorter({ originalNotes, setNotes }) {
  const [activeCriteria, setActiveCriteria] = useState('all');

  useEffect(() => {
    setNotes(originalNotes);
    setActiveCriteria('all');
  }, [originalNotes, setNotes]);

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
    setActiveCriteria(criteria);
  };

  const controls = [
    { criteria: 'newest', icon: '↓', label: 'Newest', title: 'Sort by newest first' },
    { criteria: 'oldest', icon: '↑', label: 'Oldest', title: 'Sort by oldest first' },
    { criteria: 'open', icon: '○', label: 'Open', title: 'Show open notes' },
    { criteria: 'completed', icon: '✓', label: 'Completed', title: 'Show completed notes' },
    { criteria: 'all', icon: '↺', label: 'All', title: 'Show all notes' },
  ];

  return (
    <div className='sort-toolbar' role='group' aria-label='Filter and sort notes'>
      <span className='sort-toolbar__label'>Notes</span>
      <div className='sort-button-group'>
        {controls.map(control => (
          <button
            key={control.criteria}
            type='button'
            className={`sort-button ${activeCriteria === control.criteria ? 'sort-button--active' : ''}`}
            onClick={() => sortNotes(control.criteria)}
            title={control.title}
            aria-label={control.title}
            aria-pressed={activeCriteria === control.criteria}
          >
            <span className='sort-button__icon' aria-hidden='true'>{control.icon}</span>
            <span>{control.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default NoteSorter;