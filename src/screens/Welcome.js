import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

const Welcome = ({navigation}) => {

  const APIDemo = () =>
  {
    navigation.navigate('APIDemo');
  }

  const FirebaseDemo = () =>
  {
    navigation.navigate('FirebaseDemo');
  }

  const Chat = () =>
  {
    navigation.navigate('FirebaseLogin');
  }

  const ReelsTab = () =>
  {
    navigation.navigate('FirebaseLogin');
  }

  const GraphQL = () =>
  {
    navigation.navigate('GraphQLDemo');
  }

  const PostsList = () =>
  {
    navigation.navigate('PostsList');
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={APIDemo} >
        <Text style={styles.buttonText}>APIDemo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={FirebaseDemo} >
        <Text style={styles.buttonText}>Firebase Demo</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.button} onPress={Chat} >
        <Text style={styles.buttonText}>Chat</Text>
      </TouchableOpacity> */}
      <TouchableOpacity style={styles.button} onPress={ReelsTab} >
        <Text style={styles.buttonText}>Reels</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={GraphQL} >
        <Text style={styles.buttonText}>GraphQL</Text>
      </TouchableOpacity> 

      <TouchableOpacity style={styles.button} onPress={PostsList} >
        <Text style={styles.buttonText}>React Query</Text>
      </TouchableOpacity> 

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 20,
    margin: 10,
    borderRadius: 8,
    width:200,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Welcome;
