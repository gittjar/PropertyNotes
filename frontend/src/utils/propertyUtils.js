export const isValidDate = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

export const isNoteOpen = (note) => {
  if (!note) return false;

  if (!note.subnotes || !Array.isArray(note.subnotes) || note.subnotes.length === 0) {
    return !note.isTrue;
  }

  return !note.subnotes.every(subnote => subnote.isTrue);
};

export const isNoteCompleted = (note) => {
  if (!note) return false;

  if (!note.subnotes || !Array.isArray(note.subnotes) || note.subnotes.length === 0) {
    return note.isTrue;
  }

  return note.subnotes.every(subnote => subnote.isTrue);
};

export const getOpenNotesCount = (notes = []) => notes.filter(isNoteOpen).length;
export const getCompletedNotesCount = (notes = []) => notes.filter(isNoteCompleted).length;

export const getAlertNotesCount = (notes = []) => {
  return notes.filter(note => {
    if (!isNoteOpen(note)) {
      return false;
    }

    return isValidDate(note.alarmTime) && new Date(note.alarmTime) < new Date();
  }).length;
};

export const formatDateForInput = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '';
  }

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().substring(0, 16);
};
