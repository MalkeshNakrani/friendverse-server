import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { MongodbPubSub } from 'graphql-mongodb-subscriptions';
import { MongoClient } from 'mongodb';

import express from 'express';
import http from 'http';
import cors from 'cors';
import { json } from 'body-parser';
import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();

import resolvers from './graphql/resolvers';
import typeDefs from './graphql/typeDefs';

import passportSetup from './utils/passport';
import authRouter from './routes/auth';
import { checkIsAuthenticated, checkLoggedIn } from './utils/auth';
import { appCorsConfiguration, graphQlSandboxConfiguration } from './utils/cors';
import cookieParser from 'cookie-parser';

async function main() {
  const app = express();
  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const url = process.env.MONGO_URI!;
  const client = new MongoClient(url);

  const pubsub = new MongodbPubSub({
    connectionDb: client.db('graphql'),
  });

  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: '/graphql',
  });

  // context need to be updated for auth
  const serverCleanup = useServer({ schema, context: async () => ({ pubsub }) }, wsServer);

  const server = new ApolloServer({
    schema,
    introspection: process.env.NODE_ENV !== 'production',
    csrfPrevention: false, //Preventing Cross-Site Request Forgery (CSRF) change to TRUE
    cache: 'bounded',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await mongoose.connect(process.env.MONGO_URI!);
  console.log('🚀 Connected to MongoDB');

  await server.start();

  app.use(cors(appCorsConfiguration));

  // initialize pasport and setup strategy
  passportSetup(app);

  // Set up our Express middleware to handle CORS, body parsing,
  // and our expressMiddleware function.
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(
      process.env.NODE_ENV === 'production' ? appCorsConfiguration : graphQlSandboxConfiguration
    ),
    cookieParser(),
    // 50mb is the limit that `startStandaloneServer` uses, but you may configure this to suit your needs
    json({ limit: '50mb' }),
    checkIsAuthenticated,
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async ({ req }) => ({ pubsub, user: req.user }),
    })
  );

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use('/auth', authRouter);
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.get('/login', checkLoggedIn, (req, res) => {
    res.render('login.ejs');
  });

  app.get('/dashboard', checkIsAuthenticated, (req: express.Request, res: express.Response) => {
    interface User {
      userName: string;
    }
    const user = req.user as User;
    res.render('dashboard.ejs', { name: user.userName });
  });

  await new Promise<void>(resolve => httpServer.listen({ port: process.env.PORT }, resolve));
  console.log(`😎 Server ready at http://localhost:${process.env.PORT}/graphql`);
}

main().catch(err => console.error(err));
