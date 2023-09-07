import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from "./Home";
import CreateReels from "./CreateReels";
import { Icon } from "../../assets";


const Tab = createBottomTabNavigator();

const ReelsTabs = ({navigation, route}) => {
  const email = route.params;
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBarStyle,
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarLabelStyle: {
            marginBottom: 5,
            padding: 0,
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 14,
            color: 'grey'
          },
          tabBarIconStyle: {
            width: 20,
            height:15,
            marginTop: 0,
            justifyContent: 'center',
            alignItems: 'center',
          },
          tabBarShowLabel:false,
          email : email,
        }}>

        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <HomeTab focused={focused} />
            ),
            tabBarStyle:{
              backgroundColor: 'black',
              borderBlockColor: 'transparent',
            }  
          }}
        />
        <Tab.Screen
          name="CreateReels"
          component={CreateReels}
          options={{
            tabBarIcon: props => <CreateReelsTab {...props} />,
          }}
          initialParams={{ email }}
        />
  
      </Tab.Navigator>
    );
  };
  
  const HomeTab = ({ focused }) => (
        <Image style={{ width: 20, height: 20,}} 
      source={ Icon.Home } tintColor={ focused ? 'white' : 'grey' } resizeMode={'contain'} />
  );

  const CreateReelsTab = ({ focused }) => (
    <Image style={{ width: 20, height: 20,}} 
      source={ Icon.upload } tintColor={ focused ? 'black' : 'grey' } resizeMode={'contain'} />
  );

  
  export default ReelsTabs;
  
  const styles = StyleSheet.create({
    tabBarStyle: {
      backgroundColor: 'white',
      height:  Platform.OS === 'ios' ? '7%' : '6%',
      justifyContent: 'center',
      paddingBottom: Platform.OS === 'ios' ? 15 : 0,
      // borderTopColor: transparent,
      elevation:0,
      shadowOpacity:0,
    },
   
  });
  