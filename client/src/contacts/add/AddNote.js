import React from 'react';
import { withRouter } from 'react-router';

import { gql, graphql } from 'react-apollo';

import { contactQuery } from '../contact/Contact';

const AddNote = ({ mutate, match }) => {
    const newId = Math.round(Math.random() * -1000000);
    const handleSubmit = (event) => {
        if (event.keyCode === 13) {
            mutate({
                variables: {
                    note: {
                        contactId: match.params.contactId,
                        details: event.target.value,
                    },
                },
                optimisticResponse: {
                    addNote: {
                        details: event.target.value,
                        id: newId,
                        __typename: 'Note',
                    },
                },
                update: (store, { data: { addNote } }) => {
                    if (!addNote) {
                        return;
                    }

                    const data = store.readQuery({
                        query: contactQuery,
                        variables: {
                            contactId: match.params.contactId,
                        },
                    });

                    if (
                        !data.contact.notes.find(
                            (note) => note.id === addNote.id
                        )
                    ) {
                        data.contact.notes.push(addNote);
                    }

                    store.writeQuery({
                        query: contactQuery,
                        variables: {
                            contactId: match.params.contactId,
                        },
                        data,
                    });
                },
            });

            event.target.value = '';
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Enter new note and press enter"
                onKeyUp={handleSubmit}
            />
        </div>
    );
};

const addNoteMutation = gql`
    mutation addNote($note: NoteInput!) {
        addNote(note: $note) {
            id
            details
        }
    }
`;

const AddNoteWithMutation = graphql(addNoteMutation)(withRouter(AddNote));

export default AddNoteWithMutation;
