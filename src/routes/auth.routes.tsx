import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SignIn from '../pages/Auth/SignIn/Index';

const AuthStack = createStackNavigator();

const AuthStackRoutes = () => (

   <AuthStack.Navigator screenOptions={{
      header: () => null,
      animationEnabled: false,
      gestureEnabled: false,
   }} initialRouteName="SignIn">
      <AuthStack.Screen name="SignIn" component={SignIn} />
   </AuthStack.Navigator>
);

export default AuthStackRoutes;