import { FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import storage from '@react-native-firebase/storage';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import Video from 'react-native-video';
import { Dimensions } from 'react-native';
import RenderReels from './Components/RenderReels'; 
import Carousel from 'react-native-snap-carousel';
import firestore from '@react-native-firebase/firestore';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


const statusBarHeight = StatusBar.currentHeight || 0;
const availableScreenHeight = screenHeight - statusBarHeight;

const StaticURLs = [
  'https://firebasestorage.googleapis.com/v0/b/fir-demo-20a74.appspot.com/o/johndoe%40gmail.com%2Fvideos%2F6804b3b5-521e-48bf-b269-36559ea029d8.mp4?alt=media&token=d3591226-9d98-44c0-a99f-90cf93a0b67b',
  'https://player.vimeo.com/external/400233454.hd.mp4?s=8d4cad8ef9aff918ee0e9336900e1c3bee90ccc8&profile_id=174&oauth2_token_id=57447761',
  'https://player.vimeo.com/external/408879388.sd.mp4?s=51426565a28e1b4440d72527619ec97546c1f237&profile_id=164&oauth2_token_id=57447761',
]

const Home = () => {

  const [videos, setVideos] = useState([]);
  const [focusedItemId, setFocusedItemId] = useState(null);
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [Firestorevideos, setFirestorevideos] = useState([]);
  const [refresh, setRefresh] = useState(true);

  // useEffect(() => {
  //   if (carouselRef.current) {
  //     console.log('carouselRef.current.currentIndex======',carouselRef.current.currentIndex);
  //     setActiveIndex(carouselRef.current.currentIndex);
  //   }
  // }, [carouselRef?.current?.currentIndex]);
  
  const handleSnapToItem = (index) => {
    setActiveIndex(index);
  };

  const handleScrollEndDrag = (e) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.y / Dimensions.get('window').height);
    setActiveIndex(newIndex);
  };

  const getALlVideos = async () => {
    const videoRefs = await storage()?.ref()?.child(`${email}/videos/`)?.listAll();
    const videoUrls = await Promise?.all(videoRefs?.items?.map((ref) => ref?.getDownloadURL()));
    setVideos([...videoUrls]);
    console.log('Videos---------------------------', videos);
  }

  // const getFireStoreVideos = async () =>
  // {
  //   try {
  //     const querySnapshot = await firestore().collection('Reels').doc('Reels').get();
  //     if (querySnapshot.exists) {
  //       const data = querySnapshot.data();
  //       const dataArray = Object.values(data);

  //       setFirestorevideos(dataArray);
  //       // console.log('FirestoreVideos==========', Firestorevideos);
  //       console.log('Reels dataArray copied to state:', dataArray);
  //     } else {
  //       console.log('Document does not exist');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching Reels data:', error);
  //   }
  // }

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



  useEffect(() => {
    getFireStoreVideos();
    getALlVideos();
    // console.log('FirestoreVideos in useEffect ==========', Firestorevideos);
  }, [])


  useEffect( () => {
    carouselRef.current.triggerRenderingHack();
  }, [ Firestorevideos ] );

  return (
    <View style={{flex:1, backgroundColor: 'black' }} >

      {
      /* <SwiperFlatList
      // autoplay
      // autoplayDelay={2}
      // autoplayLoop
      // index={2}
      // showPagination
      data={videos}
      renderItem={({ item }) => (
        <RenderReels focusedItemId = {focusedItemId} item={item} />
      )}
      vertical
      disableIntervalMomentum
      keyExtractor={(item,index)=>index.toString()}
      // viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      // onViewableItemsChanged={onViewableItemsChanged}
      // viewabilityConfig={viewabilityConfig}

    /> */
    }
{/* {
  console.log('VIdeos in Return Fn =============', Firestorevideos)
} */}
      <Carousel
        data={Firestorevideos}
        renderItem={({ item, index }) => 
        (
          <RenderReels focusedItemId = {focusedItemId} index={index} activeIndex={activeIndex} item={item} />
        )
        }
        // sliderWidth={Dimensions.get('window').width}
        // itemWidth={Dimensions.get('window').width}
        layout={'default'} // 'default', 'stack', 'tinder'
        vertical
        sliderHeight={Dimensions.get('window').height}
        itemHeight={Dimensions.get('window').height}
        ref={carouselRef}
        onSnapToItem={handleSnapToItem}
        onScrollEndDrag={handleScrollEndDrag}
        key={(item,index)=>item}
      />

    </View>
  )
}

export default Home

const styles = StyleSheet.create({})