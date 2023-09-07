import React, { memo, useState } from 'react';
import { View, StatusBar } from 'react-native';
import Video from 'react-native-video';
import { Dimensions } from 'react-native';
const screenHeight = Dimensions.get('window').height;

const statusBarHeight = StatusBar.currentHeight || 0;
const availableScreenHeight = screenHeight - statusBarHeight;

const RenderReels = ({item, index, focusedItemId, activeIndex }) => {

  console.log('Item in RenderReels======');

  return (
    <View
      style={{height: availableScreenHeight, backgroundColor: 'black', borderWidth:1 }}>
      <Video
        source={{uri: item}}
        resizeMode="contain"
        controls={true}
        style={{flex:1}}
        disableFocus={true}
        repeat
        paused = { activeIndex == index ? false : true }
        
      />
    </View>
  );
};

export default memo(RenderReels);