import { ApolloServer, gql } from 'apollo-server';
import OwnerAPI  from './datasource';

const typeDefs = gql`
  type Owner {
    id: Int!
    firstName: String
    lastName: String
    address: String
    city: String
    telephone: String
    pets: [Pet]
  }
  type Pet{
    id: Int!
    name: String
    birthdate: String
    type: Type
    visits: [Visit]
  }
  type Type{
    id: Int!
    name: String
  }
  type Visit{
    _id: Int!
    visit_data: String
    pet_id: String
    _class: String
  }
  type Query {
    owners: [Owner]
  }
`;


const resolvers = {
  Query: {
    owners: (root, args, { dataSources }) => dataSources.ownerAPI.getAllOwners(),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    ownerAPI: new OwnerAPI()
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
});
