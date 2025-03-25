import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, MapPin, Heart, Share2, User } from 'lucide-react-native';

import { HomeScreen } from './src/screens/HomeScreen';
import { AllLocationsScreen } from './src/screens/AllLocationsScreen';
import { AllBoardsScreen } from './src/screens/AllBoardsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { LinkResultsScreen } from './src/screens/LinkResultsScreen';
import { SelectedLocationsScreen } from './src/screens/SelectedLocationsScreen';
import { LocationDetailsScreen } from './src/screens/LocationDetailsScreen';
import { BoardDetailsScreen } from './src/screens/BoardDetailsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#6A62B7',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="AllLocations"
        component={AllLocationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MapPin size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="AllBoards"
        component={AllBoardsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Share2 size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="LinkResults" component={LinkResultsScreen} />
        <Stack.Screen name="SelectedLocations" component={SelectedLocationsScreen} />
        <Stack.Screen name="LocationDetails" component={LocationDetailsScreen} />
        <Stack.Screen name="BoardDetails" component={BoardDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 