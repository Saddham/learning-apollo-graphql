import { PubSub, withFilter } from 'graphql-subscriptions';

const pubsub = new PubSub();

const contacts = [
    {
        id: '1',
        firstName: 'Immanuel',
        lastName: 'Henri',
        notes: [
            {
                id: '1',
                details: 'Author at LinkedIn',
            },
        ],
    },
    {
        id: '2',
        firstName: 'Jasmine',
        lastName: 'Henri',
        notes: [
            {
                id: '1',
                details: 'From New York',
            },
        ],
    },
];

export const resolvers = {
    Query: {
        contacts: () => {
            return contacts;
        },
        contact: (root, { id }) => {
            return contacts.find((contact) => contact.id === id);
        },
    },
    Mutation: {
        addContact: (root, args) => {
            const newContact = {
                id: args.id,
                firstName: args.firstName,
                lastName: args.lastName,
                notes: []
            };
            contacts.push(newContact);

            return newContact;
        },
        addNote: (root, { note }) => {
            const newId = require('crypto').randomBytes(5).toString('hex');
            const contact = contacts.find(
                (contact) => contact.id === note.contactId
            );
            const newNote = { id: String(newId), details: note.details };

            contact.notes.push(newNote);

            pubsub.publish('noteAdded', {
                noteAdded: newNote,
                contactId: note.contactId,
            });
        },
    },
    Subscription: {
        noteAdded: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('noteAdded'),
                (payload, variables) => {
                    return payload.contactId === variables.contactId;
                }
            ),
        },
    },
};
