import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const ChatList = ({navigation,route}) => {
  const data = [
    { id: '1', name: 'John', email: 'johndoe@gmail.com' },
    { id: '2', name: 'Richard', email: 'richardroe@gmail.com' },
    { id: '3', name: 'Alice', email: 'alice@gmail.com' },
    { id: '4', name: 'Emma', email: 'emma@gmail.com' },
    { id: '5', name: 'Michael', email: 'michael@gmail.com' },
  ];

 const {email} = route.params;

  const chat = (item) =>
  {
    console.log('=======Item Name : ',item.name);
    navigation.navigate('Chat',{ name:item.name, emailSender: email, emailReceiver: item.email , documentID : email > item.email ? email+'+'+item.email : item.email+'+'+email });
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={()=>chat(item)} style={styles.listItem}>
        <Text>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    width: '100%', // Set width to fill the screen
  },
});

export default ChatList;
