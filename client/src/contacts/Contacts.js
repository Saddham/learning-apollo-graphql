import React from 'react';
import { Link } from 'react-router-dom';

import { gql, graphql } from 'react-apollo';

const Contacts = ({ data: { loading, error, contacts } }) => {
    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error.message}</p>;
    }

    return (
        <div className="row">
            <ul className="collection">
                {contacts.map((contact) => (
                    <li key={contact.id} className="collection-item">
                        <Link
                            to={contact.id < 0 ? '/' : `contact/${contact.id}`}
                        >
                            {contact.firstName} {contact.lastName}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export const contactsListQuery = gql`
    query ContactsQuery {
        contacts {
            id
            firstName
            lastName
        }
    }
`;

export default graphql(contactsListQuery)(Contacts);
