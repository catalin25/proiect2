const { ApolloServer } = require('apollo-server')
const { typeDefs } = require('./typeDefs')
const { resolvers } = require('./resolvers')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const port = process.env.PORT || 9090;

const server = new ApolloServer({ 
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return {
      req,
      prisma
    };
  }
});

server.listen({ port }, () => console.log(`Server runs at: http://localhost:${port}`));
