const { ApolloServer } = require("apollo-server-express");

const express = require("express");
const cors = require("cors");

const { typeDefs } = require("./schema/typeDefs");
const { resolvers } = require("./schema/resolvers");

const app = express();

app.use(express.json());
app.use(cors());

const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
  server.applyMiddleware({ app });
});

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
