import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import QuotationsPanelScreen from '../screens/QuotationsPanelScreen';
import NewQuotationTypeScreen from '../screens/NewQuotationTypeScreen';
import NewQuotationDetailsScreen from '../screens/NewQuotationDetailsScreen';
import QuotationSummaryScreen from '../screens/QuotationSummaryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={QuotationsPanelScreen} />
        <Stack.Screen name="NewQuotationType" component={NewQuotationTypeScreen} />
        <Stack.Screen name="NewQuotationDetails" component={NewQuotationDetailsScreen} />
        <Stack.Screen name="QuotationSummary" component={QuotationSummaryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
