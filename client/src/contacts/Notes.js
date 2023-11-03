import React from 'react';

const Notes = ({ notes }) => {
    return (
        <ul>
            {notes.map((note) => (
                <li key={note.id}>{note.details}</li>
            ))}
        </ul>
    );
};

export default Notes;
