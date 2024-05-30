import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';
import { ApolloServer } from '@apollo/server';
import schema from './schema';
import dbConnect from './lib/dbConnect';

const server = new ApolloServer({ schema });

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => {
    await dbConnect();
    return { req };
  },
});

export { handler as GET, handler as POST };
