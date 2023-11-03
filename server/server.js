import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import cors from 'cors';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import { schema } from './src/schema/schema';

const PORT = 8080;

const server = express();

server.use('*', cors({ origin: 'http://localhost:8081' }));

server.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress({ schema: schema })
);

server.use(
    '/graphiql',
    bodyParser.json(),
    graphiqlExpress({
        endpointURL: '/graphql',
        subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`,
    })
);

const ws = createServer(server);

ws.listen(PORT, () => {
    console.log(`GraphQL server is running on port ${PORT}`);

    new SubscriptionServer(
        {
            execute: execute,
            subscribe: subscribe,
            schema: schema,
        },
        {
            server: ws,
            path: '/subscriptions',
        }
    );
});
