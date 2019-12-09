import { ApolloServer, gql } from 'apollo-server';
const fetch = require('node-fetch');
const { importSchema } = require('graphql-import');

const ownerURL = `http://localhost:6000`;
const vetsURL = `http://localhost:5000`;
const visitsURL = `http://localhost:7000`

const resolvers = {
  Query: {
    owners: async () => {
      return await fetch(`${ownerURL}/owners`).then(res => res.json())
    },
    owner: async (parent, args) => {
      const { id } = args
      return await fetch(`${ownerURL}/owners/${id}`).then(res => res.json())
    },
    pet: async (parent, args) => {
      const { id } = args
      return await fetch(`${ownerURL}/owners/*/pets/${id}`).then(res => res.json())
    },
    vets: async () => {
      return await fetch(`${vetsURL}/vets`).then(res => res.json())
    },
    visits: async (parent, args) => {
      const { petId } = args
      return await fetch(`${visitsURL}/owners/*/pets/${petId}/visits`).then(res => res.json())
    },
    types: async () => {
      return await fetch(`${ownerURL}/petTypes`).then(res => res.json())
    },
  },
  Mutation:{
    addOwner: async (_, args) => {
      return await fetch(`${ownerURL}/owners`, { method: 'POST', headers: {
        "Content-type": "application/json",
    },body: JSON.stringify(args.data) })
      .then(res => res.json())
      .catch(err => console.error(err));
    },
    updateOwner: async (_, args) => {
      return await fetch(`${ownerURL}/owners/${args.id}`, { method: 'PUT', headers: {
        "Content-type": "application/json",
    },body: JSON.stringify(args.data) })
    .then(res => {
      console.log(res.ok);
      console.log(res.status);})
    .catch(err => console.error(err));
    },
    addPet: async (_, args) => {
      return await fetch(`${ownerURL}/owners/${args.data.ownerId}/pets`, { method: 'POST', headers: {
        "Content-type": "application/json",
    },body: JSON.stringify(args.data) })
    .then(res => res.json())
    .catch(err => console.error(err));
    },
    updatePet: async (_, args) => {
      return await fetch(`${ownerURL}/owners/*/pets/${args.data.ownerId}`, { method: 'PUT', headers: {
        "Content-type": "application/json",
    },body: JSON.stringify(args.data) })
    .then(res => {
      console.log(res.ok);
      console.log(res.status);})
    .catch(err => console.error(err));
    },
    addVisit: async (_, args) => {
      return await fetch(`${visitsURL}/owners/*/pets/${args.data.petId}/visits`, { method: 'POST', headers: {
        "Content-type": "application/json",
    },body: JSON.stringify(args.data) })
    .then(res => res.json())
    .catch(err => console.error(err));
    },
  },
};

const server = new ApolloServer({
  typeDefs: importSchema('./petclinic.graphql'),
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
});
