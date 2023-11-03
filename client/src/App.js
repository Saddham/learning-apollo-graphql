import React from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';

import {
    ApolloClient,
    ApolloProvider,
    createNetworkInterface,
    toIdValue,
} from 'react-apollo';
import {
    SubscriptionClient,
    addGraphQLSubscriptions,
} from 'subscriptions-transport-ws';

import Contacts from './contacts/Contacts';
import AddContact from './contacts/add/AddContact';
import Contact from './contacts/contact/Contact';

const SERVER_PORT = 8080;

const networkInterface = createNetworkInterface({
    uri: `http://localhost:${SERVER_PORT}/graphql`,
});

const wsClient = new SubscriptionClient(
    `ws://localhost:${SERVER_PORT}/subscriptions`,
    {
        reconnect: true,
    }
);

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
    networkInterface,
    wsClient
);

const dataIdFromObject = (result) => {
    if (result.__typename) {
        if (result.id) {
            return `${result.__typename}:${result.id}`;
        }
    }
};

const client = new ApolloClient({
    networkInterface: networkInterfaceWithSubscriptions,
    customResolvers: {
        Query: {
            contact: (__, args) => {
                return toIdValue(
                    dataIdFromObject({ __typename: 'Contact', id: args['id'] })
                );
            },
        },
    },
    dataIdFromObject,
});

function App() {
    return (
        <ApolloProvider client={client}>
            <BrowserRouter>
                <div>
                    <div className="navbar-fixed">
                        <nav className="teal darken-1">
                            <div className="nav-wrapper">
                                <Link to="/" className="brand-logo center">
                                    CRM
                                </Link>
                            </div>
                        </nav>
                    </div>
                    <section>
                        <AddContact />
                        <Switch>
                            <Route exact path="/" component={Contacts} />
                            <Route
                                path="/contact/:contactId"
                                component={Contact}
                            />
                        </Switch>
                    </section>
                </div>
            </BrowserRouter>
        </ApolloProvider>
    );
}

export default App;
