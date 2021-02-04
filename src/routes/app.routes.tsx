import React from 'react'
import { StyleSheet } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import HomeIcon from '~/components/icons/Home'
import ChatIcon from '~/components/icons/Chat'
import LogoutIcon from '~/components/icons/Logout'

import Chat from '../pages/Chat/Index'
import Home from '../pages/Home/Index'

const AppStack = createStackNavigator()
const AppBottomTab = createBottomTabNavigator();

const svgProps = {
   height: 25,
   width: 25,
}

const TabNavigation = () => (

   <AppBottomTab.Navigator tabBarOptions={{
      // safeAreaInsets: { bottom: 8, top: 16 },
      showLabel: false,
      tabStyle: { backgroundColor: "white", justifyContent: "center", alignItems: "center" },
      style: { borderTopColor: "rgba(0,0,0,0.03)", borderTopWidth: 0, elevation: 0, position: "absolute" },
      activeTintColor: "rgb(0,0,55)",
      inactiveTintColor: "rgb(195,195,210)",
   }} initialRouteName="Home">
      <AppBottomTab.Screen name="Home" component={Home}
         options={{
            tabBarIcon: ({ color }) => (
               <HomeIcon {...svgProps} fill={color} />
            )
         }} />

      <AppBottomTab.Screen name="Chat" component={Chat}
         options={{
            tabBarVisible: false,
            tabBarIcon: ({ color }) => (
               <ChatIcon {...svgProps} fill={color} />
            )
         }} />
         
      <AppBottomTab.Screen name="Logout" component={Chat}
         options={{
            tabBarVisible: false,
            tabBarIcon: ({ color }) => (
               <LogoutIcon {...svgProps} fill={color} />
            )
         }} />
   </AppBottomTab.Navigator>
);

function StackNavigation() {
   return (
      <AppStack.Navigator screenOptions={{
         header: () => null,
         animationEnabled: false,
         gestureEnabled: false,
      }} initialRouteName="Home">
         <AppStack.Screen name="Home" component={Home} />
         <AppStack.Screen name="Chat" component={Chat} />
      </AppStack.Navigator>
   )
}


// const styles = StyleSheet.create({
//    drawerStyle: {
//       backgroundColor: "white"
//    }
// })

export default StackNavigation