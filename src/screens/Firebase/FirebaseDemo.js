import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ScrollView, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import axios from 'axios';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { launchImageLibrary } from "react-native-image-picker";
import storage from '@react-native-firebase/storage';

const FirebaseDemo = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [num, setNum] = useState(0);
  const [usersArray, setUsersArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isListVisible, setIsListVisible] = useState(true);

  const [selectedImage, setSelectedImage] = useState('');


   messaging().onMessage(response => { 

      console.log('Notifications with Messaging ------- ',JSON.stringify(response));

      if (Platform.OS !== 'ios') { 
          showNotification(response.notification); 
          return; 
      } 

  }); 


  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Background message received:', remoteMessage);
    // Process the message and update the UI or perform other actions

    if (Platform.OS !== 'ios') { 
      showNotification(response.notification); 
      return; 
    } 

  });


  const showNotification = ( notification ) => { 
    console.log('Notifications object ------ ', notification);
    PushNotification.localNotification({ 
        channelId: "my-channel-id", // ID of the channel to use
        title: notification.title, 
        message: notification.body, 
    }); 
  }; 


  useEffect(() => {
    FirestoreGet();

    messaging().getToken().then((token) => {
      console.log('FCM token:', token);
      global.Token = token;
    });  

    PushNotification.createChannel(
      {
        channelId: "my-channel-id", // ID of the channel
        channelName: "My Channel", // Name of the channel
        channelDescription: "My channel description", // Description of the channel
        playSound: true, // Enable sound
        soundName: "default", // Sound to play when notification is received
        importance: 4, // Importance of the notification (0-4)
        vibrate: true, // Enable vibration
      },
      (created) => console.log(`Channel created: ${created}`) // Callback when channel is created
    );  

  }, []);

  
  const FirestoreAdd = () => {
    setNum(num + 1);
    firestore()
      .collection('Users')
      .doc(`User${num}`)
      .set({
        name: name,
        age: age,
        city: city,
      })
      .then(() => {
        console.log('User added!');
        FirestoreGet(); // Fetch updated data after adding a new user
      });

      const data = {
        to: global.Token,
        notification: {
          title: name,
          body: 'Added Successfully'
        }
      };
   
      PushNot(data);

  };

  const PushNot = (data) =>
  {
    console.log('Inside PushNot');
    axios.post('https://fcm.googleapis.com/fcm/send', data, {
      headers: {
        Authorization: 'key=AAAAU0LJNxs:APA91bHJ1qtzXG9mWcZZHhwpwKZdN77NYWaGewqGtYeguHeIvcgXySDjazlmeRjEdYY9AKsv15P6j4UIfvpySrlXcWZw5DZ2HipFW8BbmGx0l7ls2OtQkW_aR0XOIEMZ2KGRFvf5Tcv2',
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log('Notification sent:', response.data);
    }).catch(error => {
      console.error('Notification error:', error);
    });
  }

  const FirestoreGet = async () => {
    setIsLoading(true);
    setIsListVisible(!isListVisible);
    try {
      const querySnapshot = await firestore().collection('Users').get();
      const usersData = querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        };
      });
      setUsersArray(usersData);
    } catch (error) {
      console.error('Error fetching Firestore data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    // Show a modal or navigate to a new screen with the input fields pre-filled with the data of the selected item
  };

  const handleDeleteItem = (item) => {
    firestore()
      .collection('Users')
      .doc(item.id)
      .delete()
      .then(() => {
        console.log('User updated!');
        // Clear the editingItem state after successfully saving the changes
        setIsListVisible(true);
        // Refetch the data from Firestore to update the list with the new data
        FirestoreGet();
      })
      .catch((error) => {
        console.error('Error updating user:', error);
      });
    // Show a modal or navigate to a new screen with the input fields pre-filled with the data of the selected item
  };

  const handleSaveEdit = () => {
    // Save the edited data to Firebase for the selected item
    // Update the document in Firestore with the new data
    firestore()
      .collection('Users')
      .doc(editingItem.id)
      .update({
        name: editingItem.name,
        age: editingItem.age,
        city: editingItem.city,
      })
      .then(() => {
        console.log('User updated!');
        // Clear the editingItem state after successfully saving the changes
        setEditingItem(null);
        // Refetch the data from Firestore to update the list with the new data
        FirestoreGet();
      })
      .catch((error) => {
        console.error('Error updating user:', error);
      });
  };

  const StoreProfilePic = (uri) =>
  {
    console.log('-----StoreProfilePic-----------');
    const storageRef = storage().ref();
    // Path where the image will be stored in Firebase Storage
    const path = 'Images/profile.png';
    // Local filesystem path to the image file
    const localFilePath = uri;
    // Upload the image file to Firebase Storage
    const uploadTask = storageRef.child(path).putFile(localFilePath);        
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed', (taskSnapshot) => {
      console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
    }, (error) => {
      console.log(error.message);
    }, () => {
      console.log('Image uploaded successfully.');
    });    
  }

  const opengallery = () => {
    let options = {
        mediaType: 'photo'
    }

     launchImageLibrary (options, (response) => {
        console.log('Response', response)
        if (response.didCancel === true) {
            console.log(response)
        }
        else {
            setSelectedImage(response.assets[0].uri);
            StoreProfilePic(response.assets[0].uri);        
        }
    })
    
}

  return (
    <ScrollView style={{ flexGrow: 1 }}>
      <View style={styles.container}>

        <View style={{height:100, width:100, marginBottom:12 }} >
          <View style={styles.profilepic} >
            <Image source={ selectedImage == '' ? require('../../assets/User_Photo.png') : {uri: selectedImage} } style={{height:'100%', width:'100%', zIndex:-10 }} />
            
          </View>
          <TouchableOpacity onPress={opengallery} style={{position:'absolute', marginLeft:'72%', marginTop:'65%' }} >
            <EntypoIcon name='edit' size={30} color='black'  />
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your city"
          value={city}
          onChangeText={setCity}
        />
        <TouchableOpacity style={styles.button} onPress={FirestoreAdd}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={FirestoreGet}>
          <Text style={styles.buttonText}>{isListVisible ? 'Hide' : 'Get'}</Text>
        </TouchableOpacity>
      </View>

      {editingItem && (
        <View style={styles.editContainer}>
          <Text>Edit User</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={editingItem.name}
            onChangeText={(text) => setEditingItem({ ...editingItem, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your age"
            value={editingItem.age}
            onChangeText={(text) => setEditingItem({ ...editingItem, age: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your city"
            value={editingItem.city}
            onChangeText={(text) => setEditingItem({ ...editingItem, city: text })}
          />
          <TouchableOpacity style={styles.button} onPress={handleSaveEdit}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}

      { isListVisible &&  
      <View style={styles.listview}>
        <FlatList
          data={usersArray}
          scrollEnabled = {false}
          renderItem={({ item }) => (
            <View style={styles.userContainer}>
              <Text>Name: {item.name}</Text>
              <Text>Age: {item.age}</Text>
              <Text>City: {item.city}</Text>
              <View style={styles.EditDelete} >
                <TouchableOpacity style={styles.editButton} onPress={() => handleEditItem(item)}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editButton} onPress={() => handleDeleteItem(item)}>
                  <Text style={styles.editButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          refreshing={isLoading}
          onRefresh={FirestoreGet}
        />
      </View>
      }

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  editContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    margin: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  button: {
    backgroundColor: 'blue',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  userContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: 'green',
    borderRadius: 5,
    padding: 5,
    alignItems: 'center',
    width:'50%',
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
  },
  listview: {
    marginHorizontal: 20,
  },
  EditDelete:{
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  profilepic:{
    borderWidth:1,
    marginBottom: 12,
    height:100,
    width:100,
    borderRadius:50,
    overflow: 'hidden',
  },
});

export default FirebaseDemo;
