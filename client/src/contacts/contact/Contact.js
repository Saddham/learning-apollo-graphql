import React, { Component } from 'react';

import { gql, graphql } from 'react-apollo';

import Notes from '../Notes';
import ContactHeader from './ContactHeader';
import AddNote from '../add/AddNote';

class Contact extends Component {
    componentWillMount() {
        this.props.data.subscribeToMore({
            document: noteSubscriptionQuery,
            variables: {
                contactId: this.props.match.params.contactId,
            },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) {
                    return prev;
                }

                const newNote = subscriptionData.data.noteAdded;

                if (
                    !prev.contact.notes.find((note) => note.id === newNote.id)
                ) {
                    return Object.assign({}, prev, {
                        contact: Object.assign({}, prev.contact, {
                            notes: [...prev.contact.notes, newNote],
                        }),
                    });
                } else {
                  return prev
                }
            },
        });
    }

    render() {
        const {
            data: { loading, error, contact },
            match,
        } = this.props;

        if (loading) {
            return (
                <ContactHeader
                    contactId={match.params.contactId}
                ></ContactHeader>
            );
        }

        if (error) {
            return <p>{error.message}</p>;
        }

        if (contact.notes == null) {
            return (
                <div className="container">
                    <h2>
                        {contact.firstName} {contact.lastName}
                    </h2>
                    <AddNote />
                </div>
            );
        }

        return (
            <div className="container">
                <h2>
                    {contact.firstName} {contact.lastName}
                </h2>
                <Notes notes={contact.notes} />
                <AddNote />
            </div>
        );
    }
}

const noteSubscriptionQuery = gql`
    subscription noteAdded($contactId: ID!) {
        noteAdded(contactId: $contactId) {
            id
            details
        }
    }
`;

export const contactQuery = gql`
    query ContactQuery($contactId: ID!) {
        contact(id: $contactId) {
            id
            firstName
            lastName
            notes {
                id
                details
            }
        }
    }
`;

export default graphql(contactQuery, {
    options: (props) => ({
        variables: { contactId: props.match.params.contactId },
    }),
})(Contact);
