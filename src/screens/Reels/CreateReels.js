import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, FlatList } from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import VideoPlayer from 'react-native-video'
import { Icon, user_photo } from '../../assets';
import storage from '@react-native-firebase/storage';
import { Video } from 'react-native-compressor';
import firestore from '@react-native-firebase/firestore';


const CreateReels = ({route}) => {
  const [selectedVideo, setSelectedVideo] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [videos, setVideos] = useState([]);
  const [Firestorevideos, setFirestorevideos] = useState([]);
  
  const email = route.params.email.email;

  const pickVideo = async () => {
    
    // const options = {
    //   mediaType: 'video',
    //   videoQuality: 'high',
    // };
    // const result = await launchImageLibrary(options, response => {
    //   if (response.didCancel) {
    //     console.log('User cancelled video picker');
    //   } else if (response.errorMessage) {
    //     console.log('Video picker error:', response.errorMessage);
    //   } else {
    //     console.log('Video Selected!');
    //     console.log('response.assets[0].uri======',response.assets[0].uri);
    //     setSelectedVideo(response.assets[0].uri);
    //     setVideos([...videos, response.assets[0].uri ])
    //     StoreVideos(response.assets[0].uri);
    //     console.log('Videos========', videos);
    //   }
    // });

    ImagePicker.openPicker({
      mediaType: "video",
    }).then(async (video) => {
      try {
        // Compress the selected video
        const compressedVideo = await Video.compress(
          video.path,
          {
            compressionMethod: 'auto',
            minimumFileSizeForCompress: 0.5,
          },
          (progress) => {
            console.log('Compression Progress: ', progress);
          }
        );
    
        console.log('CompressionVideo_Path=======',compressedVideo);
        setSelectedVideo(compressedVideo);

    
        // Store the compressed video path in your state
        setVideos([...videos, compressedVideo]);
        // global.videos = videos;
    
        // Now you can implement your upload logic here using the compressed video path
        StoreVideos(compressedVideo);
      } catch (error) {
        console.error('Video compression error:', error);
      }
    });






  };

  const StoreProfilePic = (uri) =>
  {
    console.log('-----StoreProfilePic-----------');
    const storageRef = storage()?.ref();
    // Path where the image will be stored in Firebase Storage
    const path = `${email}/profile/profile.png`;
    // Local filesystem path to the image file
    const localFilePath = uri;
    // Upload the image file to Firebase Storage
    const uploadTask = storageRef?.child(path)?.putFile(localFilePath);        
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed', (taskSnapshot) => {
      console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot?.totalBytes}`);
    }, (error) => {
      console.log(error.message);
    }, () => {
      console.log('Image uploaded successfully.');
    });    
  }

  const StoreVideos = async (uri) =>
  {
    console.log('-----StoreVideos-----------');

    const StoreVidStorage = async () =>
    {
      const fileName = uri?.split('/')?.pop();
      console.log('FileName====Split==========',fileName);

      const storageRef = storage()?.ref();
      // Path where the image will be stored in Firebase Storage
      const path = `${email}/videos/${fileName}`;
      // Local filesystem path to the image file
      const localFilePath = uri;
      // Upload the image file to Firebase Storage
      const uploadTask = storageRef?.child(path)?.putFile(localFilePath);        
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on('state_changed', (taskSnapshot) => {
        console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
      }, (error) => {
        console.log(error.message);
      }, () => {
        console.log('Image uploaded successfully.');
        const StoreVidFirestore = async () =>
        {
          console.log('Inside StoreVidFirestore=======');
          let tmpData = Firestorevideos
          const videoRef = await storage()?.ref()?.child(path)?.getDownloadURL();
          console.log('videoRef======================',videoRef);
          tmpData.push(videoRef)

          setFirestorevideos(tmpData)

          console.log('tmpData==========',tmpData);
          console.log('Firestorevideos==========',Firestorevideos);

        firestore()
          .collection('Reels')
          .doc('Reels')
          .set({
            ...Firestorevideos
          })
          .then(() => {
            console.log('Reel added!');
            // FirestoreGet(); // Fetch updated data after adding a new user
          });
    
        }
        StoreVidFirestore();
      }); 
      
    }   

   
    await StoreVidStorage();
    
    

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

  const renderVideos = ({item}) =>
  {
      return(
        <View style={{ height:150, padding:1 ,width:'33.33%', backgroundColor:'white' }} >
          <VideoPlayer
            source={{ uri: item }}
            resizeMode="cover"
            // controls={true}
            style={styles.video}
            playWhenInactive
          />
        </View>
      )
  }

  const getALlVideos = async () => {

    const videoRefs = await storage()?.ref()?.child(`${email}/videos/`)?.listAll();
    const videoUrls = await Promise?.all(videoRefs?.items?.map((ref) => ref?.getDownloadURL()));
    setVideos([...videoUrls]);

  }
  const getProfileImage = async () => {
    const ImageProfile = await storage()?.ref()?.child(`${email}/profile/profile.png`)?.getDownloadURL();
    
    setSelectedImage(ImageProfile);
  }

  const getFireStoreVideos = () => {
    const unsubscribe = firestore()
      .collection('Reels')
      .doc('Reels')
      .onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data();
          const dataArray = Object.values(data);
          setFirestorevideos(dataArray);
          console.log('Reels data updated in real-time:', data);
        } else {
          console.log('Document does not exist');
        }
      });
  
    // Return the unsubscribe function in case you want to stop listening later
    return unsubscribe;
  };
  


  // const getFireStoreVideos = async () =>
  // {
  //   try {
  //     const querySnapshot = await firestore()?.collection('Reels')?.doc('Reels')?.get();
  //     if (querySnapshot.exists) {
  //       const data = querySnapshot.data();
  //       const dataArray = Object.values(data);

  //       setFirestorevideos(dataArray);
  //       console.log('Reels data copied to state:', data);
  //     } else {
  //       console.log('Document does not exist');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching Reels data:', error);
  //   }
  // }

  // useEffect(() => {
    
  //   console.log('email========', email);
  //   console.log('Firestorevideos========', Firestorevideos);
  //   getFireStoreVideos();
  //   getALlVideos();
  //   getProfileImage();
  
  // }, [Firestorevideos])
  
  useEffect(() => {
    
    console.log('email========', email);
    console.log('Firestorevideos========', Firestorevideos);
    getFireStoreVideos();
    getALlVideos();
    getProfileImage();
  
  }, [])


  return (
    <View style={styles.container}>

      <View style={{height:80, width:80, marginTop: 20, alignSelf:'center' , borderRadius:50, borderWidth:1 ,overflow:'hidden' }} >
          <View style={styles.profilepic} >
            <Image source={ selectedImage == '' ? user_photo : {uri: selectedImage} } style={{height:'100%', width:'100%', borderRadius:50 }} />
            
          </View>
          <TouchableOpacity onPress={opengallery} style={{position:'absolute', marginLeft:'72%', marginTop:'65%' }} >
            <Image source={Icon.pencil} tintColor={'white'} style={{height:20, width:20}} />
          </TouchableOpacity>
      </View>
      <Text style={{color:'black', alignSelf:'center', fontSize:22, marginTop:6 }} >John Doe</Text>
      <View style={{width:'100%', borderWidth:0.3, marginTop:8,  }} />
      

      <FlatList
        // scrollEnabled={false}
        data={videos}
        renderItem={renderVideos}
        key={(item,index) => item.toString() }
        // estimatedItemSize={200}
        // contentContainerStyle={{borderWidth:1}}
        numColumns={3}

      />  

      <TouchableOpacity onPress={pickVideo} style={styles.button}>
        <Text style={styles.buttonText}>Upload</Text>
        <Image source={Icon.camera} tintColor={'grey'} style={{height:25, width:25, alignSelf: 'center' }} />
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    // elevation: 1,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 4,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    width: 102,
    justifyContent: 'space-between',
    right: 10,
    bottom: 10,
    position: 'absolute',
  },
  buttonText: {
    color: 'grey',
    fontSize: 16,
    alignSelf: 'center',
  },
  videoContainer: {
    marginTop: 20,
    width: 50,
    height: 50,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default CreateReels;
