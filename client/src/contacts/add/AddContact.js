import React, { Component } from 'react';

import { gql, graphql } from 'react-apollo';

import { contactsListQuery } from '../Contacts';

class AddContact extends Component {
    state = {
        firstName: '',
        lastName: '',
    };

    handleSave = ({ mutate }) => {
        const { firstName, lastName } = this.state;
        const id = require('crypto').randomBytes(5).toString('hex');

        this.props
            .mutate({
                variables: { id, firstName, lastName },
                optimisticResponse: {
                    addContact: {
                        id,
                        firstName,
                        lastName,
                        __typename: 'Contact',
                    },
                },
                update: (store, { data: { addContact } }) => {
                    const data = store.readQuery({ query: contactsListQuery });
                    data.contacts.push(addContact);
                    store.writeQuery({ query: contactsListQuery, data });
                },
            })
            .then((res) => {
                this.setState({
                    firstName: '',
                    lastName: '',
                });
            });
    };

    render() {
        return (
            <div className="row">
                <div className="col s5">
                    <input
                        value={this.state.firstName}
                        placeholder="First Name"
                        onChange={(e) =>
                            this.setState({ firstName: e.target.value })
                        }
                    />
                </div>
                <div className="col s5">
                    <input
                        value={this.state.lastName}
                        placeholder="Last Name"
                        onChange={(e) =>
                            this.setState({ lastName: e.target.value })
                        }
                    />
                </div>
                <div className="col s2">
                    <button
                        onClick={this.handleSave}
                        className="btn waves-effect waves-light"
                        type="submit"
                    >
                        Add New
                    </button>
                </div>
            </div>
        );
    }
}

export const createContact = gql`
    mutation AddContact($id: String!, $firstName: String!, $lastName: String!) {
        addContact(id: $id, firstName: $firstName, lastName: $lastName) {
            id
            firstName
            lastName
        }
    }
`;

export default graphql(createContact)(AddContact);
