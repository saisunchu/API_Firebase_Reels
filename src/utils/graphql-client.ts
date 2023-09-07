// src/utils/graphql-client.ts
import { GraphQLClient } from 'graphql-request'

export const gqlClient = new GraphQLClient('YOUR_GRAPHQL_API_URL', {
  headers: () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    }
  },
})
