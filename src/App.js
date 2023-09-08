import React from "react";
import Navigation from "./Navigation/Navigation";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const client = new ApolloClient({
  // uri: 'https://countries.trevorblades.com/',
  uri: 'https://graphqlzero.almansi.me/api',
  cache: new InMemoryCache(),
});

const App = () =>
{
  //App.js
  //temp branch update
  //temp + main branch
  return(
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={client}>
        <Navigation />
      </ApolloProvider>
    </QueryClientProvider>
  )
}
export default App;