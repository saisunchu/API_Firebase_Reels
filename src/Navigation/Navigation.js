import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import APIDemo from "../screens/APIDemo";
import Welcome from "../screens/Welcome";
import FirebaseLogin from "../screens/Firebase/FirebaseLogin";
import FirebaseDemo from "../screens/Firebase/FirebaseDemo";
import { Chat } from "../screens/Chat/Chat";
import ChatList from "../screens/Chat/ChatList";
import ReelsTab from "../screens/Reels/ReelsTab";
import GraphQLDemo from "../screens/GraphQL/GraphQLDemo";
import PostsList from "../screens/ReactQuery/PostList";


const Stack = createStackNavigator();

const Navigation = () =>
{
    return (
        <NavigationContainer>

            <Stack.Navigator
                initialRouteName='Welcome'
                screenOptions={{
                    headerShown: false,
                }}>
                
                <Stack.Screen
                    name='Welcome'
                    component={Welcome}
                    options={{ title: 'APIDemo' }}
                />

                <Stack.Screen
                    name='APIDemo'
                    component={APIDemo}
                    options={{ title: 'APIDemo' }}
                />

                <Stack.Screen
                    name='FirebaseLogin'
                    component={FirebaseLogin}
                    options={{ title: 'FirebaseLogin' }}
                />

                <Stack.Screen
                    name='FirebaseDemo'
                    component={FirebaseDemo}
                    options={{ title: 'FirebaseDemo' }}
                />

                <Stack.Screen
                    name='ChatList'
                    component={ChatList}
                    options={{ title: 'ChatList' }}
                />

                <Stack.Screen
                    name='Chat'
                    component={Chat}
                    options={({route}) => ({ title: route.params.name }) }
                />

                <Stack.Screen
                    name='ReelsTab'
                    component={ReelsTab}
                />

                <Stack.Screen
                    name='GraphQLDemo'
                    component={GraphQLDemo}
                />

                <Stack.Screen
                    name='PostsList'
                    component={PostsList}
                />

            </Stack.Navigator>
        </NavigationContainer>
    )
}
export default Navigation;