import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View } from 'react-native';
import { RootStackParamList } from '../types';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { Colors } from '../constants/colors';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import QuotationsPanelScreen from '../screens/QuotationsPanelScreen';
import NewQuotationTypeScreen from '../screens/NewQuotationTypeScreen';
import NewQuotationDetailsScreen from '../screens/NewQuotationDetailsScreen';
import QuotationSummaryScreen from '../screens/QuotationSummaryScreen';
import QuotationFinalScreen from '../screens/QuotationFinalScreen';
import QuotationDetailScreen from '../screens/QuotationDetailScreen';
import AdminPanelScreen from '../screens/AdminPanelScreen';
import PendingApprovalScreen from '../screens/PendingApprovalScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { profile } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: Colors.border,
        },
      }}
    >
      <Tab.Screen
        name="Cotizaciones"
        component={QuotationsPanelScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text" size={size} color={color} />
          ),
        }}
      />
      {profile?.is_admin && (
        <Tab.Screen
          name="Usuarios"
          component={AdminPanelScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people" size={size} color={color} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
}

function AppContent() {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {!session ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : !profile?.is_approved ? (
        <Stack.Screen name="PendingApproval" component={PendingApprovalScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="NewQuotationType" component={NewQuotationTypeScreen} />
          <Stack.Screen name="NewQuotationDetails" component={NewQuotationDetailsScreen} />
          <Stack.Screen name="QuotationSummary" component={QuotationSummaryScreen} />
          <Stack.Screen name="QuotationFinal" component={QuotationFinalScreen} />
          <Stack.Screen name="QuotationDetail" component={QuotationDetailScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </AuthProvider>
  );
}
