import { makeExecutableSchema } from 'graphql-tools';

import { resolvers } from '../resolvers/resolvers';

const typeDefs = `
    type Contact {
        id: ID!
        firstName: String
        lastName: String
        notes: [Note]!
    }

    type Note {
        id: ID!,
        details: String
    }

    input NoteInput {
        contactId: ID!
        details: String
    }

    type Query {
        contacts: [Contact]
        contact(id: ID!): Contact
    }

    type Mutation {
        addContact(id: String!, firstName: String!, lastName: String!): Contact
        addNote(note: NoteInput!): Note
    }

    type Subscription {
        noteAdded(contactId: ID!): Note
    }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export { schema };
