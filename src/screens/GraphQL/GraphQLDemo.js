import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { ApolloProvider, ApolloClient, InMemoryCache, useQuery, useMutation } from '@apollo/client';
import { GET_USERDATA, ADD_USERDATA, UPDATE_USERDATA, DELETE_USERDATA } from './queries';

const client = new ApolloClient({
  uri: 'https://graphqlzero.almansi.me/api',
  cache: new InMemoryCache(),
});

const GraphQLDemo = () => {
  const { loading, error, data } = useQuery(GET_USERDATA);
  const [newName, setNewName] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserCompanyName, setNewUserCompanyName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [createUser] = useMutation(ADD_USERDATA);
  const [updateUser] = useMutation(UPDATE_USERDATA);
  const [deleteUser] = useMutation(DELETE_USERDATA);

  const handleCreateUser = async () => {
    try {
      const { data: createdUserData } = await createUser({
        variables: {
          input: {
            name: newName,
            username: newUserName,
            email: newUserEmail,
            company: {
              name: newUserCompanyName,
            },
          },
        },
      });
      console.log('New User Created: ', createdUserData.createUser);
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const handleUpdateUser = async (id) => {
    try {
      const { data: updatedUserData } = await updateUser({
        variables: {
          updateUserId: id,
          input: {
            name: "Kashish Prasad",
            username: "kashishprasad",
            email: "kashishprasad@gmail.com"
          }
        },
      });
      console.log('User Updated: ', updatedUserData.updateUser);
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const { data: deletedUserData } = await deleteUser({
        variables: {
          deleteUserId: id,
        },
      });
      console.log('User Deleted: ', deletedUserData.deleteUser);
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  return (
    <ApolloProvider client={client}>
      <ScrollView style={{ flexGrow: 1 }}>
        <View style={{ padding: 20 }}>
          <Text style={{ marginBottom: 20 }}>Users & Their Data</Text>
          {error && <Text>Error: {error.message}</Text>}
          {data && data.users && (
            <FlatList
              data={data.users.data}
              keyExtractor={(user) => user.id.toString()}
              renderItem={({ item: user }) => (
                <View style={{ marginBottom: 20 }}>
                  <Text>ID: {user.id}</Text>
                  <Text>Name: {user.name}</Text>
                  <Text>Email: {user.email}</Text>
                  <TouchableOpacity onPress={() => handleUpdateUser(user.id)} style={{ backgroundColor: 'green', padding: 5, alignItems: 'center' }}>
                    <Text style={{ color: 'white' }}>UPDATE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteUser(user.id)} style={{ backgroundColor: 'red', padding: 5, alignItems: 'center' }}>
                    <Text style={{ color: 'white' }}>DELETE</Text>
                  </TouchableOpacity>
                </View>
              )}
              scrollEnabled={false}
            />
          )}
          <View>
            <Text style={{ marginTop: 20 }}>Add a New User</Text>
            <TextInput
              placeholder="Name"
              onChangeText={(text) => setNewName(text)}
              value={newName}
              style={{ borderWidth: 1, marginBottom: 5, borderColor: 'grey' }}
            />
            <TextInput
              placeholder="User Name"
              onChangeText={(text) => setNewUserName(text)}
              value={newUserName}
              style={{ borderWidth: 1, marginBottom: 5, borderColor: 'grey' }}
            />
            <TextInput
              placeholder="Company Name"
              onChangeText={(text) => setNewUserCompanyName(text)}
              value={newUserCompanyName}
              style={{ borderWidth: 1, marginBottom: 5, borderColor: 'grey' }}
            />
            <TextInput
              placeholder="Email"
              onChangeText={(text) => setNewUserEmail(text)}
              value={newUserEmail}
              style={{ borderWidth: 1, marginBottom: 5, borderColor: 'grey' }}
            />
            <TouchableOpacity onPress={handleCreateUser} style={{ backgroundColor: 'blue', padding: 10, alignItems: 'center' }}>
              <Text style={{ color: 'white' }}>ADD USER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ApolloProvider>
  );
};

export default GraphQLDemo;
