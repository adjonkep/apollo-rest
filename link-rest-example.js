import { ApolloClient  } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { RestLink } from 'apollo-link-rest';
import fetch from 'node-fetch';
import gql from 'graphql-tag';

if (global.Headers == null) {
    const fetch = require('node-fetch');
    global.Headers = fetch.Headers;
}

export const restLink = new RestLink({ uri: "http://localhost:6000/", endpoints: { owner: 'http://localhost:6000/', vets: 'http://localhost:5000/' , visits: 'http://localhost:7000/'}, customFetch: fetch});

export const ownerQuery = gql`
  query owners($id: ID!){
    Owner(id: $id) @rest(type: "Owner", path: "owners/{args.id}", endpoint: "owner"){
      id
      firstName
      lastName
      address
      city
      telephone
      pets
    }
  }
`;

export const ownersQuery = gql`
  query owners{
    Owner @rest(type: "Owner", path: "owners", endpoint: "owner"){
      id
      firstName
      lastName
      address
      city
      telephone
      pets
    }
  }
`;

export const vetQuery = gql`
  query vets{
    Vet @rest(type: "[Vet]", path: "vets", endpoint: "vets"){
      id
      firstName
      lastName
      specialties
      nrOfSpecialties
    }
  }
`;

export const getPetQuery = gql`
  query pet($id: ID!){
    Pet(id: $id) @rest(type: "Pet", path: "owners/*/pets/{args.id}", endpoint: "owner"){
      id
      name
      owner
      birthdate
      type
    }
  }
`;

export const getVisitQuery = gql`
  query visit($petId: Int!){
    Visit(petId: $petId) @rest(type: "[Visit]", path: "owners/*/pets/{args.petId}/visits", endpoint: "visits"){
      id
      date
      description
      petId
    }
  }
`;

export const petTypesQuery = gql`
  query petTypes{
    Type @rest(type: "[Type]", path: "petTypes", endpoint: "petTypes"){
      id
      name
    }
  }
`;



export const addOwnerMutation = gql`
  mutation addOwnerMutation($firstName: String!, $lastName: String!, $address: String!, $city: String!, $telephone: String!) {
    addOwner(input: {
      firstName: $firstName,
      lastName: $lastName,
      address: $address,
      city: $city,
      telephone: $telephone
    })
    @rest(
      method: "POST",
      path: "owners",
      endpoint: "owner"
      type: "Owner",
    ) {
      id
      firstName
    }
  }
`;

export const editOwnerMutation = gql`
  mutation editOwnerMutation($id: ID!, $firstName: String, $lastName: String, $address: String, $city: String, $telephone: String) {
    editOwner(input: {
      id: $id,
      firstName: $firstName,
      lastName: $lastName,
      address: $address,
      city: $city,
      telephone: $telephone
    })
    @rest(
      method: "PUT",
      path: "owners/{args.input.id}",
      endpoint: "owner"
      type: "Owner",
    ) {
      id
      firstName
    }
  }
`;

export const addPetMutation = gql`
  mutation addPetMutation($name: String!, $birthDate: DateTime!, $ownerId: Int!, $typeId: Int!) {
    addPet(input: {
      name: $name,
      ownerId: $ownerId,
      birthDate: $birthDate,
      typeId: $typeId
    })
    @rest(
      method: "POST",
      path: "owners/{args.input.ownerId}/pets",
      endpoint: "owner"
      type: "Pet",
    ) {
      id
      name
    }
  }
`;

export const editPetMutation = gql`
  mutation editPetMutation($id: ID!, $name: String, $birthDate: DateTime, $ownerId: Int, $typeId: Int) {
    editPet(input: {
      id: $id,
      name: $name,
      ownerId: $ownerId,
      birthDate: $birthDate,
      typeId: $typeId
    })
    @rest(
      method: "PUT",
      path: "owners/*/pets/{args.input.id}",
      endpoint: "owner"
      type: "Pet",
    ) {
      id
      name
    }
  }
`;

export const addVisitMutation = gql`
  mutation addPetMutation($petId: Int!, $date: DateTime!, $description: String!) {
    addVisit(input: {
      petId: $petId,
      date: $date,
      description: $description,
    })
    @rest(
      method: "POST",
      path: "owners/*/pets/{args.input.petId}/visits",
      endpoint: "visits"
      type: "Visit",
    ) {
      date
      description
    }
  }
`;

const client = new ApolloClient({
  link: restLink,
  cache: new InMemoryCache(),
});

client.mutate({
    mutation: addVisitMutation,
    variables: {
      petId: 16,
      date: "2019-11-16",
      description: "Regular Checkup",
    },
  })
  .then(response => {
    console.log(response.data);});
/*
client.query({ query: ownerQuery, variables: {id:2} })
.then(response => {console.log(response.data.Owner);})
.catch(error => console.error(error));

client.query({ query: getVisitQuery, variables: {petId: 18} })
.then(response => {console.log(response.data);})
.catch(error => console.error(error));

client.mutate({
    mutation: editPetMutation,
    variables: {
      id: 16,
      birthDate: "2017-05-16",
      name: "Max",
    },
  })
  .then(response => {
    console.log(response.data);});
*/
/*
client.mutate({
    mutation: editOwnerMutation,
    variables: {
      id: 11,
      firstName: "Nick",
      lastName: "Chester",
      address: "123 renault st",
      city: "Viry",
      telephone: "1239842345"
    },
  })
  .then(response => {
    console.log(response.data);});
    */
