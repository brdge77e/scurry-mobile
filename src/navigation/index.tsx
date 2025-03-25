import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Bookmark, User, Grid3x3 } from 'lucide-react-native';

// Import screens
import HomePage from '../screens/HomePage';
import SelectedLocationsScreen from '../screens/SelectedLocationsScreen';
import LinkResultsScreen from '../screens/LinkResultsScreen';
import AllLocationsScreen from '../screens/AllLocationsScreen';
import AllBoardsScreen from '../screens/AllBoardsScreen';
import BoardScreen from '../screens/BoardScreen';
import LocationDetailsScreen from '../screens/LocationDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import NotFoundScreen from '../screens/NotFoundScreen';

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
        component={HomePage}
        options={{
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Locations"
        component={AllLocationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Bookmark size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Collections"
        component={AllBoardsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Grid3x3 size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="SelectedLocations" component={SelectedLocationsScreen} />
        <Stack.Screen name="LinkResults" component={LinkResultsScreen} />
        <Stack.Screen name="Board" component={BoardScreen} />
        <Stack.Screen name="LocationDetails" component={LocationDetailsScreen} />
        <Stack.Screen name="NotFound" component={NotFoundScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 