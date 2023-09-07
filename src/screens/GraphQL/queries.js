import { gql } from '@apollo/client';

export const GET_USERDATA = gql`
  query {
    users {
      data {
        id
        name
        username
        email
        company {
          name
        }
      }
    }
  }
`;

export const ADD_USERDATA = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      username
      email
      company {
        name
      }
    }
  }
`;

export const UPDATE_USERDATA = gql`
  mutation UpdateUser($updateUserId: ID!, $input: UpdateUserInput!) {
    updateUser(id: $updateUserId, input: $input) {
      id
      name
      username
      email
      company {
        name
      }
    }
  }
`;

export const DELETE_USERDATA = gql`
  mutation DeleteUser($deleteUserId: ID!) {
    deleteUser(id: $deleteUserId)
  }
`;
